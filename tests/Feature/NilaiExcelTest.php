<?php

use App\Models\Kelas;
use App\Models\Krs;
use App\Models\Mahasiswa;
use App\Models\Nilai;
use App\Models\User;
use Illuminate\Http\UploadedFile;

test('admin can export nilai to excel', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    Nilai::factory()->create();

    $response = $this->actingAs($admin)->get(route('admin.nilai.export'));

    $response->assertOk();
});

test('admin can import nilai from a csv file', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $mahasiswa = Mahasiswa::factory()->create(['nim' => '2026001']);
    $kelas = Kelas::factory()->create(['kode_kelas' => 'TIF-A1']);
    Krs::factory()->create([
        'mahasiswa_id' => $mahasiswa->id,
        'kelas_id' => $kelas->id,
        'status' => 'disetujui',
    ]);

    $csv = "nim,kode_kelas,nilai,grade,status,keterangan\n2026001,TIF-A1,88,A,tercatat,Baik\n";
    $tmpPath = tempnam(sys_get_temp_dir(), 'nilai').'.csv';
    file_put_contents($tmpPath, $csv);
    $file = new UploadedFile($tmpPath, 'nilai.csv', 'text/csv', null, true);

    $response = $this->actingAs($admin)->post(route('admin.nilai.import'), [
        'file' => $file,
    ]);

    $response->assertRedirect(route('admin.nilai.index'));

    $this->assertDatabaseHas('nilai', [
        'nilai' => 88,
        'grade' => 'A',
        'status' => 'tercatat',
    ]);

    @unlink($tmpPath);
});

test('importing an unmatched row is skipped and reported', function () {
    $admin = User::factory()->create(['role' => 'admin']);

    $csv = "nim,kode_kelas,nilai,grade,status,keterangan\n9999999,UNKNOWN,50,D,tercatat,\n";
    $tmpPath = tempnam(sys_get_temp_dir(), 'nilai').'.csv';
    file_put_contents($tmpPath, $csv);
    $file = new UploadedFile($tmpPath, 'nilai.csv', 'text/csv', null, true);

    $response = $this->actingAs($admin)->post(route('admin.nilai.import'), [
        'file' => $file,
    ]);

    $response->assertRedirect(route('admin.nilai.index'));
    $response->assertSessionHas('error');
    $this->assertDatabaseCount('nilai', 0);

    @unlink($tmpPath);
});
