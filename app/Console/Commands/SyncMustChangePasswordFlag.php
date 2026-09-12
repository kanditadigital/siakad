<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;

class SyncMustChangePasswordFlag extends Command
{
    /**
     * @var string
     */
    protected $signature = 'users:sync-must-change-password
                            {--dry-run : List which accounts would be flagged without writing anything}';

    /**
     * @var string
     */
    protected $description = 'Flag existing dosen/mahasiswa accounts whose password still equals their NIDN/NIM, so they get the first-login forced change too';

    public function handle(): int
    {
        $dryRun = (bool) $this->option('dry-run');

        $flagged = 0;

        $flagged += $this->syncRole('dosen', 'nidn', $dryRun);
        $flagged += $this->syncRole('mahasiswa', 'nim', $dryRun);

        $this->newLine();
        $this->components->info(sprintf(
            '%d account%s %s must_change_password.',
            $flagged,
            $flagged === 1 ? '' : 's',
            $dryRun ? 'would be flagged with' : 'flagged with',
        ));

        return self::SUCCESS;
    }

    private function syncRole(string $role, string $identifierColumn, bool $dryRun): int
    {
        $flagged = 0;

        User::query()
            ->where('role', $role)
            ->where('must_change_password', false)
            ->whereNotNull($identifierColumn)
            ->chunkById(100, function ($users) use ($identifierColumn, $dryRun, &$flagged): void {
                foreach ($users as $user) {
                    if (! Hash::check($user->{$identifierColumn}, $user->password)) {
                        continue;
                    }

                    $this->line("  <fg=cyan>{$user->role->value}</> #{$user->id} {$user->name} ({$identifierColumn}={$user->{$identifierColumn}})");

                    if (! $dryRun) {
                        $user->forceFill(['must_change_password' => true])->save();
                    }

                    $flagged++;
                }
            });

        return $flagged;
    }
}
