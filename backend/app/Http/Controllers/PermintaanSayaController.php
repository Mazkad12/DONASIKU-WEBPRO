<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use App\Models\PermintaanSaya;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Http\JsonResponse;
use App\Models\Notification;

class PermintaanSayaController extends Controller
{
    /**
     * Get all permintaan saya (Hanya permintaan milik user yang login)
     * GET /api/permintaan-sayas
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $user = Auth::user() ?? auth()->guard('sanctum')->user();

            // Otentikasi tetap diperlukan
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Tidak terautentikasi'
                ], 401);
            }

            $query = PermintaanSaya::with('donation'); // Eager load donation relationship

            // Logika baru: Jika user adalah PENERIMA, filter hanya permintaan miliknya.
            if ($user->role === 'penerima') {
                $query->where('user_id', $user->id);
            }
            // Jika user adalah DONATUR, tampilkan (1) Permintaan yang dia penuhi (linked to his donation), ATAU (2) Permintaan terbuka (belum ada donasi).
            else if ($user->role === 'donatur') {
                $query->where(function ($q) use ($user) {
                    $q->whereHas('donation', function ($subQ) use ($user) {
                        $subQ->where('user_id', $user->id);
                    })
                    ->orWhereNull('donation_id'); // Tampilkan permintaan terbuka
                });
            }

            // Filter by status if provided (optional)
            if ($request->has('status')) {
                $query->where('status', $request->status);
            }

            $permintaan = $query->orderBy('created_at', 'desc')->get();

            // Transform data untuk memastikan donation image terlihat
            $formattedData = $permintaan->map(function ($item) {
                return [
                    'id' => $item->id,
                    'user_id' => $item->user_id,
                    'donation_id' => $item->donation_id,
                    'judul' => $item->judul,
                    'deskripsi' => $item->deskripsi,
                    'kategori' => $item->kategori,
                    'target_jumlah' => $item->target_jumlah,
                    'lokasi' => $item->lokasi,
                    'image' => $item->image,
                    'status' => $item->status,
                    'status_permohonan' => $item->status_permohonan,
                    'status_pengiriman' => $item->status_pengiriman,
                    'bukti_kebutuhan' => $item->bukti_kebutuhan,
                    'approved_at' => $item->approved_at,
                    'sent_at' => $item->sent_at,
                    'received_at' => $item->received_at,
                    'created_at' => $item->created_at,
                    'updated_at' => $item->updated_at,
                    'donation' => $item->donation ? [
                        'id' => $item->donation->id,
                        'user_id' => $item->donation->user_id,
                        'nama' => $item->donation->nama,
                        'image' => $item->donation->image,
                        'kategori' => $item->donation->kategori,
                        'jumlah' => $item->donation->jumlah,
                        'lokasi' => $item->donation->lokasi,
                    ] : null,
                ];
            });

            return response()->json([
                'success' => true,
                'message' => 'Data permintaan berhasil diambil',
                'data' => $formattedData
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error fetching Permintaan Saya (Index): ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get permintaan saya by ID
     * GET /api/permintaan-sayas/{id}
     */
    public function show($id): JsonResponse
    {
        try {
            $user = Auth::user() ?? auth()->guard('sanctum')->user();

            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Tidak terautentikasi'
                ], 401);
            }

            $query = PermintaanSaya::with('donation')->where('id', $id);

            // Jika user adalah penerima, harus miliknya sendiri
            if ($user->role === 'penerima') {
                $query->where('user_id', $user->id);
            }
            // Jika donatur, bisa lihat semua (atau logic lain sesuai kebutuhan bisnis)
            // Untuk saat ini donatur bisa lihat detail permintaan apapun untuk dipenuhi

            $permintaan = $query->firstOrFail();

            return response()->json([
                'success' => true,
                'message' => 'Data permintaan berhasil diambil',
                'data' => $permintaan
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Data tidak ditemukan'
            ], 404);
        }
    }

    /**
     * Create permintaan saya (Menyimpan gambar Base64)
     * POST /api/permintaan-sayas
     */
    public function store(Request $request): JsonResponse
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
                    'message' => 'Hanya penerima yang dapat membuat permintaan'
                ], 403);
            }

            $validated = $request->validate([
                'judul' => 'required|string|max:255',
                'deskripsi' => 'nullable|string', // Changed to nullable - optional field
                'kategori' => 'required|string|max:255',
                'target_jumlah' => 'required|integer|min:1',
                'lokasi' => 'required|string|max:255',
                'image' => 'nullable|string', // Gambar dikirim sebagai string Base64
                'batas_waktu' => 'nullable|date',
                'bukti_kebutuhan' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048', // File upload untuk bukti
                'donation_id' => 'nullable|integer|exists:donations,id', // Link ke donasi
            ]);

            $imagePath = null;

            // START: Logic Penyimpanan Gambar Base64 (FIX NULL IMAGE)
            if (isset($validated['image']) && $validated['image']) {
                try {
                    $base64Image = $validated['image'];

                    // Pisahkan header Base64 dari data
                    @list($type, $imageData) = explode(';', $base64Image);
                    @list(, $imageData) = explode(',', $imageData);

                    $imageData = base64_decode($imageData);

                    // Deteksi ekstensi (asumsi PNG jika tidak ada header)
                    $extension = (isset($type) && strpos($type, 'image/')) ? explode('/', $type)[1] : 'png';

                    $filename = 'req_' . time() . '_' . Str::random(10) . '.' . $extension;

                    // Simpan file ke storage (buat folder 'permintaan' di public disk)
                    Storage::disk('public')->put('permintaan/' . $filename, $imageData);

                    // Simpan path yang dapat diakses publik (relative path)
                    $imagePath = 'storage/permintaan/' . $filename;

                } catch (\Exception $e) {
                    Log::error('Gagal menyimpan gambar Base64 di PermintaanSayaController: ' . $e->getMessage());
                    $imagePath = null;
                }
            }
            // END: Logic Penyimpanan Gambar Base64

            // DEBUG LOG
            Log::info('Creating PermintaanSaya', [
                'user_id' => $user->id,
                'donation_id' => $validated['donation_id'] ?? null,
                'judul' => $validated['judul'],
            ]);

            // If no image path provided, try to get from donation relationship
            if (!$imagePath && !empty($validated['donation_id'])) {
                $donation = \App\Models\Donation::find($validated['donation_id']);
                if ($donation && $donation->image) {
                    $imagePath = $donation->image;
                }
            }

            // Validasi donation memiliki stok yang cukup
            if (!empty($validated['donation_id'])) {
                $donation = \App\Models\Donation::find($validated['donation_id']);
                if (!$donation) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Donasi tidak ditemukan'
                    ], 404);
                }
                if ($donation->jumlah <= 0) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Donasi telah habis, tidak bisa dimintai lagi'
                    ], 400);
                }
                if ($donation->jumlah < $validated['target_jumlah']) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Stok donasi tidak cukup. Stok tersedia: ' . $donation->jumlah . ', diminta: ' . $validated['target_jumlah']
                    ], 400);
                }
            }

            // Handle bukti_kebutuhan file upload
            $buktiPath = null;
            if ($request->hasFile('bukti_kebutuhan')) {
                try {
                    $file = $request->file('bukti_kebutuhan');
                    $filename = 'bukti_' . time() . '_' . Str::random(10) . '.' . $file->getClientOriginalExtension();
                    $path = $file->storeAs('bukti_kebutuhan', $filename, 'public');
                    $buktiPath = 'storage/' . $path;
                    Log::info('Bukti kebutuhan uploaded', ['path' => $buktiPath]);
                } catch (\Exception $e) {
                    Log::error('Gagal upload bukti kebutuhan: ' . $e->getMessage());
                    $buktiPath = null;
                }
            }

            $donationId = isset($validated['donation_id']) ? (int) $validated['donation_id'] : null;

            $permintaan = PermintaanSaya::create([
                'user_id' => $user->id,
                'donation_id' => $donationId, // Link ke donasi (cascade delete akan work)
                'judul' => $validated['judul'],
                'deskripsi' => $validated['deskripsi'],
                'kategori' => $validated['kategori'],
                'target_jumlah' => $validated['target_jumlah'],
                'jumlah_terkumpul' => 0,
                'lokasi' => $validated['lokasi'],
                'image' => $imagePath, // <-- Simpan path yang dihasilkan (dari donasi jika ada)
                'status' => 'aktif',
                'batas_waktu' => $validated['batas_waktu'] ?? null,
                'bukti_kebutuhan' => $buktiPath, // <-- Simpan path file bukti yang diupload
            ]);

            // Notify Donatur that someone applied for their donation
            if ($permintaan->donation_id) {
                $donation = \App\Models\Donation::find($permintaan->donation_id);
                if ($donation && $donation->user_id !== $user->id) {
                    Notification::create([
                        'user_id' => $donation->user_id,
                        'title' => 'Permintaan Masuk',
                        'message' => $user->name . ' mengajukan permintaan untuk donasi: ' . $donation->nama,
                        'type' => 'application_received',
                        'link' => '/dashboard-donatur'
                    ]);
                }
            }

            Log::info('PermintaanSaya created successfully', [
                'permintaan_id' => $permintaan->id,
                'donation_id' => $permintaan->donation_id,
                'target_jumlah' => $permintaan->target_jumlah,
                'user_id' => $user->id
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Permintaan berhasil dibuat',
                'data' => $permintaan
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validasi gagal',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Error creating PermintaanSaya: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update permintaan saya
     * PUT/PATCH /api/permintaan-sayas/{id}
     * - Penerima dapat update field data sendiri (judul, deskripsi, etc)
     * - Donatur dapat update status saja (approve/reject)
     */
    public function update(Request $request, $id): JsonResponse
    {
        try {
            $user = Auth::user() ?? auth()->guard('sanctum')->user();

            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Tidak terautentikasi'
                ], 401);
            }

            // First, get permintaan by ID without user_id filter
            $permintaan = PermintaanSaya::findOrFail($id);

            // Check authorization based on role
            if ($user->role === 'penerima') {
                // Penerima hanya bisa update permintaan miliknya sendiri
                if ($permintaan->user_id !== $user->id) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Anda tidak berhak mengubah permintaan ini'
                    ], 403);
                }
            } else if ($user->role !== 'donatur') {
                // Donatur dapat update status permintaan aktif
                // (Only donatur can update status, others blocked)
                return response()->json([
                    'success' => false,
                    'message' => 'Role tidak berhak melakukan aksi ini'
                ], 403);
            }

            // Different validation rules for donatur vs penerima
            if ($user->role === 'donatur') {
                // Donatur hanya bisa update status
                $validated = $request->validate([
                    'status' => 'required|in:aktif,terpenuhi,dibatalkan',
                ]);
            } else {
                // Penerima bisa update berbagai field
                $validated = $request->validate([
                    'judul' => 'sometimes|string|max:255',
                    'deskripsi' => 'sometimes|string',
                    'kategori' => 'sometimes|string|max:255',
                    'target_jumlah' => 'sometimes|integer|min:1',
                    'lokasi' => 'sometimes|string|max:255',
                    'image' => 'nullable|string',
                    'status' => 'sometimes|in:aktif,terpenuhi,dibatalkan',
                    'batas_waktu' => 'nullable|date',
                    'bukti_kebutuhan' => 'nullable|string',
                ]);
            }

            // Logic update image jika ada
            if (isset($validated['image']) && $validated['image']) {
                // Hapus gambar lama jika ada
                if ($permintaan->image) {
                    Storage::disk('public')->delete(str_replace('storage/', '', $permintaan->image));
                }

                // Logic penyimpanan Base64 baru
                $imagePath = null;
                try {
                    $base64Image = $validated['image'];
                    @list($type, $imageData) = explode(';', $base64Image);
                    @list(, $imageData) = explode(',', $imageData);
                    $imageData = base64_decode($imageData);
                    $extension = (isset($type) && strpos($type, 'image/')) ? explode('/', $type)[1] : 'png';
                    $filename = 'req_' . time() . '_' . Str::random(10) . '.' . $extension;
                    Storage::disk('public')->put('permintaan/' . $filename, $imageData);
                    $imagePath = 'storage/permintaan/' . $filename;
                    $validated['image'] = $imagePath; // Timpa field image dengan path baru
                } catch (\Exception $e) {
                    Log::error('Gagal update gambar Base64: ' . $e->getMessage());
                    unset($validated['image']); // Jangan update field image jika gagal
                }
            } else {
                // Jika image dikirim null, hapus path lama
                if (array_key_exists('image', $validated) && is_null($validated['image']) && $permintaan->image) {
                    Storage::disk('public')->delete(str_replace('storage/', '', $permintaan->image));
                }
            }

            $permintaan->update($validated);

            return response()->json([
                'success' => true,
                'message' => 'Permintaan berhasil diperbarui',
                'data' => $permintaan
            ], 200);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validasi gagal',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Error updating PermintaanSaya: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete permintaan saya
     * DELETE /api/permintaan-sayas/{id}
     */
    public function destroy($id): JsonResponse
    {
        try {
            $user = Auth::user() ?? auth()->guard('sanctum')->user();

            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Tidak terautentikasi'
                ], 401);
            }

            $permintaan = PermintaanSaya::where('id', $id)
                ->where('user_id', $user->id)
                ->firstOrFail();

            // Hapus file gambar dari storage sebelum menghapus record
            if ($permintaan->image) {
                Storage::disk('public')->delete(str_replace('storage/', '', $permintaan->image));
            }

            $permintaan->delete();

            return response()->json([
                'success' => true,
                'message' => 'Permintaan berhasil dihapus'
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error deleting PermintaanSaya: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Donatur approve permintaan
     * PATCH /api/permintaan-sayas/{id}/approve
     */
    public function approve($id): JsonResponse
    {
        try {
            $user = Auth::user() ?? auth()->guard('sanctum')->user();

            if (!$user) {
                return response()->json(['success' => false, 'message' => 'Tidak terautentikasi'], 401);
            }

            if ($user->role !== 'donatur') {
                return response()->json(['success' => false, 'message' => 'Hanya donatur yang dapat approve'], 403);
            }

            $permintaan = PermintaanSaya::findOrFail($id);

            // Validasi donatur adalah pemilik donation
            if ($permintaan->donation_id && $permintaan->donation->user_id !== $user->id) {
                return response()->json(['success' => false, 'message' => 'Anda bukan pemilik donasi ini'], 403);
            }

            // Cek status permohonan saat ini
            if ($permintaan->status_permohonan !== 'pending') {
                return response()->json(['success' => false, 'message' => 'Status permohonan sudah diproses'], 400);
            }

            // Validasi donation masih punya stok
            if ($permintaan->donation_id) {
                $donation = $permintaan->donation;
                $requestedQty = $permintaan->target_jumlah;

                if ($donation->jumlah < $requestedQty) {
                    return response()->json(['success' => false, 'message' => 'Stok donasi tidak cukup. Stok tersisa: ' . $donation->jumlah], 400);
                }
            }

            $permintaan->update([
                'status_permohonan' => 'approved',
                'approved_at' => now(),
                'status_pengiriman' => 'draft' // Siap disiapkan untuk dikirim
            ]);

            // Notify Penerima that their request was approved
            Notification::create([
                'user_id' => $permintaan->user_id,
                'title' => 'Permintaan Disetujui',
                'message' => 'Permintaan Anda untuk "' . $permintaan->judul . '" telah disetujui oleh donatur.',
                'type' => 'request_approved',
                'link' => '/dashboard-penerima'
            ]);

            Log::info('Permintaan approved by donatur', ['permintaan_id' => $id, 'user_id' => $user->id]);

            return response()->json([
                'success' => true,
                'message' => 'Permintaan disetujui',
                'data' => $permintaan
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error approving permintaan: ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'Terjadi kesalahan: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Donatur reject permintaan
     * PATCH /api/permintaan-sayas/{id}/reject
     */
    public function reject($id, Request $request): JsonResponse
    {
        try {
            $user = Auth::user() ?? auth()->guard('sanctum')->user();

            if (!$user) {
                return response()->json(['success' => false, 'message' => 'Tidak terautentikasi'], 401);
            }

            if ($user->role !== 'donatur') {
                return response()->json(['success' => false, 'message' => 'Hanya donatur yang dapat reject'], 403);
            }

            $permintaan = PermintaanSaya::findOrFail($id);

            // Validasi donatur adalah pemilik donation
            if ($permintaan->donation_id && $permintaan->donation->user_id !== $user->id) {
                return response()->json(['success' => false, 'message' => 'Anda bukan pemilik donasi ini'], 403);
            }

            // Cek status permohonan saat ini
            if ($permintaan->status_permohonan !== 'pending') {
                return response()->json(['success' => false, 'message' => 'Status permohonan sudah diproses'], 400);
            }

            $reason = $request->input('reason', 'Tidak ada alasan diberikan');

            $permintaan->update([
                'status_permohonan' => 'rejected',
                'bukti_kebutuhan' => 'Ditolak - ' . $reason // Simpan alasan reject
            ]);

            // Notify Penerima that their request was rejected
            Notification::create([
                'user_id' => $permintaan->user_id,
                'title' => 'Permintaan Ditolak',
                'message' => 'Maaf, permintaan Anda untuk "' . $permintaan->judul . '" belum dapat disetujui.',
                'type' => 'request_rejected',
                'link' => '/dashboard-penerima'
            ]);

            Log::info('Permintaan rejected by donatur', ['permintaan_id' => $id, 'user_id' => $user->id, 'reason' => $reason]);

            return response()->json([
                'success' => true,
                'message' => 'Permintaan ditolak',
                'data' => $permintaan
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error rejecting permintaan: ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'Terjadi kesalahan: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Donatur mark as sent (pengiriman dimulai)
     * PATCH /api/permintaan-sayas/{id}/sent
     */
    public function markSent($id): JsonResponse
    {
        try {
            $user = Auth::user() ?? auth()->guard('sanctum')->user();

            if (!$user) {
                return response()->json(['success' => false, 'message' => 'Tidak terautentikasi'], 401);
            }

            if ($user->role !== 'donatur') {
                return response()->json(['success' => false, 'message' => 'Hanya donatur yang dapat mark sent'], 403);
            }

            $permintaan = PermintaanSaya::findOrFail($id);

            if ($permintaan->donation_id && $permintaan->donation->user_id !== $user->id) {
                return response()->json(['success' => false, 'message' => 'Anda bukan pemilik donasi ini'], 403);
            }

            if ($permintaan->status_permohonan !== 'approved') {
                return response()->json(['success' => false, 'message' => 'Hanya permintaan yang diapprove yang dapat dikirim'], 400);
            }

            $permintaan->update([
                'status_pengiriman' => 'sent',
                'sent_at' => now()
            ]);

            // Notify Penerima that the item is sent
            Notification::create([
                'user_id' => $permintaan->user_id,
                'title' => 'Barang Dikirim',
                'message' => 'Donatur telah mengirimkan barang untuk permintaan: ' . $permintaan->judul,
                'type' => 'request_sent',
                'link' => '/dashboard-penerima'
            ]);

            Log::info('Permintaan marked as sent', ['permintaan_id' => $id, 'user_id' => $user->id]);

            return response()->json([
                'success' => true,
                'message' => 'Permintaan sudah dikirim',
                'data' => $permintaan
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error marking sent: ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'Terjadi kesalahan: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Penerima confirm terima
     * PATCH /api/permintaan-sayas/{id}/received
     */
    public function markReceived($id): JsonResponse
    {
        try {
            $user = Auth::user() ?? auth()->guard('sanctum')->user();

            if (!$user) {
                return response()->json(['success' => false, 'message' => 'Tidak terautentikasi'], 401);
            }

            $permintaan = PermintaanSaya::findOrFail($id);

            // Penerima hanya bisa confirm terima permintaan miliknya
            if ($permintaan->user_id !== $user->id) {
                return response()->json(['success' => false, 'message' => 'Anda bukan pemilik permintaan ini'], 403);
            }

            if ($permintaan->status_pengiriman !== 'sent') {
                return response()->json(['success' => false, 'message' => 'Permintaan belum dikirim'], 400);
            }

            $permintaan->update([
                'status_pengiriman' => 'received',
                'received_at' => now(),
                'status' => 'terpenuhi' // Mark overall status as fulfilled
            ]);

            // Kurangi jumlah donasi sesuai dengan jumlah yang diminta
            if ($permintaan->donation_id && $permintaan->target_jumlah > 0) {
                // Gunakan query langsung untuk memastikan data terbaru
                $donation = \App\Models\Donation::findOrFail($permintaan->donation_id);
                $previousQty = $donation->jumlah;
                $newQuantity = max(0, $previousQty - $permintaan->target_jumlah);

                Log::info('Decreasing donation stock', [
                    'donation_id' => $donation->id,
                    'previous_qty' => $previousQty,
                    'target_jumlah' => $permintaan->target_jumlah,
                    'will_be' => $newQuantity
                ]);

                $donation->update(['jumlah' => $newQuantity]);
                $donation->refresh(); // Refresh to get updated data

                Log::info('Donation quantity decreased', [
                    'donation_id' => $donation->id,
                    'previous_qty' => $previousQty,
                    'requested_qty' => $permintaan->target_jumlah,
                    'new_qty' => $donation->jumlah
                ]);
            }

            // Refresh permintaan with updated donation data
            $permintaan->load('donation');

            Log::info('Permintaan confirmed received', ['permintaan_id' => $id, 'user_id' => $user->id]);

            return response()->json([
                'success' => true,
                'message' => 'Terima kasih! Permintaan telah dikonfirmasi diterima',
                'data' => $permintaan->load('donation')
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error marking received: ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'Terjadi kesalahan: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Donatur memenuhi permintaan (Fulfill Request)
     * POST /api/permintaan-sayas/{id}/fulfill
     * - Membuat Donasi baru
     * - Link Donasi ke Permintaan ini
     * - Auto-approve permintaan
     */
    public function fulfill(Request $request, $id): JsonResponse
    {
        try {
            $user = Auth::user() ?? auth()->guard('sanctum')->user();

            if (!$user) {
                return response()->json(['success' => false, 'message' => 'Tidak terautentikasi'], 401);
            }

            if ($user->role !== 'donatur') {
                return response()->json(['success' => false, 'message' => 'Hanya donatur yang dapat memenuhi permintaan'], 403);
            }

            $permintaan = PermintaanSaya::findOrFail($id);

            if ($permintaan->donation_id) {
                return response()->json(['success' => false, 'message' => 'Permintaan ini sudah dipenuhi oleh orang lain'], 400);
            }

            // Validasi input donasi (mirip dengan DonationController store)
            $validated = $request->validate([
                'nama' => 'required|string|max:255',
                'kategori' => 'required|string|max:255',
                'jumlah' => 'required|integer|min:1',
                'deskripsi' => 'required|string',
                'lokasi' => 'required|string',
                'image' => 'required|string', // Base64 image required for donation proof
            ]);

            DB::beginTransaction();

            // 1. Buat Donation Baru
            $donation = \App\Models\Donation::create([
                'user_id' => $user->id,
                'nama' => $validated['nama'],
                'kategori' => $validated['kategori'],
                'jumlah' => $validated['jumlah'],
                'deskripsi' => $validated['deskripsi'],
                'lokasi' => $validated['lokasi'],
                'image' => $validated['image'], // Simpan base64 langsung sesuai implementasi DonationController
                'status' => 'aktif',
            ]);

            // 2. Update PermintaanSaya
            $permintaan->update([
                'donation_id' => $donation->id,
                'status_permohonan' => 'approved', // Auto-approve karena donatur yang berinisiatif
                'approved_at' => now(),
                'status_pengiriman' => 'draft', // Siap dikirim
            ]);

            // Notify Penerima that their request was fulfilled by a donor
            Notification::create([
                'user_id' => $permintaan->user_id,
                'title' => 'Permintaan Dipenuhi',
                'message' => 'Donatur ' . $user->name . ' bersedia memenuhi permintaan Anda: ' . $permintaan->judul,
                'type' => 'request_fulfilled',
                'link' => '/dashboard-penerima'
            ]);

            DB::commit();

            Log::info('Permintaan fulfilled by donatur', [
                'permintaan_id' => $permintaan->id,
                'donation_id' => $donation->id,
                'user_id' => $user->id
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Terima kasih! Permintaan berhasil dipenuhi. Silakan proses pengiriman.',
                'data' => $permintaan->load('donation')
            ], 200);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error fulfilling permintaan: ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'Terjadi kesalahan: ' . $e->getMessage()], 500);
        }
    }
}