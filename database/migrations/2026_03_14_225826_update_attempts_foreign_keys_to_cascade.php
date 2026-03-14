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
        Schema::table('attempt_parts', function (Blueprint $table) {
            $table->dropForeign(['attempt_id']);
            $table->foreign('attempt_id')
                ->references('id')
                ->on('attempts')
                ->onDelete('cascade');
        });

        Schema::table('attempt_answers', function (Blueprint $table) {
            // Check if foreign key exists before dropping it to avoid errors if it was already handled or named differently
            // But based on our research, it should be there.
            $table->dropForeign(['attempt_part_id']);
            $table->foreign('attempt_part_id')
                ->references('id')
                ->on('attempt_parts')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('attempt_parts', function (Blueprint $table) {
            $table->dropForeign(['attempt_id']);
            $table->foreign('attempt_id')
                ->references('id')
                ->on('attempts')
                ->onDelete('restrict');
        });

        Schema::table('attempt_answers', function (Blueprint $table) {
            $table->dropForeign(['attempt_part_id']);
            $table->foreign('attempt_part_id')
                ->references('id')
                ->on('attempt_parts')
                ->onDelete('restrict');
        });
    }
};
