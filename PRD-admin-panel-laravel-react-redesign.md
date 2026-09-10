# PRD — Redesign Admin Panel Laravel Starter Kit React

## 1. Ringkasan Produk

Dokumen ini mendefinisikan kebutuhan redesign admin panel berbasis **Laravel Starter Kit React** agar secara visual sangat dekat dengan dashboard referensi yang diberikan pengguna.

Target utama bukan membuat interpretasi baru, melainkan melakukan **visual reproduction** terhadap referensi, terutama pada:

- struktur layout
- bentuk sidebar
- warna
- proporsi
- spacing
- card
- header
- chart
- typography
- kepadatan UI
- responsive behavior

Redesign harus dilakukan tanpa merusak arsitektur backend Laravel, autentikasi, Inertia.js, routing, middleware, dan mekanisme session yang sudah ada.

---

# 2. Informasi Teknis Project

## 2.1 Stack Utama

Gunakan stack existing project:

- Laravel
- Laravel Starter Kit React
- Inertia.js
- React
- TypeScript
- Tailwind CSS
- Lucide React
- Recharts untuk chart

Tidak diperbolehkan mengganti stack utama hanya untuk kebutuhan redesign.

## 2.2 Prinsip Implementasi

Redesign harus:

- menggunakan struktur project yang sudah ada
- menggunakan auth Laravel yang sudah ada
- menggunakan routing Laravel/Inertia yang sudah ada
- mempertahankan seluruh logic backend
- membuat component reusable
- tidak menulis ulang project dari nol
- menghindari dependency UI framework baru

---

# 3. Tujuan

## 3.1 Tujuan Utama

Membuat admin dashboard Laravel Starter Kit React yang memiliki tampilan sedekat mungkin dengan screenshot referensi.

## 3.2 Tujuan Visual

Hasil akhir harus memiliki:

- sidebar biru gelap
- bentuk sidebar dengan curved upper-right transition
- background main content abu-abu kebiruan sangat muda
- top header compact
- breadcrumb pada area atas
- search input pill kecil
- notifikasi
- user avatar
- empat statistic cards
- satu chart utama
- satu pie chart
- satu donut chart
- section official store
- section weekly best sellers
- floating dark mode switch
- card radius kecil
- shadow sangat lembut
- typography compact

## 3.3 Non-goals

Project ini bukan:

- redesign total backend
- migrasi framework
- penggantian Inertia
- pembuatan CMS baru
- pembuatan design system baru yang tidak terkait referensi
- pembuatan dashboard dengan style modern hasil improvisasi AI

---

# 4. Visual Reference Policy

Screenshot referensi harus dianggap sebagai:

> sumber kebenaran visual utama

AI coding agent tidak boleh memperlakukan screenshot hanya sebagai inspirasi.

Prioritas keputusan desain:

1. similarity terhadap screenshot
2. layout silhouette
3. proporsi
4. warna
5. ukuran komponen
6. spacing
7. typography
8. shadow
9. icon placement
10. responsive behavior

Jika ada dua opsi:

- lebih modern
- lebih mirip referensi

selalu pilih opsi yang lebih mirip referensi.

---

# 5. Design Direction

## 5.1 Style

Karakter utama:

- clean
- compact
- professional
- classic admin dashboard
- minimal decoration
- soft shadow
- small radius
- flat color
- outline icon
- balanced data density

## 5.2 Dilarang

Jangan menggunakan:

- gradient
- glassmorphism
- backdrop blur
- neo-brutalism
- oversized card
- rounded-3xl
- giant typography
- floating dashboard layout
- dark glossy effect
- excessive animation
- decorative blobs
- 3D icon
- neon colors
- default shadcn visual style
- default Material UI look

---

# 6. Color System

Gunakan warna berikut sebagai baseline.

## 6.1 Primary Colors

```css
--sidebar: #2947B8;
--sidebar-hover: #233FA4;
--primary: #315ACB;
--background: #F3F6FA;
--card: #FFFFFF;
```

## 6.2 Supporting Colors

```css
--orange: #F59E42;
--green: #9CCB3B;
--yellow: #F3C346;
--red: #D83B3B;
```

## 6.3 Text Colors

```css
--text-primary: #1F2937;
--text-secondary: #475569;
--muted: #8A94A6;
--border: #E8EDF4;
```

## 6.4 Usage

Sidebar:
- background `#2947B8`
- inactive text `rgba(255,255,255,.88)`
- icon `rgba(255,255,255,.9)`

