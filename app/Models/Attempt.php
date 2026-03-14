<?php

namespace App\Models;

use App\Models\User\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Attempt extends Model
{
    /** @use HasFactory<\Database\Factories\AttemptFactory> */
    use HasFactory;
    protected static function booted()
    {
        static::deleting(function ($attempt) {
            $attempt->attempt_parts()->each(function ($part) {
                $part->delete();
            });
        });
    }


    protected $fillable = [
        'name',
        'user_id',
        'mock_id',
        'test_id',
        'started_at',
        'finished_at',
        'evaluated_at',
        'score',
        'review'
    ];

    protected $casts = [
        'started_at' => 'datetime',
        'finished_at' => 'datetime',
        'score' => 'integer',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function scopeWithAiScoreAvg($query)
    {
        return $query->addSelect(\Illuminate\Support\Facades\DB::raw("aiScoreAvg(attempts.id, null) as ai_score_avg"));
    }

    public function mock()
    {
        return $this->belongsTo(Mock::class, 'mock_id');
    }

    public function test()
    {
        return $this->belongsTo(Test::class, 'test_id');
    }

    public function attempt_parts()
    {
        return $this->hasMany(AttemptPart::class, 'attempt_id');
    }

}
