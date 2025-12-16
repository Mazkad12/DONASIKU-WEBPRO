<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('permintaan_sayas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('judul');
            $table->text('deskripsi');
            $table->string('kategori');
            $table->integer('target_jumlah');
            $table->integer('jumlah_terkumpul')->default(0);
            $table->string('lokasi');
            $table->longText('image')->nullable();
            $table->enum('status', ['aktif', 'terpenuhi', 'dibatalkan'])->default('aktif');
            $table->date('batas_waktu')->nullable();
            $table->text('bukti_kebutuhan')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('permintaan_sayas');
    }
};
