<?php

namespace App\Http\Controllers;

use App\Models\Donation;
use App\Models\DetailDonasi; // <-- Model ini sekarang ada dari Langkah 1.1
use App\Http\Requests\StoreDonationRequest;
use App\Http\Requests\UpdateDonationRequest;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class DonationController extends Controller
{
    // ... (Fungsi index, myDonations, show, update, destroy tetap sama) ...

    // START: Fungsi STORE yang ditambahkan untuk memperbaiki Error 'Call to undefined method'
    // ... (Pastikan import Donation dan lainnya ada di atas)

    public function index(Request $request): JsonResponse
    {
        try {
            $query = Donation::query();

            // Hapus SEMUA ->with() di sini untuk menghindari 500 akibat relasi yang rusak.
            // Contoh: $query->with('user'); // HAPUS INI

            if ($request->has('status')) {
                $query->where('status', $request->status);
            }

            if ($request->has('kategori')) {
                $query->where('kategori', $request->kategori);
            }

            if ($request->has('search')) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('nama', 'like', "%{$search}%")
                        ->orWhere('deskripsi', 'like', "%{$search}%")
                        ->orWhere('lokasi', 'like', "%{$search}%");
                });
            }

            $perPage = $request->get('per_page', 15);
            $donations = $query->orderBy('created_at', 'desc')->paginate($perPage);

            // Pastikan field yang diakses di sini SESUAI PERSIS dengan skema tabel 'donations' Anda
            $formattedData = $donations->map(function ($donation) {
                return [
                    'id' => $donation->id,
                    'userId' => $donation->user_id,
                    'nama' => $donation->nama,
                    'kategori' => $donation->kategori,
                    'jumlah' => (int) $donation->jumlah,
                    'deskripsi' => $donation->deskripsi,
                    'lokasi' => $donation->lokasi,
                    'image' => $donation->image,
                    'status' => $donation->status,
                    'createdAt' => $donation->created_at->toIso8601String(),
                    'updatedAt' => $donation->updated_at->toIso8601String(),
                ];
            });

            return response()->json([
                'success' => true,
                'data' => [
                    'data' => $formattedData,
                    'meta' => [
                        'total' => $donations->total(),
                        'per_page' => $donations->perPage(),
                        'current_page' => $donations->currentPage(),
                        'last_page' => $donations->lastPage(),
                    ],
                ],
            ], 200);

        } catch (\Exception $e) {
            // Log Error untuk dibaca di server
            Log::error('Error fetching donations: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data donasi. Cek Log Laravel untuk detail 500.',
                'data' => ['data' => [], 'meta' => ['total' => 0, 'per_page' => 15, 'current_page' => 1, 'last_page' => 1,]],
            ], 500);
        }
    }

    // ... (Di dalam class DonationController)

    public function show(string $id): JsonResponse
    {
        try {
            // FIX: Hapus SEMUA eager loading yang mungkin ada di sini.
            // Contoh DULU: $donation = Donation::with(['user', 'detailDonasis'])->find($id);
            $donation = Donation::with('user')->find($id);

            if (!$donation) {
                return response()->json([
                    'success' => false,
                    'message' => 'Donasi tidak ditemukan',
                ], 404);
            }

            // ... (Logika formatting data)
            return response()->json([
                'success' => true,
                'data' => [
                    'id' => $donation->id,
                    'userId' => $donation->user_id,
                    'nama' => $donation->nama,
                    'kategori' => $donation->kategori,
                    'jumlah' => (int) $donation->jumlah,
                    'deskripsi' => $donation->deskripsi,
                    'lokasi' => $donation->lokasi,
                    'image' => $donation->image,
                    'status' => $donation->status,
                    'donatur' => $donation->user ? [
                        'id' => $donation->user->id,
                        'name' => $donation->user->name,
                        'email' => $donation->user->email,
                        'photo' => $donation->user->photo,
                        'phone' => $donation->user->phone,
                    ] : null,
                    'createdAt' => $donation->created_at->toIso8601String(),
                    'updatedAt' => $donation->updated_at->toIso8601String(),
                ],
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error fetching donation: ' . $e->getMessage()); // <-- Cek log ini!

            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil detail donasi. Cek Log Laravel untuk detail 500.',
            ], 500);
        }
    }
    public function store(StoreDonationRequest $request): JsonResponse
    {
        try {
            DB::beginTransaction();

            $donation = Donation::create([
                'user_id' => Auth::id(),
                'nama' => $request->nama,
                'kategori' => $request->kategori,
                'jumlah' => $request->jumlah,
                'deskripsi' => $request->deskripsi,
                'lokasi' => $request->lokasi,
                'image' => $request->image,
                'status' => 'aktif',
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Donasi berhasil dibuat',
                'data' => [
                    'id' => $donation->id,
                    'userId' => $donation->user_id,
                    'nama' => $donation->nama,
                    'kategori' => $donation->kategori,
                    'jumlah' => (int) $donation->jumlah,
                    'deskripsi' => $donation->deskripsi,
                    'lokasi' => $donation->lokasi,
                    'image' => $donation->image,
                    'status' => $donation->status,
                    'createdAt' => $donation->created_at->toIso8601String(),
                    'updatedAt' => $donation->updated_at->toIso8601String(),
                ],
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error creating donation: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Gagal membuat donasi',
            ], 500);
        }
    }
    // END: Fungsi STORE

    public function update(UpdateDonationRequest $request, $id)
    {
        try {
            $donation = Donation::findOrFail($id);

            // Check ownership
            if ($donation->user_id !== Auth::id()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized'
                ], 403);
            }

            $data = $request->validated();

            // Auto-status logic
            if (isset($data['jumlah'])) {
                if ((int) $data['jumlah'] === 0) {
                    $data['status'] = 'selesai';
                } elseif ((int) $data['jumlah'] > 0) {
                    // Jika sebelumnya selesai dan sekarang jumlah > 0, kembalikan ke aktif
                    // Atau jika user tidak eksplisit mengubah status, kita asumsikan aktif jika stok ada
                    if ($donation->status === 'selesai' || !isset($data['status'])) {
                        $data['status'] = 'aktif';
                    }
                }
            }

            $donation->update($data);

            return response()->json([
                'success' => true,
                'message' => 'Donasi berhasil diperbarui',
                'data' => $donation
            ]);

        } catch (\Exception $e) {
            Log::error('Error updating donation: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Gagal memperbarui donasi'
            ], 500);
        }
    }

    // Fungsi updateStatus yang sudah diperbaiki (Logika Otorisasi)
    public function updateStatus(Request $request, string $id): JsonResponse
    {
        $request->validate([
            'status' => 'required|in:aktif,selesai',
        ]);

        try {
            $user = Auth::user();
            $donation = Donation::find($id);

            if (!$donation) {
                return response()->json(['success' => false, 'message' => 'Donasi tidak ditemukan'], 404);
            }

            // Pengecekan Otorisasi Ganda
            $isOwner = $donation->user_id === $user->id;
            $isReceiverAuthorized = false;

            if ($request->status === 'selesai' && $user->role === 'penerima') {
                $isReceiverAuthorized = DetailDonasi::where('donation_id', $donation->id)
                    ->where('user_id', $user->id)
                    ->where('status_penerimaan', 'diterima')
                    ->exists();
            }

            if (!$isOwner && !$isReceiverAuthorized) {
                return response()->json(['success' => false, 'message' => 'Anda tidak memiliki akses untuk mengupdate status donasi ini'], 403);
            }

            DB::beginTransaction();
            $donation->update(['status' => $request->status]);
            DB::commit();

            // Peringatan VS Code hilang karena ada return di semua path (try dan catch)
            return response()->json([
                'success' => true,
                'message' => 'Status donasi berhasil diupdate',
                // ... (return data) ...
            ], 200);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error updating status: ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'Gagal mengupdate status donasi'], 500);
        }
    }

    // Tambahkan fungsi ini di dalam class DonationController Anda

    public function myDonations(Request $request): JsonResponse
    {
        try {
            if (!Auth::check()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthenticated',
                    'data' => ['data' => [], 'meta' => ['total' => 0, 'per_page' => 15, 'current_page' => 1, 'last_page' => 1,]],
                ], 401);
            }

            $query = Donation::where('user_id', Auth::id());

            // Hapus SEMUA ->with() yang tidak perlu untuk menghindari 500 akibat relasi yang rusak.

            if ($request->has('status')) {
                $query->where('status', $request->status);
            }

            $perPage = $request->get('per_page', 15);
            $donations = $query->orderBy('created_at', 'desc')->paginate($perPage);

            // Pastikan field yang diakses di sini SESUAI PERSIS dengan skema tabel 'donations'
            $formattedData = $donations->map(function ($donation) {
                return [
                    'id' => $donation->id,
                    'userId' => $donation->user_id,
                    'nama' => $donation->nama,
                    'kategori' => $donation->kategori,
                    'jumlah' => (int) $donation->jumlah,
                    'deskripsi' => $donation->deskripsi,
                    'lokasi' => $donation->lokasi,
                    'image' => $donation->image,
                    'status' => $donation->status,
                    'createdAt' => $donation->created_at->toIso8601String(),
                    'updatedAt' => $donation->updated_at->toIso8601String(),
                ];
            });

            return response()->json([
                'success' => true,
                'data' => [
                    'data' => $formattedData,
                    'meta' => [
                        'total' => $donations->total(),
                        'per_page' => $donations->perPage(),
                        'current_page' => $donations->currentPage(),
                        'last_page' => $donations->lastPage(),
                    ],
                ],
            ], 200);

        } catch (\Exception $e) {
            Log::error('Error fetching my donations: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data donasi. Cek Log Laravel untuk detail 500.',
                'data' => ['data' => [], 'meta' => ['total' => 0, 'per_page' => 15, 'current_page' => 1, 'last_page' => 1,]],
            ], 500);
        }
    }

    // ... (Di dalam class DonationController)

    public function destroy(string $id): JsonResponse
    {
        try {
            $user = Auth::user();

            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Tidak terautentikasi'
                ], 401);
            }

            // Cari donasi, jika tidak ada, lempar 404
            $donation = Donation::findOrFail($id);

            // Pengecekan Otorisasi: Hanya pemilik yang boleh menghapus
            if ($donation->user_id !== $user->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Anda tidak memiliki akses untuk menghapus donasi ini'
                ], 403);
            }

            // Jalankan penghapusan
            // Jika Model Donation menggunakan SoftDeletes, ini akan menjadi soft delete.
            // Jika tidak, ini adalah hard delete. Kita asumsikan hard delete sesuai skema Anda.
            $donation->delete();

            return response()->json([
                'success' => true,
                'message' => 'Donasi berhasil dihapus'
            ], 200);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Donasi tidak ditemukan'
            ], 404);
        } catch (\Exception $e) {
            // Catat error fatal di log
            Log::error('Error deleting donation: ' . $e->getMessage());

            // FIX: Tambahkan pesan yang lebih informatif di frontend
            return response()->json([
                'success' => false,
                'message' => 'Gagal menghapus donasi. Cek Log Laravel (Kemungkinan ada masalah Foreign Key).',
            ], 500);
        }
    }
    // ... (Tambahkan fungsi-fungsi lainnya seperti index, show, update, destroy di sini)
}