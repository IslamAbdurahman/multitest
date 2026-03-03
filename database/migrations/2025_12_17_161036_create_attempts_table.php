<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('attempts', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('mock_id')->nullable();
            $table->unsignedBigInteger('test_id');

            $table->dateTime('started_at');
            $table->dateTime('finished_at')->nullable();
            $table->dateTime('evaluated_at')->nullable();
            $table->integer('score')->nullable();
            $table->text('review')->nullable();

            $table->timestamps();

            $table->foreign('user_id')
                ->references('id')
                ->on('users')
                ->onDelete('restrict');

            $table->foreign('mock_id')
                ->references('id')
                ->on('mocks')
                ->onDelete('restrict');

            $table->foreign('test_id')
                ->references('id')
                ->on('tests')
                ->onDelete('restrict');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('attempts');
    }
};
