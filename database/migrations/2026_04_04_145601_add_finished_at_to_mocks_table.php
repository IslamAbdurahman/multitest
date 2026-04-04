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
        Schema::table('mocks', function (Blueprint $table) {
            $table->dateTime('finished_at')->nullable()->after('starts_at');
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('mocks', function (Blueprint $table) {
            $table->dropColumn('finished_at');
        });

    }
};
