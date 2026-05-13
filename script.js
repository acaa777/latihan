/**
 * JBTB Casting Website - Supabase Integration & Utility Functions
 * Script untuk mengelola data dengan Supabase + localStorage fallback
 */

// ==================== KONFIGURASI SUPABASE ====================

// Ganti dengan URL dan Anon Key dari dashboard Supabase (Settings > API)
const SUPABASE_URL = 'https://your-project.supabase.co';
const SUPABASE_KEY = 'your-anon-key-here';

// Inisialisasi Supabase client (pastikan script tag Supabase sudah dimuat)
let supabaseClient = null;

if (typeof window.supabase !== 'undefined') {
  supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
} else {
  console.warn("Supabase tidak tersedia, menggunakan localStorage fallback");
}

// ==================== JOB MANAGEMENT (Database) ====================

/**
 * Mengambil semua lowongan dari Supabase atau localStorage
 */
async function getJobsFromDB() {
  if (supabaseClient) {
    try {
      const { data, error } = await supabaseClient
        .from('jobs')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Gagal ambil data lowongan dari Supabase:", error.message);
      return getJobsFromStorage();
    }
  }
  return getJobsFromStorage();
}

/**
 * Menambah lowongan baru ke Supabase atau localStorage
 */
async function addJobToDB(jobData) {
  if (supabaseClient) {
    try {
      const { data, error } = await supabaseClient
        .from('jobs')
        .insert([
          {
            title: jobData.title,
            rate: jobData.rate,
            requirements: jobData.requirements,
            description: jobData.description || "",
            is_active: true
          }
        ])
        .select();

      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error("Gagal tambah lowongan ke Supabase:", error.message);
      return addJob(jobData);
    }
  }
  return addJob(jobData);
}

/**
 * Update lowongan di Supabase atau localStorage
 */
async function updateJobInDB(jobId, jobData) {
  if (supabaseClient) {
    try {
      const { data, error } = await supabaseClient
        .from('jobs')
        .update({
          title: jobData.title,
          rate: jobData.rate,
          requirements: jobData.requirements,
          description: jobData.description
        })
        .eq('id', jobId)
        .select();

      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error("Gagal update lowongan di Supabase:", error.message);
      return updateJob(jobId, jobData);
    }
  }
  return updateJob(jobId, jobData);
}

/**
 * Hapus lowongan dari Supabase atau localStorage
 */