Active nav:
- background putih
- text gelap
- icon primary blue

Main:
- background `#F3F6FA`

Card:
- background putih
- border optional sangat tipis

---

# 7. Typography

## 7.1 Font

Prioritas:

- Inter
- fallback `ui-sans-serif`
- fallback system sans-serif

## 7.2 Scale

```text
Sidebar Brand: 14px
Sidebar Item: 12–13px
Breadcrumb: 11–12px
Section Title: 14–15px
Card Label: 11–12px
Card Value: 22–24px
Widget Title: 13–14px
Table/List Title: 12–13px
Meta: 10–11px
```

## 7.3 Font Weight

Gunakan:

- 400 normal
- 500 medium
- 600 semibold

Hindari bold berlebihan.

---

# 8. Layout Architecture

## 8.1 Desktop Structure

```text
┌─────────────────────────────────────────────────────────────────┐
│ Sidebar │ Top Header                                            │
│         ├───────────────────────────────────────────────────────┤
│         │ Main Content                                          │
│         │                                                       │
│         │ General Report                                        │
│         │ Statistic Cards                                       │
│         │ Sales / Pie / Donut                                   │
│         │ Official Store / Best Sellers                         │
└─────────────────────────────────────────────────────────────────┘
```

## 8.2 Sidebar

Desktop:
- fixed
- width: 220–230px
- height: 100vh

Main content:
- margin-left sama dengan sidebar
- min-height 100vh

## 8.3 Main Padding

Desktop:
- horizontal: 28–32px
- vertical: 20–28px

---

# 9. Sidebar Specification

## 9.1 Shape

Sidebar tidak boleh berupa kotak biasa.

Bagian kanan atas harus memiliki bentuk transisi curved seperti screenshot.

Implementasi dapat menggunakan:

- pseudo element
- nested wrapper
- border radius besar
- mask/clip-path bila diperlukan

Tetapi hasil visual harus tetap sederhana dan stabil.

## 9.2 Brand Area

Tinggi sekitar:
- 68–76px

Isi:
- logo icon
- nama aplikasi

Alignment:
- horizontal
- vertical centered

Padding:
- 28–32px

## 9.3 Menu Container

Mulai setelah brand.

Gap antar item:
- 2–5px

Section divider:
- garis putih dengan opacity sangat rendah

## 9.4 Navigation Item

Height:
- 38–42px

Padding:
- 0 20–24px

Icon:
- Lucide
- 17–19px
- stroke normal

Text:
- 12–13px

## 9.5 Active State

Active item:
- white background
- text dark
- icon blue
- radius 5–7px
- small inner spacing

Jangan menggunakan pill radius besar.

## 9.6 Nested Menu

Support:
- expanded state
- collapsed state
- chevron rotate
- submenu indent

Animation maksimal:
- 150–200ms
- subtle

---

# 10. Top Header

## 10.1 Dimensions

Height:
- 64–72px

Background:
- sama dengan page background

Border:
- optional very subtle

## 10.2 Left Side

Breadcrumb:

```text
Application > Dashboard
```

Style:
- text kecil
- current page sedikit lebih gelap

## 10.3 Right Side

Urutan:

1. Search
2. Notification
3. Avatar

Gap:
- 14–18px

---

# 11. Search Input

Ukuran:

```text
width: 160–180px
height: 34–36px
```

Style:
- pill
- background `#E6ECF4`
- no heavy border
- placeholder kecil
- icon kanan

Focus:
- border/outline primary tipis
- no glow berlebihan

---

# 12. User Profile / Avatar

Avatar:
- 28–32px

Shape:
- circle

Hover:
- pointer
- subtle opacity

Dropdown dapat memanfaatkan komponen existing starter kit bila ada.

---

# 13. Page Header

Section title:

```text
General Report
```

Posisi:
- kiri
- setelah topbar

Tambahkan action kanan:

```text
Reload Data
```

dengan icon refresh kecil.

Action harus ringan, bukan button besar.

---

# 14. Statistic Cards

## 14.1 Grid

Desktop:
- 4 column

Gap:
- 14–18px

## 14.2 Card Dimensions

Height:
- sekitar 104–112px

Padding:
- 17–20px

Radius:
- 5–8px

Shadow:

```css
box-shadow:
0 3px 10px rgba(15,23,42,0.03),
0 8px 20px rgba(15,23,42,0.04);
```

## 14.3 Card Content

Atas:
- icon kiri
- badge kanan

Bawah:
- angka
- label

Contoh:

