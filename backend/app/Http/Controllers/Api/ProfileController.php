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
            'email' => 'sometimes|email|max:255|unique:users,email,' . $user->id,
            'phone' => 'nullable|string|max:15',
            // Validasi 'photo' atau 'avatar' sebagai file upload
            'photo' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120', // Max 5MB
            'avatar' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120', // Max 5MB
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // 2. Pemrosesan Data Update
        $data = $request->only(['name', 'phone']);
        
        // Jika email disertakan, tambahkan ke data
        if ($request->has('email')) {
            $data['email'] = $request->input('email');
        }

        // Penanganan Photo/Avatar (Standar File Upload)
        // Frontend mengirim 'photo', tapi model menyimpan sebagai 'photo'
        if ($request->hasFile('photo')) {
            // Jika dikirim sebagai file (Multipart)
            if ($user->photo) {
                // Hapus foto lama
                Storage::disk('public')->delete($user->photo); 
            }
            // Simpan file baru
            $path = $request->file('photo')->store('avatars', 'public');
            $data['photo'] = $path;

        } elseif ($request->hasFile('avatar')) {
            // Fallback untuk 'avatar' jika frontend mengirim dengan nama 'avatar'
            if ($user->photo) {
                Storage::disk('public')->delete($user->photo); 
            }
            $path = $request->file('avatar')->store('avatars', 'public');
            $data['photo'] = $path;

        } elseif ($request->input('photo') === '') {
            // Jika frontend mengirim string kosong (tanda ingin menghapus)
            if ($user->photo) {
                Storage::disk('public')->delete($user->photo);
            }
            $data['photo'] = null;
        }
        
        // 3. Update Database
        $user->update($data);

        // 4. Kirim Respons dengan data baru
        return response()->json([
            'message' => 'Profil berhasil diperbarui.',
            'data' => [
                'user' => $user->fresh()
            ]
        ], 200);
    }
}