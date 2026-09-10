<?php

namespace App\Concerns;

use Illuminate\Http\Request;

/**
 * Single point of enforcement for the rule every AdminProdi controller
 * action needs before it may view or mutate a Dosen, Mahasiswa, Krs,
 * MataKuliah, Kelas, or Nilai record: the resource must belong to the
 * acting admin prodi's own program studi. Centralizing the check here
 * means a future change to the rule (e.g. a super-admin-prodi bypass, or
 * audit logging on denial) only needs to change in one place instead of
 * every controller action that currently repeats it inline.
 */
trait AuthorizesProgramStudi
{
    /**
     * Abort with 403 unless the resource's program studi matches the acting
     * admin prodi's own. Pass the resolved id — walking relations at the
     * call site as needed, e.g. `$krs->mahasiswa?->program_studi_id`.
     */
    protected function authorizeSameProgramStudi(?int $resourceProgramStudiId, Request $request): void
    {
        abort_unless($resourceProgramStudiId === $request->user()->program_studi_id, 403);
    }
}
