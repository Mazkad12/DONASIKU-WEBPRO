<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PermintaanSaya extends Model
{
    protected $table = 'permintaan_sayas';

    protected $fillable = [
        'user_id',
        'donation_id',
        'judul',
        'deskripsi',
        'kategori',
        'target_jumlah',
        'jumlah_terkumpul',
        'lokasi',
        'image',
        'status',
        'status_permohonan',
        'status_pengiriman',
        'batas_waktu',
        'bukti_kebutuhan',
        'approved_at',
        'sent_at',
        'received_at',
    ];

    protected $casts = [
        'batas_waktu' => 'date',
        'approved_at' => 'datetime',
        'sent_at' => 'datetime',
        'received_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function donation(): BelongsTo
    {
        return $this->belongsTo(Donation::class);
    }

    public function detailDonasis(): HasMany
    {
        return $this->hasMany(DetailDonasi::class, 'donation_id');
    }
}
