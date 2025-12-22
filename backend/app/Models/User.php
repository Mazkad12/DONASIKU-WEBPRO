<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasApiTokens;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'phone',
        'photo',
        'avatar',
        'is_verified',
        'verification_document',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_verified' => 'boolean',
        ];
    }

    /**
     * Get the user's photo URL
     */
    public function getPhotoUrlAttribute()
    {
        if (!$this->photo) {
            return null;
        }
        
        // Jika sudah full URL, return as is
        if (strpos($this->photo, 'http') === 0) {
            return $this->photo;
        }
        
        // Return full URL dengan storage path
        return url('storage/' . $this->photo);
    }

    public function donations()
    {
        return $this->hasMany(Donation::class);
    }
}