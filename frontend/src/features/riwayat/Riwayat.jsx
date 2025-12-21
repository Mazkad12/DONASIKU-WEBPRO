import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPackage, FiMapPin, FiCalendar, FiClock, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';
import { getAuthData, getUserRole } from '../../utils/localStorage';
import { getAllDonasi } from '../../services/donasiService';
import { getMyPermintaanSaya } from '../../services/permintaanService';
import API, { detailDonasiAPI } from '../../services/api';

const Riwayat = () => {
  const user = getAuthData();
  const role = getUserRole();
  const [historyItems, setHistoryItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHistory = async () => {
      setLoading(true);
      try {
        const [permintaanList, detailDonasiResponse] = await Promise.all([
          getMyPermintaanSaya(),
          detailDonasiAPI.getAll()
        ]);

        const detailDonasiList = detailDonasiResponse.data?.data || [];

        if (role === 'donatur') {
          // 1. Get traditional donations that are finished
          const allDonasi = await getAllDonasi();
          const myDonations = allDonasi.filter(
            d => d.user_id === user.id && d.status === 'selesai'
          );

          // 2. Get fulfilled requests that are received
          const fulfilledHistory = permintaanList.filter(
            req => req.donation?.user_id === user.id && req.status_pengiriman === 'received'
          ).map(req => ({
            ...req,
            nama: req.judul,
            jumlah: req.target_jumlah,
            updated_at: req.received_at || req.updated_at,
            displayStatus: 'completed'
          }));

          setHistoryItems([...myDonations, ...fulfilledHistory]);
        } else if (role === 'penerima') {
          // Normalize items from PermintaanSaya
          const historyFromPermintaan = permintaanList.filter(
            req => req.status_pengiriman === 'received' || req.status_permohonan === 'rejected' || req.status === 'terpenuhi'
          ).map(req => ({
            ...req,
            nama: req.judul,
            jumlah: req.target_jumlah,
            displayStatus: (req.status_pengiriman === 'received' || req.status === 'terpenuhi') ? 'completed' : 'rejected',
            updatedAt: req.received_at || req.updated_at
          }));

          // Normalize items from DetailDonasi (Accepted donations)
          const historyFromDetail = detailDonasiList.filter(
            dd => dd.status_penerimaan === 'received' || dd.status_penerimaan === 'completed' || dd.status_penerimaan === 'selesai'
          ).map(dd => ({
            ...dd,
            nama: dd.donation?.nama || 'Donasi',
            jumlah: dd.jumlah || 1,
            kategori: dd.donation?.kategori || 'lainnya',
            image: dd.donation?.image,
            displayStatus: 'completed',
            updatedAt: dd.updated_at || dd.created_at
          }));

          const merged = [...historyFromPermintaan, ...historyFromDetail].sort((a, b) =>
            new Date(b.updatedAt || b.updated_at) - new Date(a.updatedAt || a.updated_at)
          );

          setHistoryItems(merged);
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
    return icons[category?.toLowerCase()] || '📦';
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
        <div className="relative">
          <svg viewBox="0 0 1440 100" className="w-full">
            <path fill="#F9FAFB" d="M0,50 Q360,0 720,50 T1440,50 L1440,100 L0,100 Z"></path>
          </svg>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-8">

        {loading && <p className="text-center text-gray-500">Memuat riwayat...</p>}

        {!loading && historyItems.length === 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiAlertCircle className="text-5xl text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Belum Ada Riwayat</h3>
            <p className="text-gray-600 mb-6">
              {role === 'donatur'
                ? 'Anda belum memiliki donasi yang berstatus "Selesai".'
                : 'Anda belum memiliki riwayat penerimaan yang sudah selesai.'}
            </p>
            {role === 'penerima' && (
              <Link
                to="/penerima/permintaan-saya"
                className="inline-flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-[#007EFF] to-[#0063FF] text-white font-bold rounded-xl hover:shadow-xl transition-all"
              >
                <span>Lihat Permintaan Saya</span>
              </Link>
            )}
          </div>
        )}

        {!loading && historyItems.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {historyItems.map((item, idx) => (
              <div
                key={item.id || idx}
                className="group bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100"
              >
                <div className="relative h-48 overflow-hidden bg-blue-50">
                  {item.image ? (
                    <img
                      src={item.image.startsWith('http') || item.image.startsWith('data:') ? item.image : `http://localhost:8000/${item.image}`}
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
                  <div className="absolute top-3 right-3">
                    <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-semibold ${(item.displayStatus === 'completed' || item.status === 'selesai' || item.status === 'terpenuhi') ? 'bg-green-100 text-green-700' :
                        item.displayStatus === 'rejected' ? 'bg-red-100 text-red-700' :
                          'bg-blue-100 text-blue-700'
                      }`}>
                      <FiCheckCircle />
                      <span>
                        {(item.displayStatus === 'completed' || item.status === 'selesai' || item.status === 'terpenuhi') ? 'Selesai' :
                          item.displayStatus === 'rejected' ? 'Ditolak' :
                            'Selesai'}
                      </span>
                    </span>
                  </div>
                </div>

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
                      <span className="line-clamp-1">{item.lokasi || 'Lokasi tidak tersedia'}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <FiCalendar className="text-[#007EFF]" />
                      <span>Tanggal: {new Date(item.updatedAt || item.updated_at || item.createdAt || item.created_at).toLocaleDateString('id-ID', {
                        day: 'numeric', month: 'long', year: 'numeric'
                      })}</span>
                    </div>
                  </div>
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
      </div>
    </div>
  );
};

export default Riwayat;