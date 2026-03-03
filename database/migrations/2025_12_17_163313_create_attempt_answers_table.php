<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('attempt_answers', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('attempt_part_id');
            $table->unsignedBigInteger('question_id');

            $table->dateTime('started_at');
            $table->dateTime('finished_at')->nullable();
            $table->string('audio_path')->nullable();
            $table->double('audio_second')->nullable();

            $table->mediumText('transcript')->nullable();
            $table->mediumText('review_ai')->nullable();
            $table->mediumText('review')->nullable();

            $table->integer('score_ai')->nullable();
            $table->integer('score')->nullable();

            $table->timestamps();

            $table->foreign('attempt_part_id')
                ->references('id')
                ->on('attempt_parts')
                ->onDelete('restrict');

            $table->foreign('question_id')
                ->references('id')
                ->on('questions')
                ->onDelete('restrict');

            // Bitta attempt ichida bitta question
            $table->unique(['attempt_part_id', 'question_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('attempt_answers');
    }
};
