<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('permintaan_sayas', function (Blueprint $table) {
            // Tambah kolom donation_id dengan foreign key dan cascade delete
            $table->foreignId('donation_id')
                  ->nullable()
                  ->constrained('donations')
                  ->onDelete('cascade')
                  ->after('user_id');
        });
    }

    public function down(): void
    {
        Schema::table('permintaan_sayas', function (Blueprint $table) {
            $table->dropConstrainedForeignId('donation_id');
        });
    }
};
