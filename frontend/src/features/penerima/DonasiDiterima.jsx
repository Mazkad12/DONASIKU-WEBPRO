import { useState, useEffect } from 'react';
import { FiPackage, FiMapPin, FiCalendar, FiUser, FiAlertCircle, FiLoader, FiCheckCircle } from 'react-icons/fi';
import { getAuthData } from '../../utils/localStorage';
import API from '../../services/api';

const DonasiDiterima = () => {
  const [donasi, setDonasi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('semua');
  const [errorMsg, setErrorMsg] = useState('');
  const user = getAuthData();

  useEffect(() => {
    // Fetch data donasi yang diterima dari permintaan yang sudah terpenuhi
    const fetchDonasi = async () => {
      try {
        setLoading(true);
        setErrorMsg('');
        
        // Ambil permintaan dengan status terpenuhi (donasi sudah diterima)
        const response = await API.get('/permintaan-sayas?status=terpenuhi');

        if (response.data && response.data.data) {
          const detailDonasi = response.data.data.map(item => ({
            id: item.id,
            nama: item.judul,
            kategori: item.kategori || 'lainnya',
            jumlah: item.target_jumlah,
            lokasi: item.lokasi || 'Tidak diketahui',
            status: item.status || 'terpenuhi', // Status keseluruhan
            status_permohonan: item.status_permohonan || 'pending', // NEW: Approval status
            status_pengiriman: item.status_pengiriman || 'draft', // NEW: Delivery status
            tanggalDiterima: item.received_at || item.updated_at,
            tanggalDisetujui: item.approved_at,
            tanggalDikirim: item.sent_at,
            donatur: 'Donatur',
            deskripsi: item.deskripsi || '',
            email: '',
            nomor_hp: '',
            catatan: '',
            // Gunakan donation.image (base64 atau path), fallback ke item.image
            image: item.donation?.image || item.image || '/placeholder-donation.jpg'
          }));
          
          setDonasi(detailDonasi);
        }
      } catch (error) {
        console.error('Error fetching donasi:', error);
        setErrorMsg('Gagal memuat data donasi. ' + (error.response?.data?.message || error.message));
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchDonasi();
    } else {
      setLoading(false);
      setErrorMsg('Silakan login terlebih dahulu');
    }
  }, [user?.id]);

  const filteredDonasi = donasi.filter(d => {
    if (filter === 'semua') return true;
    if (filter === 'terpenuhi') return d.status_pengiriman === 'received';
    if (filter === 'menunggu') return d.status_permohonan === 'pending';
    return true;
  });

  const categoryIcons = {
    pakaian: '👕',
    elektronik: '💻',
    buku: '📚',
    mainan: '🧸',
    perabotan: '🛋️',
    lainnya: '📦'
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <FiLoader className="text-4xl text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Donasi yang Diterima</h1>
        <p className="text-gray-600 mt-2">Kelola donasi yang telah Anda terima</p>
      </div>

      {/* Error Alert */}
      {errorMsg && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
          <FiAlertCircle className="text-red-500 text-xl" />
          <p className="text-red-700">{errorMsg}</p>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex gap-3 border-b border-gray-200">
        {[
          { value: 'semua', label: 'Semua', count: donasi.length },
          { value: 'terpenuhi', label: 'Terpenuhi', count: donasi.filter(d => d.status_pengiriman === 'received').length },
          { value: 'menunggu', label: 'Menunggu Diproses', count: donasi.filter(d => d.status_permohonan === 'pending').length }
        ].map(tab => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value)}
            className={`px-4 py-3 font-semibold border-b-2 transition-all ${
              filter === tab.value
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Donasi List */}
      {filteredDonasi.length === 0 ? (
        <div className="text-center py-12 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-dashed border-blue-300">
          <FiPackage className="text-5xl text-blue-400 mx-auto mb-3" />
          <p className="text-gray-700 font-semibold">Belum ada donasi yang terpenuhi</p>
          <p className="text-sm text-gray-600 mt-2">Buat permintaan donasi dan tunggu donatur menyetujuinya</p>
          <p className="text-xs text-gray-500 mt-4 px-6">Donasi Anda yang sudah terpenuhi akan ditampilkan di sini</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredDonasi.map(item => (
            <div
              key={item.id}
              className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all"
            >
              <div className="flex gap-4">
                {/* Image - Support base64 & path */}
                <div className="flex-shrink-0">
                  <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-blue-100 rounded-lg flex items-center justify-center text-3xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                    {item.image ? (
                      <img
                        src={
                          item.image.startsWith('data:')
                            ? item.image
                            : `http://localhost:8000/${item.image}`
                        }
                        alt={item.nama}
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
                      className="w-full h-full bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center text-3xl"
                      style={{ display: item.image ? 'none' : 'flex' }}
                    >
                      {categoryIcons[item.kategori] || '📦'}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-grow">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">{item.nama}</h3>
                      <p className="text-sm text-gray-600 mt-1">{item.deskripsi}</p>
                    </div>
                    <div className="flex flex-col gap-2">
                      {/* Status Permohonan */}
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        item.status_permohonan === 'approved'
                          ? 'bg-green-100 text-green-700'
                          : item.status_permohonan === 'rejected'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {item.status_permohonan === 'approved' ? '✓ Disetujui' : item.status_permohonan === 'rejected' ? '✕ Ditolak' : '⏳ Menunggu'}
                      </span>
                      
                      {/* Status Pengiriman (jika approved) */}
                      {item.status_permohonan === 'approved' && (
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          item.status_pengiriman === 'received'
                            ? 'bg-green-100 text-green-700'
                            : item.status_pengiriman === 'sent'
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {item.status_pengiriman === 'received' ? '📍 Diterima' : item.status_pengiriman === 'sent' ? '🚚 Dikirim' : '📦 Disiapkan'}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Details */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    <div className="flex items-center gap-2 text-sm">
                      <FiPackage className="text-blue-500" />
                      <span className="text-gray-600">
                        <span className="font-semibold">{item.jumlah}</span> item
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <FiMapPin className="text-red-500" />
                      <span className="text-gray-600">{item.lokasi}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <FiUser className="text-purple-500" />
                      <span className="text-gray-600">{item.donatur}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <FiCalendar className="text-green-500" />
                      <span className="text-gray-600">
                        {item.tanggalDiterima 
                          ? new Date(item.tanggalDiterima).toLocaleDateString('id-ID')
                          : 'Belum diterima'
                        }
                      </span>
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-500 space-y-1">
                    {item.tanggalDisetujui && (
                      <p>✓ Disetujui: {new Date(item.tanggalDisetujui).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</p>
                    )}
                    {item.tanggalDikirim && (
                      <p>🚚 Dikirim: {new Date(item.tanggalDikirim).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</p>
                    )}
                    {item.tanggalDiterima && (
                      <p>📍 Diterima: {new Date(item.tanggalDiterima).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mt-8">
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Terpenuhi</p>
              <p className="text-2xl font-bold text-green-600 mt-1">
                {donasi.filter(d => d.status === 'terpenuhi').length}
              </p>
            </div>
            <FiCheckCircle className="text-4xl text-green-500 opacity-50" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Menunggu Diproses</p>
              <p className="text-2xl font-bold text-orange-600 mt-1">
                {donasi.filter(d => d.status === 'aktif').length}
              </p>
            </div>
            <FiAlertCircle className="text-4xl text-orange-500 opacity-50" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Item</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">
                {donasi.reduce((sum, d) => sum + d.jumlah, 0)}
              </p>
            </div>
            <FiPackage className="text-4xl text-blue-500 opacity-50" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonasiDiterima;
