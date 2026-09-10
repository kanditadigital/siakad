---
paths:
  - 'resources/js/**'
---

# Js

## Echo hooks: prefix a custom broadcastAs() name with a dot
When a PHP event sets `broadcastAs('some.name')`, the `useEcho`/`useEchoPublic`/etc. hooks from `@laravel/echo-react` must listen with a leading dot: `useEcho('channel', '.some.name', cb)`. Without the dot, Echo's event formatter treats the string as a namespaced class name and rewrites dots to backslashes (`App\Events\some\name`), silently matching nothing. See `LoncengTugas` in `app-sidebar-header.tsx` for a working example.