```text
🛒                 33% ↑

4.510
Item Sales
```

## 14.4 Statistic Variants

Card 1:
- icon cart
- blue
- positive green badge

Card 2:
- icon credit card/order
- orange
- negative red badge

Card 3:
- icon monitor/package
- yellow
- positive green

Card 4:
- icon user
- green
- positive green

---

# 15. Dashboard Analytics Layout

Gunakan grid 12 column.

Desktop:

- Sales Report: col-span-6
- Weekly Top Seller: col-span-3
- Sales Report Donut: col-span-3

Gap:
- 16px

---

# 16. Sales Report Main Chart

## 16.1 Header

Section title di luar card bila mengikuti screenshot.

Di dalam card:

Kiri:
- Current Month value
- label

Tengah:
- Last Month value
- label

Kanan:
- filter category

## 16.2 Chart

Gunakan Recharts.

Main series:
- blue
- solid
- smooth curve

Comparison:
- light gray
- dashed

Grid:
- horizontal
- very light

Axis:
- small
- muted

Tooltip:
- compact
- white
- soft shadow

## 16.3 Time Range Control

Di atas card area:
- date range picker appearance
- compact
- calendar icon

Tidak wajib functional penuh pada MVP jika backend belum tersedia.

---

# 17. Pie Chart Widget

Title:
- Weekly Top Seller

Action:
- See all

Chart:
- pie
- dominan blue
- secondary orange
- yellow

Legend:
- di bawah chart
- label kiri
- percentage kanan

Rows contoh:

```text
17 - 30 Years old      62%
31 - 50 Years old      33%
>= 50 Years old        10%
```

---

# 18. Donut Chart Widget

Title:
- Sales Report

Action:
- See all

Chart:
- donut
- thick ring
- center kosong

Legend sama dengan pie chart.

---

# 19. Official Store

## 19.1 Layout

Desktop:
- col-span-8

Header:
- Official Store
- filter city di kanan

Card:
- white
- radius kecil

## 19.2 Description

Contoh:

```text
250 Official stores in 21 countries, click the marker to see location details.
```

Style:
- 11–12px
- muted

## 19.3 Map

Tahap awal diperbolehkan:

- static mock map
- placeholder
- Leaflet bila project sudah memakai Leaflet

Prioritas utama pada MVP adalah layout visual.

---

# 20. Weekly Best Sellers

Desktop:
- col-span-4

Item terdiri dari:

- avatar
- name
- date
- sales badge

Row:
- 52–62px

Badge:
- green
- compact
- rounded small/pill

Divider:
- subtle

---

# 21. Dark Mode Toggle

Floating control kanan bawah.

Format:

```text
Dark Mode   [toggle]
```

Style:
- card putih
- soft shadow
- radius sedang
- ukuran kecil

Dark mode support opsional pada fase awal.

Jika existing project punya theme system, reuse existing mechanism.

---

# 22. Responsive Behavior

## 22.1 Desktop >= 1280px

Target utama pixel similarity.

Sidebar:
- fixed

Stats:
- 4 columns

Analytics:
- 6 / 3 / 3

Bottom:
- 8 / 4

## 22.2 Tablet 768–1279px

Sidebar:
- collapsible
- dapat berubah menjadi icon-only atau drawer

Stats:
- 2 columns

Analytics:
- chart utama full/large
- side chart dapat 2 columns

Bottom:
- stack bila perlu

## 22.3 Mobile < 768px

Sidebar:
- drawer

Topbar:
- search bisa menjadi icon atau full-width pada secondary row

Stats:
- 1 column

Analytics:
- vertical stack

Bottom:
- vertical stack

Desktop fidelity lebih penting daripada mobile fidelity.

---

# 23. Component Architecture

Target struktur:

```text
resources/js/
├── components/
│   ├── admin/
│   │   ├── app-sidebar.tsx
│   │   ├── sidebar-brand.tsx
│   │   ├── sidebar-menu.tsx
│   │   ├── sidebar-item.tsx
│   │   ├── top-header.tsx
│   │   ├── breadcrumb.tsx
│   │   ├── page-header.tsx
│   │   ├── search-box.tsx
│   │   └── dark-mode-toggle.tsx
│   │
│   ├── dashboard/
│   │   ├── statistic-card.tsx
│   │   ├── sales-report-chart.tsx
│   │   ├── top-seller-chart.tsx
│   │   ├── sales-donut-chart.tsx
│   │   ├── official-store.tsx
│   │   └── weekly-best-sellers.tsx
│   │
│   └── ui/
│       └── reuse existing ui components when suitable
│
├── layouts/
│   └── admin-layout.tsx
│
└── pages/
    └── dashboard.tsx
```

