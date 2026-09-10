---
paths:
  - 'resources/js/components/**'
  - resources/js/components/nav-main.tsx
---

# Components

## Sidebar is white now, and chrome data comes from the `chrome` shared prop
The green sidebar was replaced with a white one on 2026-09-02 by owner decision (DESIGN.md §3.5 rewritten to match). The institutional green now lives in the brand plate, the active-item wash (`sidebar-accent`), the TAHUN AKADEMIK card, and primary buttons — do not restore a solid green sidebar.

Sidebar/header data (active academic period, KRS-pending and unpaid-UKT counts for the "Keuangan" badge and the header bell) is shared globally as `chrome` by `HandleInertiaRequests` and cached 1 minute; read it from `usePage().props.chrome` instead of adding per-page props or queries. `chrome.tugas` is null for non-staff roles.

## Sidebar is dark blue now (supersedes the 2026-09-02 white-sidebar rule)
2026-09-05: the white sidebar decision from 2026-09-02 was superseded by a new owner-approved direction (Midone reference dashboard). Sidebar is now dark blue (`--sidebar: #2947b8`), active items are a white pill with dark text + blue icon (`text-sidebar`), and inactive sidebar text/icons must use `text-sidebar-foreground` (not `text-muted-foreground`, which is dark and unreadable on blue). The account/logout menu moved from the sidebar footer to a header avatar (`header-user-menu.tsx`) — the sidebar footer now only renders the TAHUN AKADEMIK card. `--radius` is 6px (was 8px) and `--background` is `#f3f6fa`. See DESIGN.md §2.1/§2.3/§3.5/§3.6 for full detail. Do not restore the white sidebar or dark-text-on-blue without a new decision.

## Sidebar chrome: hover wash, no active rail, notch must live in sidebar DOM
Blue sidebar (2026-09-05) refinements, all in nav-main.tsx / app-sidebar.tsx / app-logo.tsx / app-shell.tsx:
- Hover on inactive rows is `bg-white/10`, overriding the shadcn primitive's default `hover:bg-sidebar-accent` (a full white pill). The solid white pill is reserved for the ACTIVE row only; don't let hover reuse it.
- Active row has NO left rail. The 3px rail existed when active state was a soft green wash; against blue the white pill is already max contrast.
- The curved corner notch MUST live in the sidebar's own DOM (app-sidebar.tsx), not the header's — AppContent uses `overflow-x-clip`, which silently clips a notch that hangs left out of the header.
- Sidebar width is 240px via `--sidebar-width: 15rem` passed to SidebarProvider in app-shell.tsx (not the 16rem default).
- Brand block is horizontal (~72px tall), and the no-logo fallback plate is `bg-white/10 ring-white/20`, not green — a second brand colour fights the blue panel.
- Footer is not rendered at all when `chrome.periode` is null, and is hidden in icon mode; an empty SidebarFooter leaves a dangling border-t hairline.
- In icon mode SidebarGroup needs `px-2` so 32px icon buttons centre in the 48px rail.

## Sidebar/header curved corner: lives in the header, rounds the WHITE layer (corrects earlier note)
CORRECTS the earlier rule that said the notch must live in the sidebar's DOM — that produced a "folded corner" artifact and is wrong.

The Midone silhouette is the CONTENT panel rounding its top-left corner with blue behind it. The sidebar's right edge stays perfectly straight; nothing is carved out of the sidebar.

Implementation (app-sidebar-header.tsx, inside <header>):
  <div class="absolute top-0 left-0 size-6 bg-sidebar"><div class="size-full rounded-tl-[1.5rem] bg-card" /></div>

Two traps:
1. `border-radius` REMOVES material from the corner it names. Round the top-left of the WHITE layer so blue shows at the junction corner. Rounding the blue layer's bottom-left (the old bug) leaves blue at the corner and scoops white out below it — a dog-ear.
2. Use a POSITIVE offset (left-0) inside the header. A negative offset hanging left out of the header is silently eaten by AppContent's `overflow-x-clip`.

Placing it in the header also makes it stick on scroll and follow the rail in icon mode for free. Guard with `hidden lg:block` — on mobile the sidebar is a drawer, so there's no seam.

## Sidebar is institutional green (supersedes both the white and the Midone-blue notes)
CORRECTS the earlier note saying the sidebar is dark blue `#2947b8` — that phase lasted one day.

2026-09-05 (final): `--sidebar: var(--color-green-800)` = `#166534`, the same value as `--primary`, so the nav panel carries the campus brand colour. `--background` is back to `#f3f5f3` (green-grey); the Midone `#f3f6fa` blue-grey ground went with the blue.

