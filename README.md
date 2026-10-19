# Sistem Inventaris Perangkat TI — Diskominfo Kota Probolinggo

Aplikasi manajemen inventaris perangkat teknologi informasi (TI) berbasis web yang dibangun sesuai standar teknis seleksi Tenaga Ahli TIK Diskominfo Kota Probolinggo.

---

## 🛠️ Stack Teknologi

- **Backend:** Laravel 13 (PHP 8.4) — RESTful API Resource, Form Request Validation, Strict Model Casting & Enum
- **Database:** MariaDB / MySQL / SQLite — Relasi 1:N (`categories` ──< `devices`), Unique Key Constraint, Foreign Key Cascade
- **Frontend:** React 19, Tailwind CSS v4, IDDS (INA Digital Design System via `@idds/react` & `@idds/styles`)
- **Build Tool:** Vite 8 dengan `@vitejs/plugin-react` & `@tailwindcss/vite`
- **Testing:** PHPUnit (Feature & Unit Tests)
- **DevOps & Kontainerisasi:** Docker & Docker Compose (Multi-stage build, Nginx Reverse Proxy, PHP 8.4-FPM, MariaDB 10.11)

---

## 📋 Fitur Utama (Sesuai Rubrik Seleksi)

1. **CRUD Lengkap:**
   - **Create:** Tambah perangkat baru dengan validasi field wajib, kode aset unik, harga &ge; 0, dan tanggal valid.
   - **Read:** Tabel inventaris interaktif, statistik ringkasan status operasional, filter kategori & status, pencarian multi-kolom, dan modal rincian spesifikasi perangkat.
   - **Update:** Ubah data perangkat dengan pengecualian unik otomatis pada record yang sedang diedit.
   - **Delete:** Hapus data dengan dialog modal konfirmasi keamanan.
2. **Kepatuhan Desain IDDS (INA Digital Design System):**
   - Komponen resmi `@idds/react`: `Button`, `Badge`, `TextField`, `PasswordInput`, `TextArea`, `SelectDropdown`, `Modal`, `Alert`, `Checkbox`, `Skeleton`, `Spinner`, `ToastProvider`.
   - Token status semantik: `success` (Aktif), `warning` (Dalam Perbaikan), `danger` (Rusak), `neutral` (Tidak Dipakai).
   - Aksesibilitas (A11y): Label input terhubung, pesan error berbasis teks untuk pembaca layar, keyboard-navigable.
   - Ilustrasi resmi IDDS: Aset ilustrasi SVG/PNG resmi dari INA Digital Illustration Library (konfirmasi data, permohonan maaf, empty state, dan pengadaan TI).
3. **Autentikasi Kedinasan & Akses Penguji:**
   - Sistem login/logout berbasis sesi Laravel aman.
   - Form otentikasi dilengkapi validasi real-time, toggle sembunyikan/tampilkan kata sandi, dan card akses demo penguji 1-klik (*autofill*).
4. **State Feedback Komprehensif:**
   - Loading State (Skeleton placeholder dan Spinner)
   - Empty State (tampilan bersih saat data belum ada atau pencarian tidak ditemukan)
   - Error State (Banner Alert dengan tombol coba lagi / retry)
   - Toast Feedback non-blocking untuk setiap operasi sukses dan gagal.

---

## 🗄️ Skema Database

```text
CATEGORIES (1) ───────< DEVICES (N)
```

### Tabel `categories`
| Kolom | Tipe | Keterangan |
| --- | --- | --- |
| `id` | BIGINT PK | Identitas kategori (auto-increment) |
| `name` | VARCHAR(100) UNIQUE | Nama kategori (Laptop, Printer, Jaringan) |
| `created_at` / `updated_at` | TIMESTAMP | Audit log bawaan Laravel |

