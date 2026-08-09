# Feature: Get Current User API (`GET /api/users/current`)

## Goal
Mengimplementasikan fitur untuk mendapatkan informasi user yang sedang login berdasarkan token yang dikirimkan melalui header `Authorization`.

---

## Specifications

### 1. Cara Kerja Autentikasi
- Client mengirimkan HTTP request dengan header:
  ```
  Authorization: Bearer <token>
  ```
- Server membaca token dari header tersebut, lalu mencari data token di tabel `sessions` untuk mendapatkan `user_id` yang terkait.
- Jika token tidak ditemukan atau tidak ada, server mengembalikan response error `Unauthorized`.
- Jika token valid, server mengambil data user dari tabel `users` berdasarkan `user_id` yang ditemukan, lalu mengembalikannya.

### 2. API Specification

- **Endpoint**: `GET /api/users/current`
- **Headers**:
  ```
  Authorization: Bearer <token>
  ```

- **Response Body (Success)**:
  ```json
  {
    "data": {
      "id": 1,
      "name": "Eko",
      "email": "eko@localhost",
      "created_at": "2026-08-09T10:00:00.000Z"
    }
  }
  ```

- **Response Body (Error - Token Tidak Ada / Tidak Valid)**:
  ```json
  {
    "error": "Unauthorized"
  }
  ```

### 3. Naming Conventions
Mengikuti struktur yang sudah ada di `src/`:
- **Routes (`src/routes/`)**: Format penamaan `[feature]-route.ts` (e.g., `users-route.ts`).
- **Services (`src/services/`)**: Format penamaan `[feature]-service.ts` (e.g., `users-service.ts`).

---

## Tahapan Implementasi (Step-by-Step Guide)

### Tahap 1: Buat Custom Error untuk Unauthorized
1. Buka file `src/services/users-service.ts`.
2. Tambahkan class error baru `UnauthorizedError` dengan message `"Unauthorized"`.

### Tahap 2: Tambahkan Logic di Service (`src/services/users-service.ts`)
1. Buat fungsi baru, misalnya `getCurrentUser(token: string)`.
2. **Validasi Token:** Cek apakah parameter `token` ada dan tidak kosong. Jika tidak ada, lempar `UnauthorizedError`.
3. **Cari Session:** Query ke tabel `sessions` menggunakan Drizzle untuk mencari baris dengan nilai `token` yang cocok (gunakan `eq(sessions.token, token)`). Ambil data `user_id` dari sana.
4. Jika tidak ada session yang cocok, lempar `UnauthorizedError`.
5. **Ambil User:** Query ke tabel `users` berdasarkan `user_id` yang didapat dari session (gunakan `eq(users.id, session.userId)`).
6. **Return:** Kembalikan data user dalam format berikut:
   ```ts
   return { data: { id, name, email, created_at } };
   ```
   Jangan sertakan field `password` dalam response!

### Tahap 3: Tambahkan Route Handler (`src/routes/users-route.ts`)
1. Buka file `src/routes/users-route.ts`.
2. Tambahkan route baru `.get('/current', ...)`.
3. Di dalam handler, baca nilai header `Authorization`:
   - Ambil nilai header `Authorization` dari request.
   - Ekstrak token-nya dengan menghilangkan prefix `"Bearer "` dari string tersebut (contoh: `const token = headers.authorization?.replace('Bearer ', '')` atau gunakan `split(' ')[1]`).
4. Panggil fungsi `usersService.getCurrentUser(token)`.
5. Gunakan `try...catch`. Jika menerima `UnauthorizedError`, set status HTTP ke `401` dan kembalikan `{ error: "Unauthorized" }`.
6. Jika berhasil, kembalikan response sukses berisi data user.

### Tahap 4: Verifikasi & Testing
1. Jalankan server (`bun run dev`).
2. Kirim request `GET /api/users/current` **tanpa** header `Authorization`. Pastikan response `401 Unauthorized`.
3. Kirim request dengan token yang salah/tidak valid. Pastikan response `401 Unauthorized`.
4. Login terlebih dahulu via `POST /api/users/login` untuk mendapatkan token yang valid. Lalu kirim request `GET /api/users/current` dengan header `Authorization: Bearer <token>`. Pastikan response mengembalikan data user yang benar.