async function deleteJobFromDB(jobId) {
  if (supabaseClient) {
    try {
      const { error } = await supabaseClient
        .from('jobs')
        .delete()
        .eq('id', jobId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Gagal hapus lowongan dari Supabase:", error.message);
      deleteJob(jobId);
      return false;
    }
  }
  deleteJob(jobId);
  return true;
}

// ==================== APPLICANT MANAGEMENT (Database) ====================

/**
 * Mengambil semua data pelamar dari Supabase atau localStorage
 */
async function getApplicantsFromDB() {
  if (supabaseClient) {
    try {
      const { data, error } = await supabaseClient
        .from('applicants')
        .select('*')
        .order('applied_date', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Gagal ambil data pelamar dari Supabase:", error.message);
      return getApplicantsFromStorage();
    }
  }
  return getApplicantsFromStorage();
}

/**
 * Menambah data pelamar baru ke Supabase atau localStorage
 */
async function addApplicantToDB(applicantData) {
  if (supabaseClient) {
    try {
      const { data, error } = await supabaseClient
        .from('applicants')
        .insert([
          {
            name: applicantData.name,
            email: applicantData.email,
            wa: applicantData.wa,
            job_applied: applicantData.job,
            photo_link: applicantData.photo || "",
            portfolio_link: applicantData.portfolio || "",
            status: 'Pending'
          }
        ])
        .select();

      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error("Gagal tambah pelamar ke Supabase:", error.message);
      return addApplicant(applicantData);
    }
  }
  return addApplicant(applicantData);
}

/**
 * Update Status Pelamar di Supabase atau localStorage
 */
async function updateApplicantStatusDB(id, newStatus) {
  if (supabaseClient) {
    try {
      const { data, error } = await supabaseClient
        .from('applicants')
        .update({ status: newStatus })
        .eq('id', id)
        .select();

      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error("Gagal update status pelamar di Supabase:", error.message);
      return updateApplicantStatus(id, newStatus);
    }
  }
  return updateApplicantStatus(id, newStatus);
}

/**
 * Hapus pelamar dari Supabase atau localStorage
 */
async function deleteApplicantFromDB(applicantId) {
  if (supabaseClient) {
    try {
      const { error } = await supabaseClient
        .from('applicants')
        .delete()
        .eq('id', applicantId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Gagal hapus pelamar dari Supabase:", error.message);
      deleteApplicant(applicantId);
      return false;
    }
  }
  deleteApplicant(applicantId);
  return true;
}

/**
 * Bulk update status pelamar di Supabase atau localStorage
 */
async function bulkUpdateStatusDB(applicantIds, newStatus) {
  if (supabaseClient) {
    try {
      const { error } = await supabaseClient
        .from('applicants')
        .update({ status: newStatus })
        .in('id', applicantIds);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Gagal bulk update di Supabase:", error.message);
      bulkUpdateApplicantStatus(applicantIds, newStatus);
      return false;
    }
  }
  bulkUpdateApplicantStatus(applicantIds, newStatus);
  return true;
}

/**
 * Bulk delete pelamar dari Supabase atau localStorage
 */
async function bulkDeleteFromDB(applicantIds) {
  if (supabaseClient) {
    try {
      const { error } = await supabaseClient
        .from('applicants')
        .delete()
        .in('id', applicantIds);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Gagal bulk delete di Supabase:", error.message);
      bulkDeleteApplicants(applicantIds);
      return false;
    }
  }
  bulkDeleteApplicants(applicantIds);
  return true;
}

// ==================== STORAGE UTILITIES ====================

/**
 * Mendapatkan semua lowongan dari localStorage
 */
function getJobsFromStorage() {
  const jobs = localStorage.getItem("jbtb_jobs");
  return jobs ? JSON.parse(jobs) : [];
}

/**
 * Mendapatkan semua data pelamar dari localStorage
 */
function getApplicantsFromStorage() {
  const data = localStorage.getItem("jbtb_data");
  return data ? JSON.parse(data) : [];
}

/**
 * Menyimpan lowongan ke localStorage
 */
function saveJobsToStorage(jobs) {
  localStorage.setItem("jbtb_jobs", JSON.stringify(jobs));
}

/**
 * Menyimpan data pelamar ke localStorage
 */
function saveApplicantsToStorage(applicants) {
  localStorage.setItem("jbtb_data", JSON.stringify(applicants));
}

// ==================== JOB MANAGEMENT ====================

/**
 * Menambah lowongan baru
 */
function addJob(jobData) {
  const jobs = getJobsFromStorage();
  const newJob = {
    id: Date.now(),
    title: jobData.title,
    rate: jobData.rate,
    req: jobData.requirements.split(",").map((r) => r.trim()),
    desc: jobData.description || "",
    createdAt: new Date().toISOString(),
    isActive: true,
  };
  jobs.push(newJob);
  saveJobsToStorage(jobs);
  return newJob;
}

/**
 * Menghapus lowongan
 */
function deleteJob(jobId) {
  const jobs = getJobsFromStorage().filter((j) => j.id !== jobId);
  saveJobsToStorage(jobs);
}

/**
 * Mengupdate lowongan
 */
function updateJob(jobId, jobData) {
  const jobs = getJobsFromStorage();
  const jobIndex = jobs.findIndex((j) => j.id === jobId);

  if (jobIndex !== -1) {
    jobs[jobIndex] = {
      ...jobs[jobIndex],
      title: jobData.title || jobs[jobIndex].title,
      rate: jobData.rate || jobs[jobIndex].rate,
      req: jobData.requirements
        ? jobData.requirements.split(",").map((r) => r.trim())
        : jobs[jobIndex].req,
      desc:
        jobData.description !== undefined
          ? jobData.description
          : jobs[jobIndex].desc,
      updatedAt: new Date().toISOString(),
    };
    saveJobsToStorage(jobs);
    return jobs[jobIndex];
  }
  return null;
}

/**
 * Mendapatkan lowongan berdasarkan ID
 */
function getJobById(jobId) {
  const jobs = getJobsFromStorage();
  return jobs.find((j) => j.id === jobId);
}

/**
 * Mendapatkan lowongan berdasarkan judul
 */
function getJobByTitle(jobTitle) {
  const jobs = getJobsFromStorage();
  return jobs.find((j) => j.title === jobTitle);
}

// ==================== APPLICANT MANAGEMENT ====================

/**
 * Menambah data pelamar
 */
function addApplicant(applicantData) {
  const applicants = getApplicantsFromStorage();
  const newApplicant = {
    id: Date.now(),
    name: applicantData.name,
    email: applicantData.email,
    wa: applicantData.wa,
    job: applicantData.job,
    photo: applicantData.photo || "",
    porto: applicantData.portfolio || "",
    status: "Pending",
    appliedDate: new Date().toISOString(),
  };
  applicants.push(newApplicant);
  saveApplicantsToStorage(applicants);
  return newApplicant;
}

/**
 * Menghapus pelamar
 */
function deleteApplicant(applicantId) {
  const applicants = getApplicantsFromStorage().filter(
    (a) => a.id !== applicantId,
  );
  saveApplicantsToStorage(applicants);
}

/**
 * Mengupdate status pelamar
 */
function updateApplicantStatus(applicantId, newStatus) {
  const applicants = getApplicantsFromStorage();
  const applicantIndex = applicants.findIndex((a) => a.id === applicantId);

  if (applicantIndex !== -1) {
    applicants[applicantIndex].status = newStatus;
    applicants[applicantIndex].updatedDate = new Date().toISOString();
    saveApplicantsToStorage(applicants);
    return applicants[applicantIndex];
  }
  return null;
}

/**
 * Mengupdate data pelamar
 */
function updateApplicant(applicantId, applicantData) {
  const applicants = getApplicantsFromStorage();
  const applicantIndex = applicants.findIndex((a) => a.id === applicantId);

  if (applicantIndex !== -1) {
    applicants[applicantIndex] = {
      ...applicants[applicantIndex],
      ...applicantData,
      updatedDate: new Date().toISOString(),
    };
    saveApplicantsToStorage(applicants);
    return applicants[applicantIndex];
  }
  return null;
}

/**
 * Mendapatkan pelamar berdasarkan ID
 */
function getApplicantById(applicantId) {
  const applicants = getApplicantsFromStorage();
  return applicants.find((a) => a.id === applicantId);
}

/**
 * Mendapatkan pelamar berdasarkan lowongan
 */
function getApplicantsByJob(jobTitle) {
  const applicants = getApplicantsFromStorage();
  return applicants.filter((a) => a.job === jobTitle);
}

/**
 * Mendapatkan pelamar berdasarkan status
 */
function getApplicantsByStatus(status) {
  const applicants = getApplicantsFromStorage();
  return applicants.filter((a) => a.status === status);
}

/**
 * Bulk update status pelamar
 */
function bulkUpdateApplicantStatus(applicantIds, newStatus) {
  const applicants = getApplicantsFromStorage();
  applicantIds.forEach((id) => {
    const index = applicants.findIndex((a) => a.id === id);
    if (index !== -1) {
      applicants[index].status = newStatus;
      applicants[index].updatedDate = new Date().toISOString();
    }
  });
  saveApplicantsToStorage(applicants);
}

/**
 * Bulk delete pelamar
 */
function bulkDeleteApplicants(applicantIds) {
  const applicants = getApplicantsFromStorage().filter(
    (a) => !applicantIds.includes(a.id),
  );
  saveApplicantsToStorage(applicants);
}

// ==================== VALIDATION ====================

/**
 * Validasi email
 */
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validasi nomor WhatsApp
 */
function validatePhoneNumber(phone) {
  const phoneRegex = /^(\+62|62|0)[0-9]{9,12}$/;
  return phoneRegex.test(phone.replace(/[-\s]/g, ""));
}

/**
 * Validasi URL
 */
function validateURL(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validasi form pelamar
 */
function validateApplicantForm(formData) {
  const errors = [];

  if (!formData.name || formData.name.trim().length < 3) {
    errors.push("Nama harus minimal 3 karakter");
  }

  if (!validateEmail(formData.email)) {
    errors.push("Email tidak valid");
  }

  if (!validatePhoneNumber(formData.wa)) {
    errors.push("Nomor WhatsApp tidak valid (format: 08xx atau +62xx)");
  }

  if (!formData.job || formData.job.trim().length === 0) {
    errors.push("Lowongan harus dipilih");
  }

  if (formData.photo && !validateURL(formData.photo)) {
    errors.push("Link foto tidak valid");
  }

  if (formData.portfolio && !validateURL(formData.portfolio)) {
    errors.push("Link portfolio tidak valid");
  }

  return {
    isValid: errors.length === 0,
    errors: errors,
  };
}

/**
 * Validasi form lowongan
 */
function validateJobForm(formData) {
  const errors = [];

  if (!formData.title || formData.title.trim().length < 5) {
    errors.push("Judul lowongan harus minimal 5 karakter");
  }

  if (!formData.rate || formData.rate.trim().length === 0) {
    errors.push("Rate/gaji harus diisi");
  }

  if (!formData.requirements || formData.requirements.trim().length === 0) {
    errors.push("Persyaratan harus diisi");
  }

  if (!formData.description || formData.description.trim().length < 10) {
    errors.push("Deskripsi harus minimal 10 karakter");
  }

  return {
    isValid: errors.length === 0,
    errors: errors,
  };
}

// ==================== ANALYTICS ====================

/**
 * Statistik lowongan
 */
function getJobStats() {
  const jobs = getJobsFromStorage();
  const applicants = getApplicantsFromStorage();

  return {
    totalJobs: jobs.length,
    activeJobs: jobs.filter((j) => j.isActive !== false).length,
    totalApplicants: applicants.length,
    pendingApplicants: applicants.filter((a) => a.status === "Pending").length,
    acceptedApplicants: applicants.filter((a) => a.status === "Accepted")
      .length,
    rejectedApplicants: applicants.filter((a) => a.status === "Rejected")
      .length,
  };
}

/**
 * Statistik per lowongan
 */
function getJobDetailStats(jobTitle) {
  const applicants = getApplicantsByJob(jobTitle);

  return {
    jobTitle: jobTitle,
    totalApplicants: applicants.length,
    pending: applicants.filter((a) => a.status === "Pending").length,
    accepted: applicants.filter((a) => a.status === "Accepted").length,
    rejected: applicants.filter((a) => a.status === "Rejected").length,
  };
}

// ==================== EXPORT DATA ====================

/**
 * Export data pelamar ke CSV
 */
function exportApplicantsToCSV() {
  const applicants = getApplicantsFromStorage();

  if (applicants.length === 0) {
    alert("Tidak ada data pelamar untuk diexport");
    return;
  }

  let csv = "Nama,Email,WhatsApp,Lowongan,Status,Tanggal Melamar\n";

  applicants.forEach((app) => {
    const row = [
      `"${app.name}"`,
      `"${app.email}"`,
      `"${app.wa}"`,
      `"${app.job}"`,
      `"${app.status}"`,
      `"${new Date(app.appliedDate || app.id).toLocaleDateString("id-ID")}"`,
    ].join(",");
    csv += row + "\n";
  });

  downloadCSV(csv, "jbtb_applicants.csv");
}

/**
 * Download CSV file
 */
function downloadCSV(csv, filename) {
  const blob = new Blob([csv], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  window.URL.revokeObjectURL(url);
}

// ==================== UTILITIES ====================

/**
 * Format tanggal ke format Indonesia
 */
function formatDate(date) {
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  return new Date(date).toLocaleDateString("id-ID", options);
}

/**
 * Format currency ke Rupiah
 */
function formatCurrency(amount) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

/**
 * Generate ID unik
 */
function generateId() {
  return Date.now();
}

/**
 * Salin teks ke clipboard
 */
function copyToClipboard(text) {
  navigator.clipboard
    .writeText(text)
    .then(() => {
      alert("Berhasil disalin ke clipboard!");
    })
    .catch(() => {
      alert("Gagal menyalin ke clipboard");
    });
}

/**
 * Debounce function untuk optimasi performa
 */
function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

// Export untuk penggunaan di modul lain (jika menggunakan module system)
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    getJobsFromStorage,
    getApplicantsFromStorage,
    addJob,
    deleteJob,
    updateJob,
    getJobById,
    getJobByTitle,
    addApplicant,
    deleteApplicant,
    updateApplicantStatus,
    updateApplicant,
    getApplicantById,
    getApplicantsByJob,
    getApplicantsByStatus,
    bulkUpdateApplicantStatus,
    bulkDeleteApplicants,
    validateEmail,
    validatePhoneNumber,
    validateURL,
    validateApplicantForm,
    validateJobForm,
    getJobStats,
    getJobDetailStats,
    exportApplicantsToCSV,
    formatDate,
    formatCurrency,
  };
}
