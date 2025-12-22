# 🎨 UI/UX Design System Lengkap & Pedoman Desain

Dokumen ini adalah **Kitab Suci Desain** untuk proyek Donasiku. Semua pengembang Frontend WAJIB mengikuti spesifikasi ini hingga ke level pixel untuk memastikan konsistensi visual yang prima. Dokumen ini mencakup Warna, Tipografi, Spacing, Shadow, Border Radius, dan Komponen Interaktif.

---

## 1. 🌈 Sistem Warna (Color System)

Kami menggunakan palet warna yang diturunkan dari **Tailwind CSS Colors** namun dikunci pada shades tertentu untuk menjaga identitas brand.

### A. Primary Brand (Blue Royal)
Digunakan untuk elemen utama, header, dan tindakan krusial. Memberikan kesan terpercaya dan profesional.
*   `primary-50` (`#EFF6FF`): Backgrounds tipis pada card aktif.
*   `primary-100` (`#DBEAFE`): Hover state pada tombol tersier.
*   `primary-500` (`#3B82F6`): **Main Brand Color**. Tombol Utama.
*   `primary-600` (`#2563EB`): Hover state Tombol Utama.
*   `primary-900` (`#1E3A8A`): Teks pada background terang.

### B. Functional Colors (Status)
Warna semantik untuk mengkomunikasikan status sistem.
*   **Success (Emerald)**:
    *   `success-500` (`#10B981`): Icon centang, Badge status "Disetujui", Tombol "Selesai".
*   **Warning (Amber)**:
    *   `warning-500` (`#F59E0B`): Badge status "Pending", Alert peringatan.
*   **Danger (Red)**:
    *   `danger-500` (`#EF4444`): Tombol Hapus, Pesan Error Validasi, Logout.

### C. Neutral Colors (Grayscale)
Dasar dari struktur layout, teks, dan border.
*   `white` (`#FFFFFF`): Background Card, Modal, Input.
*   `gray-50` (`#F9FAFB`): Background Body Halaman.
*   `gray-200` (`#E5E7EB`): Border Input, Divider garis.
*   `gray-500` (`#6B7280`): Teks sekunder, label, placeholder.
*   `gray-900` (`#111827`): Teks utama (Headings).

---

## 2. ✒️ Tipografi & Font Stack

**Font Family Utama**: `Inter`, sans-serif.
Pastikan font ini dimuat di `index.html` via Google Fonts.

### Skala Ukuran (Type Scale)

| Role | Class Tailwind | Ukuran (px) | Line Height | Weight | Contoh Penggunaan |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Display** | `text-4xl` | 36px | 40px | Bold (700) | Headline Hero Section |
| **H1** | `text-3xl` | 30px | 36px | Bold (700) | Judul Halaman Utama |
| **H2** | `text-2xl` | 24px | 32px | SemiBold (600) | Judul Seksi Dashboard |
| **H3** | `text-xl` | 20px | 28px | SemiBold (600) | Judul Kartu Donasi |
| **Body Large** | `text-lg` | 18px | 28px | Regular (400) | Lead Paragraph |
| **Body Base** | `text-base` | 16px | 24px | Regular (400) | Isi Konten Umum |
| **Small** | `text-sm` | 14px | 20px | Medium (500) | Teks Tombol, Label Input |
| **Tiny** | `text-xs` | 12px | 16px | Regular (400) | Timestamp, Footer text |

---

## 3. 📐 Spacing & Layout System

Menggunakan skala 4px grid system standar Tailwind. Konsistensi margin dan padding adalah kunci kerapian.

*   **Jarak Mikro (Component Internal)**:
    *   `p-2` (8px): Padding dalam tombol kecil.
    *   `gap-2` (8px): Jarak antar ikon dan teks.
*   **Jarak Kecil (Section Internal)**:
    *   `p-4` (16px): Padding standar dalam Card.
    *   `gap-4` (16px): Jarak antar elemen form.
*   **Jarak Menengah (Layout)**:
    *   `p-6` (24px): Padding kontainer halaman pada mobile.
    *   `gap-6` (24px): Grid gap antar kartu donasi.
