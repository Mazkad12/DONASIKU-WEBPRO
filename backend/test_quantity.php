<?php
require 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\Donation;
use App\Models\PermintaanSaya;

// Get last permintaan
$permintaan = PermintaanSaya::orderBy('id', 'desc')->first();

if ($permintaan) {
    echo "=== CURRENT STATE ===\n";
    echo "Permintaan ID: " . $permintaan->id . "\n";
    echo "Donation ID: " . $permintaan->donation_id . "\n";
    echo "Target Jumlah: " . $permintaan->target_jumlah . "\n";
    echo "Status Pengiriman: " . $permintaan->status_pengiriman . "\n";
    echo "Status Permohonan: " . $permintaan->status_permohonan . "\n";
    
    if ($permintaan->donation_id) {
        $donation = Donation::find($permintaan->donation_id);
        if ($donation) {
            echo "\nDonation ID: " . $donation->id . "\n";
            echo "Donation Nama: " . $donation->nama . "\n";
            echo "Donation Jumlah BEFORE: " . $donation->jumlah . "\n";
            
            if ($permintaan->status_pengiriman == 'sent') {
                echo "\n--- SIMULATING RECEIVED ---\n";
                $newQty = max(0, $donation->jumlah - $permintaan->target_jumlah);
                $donation->update(['jumlah' => $newQty]);
                $donation->refresh();
                echo "Donation Jumlah AFTER: " . $donation->jumlah . "\n";
                echo "Success! Reduced by " . $permintaan->target_jumlah . "\n";
            } else {
                echo "\nStatus pengiriman bukan 'sent', status saat ini: " . $permintaan->status_pengiriman . "\n";
            }
        } else {
            echo "Donation not found!\n";
        }
    } else {
        echo "Permintaan tidak memiliki donation_id!\n";
    }
} else {
    echo "No permintaan found!\n";
}
