<?php

use App\Models\BimbinganTugasAkhir;
use App\Models\Dosen;
use App\Models\Mahasiswa;
use App\Models\PengajuanJudulTa;
use App\Models\ProgramStudi;
use App\Models\User;

test('admin_prodi only sees mahasiswa with pengajuan judul from their own program studi', function () {
    $programStudi = ProgramStudi::factory()->create();
    $otherProgramStudi = ProgramStudi::factory()->create();
    $admin = User::factory()->create(['role' => 'admin_prodi', 'program_studi_id' => $programStudi->id]);

    $ownMahasiswa = Mahasiswa::factory()->create(['program_studi_id' => $programStudi->id]);
    $foreignMahasiswa = Mahasiswa::factory()->create(['program_studi_id' => $otherProgramStudi->id]);
    PengajuanJudulTa::factory()->create(['mahasiswa_id' => $ownMahasiswa->id]);
    PengajuanJudulTa::factory()->create(['mahasiswa_id' => $foreignMahasiswa->id]);

    $response = $this->actingAs($admin)->get(route('admin-prodi.pengajuan-judul-ta.index'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('admin-prodi/pengajuan-judul-ta/index')
        ->has('mahasiswas.data', 1)
        ->where('mahasiswas.data.0.id', $ownMahasiswa->id)
        ->has('mahasiswas.data.0.pengajuan_judul_ta', 1)
    );
});

test('a mahasiswa with multiple pengajuan judul is grouped into a single row', function () {
    $programStudi = ProgramStudi::factory()->create();
    $admin = User::factory()->create(['role' => 'admin_prodi', 'program_studi_id' => $programStudi->id]);
    $mahasiswa = Mahasiswa::factory()->create(['program_studi_id' => $programStudi->id]);

    PengajuanJudulTa::factory()->count(3)->create(['mahasiswa_id' => $mahasiswa->id]);

    $response = $this->actingAs($admin)->get(route('admin-prodi.pengajuan-judul-ta.index'));

    $response->assertInertia(fn ($page) => $page
        ->has('mahasiswas.data', 1)
        ->has('mahasiswas.data.0.pengajuan_judul_ta', 3)
    );
});

test('status filter narrows the pengajuan judul entries within each mahasiswa group', function () {
    $programStudi = ProgramStudi::factory()->create();
    $admin = User::factory()->create(['role' => 'admin_prodi', 'program_studi_id' => $programStudi->id]);
    $mahasiswa = Mahasiswa::factory()->create(['program_studi_id' => $programStudi->id]);

    PengajuanJudulTa::factory()->create(['mahasiswa_id' => $mahasiswa->id, 'status' => 'pending']);
    PengajuanJudulTa::factory()->create(['mahasiswa_id' => $mahasiswa->id, 'status' => 'disetujui']);
    PengajuanJudulTa::factory()->create(['mahasiswa_id' => $mahasiswa->id, 'status' => 'ditolak']);

    $response = $this->actingAs($admin)->get(route('admin-prodi.pengajuan-judul-ta.index', ['status' => 'disetujui']));

    $response->assertInertia(fn ($page) => $page
        ->has('mahasiswas.data', 1)
        ->has('mahasiswas.data.0.pengajuan_judul_ta', 1)
        ->where('mahasiswas.data.0.pengajuan_judul_ta.0.status', 'disetujui')
    );
});

test('status filter of ditolak only shows mahasiswa with a rejected judul', function () {
    $programStudi = ProgramStudi::factory()->create();
    $admin = User::factory()->create(['role' => 'admin_prodi', 'program_studi_id' => $programStudi->id]);
    $rejected = Mahasiswa::factory()->create(['program_studi_id' => $programStudi->id]);
    $pending = Mahasiswa::factory()->create(['program_studi_id' => $programStudi->id]);

    PengajuanJudulTa::factory()->create(['mahasiswa_id' => $rejected->id, 'status' => 'ditolak']);
    PengajuanJudulTa::factory()->create(['mahasiswa_id' => $pending->id, 'status' => 'pending']);

    $response = $this->actingAs($admin)->get(route('admin-prodi.pengajuan-judul-ta.index', ['status' => 'ditolak']));

    $response->assertInertia(fn ($page) => $page
        ->has('mahasiswas.data', 1)
        ->where('mahasiswas.data.0.id', $rejected->id)
    );
});

test('search filter narrows mahasiswa groups by nim or nama', function () {
    $programStudi = ProgramStudi::factory()->create();
    $admin = User::factory()->create(['role' => 'admin_prodi', 'program_studi_id' => $programStudi->id]);
    $target = Mahasiswa::factory()->create(['program_studi_id' => $programStudi->id, 'nama' => 'Rian Saputra']);
    $other = Mahasiswa::factory()->create(['program_studi_id' => $programStudi->id, 'nama' => 'Dewi Lestari']);
    PengajuanJudulTa::factory()->create(['mahasiswa_id' => $target->id]);
    PengajuanJudulTa::factory()->create(['mahasiswa_id' => $other->id]);

    $response = $this->actingAs($admin)->get(route('admin-prodi.pengajuan-judul-ta.index', ['search' => 'Rian']));

    $response->assertInertia(fn ($page) => $page
        ->has('mahasiswas.data', 1)
        ->where('mahasiswas.data.0.id', $target->id)
    );
});

test('admin_prodi can approve a pending pengajuan judul and assign pembimbing 1 and 2', function () {
    $programStudi = ProgramStudi::factory()->create();
    $admin = User::factory()->create(['role' => 'admin_prodi', 'program_studi_id' => $programStudi->id]);
    $mahasiswa = Mahasiswa::factory()->create(['program_studi_id' => $programStudi->id]);
    $pengajuan = PengajuanJudulTa::factory()->create(['mahasiswa_id' => $mahasiswa->id, 'status' => 'pending', 'judul' => 'Judul Terpilih']);
    $pembimbing1 = Dosen::factory()->create(['program_studi_id' => $programStudi->id]);
    $pembimbing2 = Dosen::factory()->create(['program_studi_id' => $programStudi->id]);

    $response = $this->actingAs($admin)->patch(route('admin-prodi.pengajuan-judul-ta.approve', $pengajuan), [
        'pembimbing_1_id' => $pembimbing1->id,
        'pembimbing_2_id' => $pembimbing2->id,
    ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('pengajuan_judul_ta', ['id' => $pengajuan->id, 'status' => 'disetujui']);
    $this->assertDatabaseHas('bimbingan_tugas_akhir', [
        'mahasiswa_id' => $mahasiswa->id,
        'judul' => 'Judul Terpilih',
        'pembimbing_1_id' => $pembimbing1->id,
        'pembimbing_2_id' => $pembimbing2->id,
    ]);
});

test('admin_prodi can approve without assigning pembimbing 2', function () {
    $programStudi = ProgramStudi::factory()->create();
    $admin = User::factory()->create(['role' => 'admin_prodi', 'program_studi_id' => $programStudi->id]);
    $mahasiswa = Mahasiswa::factory()->create(['program_studi_id' => $programStudi->id]);
    $pengajuan = PengajuanJudulTa::factory()->create(['mahasiswa_id' => $mahasiswa->id, 'status' => 'pending']);
    $pembimbing1 = Dosen::factory()->create(['program_studi_id' => $programStudi->id]);

    $response = $this->actingAs($admin)->patch(route('admin-prodi.pengajuan-judul-ta.approve', $pengajuan), [
        'pembimbing_1_id' => $pembimbing1->id,
    ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('bimbingan_tugas_akhir', [
        'mahasiswa_id' => $mahasiswa->id,
        'pembimbing_1_id' => $pembimbing1->id,
        'pembimbing_2_id' => null,
    ]);
});

test('pembimbing_1_id is required to approve', function () {
    $programStudi = ProgramStudi::factory()->create();
    $admin = User::factory()->create(['role' => 'admin_prodi', 'program_studi_id' => $programStudi->id]);
    $mahasiswa = Mahasiswa::factory()->create(['program_studi_id' => $programStudi->id]);
    $pengajuan = PengajuanJudulTa::factory()->create(['mahasiswa_id' => $mahasiswa->id, 'status' => 'pending']);

    $this->actingAs($admin)->patch(route('admin-prodi.pengajuan-judul-ta.approve', $pengajuan))
        ->assertSessionHasErrors('pembimbing_1_id');

    $this->assertDatabaseHas('pengajuan_judul_ta', ['id' => $pengajuan->id, 'status' => 'pending']);
});

test('pembimbing_2_id cannot be the same dosen as pembimbing_1_id', function () {
    $programStudi = ProgramStudi::factory()->create();
    $admin = User::factory()->create(['role' => 'admin_prodi', 'program_studi_id' => $programStudi->id]);
    $mahasiswa = Mahasiswa::factory()->create(['program_studi_id' => $programStudi->id]);
    $pengajuan = PengajuanJudulTa::factory()->create(['mahasiswa_id' => $mahasiswa->id, 'status' => 'pending']);
    $dosen = Dosen::factory()->create(['program_studi_id' => $programStudi->id]);

    $this->actingAs($admin)->patch(route('admin-prodi.pengajuan-judul-ta.approve', $pengajuan), [
        'pembimbing_1_id' => $dosen->id,
        'pembimbing_2_id' => $dosen->id,
    ])->assertSessionHasErrors('pembimbing_2_id');
});

test('pembimbing must belong to the same program studi as the mahasiswa', function () {
    $programStudi = ProgramStudi::factory()->create();
    $otherProgramStudi = ProgramStudi::factory()->create();
    $admin = User::factory()->create(['role' => 'admin_prodi', 'program_studi_id' => $programStudi->id]);
    $mahasiswa = Mahasiswa::factory()->create(['program_studi_id' => $programStudi->id]);
    $pengajuan = PengajuanJudulTa::factory()->create(['mahasiswa_id' => $mahasiswa->id, 'status' => 'pending']);
    $foreignDosen = Dosen::factory()->create(['program_studi_id' => $otherProgramStudi->id]);

    $this->actingAs($admin)->patch(route('admin-prodi.pengajuan-judul-ta.approve', $pengajuan), [
        'pembimbing_1_id' => $foreignDosen->id,
    ])->assertSessionHasErrors('pembimbing_1_id');
});

test('approving a different judul for a mahasiswa who already has a bimbingan replaces it', function () {
    $programStudi = ProgramStudi::factory()->create();
    $admin = User::factory()->create(['role' => 'admin_prodi', 'program_studi_id' => $programStudi->id]);
    $mahasiswa = Mahasiswa::factory()->create(['program_studi_id' => $programStudi->id]);
    $oldPembimbing = Dosen::factory()->create(['program_studi_id' => $programStudi->id]);
    BimbinganTugasAkhir::factory()->create([
        'mahasiswa_id' => $mahasiswa->id,
        'judul' => 'Judul Lama',
        'pembimbing_1_id' => $oldPembimbing->id,
    ]);

    $pengajuan = PengajuanJudulTa::factory()->create(['mahasiswa_id' => $mahasiswa->id, 'status' => 'pending', 'judul' => 'Judul Baru']);
    $newPembimbing = Dosen::factory()->create(['program_studi_id' => $programStudi->id]);

    $this->actingAs($admin)->patch(route('admin-prodi.pengajuan-judul-ta.approve', $pengajuan), [
        'pembimbing_1_id' => $newPembimbing->id,
    ]);

    expect(BimbinganTugasAkhir::where('mahasiswa_id', $mahasiswa->id)->count())->toBe(1);
    $this->assertDatabaseHas('bimbingan_tugas_akhir', [
        'mahasiswa_id' => $mahasiswa->id,
        'judul' => 'Judul Baru',
        'pembimbing_1_id' => $newPembimbing->id,
    ]);
});

test('admin_prodi can reject a pending pengajuan judul', function () {
    $programStudi = ProgramStudi::factory()->create();
    $admin = User::factory()->create(['role' => 'admin_prodi', 'program_studi_id' => $programStudi->id]);
    $mahasiswa = Mahasiswa::factory()->create(['program_studi_id' => $programStudi->id]);
    $pengajuan = PengajuanJudulTa::factory()->create(['mahasiswa_id' => $mahasiswa->id, 'status' => 'pending']);

    $response = $this->actingAs($admin)->patch(route('admin-prodi.pengajuan-judul-ta.reject', $pengajuan));

    $response->assertRedirect();
    $this->assertDatabaseHas('pengajuan_judul_ta', ['id' => $pengajuan->id, 'status' => 'ditolak']);
});

test('admin_prodi cannot approve or reject a pengajuan already processed', function () {
    $programStudi = ProgramStudi::factory()->create();
    $admin = User::factory()->create(['role' => 'admin_prodi', 'program_studi_id' => $programStudi->id]);
    $mahasiswa = Mahasiswa::factory()->create(['program_studi_id' => $programStudi->id]);
    $pengajuan = PengajuanJudulTa::factory()->create(['mahasiswa_id' => $mahasiswa->id, 'status' => 'disetujui']);

    $this->actingAs($admin)->patch(route('admin-prodi.pengajuan-judul-ta.approve', $pengajuan))->assertStatus(422);
    $this->actingAs($admin)->patch(route('admin-prodi.pengajuan-judul-ta.reject', $pengajuan))->assertStatus(422);
});

test('admin_prodi cannot approve or reject a pengajuan belonging to another program studi', function () {
    $programStudi = ProgramStudi::factory()->create();
    $otherProgramStudi = ProgramStudi::factory()->create();
    $admin = User::factory()->create(['role' => 'admin_prodi', 'program_studi_id' => $programStudi->id]);
    $foreignMahasiswa = Mahasiswa::factory()->create(['program_studi_id' => $otherProgramStudi->id]);
    $foreignPengajuan = PengajuanJudulTa::factory()->create(['mahasiswa_id' => $foreignMahasiswa->id, 'status' => 'pending']);

    $this->actingAs($admin)->patch(route('admin-prodi.pengajuan-judul-ta.approve', $foreignPengajuan))->assertForbidden();
    $this->actingAs($admin)->patch(route('admin-prodi.pengajuan-judul-ta.reject', $foreignPengajuan))->assertForbidden();
});
