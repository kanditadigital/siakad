---
paths:
  - 'app/Events/**'
---

# Events

## Broadcast events: use ShouldBroadcastNow, not ShouldBroadcast
This app has no queue worker running in its dev workflow (`composer run dev` / `php artisan dev` only auto-registers `reverb:start`, not `queue:listen`). An event implementing `ShouldBroadcast` therefore sits undelivered until someone runs `queue:work` manually — not realtime in practice. Use `ShouldBroadcastNow` for anything that must actually broadcast live (see `App\Events\TugasTertundaDiperbarui`), unless a queue worker is deliberately added to the dev stack.
