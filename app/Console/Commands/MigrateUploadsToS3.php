<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Contracts\Filesystem\Filesystem;
use Illuminate\Support\Facades\Storage;
use Throwable;

class MigrateUploadsToS3 extends Command
{
    /**
     * @var string
     */
    protected $signature = 'storage:migrate-to-s3
                            {--from=public : The local disk currently holding the files}
                            {--dry-run : List what would be copied without writing anything}
                            {--overwrite : Re-upload files that already exist on the target disk}';

    /**
     * @var string
     */
    protected $description = 'Copy existing uploads from a local disk to the private uploads disk, preserving paths';

    /**
     * Directories written to by the application's upload flows.
     *
     * Paths are preserved verbatim, so records already pointing at
     * "photos/abc.jpg" keep resolving after the move.
     *
     * @var array<int, string>
     */
    private const DIRECTORIES = ['photos', 'bukti-pembayaran', 'rps', 'logo'];

    public function handle(): int
    {
        $source = Storage::disk($this->option('from'));
        $targetName = config('filesystems.uploads');
        $target = Storage::disk($targetName);

        if ($this->option('from') === $targetName) {
            $this->components->error("Source and target are the same disk [{$targetName}]. Nothing to do.");

            return self::FAILURE;
        }

        if (! $this->targetIsReachable($target, $targetName)) {
            return self::FAILURE;
        }

        $dryRun = (bool) $this->option('dry-run');

        $this->components->info(
            $dryRun
                ? "Dry run — inspecting [{$this->option('from')}] against [{$targetName}]."
                : "Copying from [{$this->option('from')}] to [{$targetName}]."
        );

        [$copied, $skipped, $bytes] = [0, 0, 0];
        $failures = [];

        foreach (self::DIRECTORIES as $directory) {
            foreach ($source->files($directory) as $path) {
                $size = (int) $source->size($path);

                if (! $this->option('overwrite') && $target->exists($path)) {
                    $this->line("  <fg=yellow>skip</> {$path} (already on {$targetName})");
                    $skipped++;

                    continue;
                }

                if ($dryRun) {
                    $this->line("  <fg=cyan>copy</> {$path} (".$this->humanBytes($size).')');
                    $copied++;
                    $bytes += $size;

                    continue;
                }

                try {
                    $stream = $source->readStream($path);

                    if ($stream === null) {
                        throw new \RuntimeException('unable to open source stream');
                    }

                    $this->writeToTarget($target, $path, $stream);

                    $this->line("  <fg=green>done</> {$path} (".$this->humanBytes($size).')');
                    $copied++;
                    $bytes += $size;
                } catch (Throwable $e) {
                    $this->line("  <fg=red>fail</> {$path} — {$e->getMessage()}");
                    $failures[] = $path;
                }
            }
        }

        $this->newLine();
        $this->components->info(sprintf(
            '%d file%s (%s)%s, %d skipped, %d failed.',
            $copied,
            $copied === 1 ? '' : 's',
            $this->humanBytes($bytes),
            $dryRun ? ' would be copied' : ' copied',
            $skipped,
            count($failures),
        ));

        if ($failures !== []) {
            $this->components->warn('Failed paths: '.implode(', ', $failures));

            return self::FAILURE;
        }

        if (! $dryRun && $copied > 0) {
            $this->components->warn(
                'Files were copied, not moved. Verify the application, then remove the originals yourself.'
            );
        }

        return self::SUCCESS;
    }

    /**
     * Fail early with a readable message when the target disk is misconfigured,
     * rather than letting a credentials error surface as a stack trace midway
     * through the copy.
     */
    private function targetIsReachable(Filesystem $target, string $targetName): bool
    {
        try {
            $target->exists('.');

            return true;
        } catch (Throwable $e) {
            $this->components->error("Cannot reach disk [{$targetName}]: {$e->getMessage()}");
            $this->components->warn('Check AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_DEFAULT_REGION and AWS_BUCKET.');

            return false;
        }
    }

    /**
     * @param  resource  $stream
     */
    private function writeToTarget(Filesystem $target, string $path, $stream): void
    {
        try {
            $target->writeStream($path, $stream);
        } finally {
            if (is_resource($stream)) {
                fclose($stream);
            }
        }
    }

    private function humanBytes(int $bytes): string
    {
        foreach (['B', 'KB', 'MB', 'GB'] as $unit) {
            if ($bytes < 1024) {
                return round($bytes, 1).' '.$unit;
            }
            $bytes /= 1024;
        }

        return round($bytes, 1).' TB';
    }
}
