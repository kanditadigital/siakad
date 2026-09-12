<?php

use App\Models\User;
use Illuminate\Support\Facades\Hash;

test('a user flagged must_change_password is redirected away from any other page', function () {
    $user = User::factory()->create(['role' => 'dosen', 'must_change_password' => true]);

    $response = $this->actingAs($user)->get(route('profile.edit'));

    $response->assertRedirect(route('password.force-change.edit'));
});

test('a user flagged must_change_password can still reach the force-change page itself', function () {
    $user = User::factory()->create(['role' => 'dosen', 'must_change_password' => true]);

    $response = $this->actingAs($user)->get(route('password.force-change.edit'));

    $response->assertOk();
});

test('dashboard is exempt from the redirect so the modal can render there instead', function () {
    $user = User::factory()->create(['role' => 'dosen', 'must_change_password' => true]);

    $response = $this->actingAs($user)->get(route('dashboard'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->where('auth.user.must_change_password', true)
        ->has('passwordRules')
    );
});

test('a user without the flag is not redirected', function () {
    $user = User::factory()->create(['role' => 'admin', 'must_change_password' => false]);

    $response = $this->actingAs($user)->get(route('dashboard'));

    $response->assertOk();
});

test('submitting a new password clears the flag and unlocks the app', function () {
    $user = User::factory()->create(['role' => 'mahasiswa', 'must_change_password' => true]);

    $response = $this->actingAs($user)->put(route('password.force-change.update'), [
        'current_password' => 'password',
        'password' => 'password-baru-123',
        'password_confirmation' => 'password-baru-123',
    ]);

    $response->assertRedirect(route('dashboard'));

    $user->refresh();
    expect($user->must_change_password)->toBeFalse();
    expect(Hash::check('password-baru-123', $user->password))->toBeTrue();

    $this->actingAs($user)->get(route('profile.edit'))->assertOk();
});

test('submitting the wrong current password does not clear the flag', function () {
    $user = User::factory()->create(['role' => 'mahasiswa', 'must_change_password' => true]);

    $response = $this->actingAs($user)->put(route('password.force-change.update'), [
        'current_password' => 'salah',
        'password' => 'password-baru-123',
        'password_confirmation' => 'password-baru-123',
    ]);

    $response->assertSessionHasErrors('current_password');

    expect($user->refresh()->must_change_password)->toBeTrue();
});
