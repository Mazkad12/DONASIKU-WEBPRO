import { useState, useRef, useEffect } from "react";
import { FiCamera, FiEdit2 } from "react-icons/fi";
import { getAuthData, setAuthData } from "../../utils/localStorage.js";
import axios from 'axios'; // <--- PASTIKAN AXIOS DIIMPORT

function Profile() {
  const userData = getAuthData();
  const [profile, setProfile] = useState(userData || {
    name: "",
    email: "",
    phone: "",
    role: "",
    avatar: "",
  });

  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({ ...profile });
  
  // STATE BARU: Menyimpan objek File mentah dari komputer lokal
  const [fileToUpload, setFileToUpload] = useState(null); 
  
  const fileInputRef = useRef(null);

  useEffect(() => {
    setEditData({ ...profile });
    setFileToUpload(null); 
  }, [profile]);

  const handleChange = (e) => setEditData({ ...editData, [e.target.name]: e.target.value });

  // 📸 Handler ini menyimpan File Object mentah dan membuat Base64 untuk PREVIEW
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileToUpload(file); // SIMPAN FILE OBJECT MENTAH UNTUK UPLOAD
      
      const reader = new FileReader();
      reader.onloadend = () => setEditData({ ...editData, avatar: reader.result });
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    
    // 1. Gunakan FormData untuk mengirim file
    const formData = new FormData();
    
    // Append data text
    formData.append('name', editData.name);
    formData.append('email', editData.email);
    formData.append('phone', editData.phone || ''); 

    // Penanganan Avatar: Kirim file mentah jika ada fileToUpload
    if (fileToUpload) {
        // Nama field HARUS 'avatar' agar sesuai dengan controller Laravel
        formData.append('avatar', fileToUpload); 
    } else if (editData.avatar === null || editData.avatar === '') {
        // Logika untuk menghapus avatar jika diperlukan
        formData.append('avatar', ''); 
    }

    try {
        // Logika token yang sudah diperbaiki
        let token;
        const currentAuthData = getAuthData();
        token = currentAuthData?.token || currentAuthData?.access_token; 
        if (!token) { token = localStorage.getItem('auth_token') || localStorage.getItem('token'); }
        
        if (!token) {
            alert("Token otorisasi tidak ditemukan. Silakan login kembali.");
            return;
        }

        // GANTI 'http://localhost:8000' dengan URL Base Backend Laravel Anda jika berbeda
        const API_URL = 'http://localhost:8000/api/profile/update';

        // 2. Kirim API Request menggunakan FormData
        const response = await axios.post(API_URL, formData, { // <--- KRITIS: MENGIRIM DATA KE LARAVEL
            headers: {
                // Axios akan otomatis mengatur Content-Type: multipart/form-data
                'Authorization': `Bearer ${token}`,
            },
        });

        // 3. Update State dan Local Storage
        const updatedUser = response.data.user; 
        
        setProfile(updatedUser); 
        setAuthData({ 
            ...currentAuthData,
            ...updatedUser,
            token: token, 
        });
        
        // Reset file state
        setFileToUpload(null); 

        setEditMode(false);
        alert(response.data.message || 'Profil berhasil diperbarui!');

    } catch (error) {
        console.error('Error saat menyimpan profil:', error);
        
        const validationErrors = error.response?.data?.errors;
        
        if (validationErrors) {
             const firstError = Object.values(validationErrors).flat()[0];
             alert('Gagal menyimpan: ' + firstError);
        } else {
             if (error.response?.status === 401) {
                alert("Sesi Anda berakhir. Silakan login kembali.");
             } else {
                alert(error.response?.data?.message || 'Terjadi kesalahan saat menghubungi server.');
             }
        }
    }
  };

  const handleCancel = () => {
    setEditData({ ...profile });
    setFileToUpload(null);
    setEditMode(false);
  };

  const avatarSrc = editData.avatar || profile.avatar;

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-6">

        {/* Avatar */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative">
             {/* Tampilan gambar: handle Base64, path storage, dan default */}
            <img
              src={avatarSrc && !avatarSrc.startsWith('data:') && !avatarSrc.startsWith('http') ? `http://localhost:8000/storage/${avatarSrc}` : avatarSrc || "/default-avatar.png"}
              alt="Avatar"
              className="w-32 h-32 rounded-full object-cover border-4 border-blue-400 shadow-md"
            />
            {editMode && (
              <button
                onClick={() => fileInputRef.current.click()}
                className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full text-white shadow-md hover:bg-blue-700 transition"
              >
                <FiCamera size={20} />
              </button>
            )}
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>
          <h1 className="text-2xl font-bold mt-4">{profile.name}</h1>
          <span className="text-sm text-white bg-blue-500 px-3 py-1 rounded-full mt-1">{profile.role}</span>
        </div>

        {/* Detail Profil */}
        {!editMode ? (
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-500">Nama</label>
              <p className="mt-1 text-gray-800">{profile.name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Email</label>
              <p className="mt-1 text-gray-800">{profile.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Nomor HP</label>
              <p className="mt-1 text-gray-800">{profile.phone || '-'}</p>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setEditMode(true)}
                className="flex items-center gap-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                <FiEdit2 /> Edit Profil
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-500">Nama</label>
              <input
                type="text"
                name="name"
                value={editData.name}
                onChange={handleChange}
                className="w-full border rounded-md px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Email</label>
              <input
                type="email"
                name="email"
                value={editData.email}
                onChange={handleChange}
                className="w-full border rounded-md px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Nomor HP</label>
              <input
                type="text"
                name="phone"
                value={editData.phone}
                onChange={handleChange}
                className="w-full border rounded-md px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={handleSave}
                className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Simpan
              </button>
              <button
                onClick={handleCancel}
                className="bg-gray-300 text-gray-700 px-5 py-2 rounded-lg hover:bg-gray-400 transition"
              >
                Batal
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;