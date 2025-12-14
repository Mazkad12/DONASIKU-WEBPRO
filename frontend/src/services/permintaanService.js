// frontend/src/services/permintaanService.js
import API from './api'; 

// Fungsi CREATE - membuat permintaan baru
export const createPermintaanSaya = async (data) => {
    try {
        const response = await API.post('/permintaan-sayas', data); 
        return response.data;
    } catch (error) {
        console.error('Error creating Permintaan Saya:', error);
        throw new Error(error.response?.data?.message || 'Gagal membuat permintaan ke server.');
    }
};

// Fungsi READ - ambil donasi berdasarkan ID untuk form permintaan
export const getDonasiForPermintaan = async (donasiId) => {
    try {
        console.log('Fetching donation for form with ID:', donasiId);
        const response = await API.get(`/donations/${donasiId}`, { timeout: 10000 });
        const donasiData = response.data.data || response.data;
        console.log('Donation data loaded:', donasiData);
        return donasiData;
    } catch (error) {
        console.error('Error fetching donation for form:', error.message);
        throw new Error(error.response?.data?.message || 'Gagal memuat data donasi.');
    }
};

// Fungsi READ yang baru - dengan timeout fallback dan retry logic
export const getMyPermintaanSaya = async (retryCount = 0) => {
    try {
        const token = localStorage.getItem('auth_token');
        console.log('Getting my requests... Token present:', !!token);
        
        // Memanggil endpoint backend GET /api/permintaan-sayas (Controller index)
        // Increased timeout to 15000ms (15 seconds) to avoid timeout issues
        const response = await API.get('/permintaan-sayas', { timeout: 15000 });
        // Asumsi backend mengembalikan data di response.data.data (seperti di Controller Anda)
        const data = response.data.data || response.data || [];
        console.log('Requests loaded successfully:', data.length, 'items');
        return Array.isArray(data) ? data : []; 
    } catch (error) {
        console.error('Error fetching my requests:', error.message, error.code);
        
        // Retry logic for timeout errors - max 1 retry
        if ((error.code === 'ECONNABORTED' || error.message.includes('timeout')) && retryCount < 1) {
            console.warn('Request timeout - retrying once...');
            await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second before retry
            return getMyPermintaanSaya(retryCount + 1);
        }
        
        // Fallback: return empty array instead of throwing
        if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
            console.warn('Request timeout after retry - returning empty list');
            return [];
        }
        if (error.response?.status === 401) {
            console.warn('Not authenticated - returning empty list');
            return []; // Not authenticated
        }
        // Don't throw for network errors, just return empty
        console.warn('API error - returning empty list:', error.message);
        return [];
    }
};