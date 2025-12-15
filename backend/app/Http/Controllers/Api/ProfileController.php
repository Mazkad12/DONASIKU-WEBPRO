<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use App\Models\User; 

class ProfileController extends Controller
{
    /**
     * Mengambil data profil pengguna yang sedang login.
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(Request $request)
    {
        $user = Auth::user();

        return response()->json([
            'user' => $user
        ], 200);
    }

    /**
     * Memperbarui informasi profil pengguna yang sedang login.
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request)
    {
        $user = Auth::user();

        // 1. Validasi Data
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email,' . $user->id,
            'phone' => 'nullable|string|max:15',
            // Validasi 'avatar' sebagai file upload
            'avatar' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048', // Max 2MB
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // 2. Pemrosesan Data Update
        $data = $request->only('name', 'email', 'phone');

        // Penanganan Avatar (Standar File Upload)
        if ($request->hasFile('avatar')) {
            // Jika dikirim sebagai file (Multipart)
            if ($user->avatar) {
                // Hapus avatar lama (pastikan path yang tersimpan di DB benar)
                Storage::disk('public')->delete($user->avatar); 
            }
            // Simpan file baru
            $path = $request->file('avatar')->store('avatars', 'public');
            $data['avatar'] = $path;

        } elseif ($request->input('avatar') === '') {
             // Jika frontend mengirim string kosong (tanda ingin menghapus)
             if ($user->avatar) {
                 Storage::disk('public')->delete($user->avatar);
             }
             $data['avatar'] = null;
        } 
        
        // 3. Update Database
        $user->update($data);

        // 4. Kirim Respons dengan data baru
        return response()->json([
            'message' => 'Profil berhasil diperbarui.',
            'user' => $user->fresh(), 
        ], 200);
    }
}