Jika struktur existing berbeda, jangan memaksakan rename besar-besaran.

Adaptasikan ke struktur existing.

---

# 24. Navigation Model

Buat navigation config reusable.

Contoh:

```ts
type NavigationItem = {
    title: string
    href?: string
    icon: LucideIcon
    children?: NavigationItem[]
}
```

Config dapat berisi:

- Dashboard
- Menu Layout
- Inbox
- File Manager
- Point of Sale
- Chat
- Post
- Crud
- Users
- Profile
- Pages
- Components
- Forms
- Widgets

Untuk project real, label menu boleh disesuaikan dengan menu existing.

Yang wajib dipertahankan adalah bentuk dan pola visualnya.

---

# 25. Auth Integration

Gunakan data user dari Inertia shared props existing.

Contoh:

```tsx
const { auth } = usePage<PageProps>().props
```

atau struktur yang sudah tersedia.

Dilarang hardcode user pada production.

Logout harus menggunakan route existing.

---

# 26. Data Strategy

## 26.1 MVP

Dashboard dapat memakai mock data terlebih dahulu untuk membangun UI.

Contoh:

```ts
const statistics = [
  {
    label: 'Item Sales',
    value: '4.510',
    change: 33,
  },
]
```

## 26.2 Production

Setelah layout selesai, data dapat diambil dari backend Laravel melalui Inertia props.

Pisahkan:

- UI
- data mapping
- backend calculation

---

# 27. State Requirements

Minimal state:

- sidebar open/collapse
- submenu expand/collapse
- mobile drawer
- search value
- chart filter
- date range placeholder
- dark mode toggle bila diaktifkan

Tidak perlu global state library jika belum dibutuhkan.

Gunakan React local state/context existing.

---

# 28. Accessibility

Minimal requirement:

- sidebar button memiliki aria-label
- mobile menu button memiliki aria-expanded
- icon-only controls punya label
- semantic button untuk action
- keyboard focus visible
- contrast cukup

---

# 29. Performance

Target:

- tidak menambah dependency besar tanpa alasan
- lazy load chart bila perlu
- gunakan icon import spesifik
- hindari re-render chart berlebihan
- hindari heavy CSS animation

---

# 30. Browser Support

Target minimum:

- Chrome latest
- Edge latest
- Safari latest
- Firefox latest

Prioritas:
- desktop Chrome/Safari

---

# 31. Dependency Policy

Diperbolehkan:

- Lucide React
- Recharts

Tidak diperbolehkan tanpa approval:

- AdminLTE
- Bootstrap
- Material UI
- Ant Design
- Chakra UI
- Mantine
- DaisyUI
- template dashboard pihak ketiga

---

# 32. Tailwind Guidelines

Gunakan utility Tailwind secara konsisten.

Hindari class:

```text
rounded-2xl
rounded-3xl
shadow-2xl
backdrop-blur
bg-gradient-to-*
```

untuk komponen utama.

Gunakan nilai custom bila diperlukan untuk match screenshot:

```tsx
className="rounded-[6px]"
className="shadow-[0_5px_15px_rgba(15,23,42,0.04)]"
```

Pixel accuracy lebih penting daripada hanya menggunakan default scale Tailwind.

---

# 33. Animation Guidelines

Animation hanya untuk:

- submenu
- hover
- mobile drawer
- dropdown
- toggle

Duration:
- 150–200ms

Easing:
- ease-out

Tidak ada:
- bounce
- zoom
- dramatic fade
- animated background

---

# 34. Implementation Phases

## Phase 0 — Audit Existing Project

Sebelum coding:

1. baca `package.json`
2. baca struktur `resources/js`
3. identifikasi layout existing
4. identifikasi dashboard page
5. identifikasi nav existing
6. identifikasi shared props auth
7. identifikasi Tailwind version
8. identifikasi icon library
9. identifikasi existing UI components

Output phase:
- daftar file relevant
- daftar file yang akan diubah
- dependency yang akan dipakai

## Phase 1 — Layout Skeleton

Implementasi:

- AdminLayout
- Sidebar
- Sidebar Brand
- Sidebar Navigation
- Top Header
- Main Content wrapper

Acceptance:
- silhouette sudah mendekati screenshot
- sidebar curve sudah benar

## Phase 2 — Statistic Cards