### Tabel `devices`
| Kolom | Tipe | Keterangan |
| --- | --- | --- |
| `id` | BIGINT PK | Identitas perangkat |
| `asset_code` | VARCHAR(30) UNIQUE | Kode inventaris unik (misal: `IT1-001`, `IT1-002`) |
| `name` | VARCHAR(255) | Nama perangkat |
| `brand` | VARCHAR(100) | Merek / brand perangkat (opsional) |
| `serial_number` | VARCHAR(100) | Nomor seri perangkat (opsional) |
| `category_id` | BIGINT FK | Foreign Key merujuk ke `categories.id` (onDelete: restrict) |
| `status` | VARCHAR(20) | Enum: `tersedia`, `digunakan`, `perbaikan` |
| `assigned_to` | VARCHAR(150) | Unit penanggung jawab / pemegang perangkat |
| `purchase_date` | DATE | Tanggal perolehan |
| `purchase_price` | BIGINT | Nilai perolehan dalam Rupiah (&ge; 0) |
| `notes` | TEXT | Catatan teknis / spesifikasi tambahan |

---

## 🚀 Panduan Menjalankan Aplikasi

Aplikasi dapat dijalankan melalui dua cara: **Menggunakan Docker (Direkomendasikan / Cepat)** atau **Manual (Local PHP & Node)**.

---

### 🐳 Opsi A: Menggunakan Docker (Direkomendasikan — Tanpa Perlu Install PHP/Node)

Seluruh *environment* (Nginx Reverse Proxy, PHP 8.4-FPM, MariaDB 10.11, aset UI yang sudah terkompilasi, migrasi database, dan data seeder) terisolasi dan berjalan otomatis.

1. **Clone repositori dan masuk ke dalam direktori:**
   ```bash
   git clone https://github.com/donnysashari/test-kominfo-donny.git
   cd test-kominfo-donny
   ```

2. **Pastikan aplikasi Docker Desktop sudah aktif**, lalu jalankan:
   ```bash
   docker compose up -d --build
   ```
   > ⏳ *Skrip otomatis kontainer akan menunggu database MariaDB siap, mengeksekusi migrasi, mengisi 20 data inventaris awal, dan menyiapkan akun Administrator.*