Colour history — do not roll back without a new decision: green solid -> white (09-02) -> Midone blue (09-05) -> institutional green (09-05, later).

IMPORTANT: "back to green" is only the COLOUR. The structure introduced in the Midone phase stays: horizontal ~72px brand block, white pill for the active row, no left rail, `bg-white/10` hover wash, curved corner in the header, 240px width, avatar menu in the top header, translucent-white period card. Do not restore the pre-09-05 layout.

Everything is token-driven (`bg-sidebar` / `text-sidebar` / `text-sidebar-foreground`) — there is no hardcoded panel colour in JSX, so a future recolour is a CSS-token edit only. The active row's icon uses `text-sidebar`, so it tracks the panel colour automatically.

Still true regardless of colour: inactive sidebar text/icons must use `text-sidebar-foreground`, never `text-muted-foreground` (dark, unreadable on a dark panel); the no-logo brand plate is `bg-white/10 ring-white/20`, never a solid green plate (it would vanish into the green panel).

## Overriding a shadcn primitive's class: match the variant, or it silently wins
When killing a class that a `components/ui/*` primitive applies under a variant, your override must carry the SAME variant prefix.

Example (app-sidebar.tsx): the Sidebar primitive sets `group-data-[side=left]:border-r`. Passing `className="border-r-0"` does NOT remove it — tailwind-merge only merges classes sharing a variant, so both survive, and the prefixed rule then outranks the bare one on CSS specificity. The working override is `className="group-data-[side=left]:border-r-0"`.

Prefer this call-site override to editing `components/ui/*`, per the house rule that base UI components are used as-is.

Related trap: `* { @apply border-border }` in app.css colours EVERY border with the light `--border` grey. Any border on a dark surface (e.g. the green sidebar) therefore shows up as a light seam unless it is removed or recoloured.

## Active top-level nav row: concave notch bleeding to sidebar edge, content panel is white
2026-09-05: top-level active nav rows (SimpleItem / CollapsibleItem trigger, not nested children) now bleed flush to the sidebar's true right edge and get a concave "notch" cut at their top-right and bottom-right corners (NotchAktif in nav-main.tsx), curving the sidebar-green background into the white pill/content boundary — matches an owner-supplied reference image.

Implementation traps:
- A 100%-width block element's right edge is fixed by its container; a negative `margin-right` does NOT extend it. The active pill instead widens explicitly via `w-[calc(100%+0.75rem)]` (0.75rem = the SidebarGroup's px-3) to actually reach x = sidebar width. Reset to `w-8` in `group-data-[collapsible=icon]` mode.
- The notch itself reuses the two-layer corner trick from app-sidebar-header.tsx's seam: outer `bg-sidebar` box, inner `bg-sidebar-accent` box with a `rounded-{corner}-[boxsize]` (radius = box size) so the named corner reveals the outer colour as a quarter circle.
- Notches are hidden in icon-collapsed mode and are NOT applied to nested child rows (their edge doesn't correspond to the sidebar's true border, so the effect there reads as a stray mark).

AppContent (app-sidebar-layout.tsx) also got `bg-card` added so the main content panel is solid white instead of the grey-green `bg-background`, so it visually merges with the header (also bg-card) and the new notch treatment.

## NotchAktif corner radius is 1rem (16px), not 0.75rem
2026-09-05 follow-up: bumped NotchAktif's box from size-3/0.75rem to size-4/1rem (rounded-{corner}-[1rem]) for a gentler, more "merged" curve per owner feedback ("menyatu... smooth") — the tighter 12px bite read as a disconnected patch rather than a flowing curve. The horizontal offset (-right-3, matching the SidebarGroup's 0.75rem padding so the box's right edge still lands exactly at the sidebar's true border) is unchanged — only the box's own size/vertical offset grew.

