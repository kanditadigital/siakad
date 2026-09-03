---
paths:
  - 'resources/js/components/**'
---

# Components

## Sidebar is white now, and chrome data comes from the `chrome` shared prop
The green sidebar was replaced with a white one on 2026-09-02 by owner decision (DESIGN.md §3.5 rewritten to match). The institutional green now lives in the brand plate, the active-item wash (`sidebar-accent`), the TAHUN AKADEMIK card, and primary buttons — do not restore a solid green sidebar.

Sidebar/header data (active academic period, KRS-pending and unpaid-UKT counts for the "Keuangan" badge and the header bell) is shared globally as `chrome` by `HandleInertiaRequests` and cached 1 minute; read it from `usePage().props.chrome` instead of adding per-page props or queries. `chrome.tugas` is null for non-staff roles.