*   **Jarak Besar (Section Separation)**:
    *   `py-12` (48px): Jarak vertikal antar seksi halaman Landing Page.

### Border Radius
Memberikan kesan ramah dan modern (tidak kaku).
*   **`rounded-md`** (6px): Input fields, Checkboxes.
*   **`rounded-lg`** (8px): Tombol, Alert boxes.
*   **`rounded-xl`** (12px): Kartu Donasi, Modal Windows.
*   **`rounded-2xl`** (16px): Container besar.
*   **`rounded-full`**: Avatar user, Badges status (Pill shape).

### Shadows (Elevation)
Untuk memberikan kedalaman (Depth) pada desain flat.
*   **`shadow-sm`**: Border subtil untuk Input field dan Card statis.
*   **`shadow`**: Dropdown menu.
*   **`shadow-md`**: Modal window, Sticky Navbar.
*   **`shadow-lg`**: Card saat di-hover (efek melayang).

---

## 4. 🧩 Spesifikasi Komponen (Component Specs)

Detail teknis cara membangun komponen agar seragam.

### A. Tombol Utama (Primary Button)
*   **Background**: `bg-blue-600` (`hover:bg-blue-700`).
*   **Text**: `text-white`, `font-medium`, `text-sm`.
*   **Padding**: `px-4 py-2` (Vertical 8px, Horizontal 16px).
*   **Radius**: `rounded-lg`.
*   **Transition**: `transition-colors duration-200`.
*   *Do*: Gunakan untuk aksi terpenting di halaman (Submit, Daftar, Simpan).
*   *Don't*: Menggunakan lebih dari satu Primary Button dalam satu grup aksi.

### B. Kartu Donasi (Donation Card)
Komponen paling sering muncul. Harus informatif tapi tidak padat.
*   **Container**: `bg-white`, `rounded-xl`, `shadow-sm`, `overflow-hidden`.
*   **Image**: Aspect Ratio 4:3 (`aspect-video`), `object-cover`, `w-full`.
*   **Content Area**: Padding `p-4`.
*   **Title**: `text-lg`, `font-semibold`, `truncate` (1 baris).
*   **Metadata**: Ikon lokasi (kecil) + Teks kota (`text-gray-500`, `text-sm`).
*   **Footer**: Badge Status di kiri, Tombol "Lihat" di kanan.

### C. Input Form
*   **Base**: `w-full`, `rounded-md`, `border-gray-300`.
*   **Focus State**: `focus:ring-2`, `focus:ring-blue-500`, `focus:border-blue-500`.
*   **Error State**: `border-red-500`, `focus:ring-red-500`.
*   **Label**: `block`, `mb-1`, `text-sm`, `font-medium`, `text-gray-700`.

### D. Modal / Dialog
*   **Overlay**: `bg-black/50` (Backdrop blur opsional).
*   **Panel**: `bg-white`, `w-full`, `max-w-md`, `rounded-2xl`, `p-6`.
*   **Animation**: Fade in + Scale up (`scale-95` -> `scale-100`).

---

## 5. 📱 Perilaku Responsif (Responsive Guidelines)

### Breakpoints
*   **Mobile (< 640px)**:
    *   Sidebar berubah menjadi Bottom Navigation Bar atau Hamburger Menu.
    *   Grid Donasi: 1 Kolom.
    *   Tabel data berubah menjadi format Card List.
*   **Tablet (640px - 1024px)**:
    *   Sidebar visible (ikon saja atau width kecil).
    *   Grid Donasi: 2 Kolom.
*   **Desktop (> 1024px)**:
    *   Sidebar full expanded.
    *   Grid Donasi: 3 atau 4 Kolom.
    *   Container max-width terpusat.

### Touch Targets
Pastikan semua elemen interaktif (tombol, link, ikon) memiliki area sentuh minimal **44x44 pixel** pada mode mobile untuk kemudahan jari pengguna.

---
*Pedoman ini berlaku mutlak. Setiap Pull Request yang melanggar sistem desain (misal: menggunakan warna hex custom di luar palet) akan ditolak saat Code Review.*
