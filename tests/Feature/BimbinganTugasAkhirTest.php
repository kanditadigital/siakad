<?php

use App\Http\Middleware\HandleInertiaRequests;
use App\Models\BimbinganTugasAkhir;
use App\Models\Dosen;
use App\Models\Mahasiswa;
use App\Models\User;
use Illuminate\Testing\TestResponse;
use Tests\TestCase;

/**
 * Request the page the way the create dialog does: a partial reload asking only
 * for the picker's optional props, which are absent from a normal page load.
 */
function reloadPicker(TestCase $test, array $query = []): TestResponse
{
    return $test->get(
        route('dosen.bimbingan-tugas-akhir.index', $query),
        [
            'X-Inertia' => 'true',
            // Must match what the middleware computes, or Inertia answers 409.
            'X-Inertia-Version' => app(HandleInertiaRequests::class)->version(request()),
            'X-Inertia-Partial-Component' => 'dosen/bimbingan-tugas-akhir/index',
            'X-Inertia-Partial-Data' => 'mahasiswaOptions',
        ],
    );
}

test('dosen sees bimbingan where they are pembimbing 1 or 2', function () {
    $user = User::factory()->create(['role' => 'dosen']);
    $dosen = Dosen::factory()->create(['user_id' => $user->id]);
    $other = Dosen::factory()->create();

    $asP1 = BimbinganTugasAkhir::factory()->create(['pembimbing_1_id' => $dosen->id, 'pembimbing_2_id' => null]);
    $asP2 = BimbinganTugasAkhir::factory()->create(['pembimbing_1_id' => $other->id, 'pembimbing_2_id' => $dosen->id]);
    BimbinganTugasAkhir::factory()->create(['pembimbing_1_id' => $other->id, 'pembimbing_2_id' => null]);

    $response = $this->actingAs($user)->get(route('dosen.bimbingan-tugas-akhir.index'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('dosen/bimbingan-tugas-akhir/index')
        ->has('bimbingans', 2)
    );
});

test('dosen can add a new bimbingan and is recorded as pembimbing 1', function () {
    $user = User::factory()->create(['role' => 'dosen']);
    $dosen = Dosen::factory()->create(['user_id' => $user->id]);
    // Scoped to the dosen's own program studi — a dosen may only supervise
    // mahasiswa from their prodi.
    $mahasiswa = Mahasiswa::factory()->create([
        'status' => 'aktif',
        'program_studi_id' => $dosen->program_studi_id,
    ]);

    $response = $this->actingAs($user)->post(route('dosen.bimbingan-tugas-akhir.store'), [
        'mahasiswa_id' => $mahasiswa->id,
        'judul' => 'Implementasi Sistem X',
    ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('bimbingan_tugas_akhir', [
        'mahasiswa_id' => $mahasiswa->id,
        'pembimbing_1_id' => $dosen->id,
        'status' => 'aktif',
    ]);
});

test('dosen can update the status of their own bimbingan', function () {
    $user = User::factory()->create(['role' => 'dosen']);
    $dosen = Dosen::factory()->create(['user_id' => $user->id]);
    $bimbingan = BimbinganTugasAkhir::factory()->create(['pembimbing_1_id' => $dosen->id, 'status' => 'aktif']);

    $response = $this->actingAs($user)->put(route('dosen.bimbingan-tugas-akhir.update', $bimbingan->uuid), [
        'status' => 'revisi',
        'catatan' => 'Perlu revisi bab 3',
    ]);

    $response->assertRedirect();
    expect($bimbingan->fresh()->status)->toBe('revisi');
});

test('dosen cannot update a bimbingan they do not supervise', function () {
    $user = User::factory()->create(['role' => 'dosen']);
    Dosen::factory()->create(['user_id' => $user->id]);
    $bimbingan = BimbinganTugasAkhir::factory()->create();

    $response = $this->actingAs($user)->put(route('dosen.bimbingan-tugas-akhir.update', $bimbingan->uuid), [
        'status' => 'revisi',
    ]);

    $response->assertForbidden();
});

test('the mahasiswa picker is not loaded until the dialog asks for it', function () {
    $user = User::factory()->create(['role' => 'dosen']);
    Dosen::factory()->create(['user_id' => $user->id]);

    $this->actingAs($user)
        ->get(route('dosen.bimbingan-tugas-akhir.index'))
        ->assertInertia(fn ($page) => $page->missing('mahasiswaOptions'));
});

test('the picker only offers active mahasiswa from the dosen own program studi', function () {
    $user = User::factory()->create(['role' => 'dosen']);
    $dosen = Dosen::factory()->create(['user_id' => $user->id]);

    $wanted = Mahasiswa::factory()->create([
        'program_studi_id' => $dosen->program_studi_id,
        'status' => 'aktif',
        'nama' => 'Mahasiswa Sendiri',
    ]);
    Mahasiswa::factory()->create(['status' => 'aktif', 'nama' => 'Prodi Lain']);
    Mahasiswa::factory()->create([
        'program_studi_id' => $dosen->program_studi_id,
        'status' => 'cuti',
        'nama' => 'Sedang Cuti',
    ]);

    $this->actingAs($user);

    reloadPicker($this)
        ->assertOk()
        ->assertJsonCount(1, 'props.mahasiswaOptions.items')
        ->assertJsonPath('props.mahasiswaOptions.items.0.id', $wanted->id)
        ->assertJsonPath('props.mahasiswaOptions.total', 1);
});

test('the picker hides mahasiswa who already have a bimbingan', function () {
    $user = User::factory()->create(['role' => 'dosen']);
    $dosen = Dosen::factory()->create(['user_id' => $user->id]);

    $available = Mahasiswa::factory()->create([
        'program_studi_id' => $dosen->program_studi_id,
        'status' => 'aktif',
    ]);
    $taken = Mahasiswa::factory()->create([
        'program_studi_id' => $dosen->program_studi_id,
        'status' => 'aktif',
    ]);
    BimbinganTugasAkhir::factory()->create(['mahasiswa_id' => $taken->id]);

    $this->actingAs($user);

    reloadPicker($this)
        ->assertOk()
        ->assertJsonCount(1, 'props.mahasiswaOptions.items')
        ->assertJsonPath('props.mahasiswaOptions.items.0.id', $available->id);
});

test('the picker search narrows by nim or nama', function () {
    $user = User::factory()->create(['role' => 'dosen']);
    $dosen = Dosen::factory()->create(['user_id' => $user->id]);

    Mahasiswa::factory()->create([
        'program_studi_id' => $dosen->program_studi_id,
        'status' => 'aktif',
        'nama' => 'Budi Santoso',
        'nim' => '2026001',
    ]);
    Mahasiswa::factory()->create([
        'program_studi_id' => $dosen->program_studi_id,
        'status' => 'aktif',
        'nama' => 'Citra Dewi',
        'nim' => '2026002',
    ]);

    $this->actingAs($user);

    reloadPicker($this, ['mahasiswa_search' => 'Budi'])
        ->assertJsonCount(1, 'props.mahasiswaOptions.items')
        ->assertJsonPath('props.mahasiswaOptions.items.0.nama', 'Budi Santoso');

    reloadPicker($this, ['mahasiswa_search' => '2026002'])
        ->assertJsonCount(1, 'props.mahasiswaOptions.items')
        ->assertJsonPath('props.mahasiswaOptions.items.0.nama', 'Citra Dewi');
});

test('the picker caps how many mahasiswa it returns but reports the true total', function () {
    $user = User::factory()->create(['role' => 'dosen']);
    $dosen = Dosen::factory()->create(['user_id' => $user->id]);

    Mahasiswa::factory()->count(30)->create([
        'program_studi_id' => $dosen->program_studi_id,
        'status' => 'aktif',
    ]);

    $this->actingAs($user);

    reloadPicker($this)
        ->assertJsonCount(25, 'props.mahasiswaOptions.items')
        ->assertJsonPath('props.mahasiswaOptions.total', 30)
        ->assertJsonPath('props.mahasiswaOptions.limit', 25);
});

test('a dosen cannot create a bimbingan for a mahasiswa outside their program studi', function () {
    $user = User::factory()->create(['role' => 'dosen']);
    Dosen::factory()->create(['user_id' => $user->id]);

    $outsider = Mahasiswa::factory()->create(['status' => 'aktif']);

    $this->actingAs($user)
        ->post(route('dosen.bimbingan-tugas-akhir.store'), [
            'mahasiswa_id' => $outsider->id,
            'judul' => 'Judul',
        ])
        ->assertSessionHasErrors('mahasiswa_id');

    $this->assertDatabaseCount('bimbingan_tugas_akhir', 0);
});

test('a mahasiswa cannot be given a second bimbingan', function () {
    $user = User::factory()->create(['role' => 'dosen']);
    $dosen = Dosen::factory()->create(['user_id' => $user->id]);

    $mahasiswa = Mahasiswa::factory()->create([
        'program_studi_id' => $dosen->program_studi_id,
        'status' => 'aktif',
    ]);
    BimbinganTugasAkhir::factory()->create(['mahasiswa_id' => $mahasiswa->id]);

    $this->actingAs($user)
        ->post(route('dosen.bimbingan-tugas-akhir.store'), [
            'mahasiswa_id' => $mahasiswa->id,
            'judul' => 'Judul Kedua',
        ])
        ->assertSessionHasErrors('mahasiswa_id');

    $this->assertDatabaseCount('bimbingan_tugas_akhir', 1);
});

test('pembimbing 2 cannot be the submitting dosen themselves', function () {
    $user = User::factory()->create(['role' => 'dosen']);
    $dosen = Dosen::factory()->create(['user_id' => $user->id]);

    $mahasiswa = Mahasiswa::factory()->create([
        'program_studi_id' => $dosen->program_studi_id,
        'status' => 'aktif',
    ]);

    $this->actingAs($user)
        ->post(route('dosen.bimbingan-tugas-akhir.store'), [
            'mahasiswa_id' => $mahasiswa->id,
            'judul' => 'Judul',
            'pembimbing_2_id' => $dosen->id,
        ])
        ->assertSessionHasErrors('pembimbing_2_id');
});

test('a colleague in the same program studi can be set as pembimbing 2', function () {
    $user = User::factory()->create(['role' => 'dosen']);
    $dosen = Dosen::factory()->create(['user_id' => $user->id]);
    $rekan = Dosen::factory()->create(['program_studi_id' => $dosen->program_studi_id]);

    $mahasiswa = Mahasiswa::factory()->create([
        'program_studi_id' => $dosen->program_studi_id,
        'status' => 'aktif',
    ]);

    $this->actingAs($user)
        ->post(route('dosen.bimbingan-tugas-akhir.store'), [
            'mahasiswa_id' => $mahasiswa->id,
            'judul' => 'Judul',
            'pembimbing_2_id' => $rekan->id,
        ])
        ->assertRedirect();

    $this->assertDatabaseHas('bimbingan_tugas_akhir', [
        'mahasiswa_id' => $mahasiswa->id,
        'pembimbing_1_id' => $dosen->id,
        'pembimbing_2_id' => $rekan->id,
    ]);
});
