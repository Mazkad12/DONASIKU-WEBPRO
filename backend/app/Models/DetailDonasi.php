<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DetailDonasi extends Model
{
    use HasFactory;

    protected $table = 'detail_donasis';

    protected $fillable = [
        'donation_id',
        'user_id',
        'nama_penerima',
        'email_penerima',
        'nomor_hp',
        'alamat',
        'keperluan',
        'jumlah_diterima',
        'status_penerimaan',
        'catatan',
        'tanggal_penerimaan',
    ];
    
    // Relasi ke Donasi
    public function donation(): BelongsTo
    {
        return $this->belongsTo(Donation::class);
    }
    
    // Relasi ke User (Penerima)
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}