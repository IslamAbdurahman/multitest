<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (DB::connection()->getDriverName() === 'sqlite') {
            return;
        }

        DB::unprepared("
            DROP FUNCTION IF EXISTS aiScoreAvg;
            CREATE FUNCTION aiScoreAvg(attemptId INT, attemptPartId INT)
            RETURNS DECIMAL(5,2)
            DETERMINISTIC
            BEGIN
                DECLARE avgScore DECIMAL(5,2);

                IF attemptId IS NOT NULL THEN
                    SELECT AVG(score_ai) INTO avgScore
                    FROM attempt_answers aa
                    JOIN attempt_parts ap ON aa.attempt_part_id = ap.id
                    WHERE ap.attempt_id = attemptId AND aa.score_ai IS NOT NULL;
                ELSEIF attemptPartId IS NOT NULL THEN
                    SELECT AVG(score_ai) INTO avgScore
                    FROM attempt_answers
                    WHERE attempt_part_id = attemptPartId AND score_ai IS NOT NULL;
                ELSE
                    RETURN NULL;
                END IF;

                RETURN avgScore;
            END
        ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (DB::connection()->getDriverName() === 'sqlite') {
            return;
        }
        DB::unprepared("DROP FUNCTION IF EXISTS aiScoreAvg;");
    }
};