Implement:
- reusable statistic card
- 4 cards
- responsive grid

Acceptance:
- spacing
- height
- icon
- badge
- typography mendekati referensi

## Phase 3 — Analytics

Implement:
- sales line chart
- pie chart
- donut chart

Acceptance:
- proporsi 6 / 3 / 3
- legend
- labels
- white cards
- compact visual

## Phase 4 — Bottom Widgets

Implement:
- official store
- weekly best sellers

## Phase 5 — Responsive

Implement:
- tablet
- mobile drawer
- grid stacking

## Phase 6 — Integration

Replace mock data dengan props backend bila dibutuhkan.

---

# 35. File Change Policy

Agent harus:

- memodifikasi file seminimal mungkin
- tidak menghapus auth scaffolding
- tidak rename folder massal
- tidak rewrite backend
- tidak mengganti route bila tidak diperlukan
- tidak memindahkan file hanya untuk preferensi pribadi

---

# 36. Functional Requirements

## FR-01

User dapat melihat dashboard setelah login.

## FR-02

Sidebar selalu terlihat di desktop.

## FR-03

Active route ditandai dengan active nav item.

## FR-04

Submenu dapat dibuka/tutup.

## FR-05

Search box dapat menerima input.

## FR-06

Notification button dapat diklik.

## FR-07

Avatar/profile membuka dropdown existing bila tersedia.

## FR-08

Stat cards menampilkan data.

## FR-09

Line chart tampil dengan dua series.

## FR-10

Pie chart tampil.

## FR-11

Donut chart tampil.

## FR-12

Official Store widget tampil.

## FR-13

Weekly Best Sellers tampil.

## FR-14

Layout responsive.

## FR-15

Logout existing tetap berfungsi.

---

# 37. Non-Functional Requirements

## NFR-01

Tidak ada console error.

## NFR-02

Tidak ada TypeScript error.

## NFR-03

Tidak ada build error.

## NFR-04

Tidak ada broken route.

## NFR-05

Laravel auth tetap berfungsi.

## NFR-06

UI desktop match referensi secara visual.

## NFR-07

Responsive tidak menghasilkan horizontal overflow.

## NFR-08

Chart tidak overflow card.

---

# 38. Pixel Match Checklist

Agent harus mengecek:

## Sidebar

- [ ] width sesuai
- [ ] blue tone sesuai
- [ ] curve kanan atas sesuai
- [ ] brand position sesuai
- [ ] active item putih
- [ ] menu density sesuai

## Header

- [ ] height sesuai
- [ ] breadcrumb kecil
- [ ] search kecil
- [ ] notification position
- [ ] avatar size

## Cards

- [ ] radius kecil
- [ ] white background
- [ ] shadow lembut
- [ ] tinggi card mirip
- [ ] text hierarchy sesuai

## Charts

- [ ] main chart proportion
- [ ] pie chart proportion
- [ ] donut chart proportion
- [ ] legend layout
- [ ] muted axis labels

## Bottom Section

- [ ] map area proportion
- [ ] best seller list position
- [ ] filter alignment

---

# 39. Error Handling

Untuk frontend:

- chart dengan data kosong menampilkan empty state compact
- avatar fallback memakai initial
- missing user name memakai fallback `User`
- map gagal load menampilkan placeholder
- notification count optional

---

# 40. Example Dashboard Data Contract

Contoh shape dari backend:

```ts
export interface DashboardPageProps {
    statistics: {
        itemSales: number
        newOrders: number
        totalProducts: number
        uniqueVisitors: number
    }

    salesReport: {
        labels: string[]
        currentMonth: number[]
        previousMonth: number[]
    }

    topSeller: {
        label: string
        value: number
    }[]

    salesDistribution: {
        label: string
        value: number
    }[]

    bestSellers: {
        id: number
        name: string
        date: string
        sales: number
        avatar?: string
    }[]
}
```

Contract ini contoh dan boleh disesuaikan dengan domain aplikasi.

---

# 41. Suggested Route

Gunakan existing dashboard route.

Contoh:

```php
Route::get('/dashboard', function () {
    return Inertia::render('dashboard');
})->middleware(['auth'])->name('dashboard');
```

Jangan mengubah jika route existing sudah benar.

---

# 42. Suggested Controller Architecture

Jika data real diperlukan:

```text
DashboardController
├── statistics()
├── salesReport()
├── topSellers()
└── bestSellers()
```

Namun jangan overengineer.

Boleh gunakan satu `index()` pada fase awal.