## NotchAktif corner spans need -z-10 or they cover the neighboring row
NotchAktif's two corner spans (-top-4/-bottom-4, size-4 = 16px) intentionally bleed outside the active row's own box into the gap and into the previous/next SidebarMenuItem's space, since SidebarMenu's row gap is only gap-0.5 (2px) — nowhere near enough to contain a 16px curve. Without an explicit -z-10 on the spans, later-painted DOM elements (this is what happens to the row that sits ABOVE the active one, since it's earlier in the list) get visually covered — e.g. a badge (LencanaJumlah) at the same right edge gets clipped/hidden by the notch's solid bg-sidebar box. Keep -z-10 on both spans so the notch always paints behind real row content (icons/text/badges), never on top of it.

## Top-level row hover wash also bleeds to the sidebar edge (not just active)
The edge-bleed width (`w-[calc(100%+0.75rem)] rounded-r-none`, collapses to `w-8 rounded-md` in icon mode) was split out of the old `AKTIF_UTAMA` into its own `UTAMA` constant and applied unconditionally to top-level rows (SimpleItem, CollapsibleItem trigger), not just when active. `AKTIF_UTAMA` no longer exists — active state is now `cn(ITEM, UTAMA, isActive && AKTIF)`. This makes the `hover:bg-white/10` wash also reach the sidebar's true right edge, matching the active pill's shape. Nested child rows still don't get `UTAMA` — same "top-level only" rule as NotchAktif.

## UTAMA's right corners: tried convex, reverted to square (2026-09-05)
Briefly changed UTAMA's right corners to `rounded-r-[1rem]` (convex) with AKTIF squaring them back off when active — owner reverted this same day. UTAMA stays `rounded-r-none` unconditionally (both hover and active are square), matching the earlier "Top-level row hover wash" note. Do not reintroduce the convex corner without a new decision.

## NotchAktif corner radius bumped to 1.5rem (24px) for a bigger, smoother curve
2026-09-05 follow-up (supersedes the "1rem, not 0.75rem" note): owner shared a reference image of a much larger, smoother curve where an active/highlighted block meets its neighboring content, so NotchAktif's box grew again from size-4/1rem to size-6/1.5rem (rounded-{corner}-[1.5rem]). Offsets scale with it: -top-6/-bottom-6 (must equal the negative of the box size so the box sits flush above/below the row), -right-3 unchanged (still matches the SidebarGroup's 0.75rem padding so the box's right edge lands at the sidebar's true border). If asked to enlarge again, keep offset magnitude == size in both dimensions.

## Corrects earlier note: don't use -z-10 on NotchAktif, use margin instead
CORRECTS the "NotchAktif corner spans need -z-10" note — that was wrong and made the notch invisible. Per CSS stacking-order rules, a negative z-index descendant paints in the stacking context's "negative stack level" step, which comes BEFORE the "in-flow, non-positioned descendants" step — meaning ALL normal sidebar content (rows, icons, badges, and even the sidebar's own bg-sidebar fill div) painted on top of a -z-10 notch, hiding it completely, not just fixing the overlap.

The actual fix: NotchAktif's spans carry no z-index override at all (plain `absolute`, default stacking). Instead, SimpleItem's and CollapsibleItem's outer SidebarMenuItem gets `my-6 group-data-[collapsible=icon]:my-0` when active/parent-active, reserving the 1.5rem the notch bleeds above/below so it never reaches into a neighboring row's box in the first place. If NotchAktif's size changes again, this margin must match it (my-6 == 1.5rem == the notch's size-6/-top-6/-bottom-6).

## Corrects earlier note: no my-6 isolation margin around active row
CORRECTS the "-z-10, use margin instead" note's margin part — `my-6` on the active SidebarMenuItem made the row look isolated/floating from the rest of the list ("mengambang", owner feedback), so it was reverted. The active row now has no extra spacing; the list stays tight (gap-0.5 everywhere) and NotchAktif's white curve merges directly into the pill. Tradeoff: this reintroduces the theoretical case where the notch's corner spans (size-6, bleeding 1.5rem past the row) can overlap a neighboring row's right-edge content (e.g. a badge) if that neighbor sits immediately above/below an active row — accepted for now since it's an edge case (only "Keuangan" currently has a top-level badge), not observed as an active problem. If it comes up again, fix at the collision site (e.g. extra clearance on LencanaJumlah) rather than isolating the whole active row again.

## NotchAktif removed (2026-09-05) — active row is now a plain squared pill
Owner decided to drop the concave-notch treatment entirely after several rounds of tuning (radius, z-index, margin) never quite looked right. `NotchAktif` and its two call sites (SimpleItem, CollapsibleItem trigger) are gone; the wrapping `<div className="relative">` around CollapsibleTrigger in CollapsibleItem was removed too since nothing inside needs absolute positioning anymore. The active row is now just the plain white pill (`AKTIF`) squared off flush to the sidebar's true edge (`UTAMA`'s `rounded-r-none` + width bleed) — no corner curve. All prior NotchAktif-related notes in this file are historical only; do not reintroduce the notch without a new decision.
