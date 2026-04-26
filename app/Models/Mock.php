<?php

namespace App\Models;

use App\Models\User\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\SoftDeletes;

class Mock extends Model
{
    /** @use HasFactory<\Database\Factories\MockFactory> */
    use HasFactory, SoftDeletes;



    protected $fillable = [
        'user_id',
        'name',
        'description',
        'audio_path',
        'starts_at',
        'finished_at',
        'slug',
        'active',
        'open'
    ];

    protected $casts = [
        'starts_at' => 'datetime',
        'finished_at' => 'datetime',
    ];


    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
    public function mock_tests(){
        return $this->hasMany(MockTest::class, 'mock_id');
    }

    public function attempts()
    {
        return $this->hasMany(Attempt::class, 'mock_id');
    }
}