---

# 43. Suggested Layout Component API

```tsx
type AdminLayoutProps = {
    children: React.ReactNode
    title?: string
}
```

Example:

```tsx
<AdminLayout title="Dashboard">
    <DashboardContent />
</AdminLayout>
```

---

# 44. Sidebar Interaction Specification

Desktop:
- default expanded
- optional collapsed feature

Tablet:
- optional compact sidebar

Mobile:
- off-canvas drawer

Overlay:
- dark transparent
- no blur

Close:
- X button
- click overlay
- Escape

---

# 45. UI Detail Specification

## Card radius

```css
border-radius: 6px;
```

## Primary shadow

```css
box-shadow: 0 6px 18px rgba(15, 23, 42, 0.05);
```

## Divider

```css
border-color: rgba(148, 163, 184, 0.18);
```

## Main background

```css
background: #F3F6FA;
```

## Sidebar

```css
background: #2947B8;
```

---

# 46. Testing Checklist

## Authentication

- [ ] login works
- [ ] dashboard protected
- [ ] logout works
- [ ] user data appears

## Navigation

- [ ] active route correct
- [ ] nested menu works
- [ ] mobile drawer works

## Visual

- [ ] no gradient
- [ ] no excessive radius
- [ ] no oversized headings
- [ ] no unintended shadcn style
- [ ] shadow subtle

## Responsive

- [ ] 1440px
- [ ] 1280px
- [ ] 1024px
- [ ] 768px
- [ ] 390px

## Technical

- [ ] npm build passes
- [ ] TypeScript passes
- [ ] Laravel page loads
- [ ] no console errors

---

# 47. Acceptance Criteria

Project dinyatakan selesai bila:

1. layout desktop sangat dekat dengan screenshot
2. sidebar berwarna dan berbentuk sesuai referensi
3. sidebar memiliki curved transition
4. header compact
5. search input kecil
6. statistik 4 cards berada pada satu row desktop
7. analytics layout 6 / 3 / 3
8. line chart mirip referensi
9. pie chart mirip referensi
10. donut chart mirip referensi
11. bottom grid mirip referensi
12. card radius kecil
13. shadow lembut
14. typography compact
15. no gradient
16. no glassmorphism
17. no AI-style dashboard
18. Laravel auth tetap utuh
19. responsive berfungsi
20. build tanpa error

---

# 48. Definition of Done

Sebelum selesai, agent wajib:

- menjalankan build
- memperbaiki TypeScript error
- memperbaiki lint error relevan
- mengecek route dashboard
- memastikan no broken imports
- mengecek mobile layout
- melakukan visual comparison dengan screenshot referensi
- memperbaiki perbedaan paling mencolok

Urutan perbaikan visual:

1. sidebar shape
2. sidebar width
3. main content offset
4. card size
5. spacing
6. colors
7. typography
8. chart proportions
9. icon size
10. shadow

---

# 49. Vibe Coding Execution Prompt

Gunakan instruksi berikut saat mengeksekusi PRD:

```text
Read this PRD fully before changing any file.

The attached dashboard screenshot is the visual source of truth.

Do not redesign based on your own taste.
Do not modernize the reference.
Do not replace it with a generic SaaS admin template.

First inspect the existing Laravel Starter Kit React project.

Identify:
- package.json
- Tailwind version
- Inertia setup
- auth shared props
- current layout
- current sidebar
- dashboard page
- navigation components

Before writing code, report the exact files you intend to modify.

Then implement the redesign incrementally.

Priority:
1. exact sidebar silhouette
2. layout proportions
3. colors
4. spacing
5. card dimensions
6. typography
7. charts
8. responsive behavior

Do not modify backend logic unless absolutely necessary.

Keep authentication, routes, middleware, session, CSRF, Inertia, and existing Laravel behavior intact.

Do not install a UI framework.

Use React, TypeScript, Tailwind CSS, Lucide React, and Recharts.

If an implementation choice is more modern but less visually similar, reject it and choose the one closest to the reference screenshot.
```

---

# 50. Final Instruction for Coding Agent

Jangan mulai dengan membuat desain baru.

Mulai dari audit project.

Setelah audit:

1. buat layout skeleton
2. match sidebar terlebih dahulu
3. match header
4. match cards
5. match chart layout
6. match lower widgets
7. responsive
8. build
9. visual refinement

Screenshot referensi adalah target visual utama.

PRD ini harus diikuti sebagai constraint implementasi, bukan hanya sebagai dokumentasi.
