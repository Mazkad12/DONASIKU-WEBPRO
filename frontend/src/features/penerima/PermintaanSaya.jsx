import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FiPackage,
  FiFileText,
  FiUsers,
  FiSend,
  FiClock,
  FiArrowLeft,
  FiImage,
  FiTruck,
  FiCheckCircle,
  FiLoader,
  FiMessageSquare
} from "react-icons/fi";
// FIX LINTER: Hanya import yang diperlukan
import { getDonasiByIdService } from "../../services/donasiService.js";
import { getMyPermintaanSaya } from "../../services/permintaanService.js";
import { getAuthData } from "../../utils/localStorage.js";
import API from "../../services/api.js";

const PermintaanSaya = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [donasi, setDonasi] = useState(null);
  const [permintaan, setPermintaan] = useState([]);
  const [formData, setFormData] = useState({ jumlah: 1, asal: "", deskripsi: "", bukti_file: null });
  const [buktiPreview, setBuktiPreview] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageZoom, setImageZoom] = useState(1);
  const [imagePan, setImagePan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Debug modal state
  useEffect(() => {
    console.log("Modal state changed:", showImageModal);
  }, [showImageModal]);

  const user = getAuthData();

  // Ambil data donasi jika ada ID (untuk form pengajuan)
  useEffect(() => {
    const fetchDonasi = async () => {
      if (id) {
        try {
          const donasiData = await getDonasiByIdService(id);
          setDonasi(donasiData);
        } catch (error) {
          console.error("Gagal memuat detail donasi:", error);
          navigate("/dashboard-penerima");
        }
      }
    };
    fetchDonasi();
  }, [id, navigate]);

  // FIX: Mengganti logic localStorage dengan panggilan API READ & FIX useEfect dependency
  useEffect(() => {
    const loadPermintaan = async () => {
      if (!user) return;
      try {
        // Try using API directly first (like PermintaanMasukDonatur)
        const response = await API.get('/permintaan-sayas', { timeout: 8000 });
        const data = response.data?.data || [];
        console.log("📦 Permintaan API Response:", data);
        if (Array.isArray(data)) {
          console.log("✅ Data is array, total:", data.length);
          if (data[0]) {
            console.log("🔍 First item:", {
              id: data[0].id,
              judul: data[0].judul,
              donation_id: data[0].donation_id,
              has_donation: !!data[0].donation,
              donation_image: data[0].donation?.image,
              full_first_item: JSON.stringify(data[0], null, 2)
            });
          }
          setPermintaan(data);
        } else {
          console.warn("Data format tidak sesuai", data);
          setPermintaan([]);
        }
      } catch (error) {
        console.error("Gagal memuat permintaan dari API:", error);
        // Fallback: try service function
        try {
          const data = await getMyPermintaanSaya();
          if (Array.isArray(data)) {
            setPermintaan(data);
          } else {
            setPermintaan([]);
          }
        } catch (err) {
          console.error("Fallback also failed:", err);
          setPermintaan([]);
        }
      }
    };
    loadPermintaan();
  }, [user]); // FIX WARNING: dependency 'user' ditambahkan

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, bukti_file: file }));

      // Preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setBuktiPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Image zoom handlers
  const handleZoomIn = () => {
    setImageZoom(prev => Math.min(prev + 0.2, 3));
  };

  const handleZoomOut = () => {
    setImageZoom(prev => Math.max(prev - 0.2, 1));
  };

  const handleResetZoom = () => {
    setImageZoom(1);
    setImagePan({ x: 0, y: 0 });
  };

  const handleImageMouseDown = (e) => {
    if (imageZoom > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - imagePan.x, y: e.clientY - imagePan.y });
    }
  };

  const handleImageMouseMove = (e) => {
    if (isDragging && imageZoom > 1) {
      setImagePan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleImageMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      handleZoomIn();
    } else {
      handleZoomOut();
    }
  };

  // Helper to open modal with logging
  const openImageModal = () => {
    console.log("🖼️ Opening image modal");
    console.log("Donation data:", donasi);
    console.log("Image path:", donasi?.image);
    if (donasi?.image) {
      const imageUrl = donasi.image.startsWith('data:')
        ? '[base64]'
        : donasi.image.startsWith('http')
          ? donasi.image
          : `http://localhost:8000/${donasi.image}`;
      console.log("Final image URL:", imageUrl);
    }
    setShowImageModal(true);
  };

  // Helper to close modal
  const closeImageModal = () => {
    console.log("Closing modal");
    setShowImageModal(false);
    setImageZoom(1);
    setImagePan({ x: 0, y: 0 });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user || !user.id) {
      alert("Data pengguna tidak ditemukan, silakan login ulang.");
      return;
    }

    if (!donasi || formData.jumlah <= 0 || formData.jumlah > donasi.jumlah) {
      alert(`Jumlah harus di antara 1 dan ${donasi?.jumlah || 1}.`);
      return;
    }

    if (!formData.asal) {
      alert("Silakan isi asal Anda.");
      return;
    }

    // KIRIM permintaan dengan FormData untuk handle file upload
    const newRequestData = new FormData();
    newRequestData.append('judul', donasi.nama);
    newRequestData.append('deskripsi', formData.deskripsi);
    newRequestData.append('kategori', donasi.kategori);
    newRequestData.append('target_jumlah', parseInt(formData.jumlah));
    newRequestData.append('lokasi', donasi.lokasi);
    newRequestData.append('donation_id', parseInt(id));

    // Tambahkan bukti file jika ada
    if (formData.bukti_file) {
      newRequestData.append('bukti_kebutuhan', formData.bukti_file);
    }

    try {
      const response = await fetch('http://localhost:8000/api/permintaan-sayas', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
          // Jangan set Content-Type, browser akan set multipart/form-data
        },
        body: newRequestData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Gagal membuat permintaan');
      }

      alert("Permintaan berhasil diajukan dan disimpan ke database!");
      setFormData({ jumlah: 1, asal: "", deskripsi: "", bukti_file: null });
      setBuktiPreview(null);
      navigate("/penerima/permintaan-saya");

    } catch (error) {
      console.error("Error API Permintaan Saya:", error);
      alert("Gagal mengajukan permintaan: " + (error.message || "Terjadi kesalahan server."));
    }
  };

  // Handle mark received
  const handleMarkReceived = async (reqId) => {
    try {
      setActionLoading(true);
      await fetch(`http://localhost:8000/api/permintaan-sayas/${reqId}/received`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      });
      alert('Barang ditandai sebagai sudah diterima');
      const data = await getMyPermintaanSaya();
      setPermintaan(data);
    } catch (error) {
      alert('Gagal menandai penerimaan: ' + (error.message || 'Terjadi kesalahan'));
    } finally {
      setActionLoading(false);
    }
  };

  // --- LOGIKA TAMPILAN DAFTAR (if (!id)) ---
  if (!id) {
    if (permintaan.length === 0) {
      return (
        <div className="max-w-7xl mx-auto p-6">
          <div className="text-center py-20 bg-gray-50 rounded-xl">
            <FiPackage className="mx-auto text-4xl text-gray-300 mb-3" />
            <p className="text-gray-600 text-lg">Belum ada permintaan yang diajukan.</p>
          </div>
        </div>
      );
    }

    return (
      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Permintaan Saya</h1>
        <div className="grid gap-4">
          {permintaan.map((req) => {
            return (
              <div
                key={req.id}
                className="bg-white rounded-xl shadow hover:shadow-lg transition-all p-6"
              >
                <div className="flex items-start justify-between gap-6">
                  {/* Image - dari donation.image (base64 atau path) */}
                  <div className="flex-shrink-0">
                    <div className="w-28 h-28 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center shadow-md hover:shadow-lg transition-shadow">
                      {req.donation?.image ? (
                        <img
                          src={
                            req.donation.image.startsWith('data:')
                              ? req.donation.image
                              : `http://localhost:8000/${req.donation.image}`
                          }
                          alt={req.judul}
                          className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                          onError={(e) => {
                            console.error("❌ Image failed to load:", e.target.src);
                            e.target.style.display = 'none';
                            if (e.target.nextElementSibling) {
                              e.target.nextElementSibling.style.display = 'flex';
                            }
                          }}
                        />
                      ) : null}
                      <div
                        className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-3xl"
                        style={{ display: req.donation?.image ? 'none' : 'flex' }}
                      >
                        📦
                      </div>
                    </div>
                  </div>

                  <div className="flex-1">
                    <h2 className="font-bold text-xl flex items-center gap-2 mb-2">
                      <FiPackage className="text-[#00306C]" />
                      {req.judul || "Permintaan Kebutuhan"}
                    </h2>
                    <p className="text-gray-600 mb-4">{req.deskripsi}</p>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Lokasi:</span>
                        <p className="font-semibold">{req.lokasi}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Jumlah:</span>
                        <p className="font-semibold">{req.target_jumlah}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 items-end">
                    {/* Status Permohonan */}
                    <div>
                      <span className="text-xs text-gray-500">Permohonan</span>
                      <span
                        className={`block px-3 py-1 rounded-full text-xs font-semibold mt-1 ${req.status_permohonan === 'pending'
                          ? 'bg-yellow-100 text-yellow-700'
                          : req.status_permohonan === 'approved'
                            ? 'bg-blue-100 text-[#00306C]'
                            : 'bg-red-100 text-red-700'
                          }`}
                      >
                        {req.status_permohonan === 'pending' ? '⏳ Menunggu' : req.status_permohonan === 'approved' ? '✓ Disetujui' : '✕ Ditolak'}
                      </span>
                    </div>

                    {/* Status Pengiriman (jika approved) */}
                    {req.status_permohonan === 'approved' && (
                      <div>
                        <span className="text-xs text-gray-500">Pengiriman</span>
                        <span
                          className={`block px-3 py-1 rounded-full text-xs font-semibold mt-1 ${req.status_pengiriman === 'draft'
                            ? 'bg-blue-100 text-[#00306C]'
                            : req.status_pengiriman === 'sent'
                              ? 'bg-purple-100 text-purple-700'
                              : 'bg-blue-100 text-[#00306C]'
                            }`}
                        >
                          {req.status_pengiriman === 'draft' ? '📦 Disiapkan' : req.status_pengiriman === 'sent' ? '🚚 Dikirim' : '📍 Diterima'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Button */}
                {req.status_permohonan === 'approved' && (
                  <div className="mt-4 pt-4 border-t flex flex-col gap-2">
                    {/* CHAT BUTTON */}
                    {req.donation?.user_id && (
                      <button
                        onClick={() => navigate('/penerima/chat', { state: { peerId: req.donation.user_id } })}
                        className="w-full bg-blue-100 hover:bg-blue-200 text-[#00306C] font-bold py-2 rounded-lg transition-all flex items-center justify-center gap-2"
                      >
                        <FiMessageSquare /> Chat Donatur
                      </button>
                    )}

                    {req.status_pengiriman === 'sent' && (
                      <button
                        onClick={() => handleMarkReceived(req.id)}
                        disabled={actionLoading}
                        className="w-full bg-[#00306C] hover:bg-[#001F4D] disabled:bg-gray-400 text-white font-bold py-2 rounded-lg transition-all flex items-center justify-center gap-2"
                      >
                        {actionLoading ? <FiLoader className="animate-spin" /> : <FiCheckCircle />}
                        Konfirmasi Sudah Diterima
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // --- LOGIKA FORM PENGAJUAN ---
  return (
    <div className="max-w-2xl mx-auto">
      {/* IMAGE ZOOM MODAL */}
      {showImageModal && donasi?.image && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={closeImageModal}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-bold">Pratinjau Gambar - {Math.round(imageZoom * 100)}%</h3>
              <button
                onClick={closeImageModal}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
              >
                ✕
              </button>
            </div>

            {/* Image Viewer */}
            <div
              className="bg-gray-900 relative overflow-hidden flex items-center justify-center"
              style={{ height: '500px' }}
              onMouseDown={handleImageMouseDown}
              onMouseMove={handleImageMouseMove}
              onMouseUp={handleImageMouseUp}
              onMouseLeave={handleImageMouseUp}
              onWheel={handleWheel}
            >
              <img
                src={
                  donasi.image.startsWith('data:')
                    ? donasi.image
                    : donasi.image.startsWith('http')
                      ? donasi.image
                      : `http://localhost:8000/${donasi.image}`
                }
                alt={donasi.nama}
                style={{
                  transform: `scale(${imageZoom}) translate(${imagePan.x}px, ${imagePan.y}px)`,
                  cursor: imageZoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default',
                  transformOrigin: 'center',
                  transition: isDragging ? 'none' : 'transform 0.2s ease-out',
                  maxHeight: '100%',
                  maxWidth: '100%',
                  objectFit: 'contain',
                }}
                onError={(e) => {
                  console.error("❌ Image failed to load in modal:", e.target.src);
                  e.target.style.display = 'none';
                  // Show fallback
                  const fallback = document.createElement('div');
                  fallback.className = 'text-6xl text-gray-600 text-center';
                  fallback.textContent = '📦 Gambar tidak dapat ditampilkan';
                  e.target.parentElement.appendChild(fallback);
                }}
              />
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-3 p-4 border-t bg-gray-50 flex-wrap">
              <button
                onClick={handleZoomOut}
                disabled={imageZoom <= 1}
                className="px-4 py-2 bg-[#00306C] text-white rounded-lg hover:bg-[#001F4D] disabled:bg-gray-300 transition-all"
              >
                − Zoom Out
              </button>
              <span className="text-sm font-semibold min-w-[80px] text-center">
                {Math.round(imageZoom * 100)}%
              </span>
              <button
                onClick={handleZoomIn}
                disabled={imageZoom >= 3}
                className="px-4 py-2 bg-[#00306C] text-white rounded-lg hover:bg-[#001F4D] disabled:bg-gray-300 transition-all"
              >
                + Zoom In
              </button>
              <button
                onClick={handleResetZoom}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center space-x-2 text-gray-700 font-semibold hover:text-[#007EFF] transition-colors"
        >
          <FiArrowLeft className="text-lg" />
          <span>Kembali</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-2xl">
        <div className="bg-gradient-to-r from-[#00306C] to-[#0063FF] text-white px-8 py-6 rounded-t-3xl">
          <h1 className="text-3xl font-bold">Permintaan Barang</h1>
          <p className="text-white/80 mt-1">
            Konfirmasi permintaan Anda untuk barang ini.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div>
            <label className="flex items-center space-x-2 text-sm font-bold text-gray-900 mb-3">
              <FiPackage className="text-[#00306C]" />
              <span>Nama Barang</span>
            </label>
            <input
              type="text"
              value={donasi?.nama || ""}
              disabled
              className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl bg-gray-100 text-gray-600"
            />
          </div>

          <div>
            <label className="flex items-center space-x-2 text-sm font-bold text-gray-900 mb-3">
              <FiPackage className="text-[#00306C]" />
              <span>Jumlah/Kebutuhan *</span>
            </label>
            <input
              type="number"
              name="jumlah"
              value={formData.jumlah}
              onChange={handleChange}
              min="1"
              max={donasi?.jumlah || 1}
              required
              className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:border-[#00306C] focus:ring-4 focus:ring-[#00306C]/10 transition-all"
            />
          </div>

          <div>
            <label className="flex items-center space-x-2 text-sm font-bold text-gray-900 mb-3">
              <FiUsers className="text-[#00306C]" />
              <span>Darimana Anda Berasal *</span>
            </label>
            <input
              type="text"
              name="asal"
              value={formData.asal}
              onChange={handleChange}
              required
              placeholder="Contoh: Komunitas, panti asuhan, dsb."
              className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:border-[#00306C] focus:ring-4 focus:ring-[#00306C]/10 transition-all"
            />
          </div>

          <div>
            <label className="flex items-center space-x-2 text-sm font-bold text-gray-900 mb-3">
              <FiFileText className="text-[#00306C]" />
              <span>Deskripsi Tambahan</span>
            </label>
            <textarea
              name="deskripsi"
              value={formData.deskripsi}
              onChange={handleChange}
              rows="4"
              className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:border-[#00306C] focus:ring-4 focus:ring-[#00306C]/10 transition-all resize-none"
            />
          </div>

          {/* GAMBAR BARANG DONASI DENGAN ZOOM */}
          {donasi ? (
            <div>
              <label className="flex items-center space-x-2 text-sm font-bold text-gray-900 mb-3">
                <FiImage className="text-[#00306C]" />
                <span>Gambar Barang Donasi</span>
              </label>
              {donasi.image ? (
                <div
                  onClick={() => {
                    console.log("🖼️ Image container clicked");
                    openImageModal();
                  }}
                  className="w-full group relative overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all cursor-pointer bg-gray-100"
                >
                  <img
                    src={donasi.image.startsWith('data:') ? donasi.image : `http://localhost:8000/${donasi.image}`}
                    alt={donasi.nama}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform"
                    onError={(e) => {
                      console.error("❌ Image failed to load:", e.target.src);
                      e.target.style.display = 'none';
                      if (e.target.nextElementSibling) {
                        e.target.nextElementSibling.style.display = 'flex';
                      }
                    }}
                  />
                  <div
                    className="w-full h-64 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-6xl"
                    style={{ display: 'none' }}
                  >
                    📦
                  </div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                    <div className="bg-white/95 px-6 py-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity text-center">
                      <p className="text-sm font-semibold text-gray-800">🔍 Klik untuk zoom in/out</p>
                      <p className="text-xs text-gray-600 mt-1">Scroll untuk zoom • Drag untuk pan</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-full h-64 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex flex-col items-center justify-center text-gray-600">
                  <p className="text-6xl mb-3">📦</p>
                  <p className="font-semibold">Gambar tidak tersedia</p>
                  <p className="text-sm mt-2">{donasi.kategori || 'Donasi'}</p>
                </div>
              )}
            </div>
          ) : null}

          {/* UPLOAD BUKTI KEBUTUHAN */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-bold text-gray-900 mb-3">
              <FiImage className="text-[#00306C]" />
              <span>Upload Bukti Kebutuhan</span>
            </label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-blue-50 hover:bg-blue-100 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <FiImage className="w-8 h-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">
                    {buktiPreview ? "File terpilih" : "Klik untuk upload atau drag & drop"}
                  </p>
                  {buktiPreview && (
                    <p className="text-xs text-green-600 mt-1">✓ Gambar siap diunggah</p>
                  )}
                </div>
                <input
                  type="file"
                  name="bukti_file"
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
              </label>
            </div>
            {buktiPreview && (
              <div className="mt-4">
                <img
                  src={buktiPreview}
                  alt="Preview"
                  className="h-32 w-auto object-cover rounded-lg shadow-md"
                />
              </div>
            )}
          </div>

          <div className="pt-6 border-t border-gray-100">
            <button
              type="submit"
              className="w-full flex items-center justify-center space-x-2 px-6 py-4 font-bold rounded-xl transition-all bg-gradient-to-r from-[#00306C] to-[#001F4D] text-white hover:shadow-xl hover:shadow-[#00306C]/30 hover:scale-[1.03]"
            >
              <FiSend className="text-xl" />
              <span>Ajukan Permintaan</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PermintaanSaya;