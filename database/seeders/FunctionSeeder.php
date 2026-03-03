<?php

namespace Database\Seeders;

use App\Models\Sklad;
use App\Models\User;
use App\Models\UserCat;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class FunctionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        // Replace 'mydb' with your actual database name

        $databaseName = env('DB_DATABASE');

// Get all function names in the database
        $functions = DB::select("SELECT ROUTINE_NAME FROM INFORMATION_SCHEMA.ROUTINES WHERE ROUTINE_TYPE = 'FUNCTION' AND ROUTINE_SCHEMA = ?", [$databaseName]);

// Drop each function
        foreach ($functions as $function) {
            $functionName = $function->ROUTINE_NAME;
            DB::statement("DROP FUNCTION IF EXISTS $functionName");
        }


        DB::select("
create
    definer = " . env('DB_USERNAME') . "@localhost function aiScoreAvg(attempt_id_ int, attempt_part_id_ int) returns double
    deterministic
    reads sql data
BEGIN
    DECLARE ai_score_avg DOUBLE;

    IF attempt_id_ IS NOT NULL THEN
        -- Case 1: Average for the entire attempt
        SELECT AVG(aa.score_ai) INTO ai_score_avg
        FROM attempt_answers aa
                 JOIN attempt_parts ap ON aa.attempt_part_id = ap.id
        WHERE ap.attempt_id = attempt_id_;
    ELSE
        -- Case 2: Average for a specific part only
        SELECT AVG(aa.score_ai) INTO ai_score_avg
        FROM attempt_answers aa
        WHERE aa.attempt_part_id = attempt_part_id_;
    END IF;

    RETURN COALESCE(ai_score_avg, 0);
END;
        ");


    }
}
