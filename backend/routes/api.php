<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DonationController;
use App\Http\Controllers\DetailDonasiController;
use App\Http\Controllers\PermintaanSayaController;
use App\Http\Controllers\Api\ProfileController;

Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);

Route::get('donations', [DonationController::class, 'index']);
Route::get('donations/{id}', [DonationController::class, 'show']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('logout', [AuthController::class, 'logout']);
    Route::get('me', [AuthController::class, 'me']);
    
    // Routes untuk Donasi
    Route::post('donations', [DonationController::class, 'store']);
    Route::put('donations/{id}', [DonationController::class, 'update']);
    Route::delete('donations/{id}', [DonationController::class, 'destroy']);
    Route::get('my-donations', [DonationController::class, 'myDonations']);
    Route::patch('donations/{id}/status', [DonationController::class, 'updateStatus']);
    
    // Routes untuk Detail Donasi (Penerima menerima donasi)
    Route::get('detail-donasis', [DetailDonasiController::class, 'index']);
    Route::get('detail-donasis/{id}', [DetailDonasiController::class, 'show']);
    Route::post('detail-donasis', [DetailDonasiController::class, 'store']);
    Route::patch('detail-donasis/{id}/status', [DetailDonasiController::class, 'updateStatus']);
    Route::delete('detail-donasis/{id}', [DetailDonasiController::class, 'destroy']);
    
    // Routes untuk Permintaan Saya (Penerima membuat permintaan donasi)
    Route::get('permintaan-sayas', [PermintaanSayaController::class, 'index']);
    Route::get('permintaan-sayas/{id}', [PermintaanSayaController::class, 'show']);
    Route::post('permintaan-sayas', [PermintaanSayaController::class, 'store']);
    Route::put('permintaan-sayas/{id}', [PermintaanSayaController::class, 'update']);
    Route::delete('permintaan-sayas/{id}', [PermintaanSayaController::class, 'destroy']);
    

    // Profile routes
Route::middleware('auth:sanctum')->group(function () {
    // Route untuk mengambil profil (GET)
    Route::get('/profile', [ProfileController::class, 'show']);
    // Route untuk memperbarui profil (PUT/PATCH)
    // Sesuai dengan frontend Anda yang akan mengirim data update
    Route::post('/profile/update', [ProfileController::class, 'update']); 
    // Saya sarankan menggunakan POST untuk form-data/file upload, atau PATCH/PUT jika tanpa file
});

    // Workflow endpoints
    Route::patch('permintaan-sayas/{id}/approve', [PermintaanSayaController::class, 'approve']); // Donatur
    Route::patch('permintaan-sayas/{id}/reject', [PermintaanSayaController::class, 'reject']); // Donatur
    Route::patch('permintaan-sayas/{id}/sent', [PermintaanSayaController::class, 'markSent']); // Donatur
    Route::patch('permintaan-sayas/{id}/received', [PermintaanSayaController::class, 'markReceived']); // Penerima
});