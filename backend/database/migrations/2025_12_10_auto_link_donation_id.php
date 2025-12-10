<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\PermintaanSaya;
use App\Models\Donation;

return new class extends Migration
{
    public function up(): void
    {
        // Update existing permintaan_sayas yang punya judul sesuai dengan donation
        // Ini adalah data recovery untuk permintaan yang dibuat sebelum fitur donation_id ditambahkan
        
        $permintaans = PermintaanSaya::all();
        $linked = 0;
        
        foreach ($permintaans as $permintaan) {
            // Skip jika sudah punya donation_id
            if ($permintaan->donation_id) {
                continue;
            }
            
            // Strategy 1: Cari berdasarkan nama + kategori + lokasi (paling spesifik)
            $donation = Donation::where('nama', $permintaan->judul)
                ->where('kategori', $permintaan->kategori)
                ->where('lokasi', $permintaan->lokasi)
                ->first();
            
            // Strategy 2: Jika tidak ketemu, cari berdasarkan nama + kategori saja
            if (!$donation) {
                $donation = Donation::where('nama', $permintaan->judul)
                    ->where('kategori', $permintaan->kategori)
                    ->first();
            }
            
            // Strategy 3: Jika masih tidak ketemu, cari berdasarkan nama saja (last resort)
            if (!$donation) {
                $donation = Donation::where('nama', $permintaan->judul)->first();
            }
            
            if ($donation) {
                $permintaan->update(['donation_id' => $donation->id]);
                $linked++;
            }
        }
    }

    public function down(): void
    {
        // Tidak ada operasi down yang diperlukan
    }
};
