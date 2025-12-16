<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('permintaan_sayas', function (Blueprint $table) {
            // Status permohonan: pending (menunggu review), approved (disetujui), rejected (ditolak)
            $table->enum('status_permohonan', ['pending', 'approved', 'rejected'])->default('pending')->after('status');
            
            // Status pengiriman: draft (belum dikirim), sent (sudah dikirim), received (sudah diterima)
            $table->enum('status_pengiriman', ['draft', 'sent', 'received'])->default('draft')->after('status_permohonan');
            
            // Timestamp untuk tracking
            $table->timestamp('approved_at')->nullable()->after('status_pengiriman');
            $table->timestamp('sent_at')->nullable()->after('approved_at');
            $table->timestamp('received_at')->nullable()->after('sent_at');
        });
    }

    public function down(): void
    {
        Schema::table('permintaan_sayas', function (Blueprint $table) {
            $table->dropColumn(['status_permohonan', 'status_pengiriman', 'approved_at', 'sent_at', 'received_at']);
        });
    }
};
