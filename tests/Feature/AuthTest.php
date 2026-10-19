<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_login_with_valid_credentials(): void
    {
        $user = User::factory()->create([
            'email' => 'admin@probolinggokota.go.id',
            'password' => 'password123',
        ]);

        $response = $this->postJson('/auth/login', [
            'email' => 'admin@probolinggokota.go.id',
            'password' => 'password123',
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('message', 'Login berhasil.')
            ->assertJsonPath('user.email', 'admin@probolinggokota.go.id')
            ->assertJsonPath('user.name', $user->name);

        $this->assertAuthenticatedAs($user);
    }

    public function test_user_cannot_login_with_invalid_credentials(): void
    {
        User::factory()->create([
            'email' => 'admin@probolinggokota.go.id',
            'password' => 'password123',
        ]);

        $response = $this->postJson('/auth/login', [
            'email' => 'admin@probolinggokota.go.id',
            'password' => 'wrongpassword',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email']);

        $this->assertGuest();
    }

    public function test_user_cannot_login_with_missing_or_invalid_fields(): void
    {
        $response = $this->postJson('/auth/login', [
            'email' => 'not-an-email',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email', 'password']);
    }

    public function test_me_returns_null_when_unauthenticated(): void
    {
        $response = $this->getJson('/auth/me');

        $response->assertStatus(200)
            ->assertJson([
                'user' => null,
            ]);
    }

    public function test_me_returns_user_data_when_authenticated(): void
    {
        $user = User::factory()->create([
            'email' => 'admin@probolinggokota.go.id',
        ]);

        $response = $this->actingAs($user)->getJson('/auth/me');

        $response->assertStatus(200)
            ->assertJsonPath('user.id', $user->id)
            ->assertJsonPath('user.email', 'admin@probolinggokota.go.id')
            ->assertJsonPath('user.name', $user->name);
    }

    public function test_user_can_logout(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->postJson('/auth/logout');

        $response->assertStatus(200)
            ->assertJsonPath('message', 'Logout berhasil.');

        $this->assertGuest();
    }
}
