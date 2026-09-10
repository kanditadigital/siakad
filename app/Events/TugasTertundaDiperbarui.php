<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;

/**
 * Broadcasts immediately rather than via the queue: the payload is two
 * integers and this app's dev workflow does not run a queue worker, so
 * queuing it would sit undelivered instead of being realtime.
 */
class TugasTertundaDiperbarui implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets;

    /**
     * @param  array{krs_pending: int, tagihan_belum_lunas: int}  $tugas
     */
    public function __construct(public array $tugas)
    {
        //
    }

    /**
     * @return array<int, Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('tugas'),
        ];
    }

    public function broadcastAs(): string
    {
        return 'tugas.diperbarui';
    }

    /**
     * @return array{krs_pending: int, tagihan_belum_lunas: int}
     */
    public function broadcastWith(): array
    {
        return $this->tugas;
    }
}
