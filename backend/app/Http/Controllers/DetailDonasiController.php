<?php

namespace App\Http\Controllers;

use App\Models\DetailDonasi;
use App\Models\Donation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class DetailDonasiController extends Controller
{
    // Get all detail donasi (for penerima)
    public function index(Request $request)
    {
        try {
            $user = Auth::user() ?? auth()->guard('sanctum')->user();
            
            Log::info('DetailDonasi Index - User:', ['user_id' => $user?->id, 'role' => $user?->role]);
            
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Tidak terautentikasi'
                ], 401);
            }

            // FIX 500: Sederhanakan eager loading.
            // DULU: DetailDonasi::with(['donation', 'donation.user', 'user']);
            $query = DetailDonasi::with('donation'); 

            // Filter by user_id if user is penerima
            if ($user->role === 'penerima') {
                $query->where('user_id', $user->id);
            }

            // Filter by status if provided
            if ($request->has('status')) {
                $query->where('status_penerimaan', $request->status);
            }

            $detailDonasi = $query->orderBy('created_at', 'desc')->get();
            
            Log::info('DetailDonasi fetched:', ['count' => count($detailDonasi)]);

            return response()->json([
                'success' => true,
                'message' => 'Data detail donasi berhasil diambil',
                'data' => $detailDonasi
            ], 200);
        } catch (\Exception $e) {
            Log::error('DetailDonasi Index Error:', ['error' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan: ' . $e->getMessage()
            ], 500);
        }
    }

    // Get detail donasi by ID
    public function show($id)
    {
        try {
            // FIX 500: Sederhanakan eager loading
            $detailDonasi = DetailDonasi::with('donation')->findOrFail($id);

            return response()->json([
                'success' => true,
                'message' => 'Data detail donasi berhasil diambil',
                'data' => $detailDonasi
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Data tidak ditemukan'
            ], 404);
        }
    }

    // Create detail donasi (penerima menerima donasi)
    public function store(Request $request)
    {
        try {
            $user = Auth::user() ?? auth()->guard('sanctum')->user();
            
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Tidak terautentikasi'
                ], 401);
            }

            if ($user->role !== 'penerima') {
                return response()->json([
                    'success' => false,
                    'message' => 'Hanya penerima yang dapat menerima donasi'
                ], 403);
            }

            $validated = $request->validate([
                'donation_id' => 'required|exists:donations,id',
                'nama_penerima' => 'required|string|max:255',
                'email_penerima' => 'required|email|max:255',
                'nomor_hp' => 'required|string|max:20',
                'alamat' => 'required|string',
                'keperluan' => 'required|string',
                'jumlah_diterima' => 'required|integer|min:1',
            ]);

            // Check if donation exists and is active
            $donation = Donation::findOrFail($validated['donation_id']);
            
            if ($donation->status !== 'aktif') {
                return response()->json([
                    'success' => false,
                    'message' => 'Donasi ini tidak tersedia'
                ], 400);
            }

            if ($donation->jumlah < $validated['jumlah_diterima']) {
                return response()->json([
                    'success' => false,
                    'message' => 'Jumlah donasi tidak mencukupi'
                ], 400);
            }

            // Create detail donasi
            $detailDonasi = DetailDonasi::create([
                'donation_id' => $validated['donation_id'],
                'user_id' => $user->id,
                'nama_penerima' => $validated['nama_penerima'],
                'email_penerima' => $validated['email_penerima'],
                'nomor_hp' => $validated['nomor_hp'],
                'alamat' => $validated['alamat'],
                'keperluan' => $validated['keperluan'],
                'jumlah_diterima' => $validated['jumlah_diterima'],
                'status_penerimaan' => 'menunggu'
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Permintaan donasi berhasil dibuat',
                'data' => $detailDonasi
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validasi gagal',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan: ' . $e->getMessage()
            ], 500);
        }
    }

    // Update detail donasi status
    public function updateStatus(Request $request, $id)
    {
        try {
            $user = Auth::user() ?? auth()->guard('sanctum')->user();
            
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Tidak terautentikasi'
                ], 401);
            }

            $detailDonasi = DetailDonasi::findOrFail($id);

            // Check if user is the owner (penerima) or donatur (donation owner)
            if ($user->id !== $detailDonasi->user_id && $user->id !== $detailDonasi->donation->user_id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Anda tidak memiliki akses untuk mengubah data ini'
                ], 403);
            }

            $validated = $request->validate([
                'status_penerimaan' => 'required|in:menunggu,diterima,ditolak',
                'catatan' => 'nullable|string',
                'tanggal_penerimaan' => 'nullable|date'
            ]);

            $detailDonasi->update($validated);

            // If accepted, reduce donation quantity
            if ($validated['status_penerimaan'] === 'diterima') {
                $donation = $detailDonasi->donation;
                $donation->update([
                    'jumlah' => $donation->jumlah - $detailDonasi->jumlah_diterima
                ]);

                // If donation is empty, mark as selesai
                if ($donation->jumlah <= 0) {
                    $donation->update(['status' => 'selesai']);
                }
            }

            return response()->json([
                'success' => true,
                'message' => 'Status donasi berhasil diperbarui',
                'data' => $detailDonasi
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan: ' . $e->getMessage()
            ], 500);
        }
    }

    // Delete detail donasi
    public function destroy($id)
    {
        try {
            $user = Auth::user() ?? auth()->guard('sanctum')->user();
            
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Tidak terautentikasi'
                ], 401);
            }

            $detailDonasi = DetailDonasi::findOrFail($id);

            // Check if user is the owner
            if ($user->id !== $detailDonasi->user_id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Anda tidak memiliki akses untuk menghapus data ini'
                ], 403);
            }

            $detailDonasi->delete();

            return response()->json([
                'success' => true,
                'message' => 'Detail donasi berhasil dihapus'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan: ' . $e->getMessage()
            ], 500);
        }
    }
}