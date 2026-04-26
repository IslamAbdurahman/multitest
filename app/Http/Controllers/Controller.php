<?php

namespace App\Http\Controllers;


/**
 * @OA\Info(
 *   title="MultiTest API",
 *   version="1.0.0",
 *   description="Description of your API"
 * ),
 *
 * @OA\SecurityScheme(
 *          securityScheme="bearerAuth",
 *          type="http",
 *          scheme="bearer",
 *          bearerFormat="JWT"
 *     ),
 *
 */
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;

abstract class Controller
{
    use AuthorizesRequests, ValidatesRequests;
}
