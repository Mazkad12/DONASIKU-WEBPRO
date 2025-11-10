import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPackage, FiMapPin, FiCalendar, FiClock, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';
import { getAuthData, getUserRole, getRequests, getDonasi } from '../../utils/localStorage';
// Kita akan panggil service donasi, karena riwayat donatur ada di sana
import { getAllDonasi } from '../../services/donasiService'; 

const Riwayat = () => {
  const user = getAuthData();
  const role = getUserRole();
  const [historyItems, setHistoryItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHistory = async () => {
      setLoading(true);
      try {
        if (role === 'donatur') {
          // 1. Ambil semua donasi
          const allDonasi = await getAllDonasi();
          // 2. Filter untuk donasi milik user ini DAN yang statusnya 'selesai'
          const myHistory = allDonasi.filter(
            d => d.userId === user.id && d.status === 'selesai'
          );
          setHistoryItems(myHistory);
        } else if (role === 'penerima') {
          // Ambil semua permintaan
          const allRequests = getRequests();
          // Filter untuk permintaan milik user ini yang sudah diterima atau selesai
          const myHistory = allRequests.filter(
            r => String(r.penerimaId) === String(user.id) && 
            (r.status === 'completed' || r.status === 'accepted' || r.status === 'sent')
          );
          
          // Ambil detail donasi untuk setiap permintaan
          const allDonasi = getDonasi();
          const historyWithDetails = myHistory.map(request => {
            const donasi = allDonasi.find(d => String(d.id) === String(request.donasiId));
            return {
              ...request,
              nama: donasi?.nama || 'Donasi tidak ditemukan',
              kategori: donasi?.kategori || 'lainnya',
              image: donasi?.image,
              lokasi: donasi?.lokasi,
              jumlah: request.jumlahDiminta || donasi?.jumlah,
            };
          });
          
          setHistoryItems(historyWithDetails);
        }
      } catch (error) {
        console.error("Gagal memuat riwayat:", error);
      }
      setLoading(false);
    };

    loadHistory();
  }, [role, user.id]);

  const getCategoryIcon = (category) => {
    const icons = {
      'pakaian': '👕',
      'elektronik': '💻',
      'buku': '📚',
      'mainan': '🧸',
      'perabotan': '🛋️',
      'lainnya': '📦'
    };
    return icons[category.toLowerCase()] || '📦';
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[#00306C] via-[#0063FF] to-[#007EFF] text-white">
        <div className="max-w-7xl mx-auto px-6 md:px-8 py-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">
            <FiClock className="inline-block mb-2 mr-3" />
            Riwayat {role === 'donatur' ? 'Donasi' : 'Penerimaan'}
          </h1>
          <p className="text-xl text-white/80">
            Daftar semua transaksi yang telah Anda selesaikan.
          </p>
        </div>
        {/* Wave Separator */}
        <div className="relative">
          <svg viewBox="0 0 1440 100" className="w-full">
            <path fill="#F9FAFB" d="M0,50 Q360,0 720,50 T1440,50 L1440,100 L0,100 Z"></path>
          </svg>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-8">
        
        {/* TODO: Tambahkan Filter (Use Case Step 3) di sini nanti */}

        {/* Daftar Riwayat */}
        {loading && <p>Memuat riwayat...</p>}

        {!loading && historyItems.length === 0 && role === 'donatur' && (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiAlertCircle className="text-5xl text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Belum Ada Riwayat</h3>
            <p className="text-gray-600">Anda belum memiliki donasi yang berstatus "Selesai".</p>
          </div>
        )}
        
        {!loading && historyItems.length === 0 && role === 'penerima' && (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiAlertCircle className="text-5xl text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Belum Ada Riwayat</h3>
            <p className="text-gray-600 mb-6">Anda belum memiliki permintaan donasi yang sudah selesai.</p>
            <Link
              to="/permintaan-saya"
              className="inline-flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-[#007EFF] to-[#0063FF] text-white font-bold rounded-xl hover:shadow-xl transition-all"
            >
              <span>Lihat Permintaan Saya</span>
            </Link>
          </div>
        )}

        {!loading && historyItems.length > 0 && role === 'penerima' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {historyItems.map((item) => (
              <div
                key={item.id}
                className="group bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden bg-blue-50">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.nama}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-6xl">
                      {getCategoryIcon(item.kategori)}
                    </div>
                  )}
                  <div className="absolute top-3 left-3">
                    <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-gray-700">
                      {getCategoryIcon(item.kategori)} {item.kategori}
                    </span>
                  </div>
                  {/* Status */}
                  <div className="absolute top-3 right-3">
                    <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-semibold ${
                      item.status === 'completed' ? 'bg-green-100 text-green-700' :
                      item.status === 'accepted' ? 'bg-blue-100 text-blue-700' :
                      item.status === 'sent' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      <FiCheckCircle />
                      <span>
                        {item.status === 'completed' ? 'Selesai' :
                         item.status === 'accepted' ? 'Diterima' :
                         item.status === 'sent' ? 'Dikirim' : 
                         item.status}
                      </span>
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">
                    {item.nama}
                  </h3>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <FiPackage className="text-[#007EFF]" />
                      <span>Jumlah diminta: <span className="font-semibold">{item.jumlah} pcs</span></span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <FiMapPin className="text-[#007EFF]" />
                      <span className="line-clamp-1">{item.lokasi}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <FiCalendar className="text-[#007EFF]" />
                      <span>Tanggal: {new Date(item.updatedAt || item.createdAt).toLocaleDateString('id-ID', {
                        day: 'numeric', month: 'long', year: 'numeric'
                      })}</span>
                    </div>
                  </div>
                  {/* Tombol Detail */}
                  <div className="pt-4 border-t border-gray-100">
                    <button
                      className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all"
                    >
                      <span>Lihat Detail</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && historyItems.length > 0 && role === 'donatur' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {historyItems.map((item) => (
              <div
                key={item.id}
                className="group bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden bg-blue-50">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.nama}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-6xl">
                      {getCategoryIcon(item.kategori)}
                    </div>
                  )}
                  <div className="absolute top-3 left-3">
                    <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-gray-700">
                      {getCategoryIcon(item.kategori)} {item.kategori}
                    </span>
                  </div>
                  {/* Status Selesai */}
                  <div className="absolute top-3 right-3">
                     <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-700">
                        <FiCheckCircle />
                        <span>Selesai</span>
                      </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">
                    {item.nama}
                  </h3>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <FiPackage className="text-[#007EFF]" />
                      <span>Jumlah: <span className="font-semibold">{item.jumlah} pcs</span></span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <FiMapPin className="text-[#007EFF]" />
                      <span className="line-clamp-1">{item.lokasi}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <FiCalendar className="text-[#007EFF]" />
                      <span>Selesai pada: {new Date(item.updatedAt || item.createdAt).toLocaleDateString('id-ID', {
                        day: 'numeric', month: 'long', year: 'numeric'
                      })}</span>
                    </div>
                  </div>
                   {/* Tombol Detail (Use Case Step 4) */}
                   <div className="pt-4 border-t border-gray-100">
                    <button
                      // onClick={() => navigate(`/riwayat/detail/${item.id}`)} // (Rute detail bisa dibuat nanti)
                      className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all"
                    >
                      <span>Lihat Detail</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Riwayat;