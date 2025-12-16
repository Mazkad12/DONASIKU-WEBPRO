<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Donation extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'nama',
        'kategori',
        'jumlah',
        'deskripsi',
        'lokasi',
        'image',
        'status',
    ];

    protected $casts = [
        'jumlah' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function detailDonasis(): HasMany
    {
        return $this->hasMany(DetailDonasi::class);
    }

    public function permintaanSayas(): HasMany
    {
        return $this->hasMany(PermintaanSaya::class);
    }
}