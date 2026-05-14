# Struktur Kode JBTB Casting Website

## 📋 Ringkasan Perubahan

Kode website telah dipisahkan dan disusun dengan rapi untuk meningkatkan maintainability dan readability:

### Sebelum:

- ❌ 600+ baris JavaScript inline di dalam HTML
- ❌ Banyak `onclick` handlers tersebar di elemen HTML
- ❌ Sulit untuk debugging dan maintenance

### Sesudah:

- ✅ HTML bersih hanya berisi struktur
- ✅ Semua JavaScript logic terpisah di `script.js`
- ✅ Event listeners disetup otomatis saat halaman load
- ✅ Kode lebih terorganisir dan mudah dipelihara

---

## 📁 Struktur File

```
WEBSITE KP/
├── index.html          # Struktur HTML (bersih, tanpa inline JS)
├── script.js           # Semua JavaScript logic
├── css/
│   └── style.css       # Styling
├── database.sql        # Database schema (local)
└── database-supabase.sql  # Database schema (Supabase)
```

---

## 🔧 Bagian-bagian script.js

### 1. **Konfigurasi Supabase** (baris 1-20)

- URL dan API Key Supabase
- Inisialisasi Supabase client

### 2. **Job Management** (baris 25-150)

- `getJobsFromDB()` - Ambil data lowongan
- `addJobToDB()` - Tambah lowongan baru
- `updateJobInDB()` - Update lowongan
- `deleteJobFromDB()` - Hapus lowongan

### 3. **Applicant Management** (baris 155-280)

- `getApplicantsFromDB()` - Ambil data pelamar
- `addApplicantToDB()` - Tambah pelamar baru
- `updateApplicantStatusDB()` - Update status
- `deleteApplicantFromDB()` - Hapus pelamar
- `bulkUpdateStatusDB()` - Bulk update status
- `bulkDeleteFromDB()` - Bulk delete

### 4. **Storage Utilities** (baris 285-315)

- `getJobsFromStorage()` - Ambil dari localStorage
- `saveJobsToStorage()` - Simpan ke localStorage
- `getApplicantsFromStorage()` - Ambil pelamar dari localStorage
- `saveApplicantsToStorage()` - Simpan pelamar ke localStorage

### 5. **Job Management (localStorage)** (baris 320-420)

- `addJob()` - Tambah lowongan ke localStorage
- `deleteJob()` - Hapus lowongan dari localStorage
- `updateJob()` - Update lowongan di localStorage
- `getJobById()` - Cari lowongan by ID
- `getJobByTitle()` - Cari lowongan by title

### 6. **Applicant Management (localStorage)** (baris 425-550)

- `addApplicant()` - Tambah pelamar
- `deleteApplicant()` - Hapus pelamar
- `updateApplicantStatus()` - Update status pelamar
- `updateApplicant()` - Update data pelamar
- `getApplicantById()` - Cari pelamar by ID
- `getApplicantsByJob()` - Cari pelamar by job
- `getApplicantsByStatus()` - Cari pelamar by status
- `bulkUpdateApplicantStatus()` - Bulk update
- `bulkDeleteApplicants()` - Bulk delete

### 7. **Validation** (baris 555-650)

- `validateEmail()` - Validasi email
- `validatePhoneNumber()` - Validasi no. WhatsApp
- `validateURL()` - Validasi URL
- `validateApplicantForm()` - Validasi form pelamar
- `validateJobForm()` - Validasi form lowongan

### 8. **UI & Event Handlers** (baris 655-1200)

- `initializeDefaultData()` - Setup data default
- `renderFrontJobs()` - Render lowongan di halaman utama
- `renderAdminJobs()` - Render lowongan di admin panel
- `refreshTable()` - Render tabel pelamar
- `setupActionButtonListeners()` - Setup button listeners
- `openModal()` - Buka modal aplikasi
- `closeModal()` - Tutup modal aplikasi
- `toggleSelectAll()` - Toggle select all checkbox
- `toggleMassActionMenu()` - Tampilkan/sembunyikan menu aksi
- `bulkAction()` - Eksekusi aksi bulk (Accept/Reject/Delete)
- `accessAdmin()` - Login admin
- `logout()` - Logout admin
- `setupNavToggle()` - Setup navigation toggle
- `setupScrollButton()` - Setup smooth scroll button
- `setupKeyboardShortcuts()` - Setup keyboard shortcuts (Shift+A)
- `setupFormSubmissions()` - Setup form handlers
- `setupAdminLink()` - Setup admin link
- `setupSelectAllListener()` - Setup select all checkbox
- `setupMassActionButtons()` - Setup bulk action buttons
- `setupLogoutButton()` - Setup logout button
- `setupCloseModalButton()` - Setup close modal button
- `initializeApp()` - Inisialisasi semua event handlers

### 9. **Analytics & Export** (baris 1205-1350)

- `getJobStats()` - Statistik lowongan
- `getJobDetailStats()` - Statistik per lowongan
- `exportApplicantsToCSV()` - Export ke CSV
- `downloadCSV()` - Download file CSV

### 10. **Utilities** (baris 1355-1450)

- `formatDate()` - Format tanggal ke format Indonesia
- `formatCurrency()` - Format currency ke Rupiah
- `generateId()` - Generate ID unik
- `copyToClipboard()` - Copy ke clipboard
- `debounce()` - Debounce function

---

## 🎯 Keyboard Shortcuts

| Shortcut      | Fungsi           |
| ------------- | ---------------- |
| **Shift + A** | Buka admin login |

---

## 🔐 Admin Login

- **Username/Password**: `123`
- Akses di: Menu Navigation > Admin Login (atau tekan Shift + A)

---

## 💾 Database Options

### 1. Supabase (Cloud - Recommended)

- Real-time sync
- Automatic backup
- Scalable

### 2. LocalStorage (Offline)

- Auto-fallback jika Supabase error
- Data tersimpan di browser
- Hilang jika clear cache browser

---

## ✅ Checklist Perubahan

- [x] Hapus semua inline `onclick` handlers
- [x] Pindahkan semua JavaScript ke `script.js`
- [x] Setup event listeners dengan `addEventListener`
- [x] Bersihkan HTML struktur
- [x] Reorganisasi fungsi JavaScript
- [x] Tambahkan dokumentasi

---

## 🚀 Cara Menggunakan

1. **Halaman Utama** - Langsung bisa diakses saat halaman load
2. **Admin Panel** - Klik "Admin Login" atau tekan **Shift + A**
3. **Tambah Lowongan** - Isi form di admin panel dan klik "SIMPAN LOWONGAN"
4. **Kelola Pelamar** - Check pelamar yang ingin diedit, gunakan tombol aksi

---

## 🐛 Troubleshooting

| Masalah                     | Solusi                                       |
| --------------------------- | -------------------------------------------- |
| Lowongan tidak tampil       | Refresh halaman atau cek Supabase connection |
| Admin password salah        | Password default adalah `123`                |
| Data hilang setelah refresh | Pastikan Supabase sudah terkoneksi           |
| Form tidak submit           | Pastikan semua field sudah diisi             |
