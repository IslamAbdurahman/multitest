<?php

use App\Models\User\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('home page can be rendered', function () {
    $response = $this->get('/');
    $response->assertStatus(200);
});

test('dashboard page requires authentication', function () {
    $response = $this->get('/dashboard');
    $response->assertRedirect('/login');
});

test('dashboard page can be rendered for authenticated user', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get('/dashboard');
    
    $response->assertStatus(200);
});