3. **Buka aplikasi di peramban:**
   - 🌐 **Sistem Inventaris:** [`http://localhost:8000`](http://localhost:8000)
   - 📖 **Dokumentasi Swagger API:** [`http://localhost:8000/docs`](http://localhost:8000/docs)

4. **Perintah Berguna Docker:**
   ```bash
   # Melihat status kontainer aktif (pastikan berstatus 'Up' atau 'healthy')
   docker compose ps

   # Memantau log aplikasi secara real-time
   docker compose logs -f app

   # Menjalankan test otomatis PHPUnit di dalam kontainer
   docker compose exec app php artisan test

   # Menghentikan seluruh kontainer
   docker compose down
   ```

---

### 💻 Opsi B: Menjalankan Secara Manual (Local Environment)

#### Prasyarat
- PHP &ge; 8.2 (direkomendasikan PHP 8.4)
- Composer
- Node.js &ge; 18 & npm (opsional, karena berkas build frontend sudah disertakan)
- MySQL / MariaDB (atau SQLite)

#### Langkah Setup Manual

1. **Clone repositori dan masuk ke direktori:**
   ```bash
   git clone <url-repo>
   cd <nama-folder-repo>
   ```

2. **Siapkan berkas environment (.env):**
   ```bash
   cp .env.example .env
   ```
   *Sesuaikan konfigurasi database (DB_CONNECTION, DB_HOST, DB_DATABASE, DB_USERNAME, DB_PASSWORD) jika menggunakan MySQL/MariaDB lokal.*

3. **Instal dependensi Backend (PHP):**
   ```bash
   composer install
   ```

4. **Generate kunci keamanan & jalankan migrasi database beserta data seeder:**
   ```bash
   php artisan key:generate
   php artisan migrate --seed
   ```
   *Seeder menyiapkan 5 kategori dasar, 20 data awal perangkat TI siap uji, dan akun Administrator.*

5. **Build Aset Frontend (Opsional):**
   *Aset build produksi sudah disertakan langsung di `public/build`. Jika ingin mengompilasi ulang kode sumber React:*
   ```bash
   npm install
   npm run build
   ```

6. **Jalankan Web Server Lokal:**
   ```bash
   php artisan serve
   ```
   Buka peramban di: [`http://localhost:8000`](http://localhost:8000)

---

### 🔐 Akses Login Demo (Untuk Penguji / Evaluator)

Aplikasi dilengkapi akun demo bawaan yang otomatis aktif setelah seeder berjalan:

| Parameter | Kredensial | Keterangan |
| --- | --- | --- |
| **Email Kedinasan** | `admin@probolinggokota.go.id` | Alamat email terdaftar di database |
| **Kata Sandi** | `password123` | Kata sandi default |
| **Role** | Administrator Diskominfo | Akses penuh manajemen aset TI |

> 💡 **Fitur Cepat:** Pada halaman login tersedia tombol **"Gunakan Akun Demo (Isi Otomatis)"** untuk langsung mengisi kredensial dengan satu klik.

---

### 🚨 Troubleshooting / Solusi Kendala Umum

| Kendala | Penyebab | Solusi |
| --- | --- | --- |
| `no configuration file provided` | Perintah `docker compose` diketik di luar folder proyek | Pastikan sudah masuk ke dalam folder dengan perintah `cd <nama-folder>` |
| `port 8000 already in use` | Port 8000 sedang dipakai oleh aplikasi lain | Matikan proses di port 8000: `kill -9 $(lsof -t -i:8000)` atau atur `DOCKER_WEB_PORT=8080` di `.env` |
| `Vite manifest not found` | Aset build belum terdeteksi | Berkas build sudah tersimpan di `public/build`. Cukup refresh browser (`Cmd+R` / `F5`) atau jalankan `npm run build` |


---

## 🧪 Pengujian Otomatis (Testing)

Jalankan rangkaian test otomatis dengan PHPUnit:
```bash
php artisan test
```
Seluruh 17 skenario pengujian (86 assertions) mencakup autentikasi (login, logout, session check), validasi batas unik, format harga, status enum, endpoint CRUD API, dokumentasi Swagger, dan penyajian antarmuka React.

---

## 📡 Dokumentasi & Endpoint RESTful API

### 📖 Dokumentasi Interaktif (Swagger / OpenAPI 3.0)
Aplikasi telah dilengkapi antarmuka Swagger UI interaktif yang dapat diakses langsung oleh penguji di peramban:
👉 **`http://localhost:8000/docs`**

Berkas spesifikasi resmi OpenAPI 3.0: [`public/openapi.json`](file:///Volumes/Donnysashari/GitHub/it-invent/inventaris-perangkat-ti/public/openapi.json)

### Daftar Endpoint API

| Method | Endpoint | Deskripsi |
| --- | --- | --- |
| `GET` | `/docs` | Dokumentasi interaktif Swagger UI |
| `POST` | `/auth/login` | Otentikasi pengguna & inisiasi sesi kedinasan |
| `POST` | `/auth/logout` | Menutup sesi pengguna aktif |
| `GET` | `/auth/me` | Memeriksa data pengguna yang sedang login |
| `GET` | `/api/devices` | Mengambil seluruh daftar perangkat beserta data kategori |
| `GET` | `/api/devices/{id}` | Mengambil detail 1 perangkat |
| `POST` | `/api/devices` | Menambahkan perangkat baru |
| `PUT` | `/api/devices/{id}` | Memperbarui data perangkat |
| `DELETE` | `/api/devices/{id}` | Menghapus perangkat |
| `GET` | `/api/categories` | Mengambil daftar kategori dan jumlah perangkat terkait |


