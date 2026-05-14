/**
 * JBTB Casting Website - Supabase Integration & Utility Functions
 * Script untuk mengelola data dengan Supabase + localStorage fallback
 */

// ==================== KONFIGURASI SUPABASE ====================

// Ganti dengan URL dan Anon Key dari dashboard Supabase (Settings > API)
const SUPABASE_URL = "https://gcleodykkntfcxrqzbop.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdjbGVvZHlra250ZmN4cnF6Ym9wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg2NjA4MjcsImV4cCI6MjA5NDIzNjgyN30.seHOYtFoU1hdVWiRQGRQxHw0MgJj2zP0lr2wqYUszg4";

// Inisialisasi Supabase client (pastikan script tag Supabase sudah dimuat)
let supabaseClient = null;

if (typeof window.supabase !== "undefined") {
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
        .from("jobs")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

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
        .from("jobs")
        .insert([
          {
            title: jobData.title,
            rate: jobData.rate,
            requirements: jobData.requirements,
            description: jobData.description || "",
            is_active: true,
          },
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
        .from("jobs")
        .update({
          title: jobData.title,
          rate: jobData.rate,
          requirements: jobData.requirements,
          description: jobData.description,
        })
        .eq("id", jobId)
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
        .from("jobs")
        .delete()
        .eq("id", jobId);

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
        .from("applicants")
        .select("*")
        .order("applied_date", { ascending: false });

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
        .from("applicants")
        .insert([
          {
            name: applicantData.name,
            email: applicantData.email,
            wa: applicantData.wa,
            job_applied: applicantData.job,
            photo_link: applicantData.photo || "",
            portfolio_link: applicantData.portfolio || "",
            status: "Pending",
          },
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
        .from("applicants")
        .update({ status: newStatus })
        .eq("id", id)
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
        .from("applicants")
        .delete()
        .eq("id", applicantId);

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
        .from("applicants")
        .update({ status: newStatus })
        .in("id", applicantIds);

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
        .from("applicants")
        .delete()
        .in("id", applicantIds);

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

// ==================== UI & EVENT HANDLERS ====================

/**
 * Initialize localStorage dengan data default
 */
function initializeDefaultData() {
  const defaultApplicants = [
    {
      id: 1001,
      name: "Reza Rahadian",
      email: "reza.rahadian@talent.com",
      wa: "081234567890",
      job: "Pemeran Utama Film",
      photo: "https://google.com/search?q=photo",
      porto: "https://youtube.com/watch?v=reza",
      status: "Pending",
    },
    {
      id: 1002,
      name: "Chelsea Islan",
      email: "chelsea.islan@talent.com",
      wa: "089988776655",
      job: "Pemeran Utama Film",
      photo: "https://google.com/search?q=photo",
      porto: "https://youtube.com/watch?v=chelsea",
      status: "Pending",
    },
  ];

  if (!localStorage.getItem("jbtb_jobs")) {
    localStorage.setItem(
      "jbtb_jobs",
      JSON.stringify([
        {
          id: 1,
          title: "Pemeran Utama Film",
          rate: "Rp 5.000.000 - 15.000.000",
          req: ["Pria/Wanita", "Usia 20-30th", "Bisa Akting Menangis"],
        },
      ]),
    );
  }
  if (!localStorage.getItem("jbtb_data")) {
    localStorage.setItem("jbtb_data", JSON.stringify(defaultApplicants));
  }
}

/**
 * Render lowongan di halaman utama
 */
async function renderFrontJobs() {
  const jobs = await getJobsFromDB();
  const container = document.getElementById("job-list-display");
  
  if (!container) return;
  
  container.innerHTML = jobs
    .map(
      (j) => `
      <div class="job-card-item">
          <div class="job-badge-tag">Open</div>
          <h3>${j.title}</h3>
          <div class="job-fee-info">
              <i class="fas fa-coins"></i> ${j.rate}
          </div>
          <ul class="job-requirement-list">
              ${(j.req || j.requirements.split(","))
                .slice(0, 3)
                .map((r) => `<li><i class="fas fa-check"></i> ${typeof r === 'string' ? r.trim() : r}</li>`)
                .join("")}
          </ul>
          <button class="btn-card-apply" data-job-id="${j.id}">
              Lamar Sekarang
          </button>
      </div>
    `,
    )
    .join("");
  
  // Attach event listeners ke semua job buttons
  document.querySelectorAll(".btn-card-apply").forEach((btn) => {
    btn.addEventListener("click", async function () {
      const jobId = this.getAttribute("data-job-id");
      const jobs = await getJobsFromDB();
      const job = jobs.find((j) => j.id == jobId);
      if (job) {
        openModal(job.title, job.description || job.desc || "");
      }
    });
  });
}

/**
 * Render lowongan di admin panel
 */
async function renderAdminJobs() {
  const jobs = await getJobsFromDB();
  const container = document.getElementById("admin-job-list");
  
  if (!container) return;
  
  container.innerHTML = jobs
    .map(
      (j) => `
      <div class="admin-loker-card">
          <div class="loker-text">
              <strong>${j.title}</strong>
              <span class="loker-rate-text">${j.rate}</span>
          </div>
          <button class="btn-loker-delete" data-job-id="${j.id}" title="Hapus Lowongan">
              <i class="fas fa-trash"></i>
          </button>
      </div>
    `,
    )
    .join("");
  
  // Attach event listeners ke delete buttons
  document.querySelectorAll(".btn-loker-delete").forEach((btn) => {
    btn.addEventListener("click", function () {
      const jobId = this.getAttribute("data-job-id");
      deleteJobAsync(jobId);
    });
  });
}

/**
 * Render tabel pelamar di admin panel
 */
async function refreshTable() {
  const data = await getApplicantsFromDB();
  const tbody = document.getElementById("table-body");
  
  if (!tbody) return;

  tbody.innerHTML = data
    .map(
      (item) => `
      <tr>
          <td>
              <input type="checkbox" class="rowCheckbox" data-id="${item.id}">
          </td>
          <td><strong>${item.name}</strong></td>
          <td>
              <div class="contact-cell">
                  <a href="mailto:${item.email}" class="link-email">
                      <i class="far fa-envelope"></i> ${item.email}
                  </a>
                  <a href="https://wa.me/${item.wa}" target="_blank" class="link-wa">
                      <i class="fab fa-whatsapp"></i> ${item.wa}
                  </a>
              </div>
          </td>
          <td><span class="job-label-tag">${item.job_applied || item.job}</span></td>
          <td>
              <div class="file-cell">
                  <a href="${item.photo_link || item.photo}" target="_blank" class="btn-view-file">
                      <i class="fas fa-image"></i> Foto
                  </a>
                  <a href="${item.portfolio_link || item.porto}" target="_blank" class="btn-view-file porto">
                      <i class="fas fa-video"></i> Porto
                  </a>
              </div>
          </td>
          <td><span class="status-pill stat-${item.status}">${item.status}</span></td>
          <td>
              <div class="action-cell">
                  <button class="btn-action-check" data-applicant-id="${item.id}" data-action="accept" title="Terima">
                      <i class="fas fa-check"></i>
                  </button>
                  <button class="btn-action-reject" data-applicant-id="${item.id}" data-action="reject" title="Tolak">
                      <i class="fas fa-times"></i>
                  </button>
                  <button class="btn-action-delete" data-applicant-id="${item.id}" data-action="delete" title="Hapus">
                      <i class="fas fa-trash-alt"></i>
                  </button>
              </div>
          </td>
      </tr>
    `,
    )
    .join("");

  // Attach event listeners ke action buttons
  setupActionButtonListeners();
  setupCheckboxListeners();
}

/**
 * Setup event listeners untuk action buttons
 */
function setupActionButtonListeners() {
  // Accept buttons
  document.querySelectorAll(".btn-action-check").forEach((btn) => {
    btn.addEventListener("click", function () {
      const id = this.getAttribute("data-applicant-id");
      updateApplicantStatusUI(id, "Accepted");
    });
  });

  // Reject buttons
  document.querySelectorAll(".btn-action-reject").forEach((btn) => {
    btn.addEventListener("click", function () {
      const id = this.getAttribute("data-applicant-id");
      updateApplicantStatusUI(id, "Rejected");
    });
  });

  // Delete buttons
  document.querySelectorAll(".btn-action-delete").forEach((btn) => {
    btn.addEventListener("click", function () {
      const id = this.getAttribute("data-applicant-id");
      deleteApplicantDataUI(id);
    });
  });
}

/**
 * Setup event listeners untuk checkboxes
 */
function setupCheckboxListeners() {
  document.querySelectorAll(".rowCheckbox").forEach((checkbox) => {
    checkbox.addEventListener("change", toggleMassActionMenu);
  });
}

/**
 * Update status pelamar dari UI
 */
async function updateApplicantStatusUI(id, newStatus) {
  try {
    await updateApplicantStatusDB(id, newStatus);
    await refreshTable();
  } catch (error) {
    console.error("Error updating status:", error);
    alert("Gagal mengupdate status pelamar!");
  }
}

/**
 * Hapus data pelamar dari UI
 */
async function deleteApplicantDataUI(id) {
  if (confirm("Hapus permanen data pelamar ini?")) {
    try {
      await deleteApplicantFromDB(id);
      await refreshTable();
    } catch (error) {
      console.error("Error deleting applicant:", error);
      alert("Gagal menghapus data pelamar!");
    }
  }
}

/**
 * Hapus lowongan async
 */
async function deleteJobAsync(id) {
  if (confirm("Hapus lowongan ini dari halaman utama?")) {
    await deleteJobFromDB(id);
    await renderAdminJobs();
    await renderFrontJobs();
  }
}

/**
 * Buka modal aplikasi
 */
function openModal(jobTitle, jobDesc) {
  const targetJobText = document.getElementById("targetJobText");
  const targetJobHidden = document.getElementById("target-job-hidden");
  const jobDescription = document.getElementById("jobDescription");
  const applyModal = document.getElementById("applyModal");

  if (targetJobText) targetJobText.innerText = jobTitle;
  if (targetJobHidden) targetJobHidden.value = jobTitle;
  if (jobDescription) jobDescription.innerText = jobDesc || "Deskripsi tidak tersedia.";
  if (applyModal) applyModal.style.display = "flex";
}

/**
 * Tutup modal aplikasi
 */
function closeModal() {
  const applyModal = document.getElementById("applyModal");
  if (applyModal) applyModal.style.display = "none";
}

/**
 * Toggle select all checkboxes
 */
function toggleSelectAll() {
  const selectAllCb = document.getElementById("selectAll");
  const checkboxes = document.querySelectorAll(".rowCheckbox");
  checkboxes.forEach((cb) => (cb.checked = selectAllCb.checked));
  toggleMassActionMenu();
}

/**
 * Toggle mass action menu visibility
 */
function toggleMassActionMenu() {
  const checkboxes = document.querySelectorAll(".rowCheckbox:checked");
  const menu = document.getElementById("massActions");
  if (menu) {
    menu.style.display = checkboxes.length > 0 ? "flex" : "none";
  }
}

/**
 * Bulk action untuk pelamar terpilih
 */
async function bulkAction(actionType) {
  const selectedCheckboxes = document.querySelectorAll(".rowCheckbox:checked");

  if (selectedCheckboxes.length === 0) return;

  const confirmMsg = `Apakah Anda yakin ingin melakukan aksi "${actionType}" ke ${selectedCheckboxes.length} pelamar?`;

  if (confirm(confirmMsg)) {
    const selectedIds = Array.from(selectedCheckboxes).map((cb) =>
      parseInt(cb.getAttribute("data-id")),
    );

    try {
      if (actionType === "Delete") {
        await bulkDeleteFromDB(selectedIds);
      } else {
        await bulkUpdateStatusDB(selectedIds, actionType);
      }

      await refreshTable();

      const selectAllCb = document.getElementById("selectAll");
      if (selectAllCb) selectAllCb.checked = false;
      toggleMassActionMenu();

      alert(
        `Aksi "${actionType}" berhasil dilakukan ke ${selectedIds.length} pelamar!`,
      );
    } catch (error) {
      console.error("Error bulk action:", error);
      alert("Gagal melakukan aksi bulk!");
    }
  }
}

/**
 * Login admin
 */
async function accessAdmin() {
  const pass = prompt("Masukkan Password Admin:");
  if (pass === "123") {
    const mainSite = document.getElementById("main-site");
    const adminDashboard = document.getElementById("admin-dashboard");

    if (mainSite) mainSite.style.display = "none";
    if (adminDashboard) adminDashboard.style.display = "block";

    await renderAdminJobs();
    await refreshTable();
  } else {
    alert("Password Salah!");
  }
}

/**
 * Logout dari admin
 */
function logout() {
  location.reload();
}

/**
 * Setup navigation toggle
 */
function setupNavToggle() {
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", function () {
      navLinks.classList.toggle("active");
    });

    document.addEventListener("click", function (event) {
      if (
        !event.target.closest("nav") &&
        navLinks.classList.contains("active")
      ) {
        navLinks.classList.remove("active");
      }
    });
  }
}

/**
 * Setup scroll button
 */
function setupScrollButton() {
  const scrollBtn = document.querySelector(".hero-btns .btn-main");
  if (scrollBtn) {
    scrollBtn.addEventListener("click", function () {
      const jobsSection = document.getElementById("jobs");
      if (jobsSection) {
        jobsSection.scrollIntoView({ behavior: "smooth" });
      }
    });
  }
}

/**
 * Setup keyboard shortcuts
 */
function setupKeyboardShortcuts() {
  document.addEventListener("keydown", function (e) {
    // Shift + A untuk login admin
    if (e.shiftKey && e.key === "A") {
      accessAdmin();
    }
  });
}

/**
 * Setup form submissions
 */
function setupFormSubmissions() {
  // Form tambah lowongan
  const lokerForm = document.getElementById("lokerForm");
  if (lokerForm) {
    lokerForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      const jobData = {
        title: document.getElementById("job-title").value,
        rate: document.getElementById("job-rate").value,
        requirements: document.getElementById("job-req").value,
        description: document.getElementById("job-desc").value,
      };

      if (!jobData.title || !jobData.rate || !jobData.requirements) {
        alert("Harap isi semua field lowongan!");
        return;
      }

      try {
        await addJobToDB(jobData);
        this.reset();
        await renderAdminJobs();
        await renderFrontJobs();
        alert("Lowongan Berhasil Dipublikasikan!");
      } catch (error) {
        console.error("Error saat menambah lowongan:", error);
        alert("Gagal menambah lowongan!");
      }
    });
  }

  // Form aplikasi casting
  const castingForm = document.getElementById("castingForm");
  if (castingForm) {
    castingForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      const name = document.getElementById("form-name").value.trim();
      const email = document.getElementById("form-email").value.trim();
      const wa = document.getElementById("form-wa").value.trim();
      const job = document.getElementById("target-job-hidden").value.trim();
      const photo = document.getElementById("form-photo").value.trim();
      const portfolio = document.getElementById("form-portfolio").value.trim();

      if (!name || !email || !wa || !job || !photo || !portfolio) {
        alert("Harap isi semua field!");
        return;
      }

      try {
        const applicantData = {
          name: name,
          email: email,
          wa: wa,
          job: job,
          photo: photo,
          portfolio: portfolio,
        };

        const result = await addApplicantToDB(applicantData);

        if (result) {
          alert("Lamaran berhasil terkirim ke JBTB Casting!");
          document.getElementById("castingForm").reset();
          closeModal();
          await refreshTable();
        } else {
          alert("Gagal mengirim lamaran, coba lagi!");
        }
      } catch (error) {
        console.error("Error saat submit aplikasi:", error);
        alert("Terjadi kesalahan saat mengirim lamaran!");
      }
    });
  }
}

/**
 * Setup admin link
 */
function setupAdminLink() {
  const adminLink = document.querySelector(".admin-link");
  if (adminLink) {
    adminLink.addEventListener("click", function (e) {
      e.preventDefault();
      accessAdmin();
    });
  }
}

/**
 * Setup select all checkbox listener
 */
function setupSelectAllListener() {
  const selectAllCb = document.getElementById("selectAll");
  if (selectAllCb) {
    selectAllCb.addEventListener("change", toggleSelectAll);
  }
}

/**
 * Setup mass action buttons
 */
function setupMassActionButtons() {
  const actionButtons = document.querySelectorAll(
    ".btn-mass-action",
  );
  
  actionButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      if (this.classList.contains("btn-mass-accept")) {
        bulkAction("Accepted");
      } else if (this.classList.contains("btn-mass-reject")) {
        bulkAction("Rejected");
      } else if (this.classList.contains("btn-mass-delete")) {
        bulkAction("Delete");
      }
    });
  });
}

/**
 * Setup logout button
 */
function setupLogoutButton() {
  const logoutBtn = document.querySelector(".btn-logout-admin");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", logout);
  }
}

/**
 * Setup close modal button
 */
function setupCloseModalButton() {
  const closeBtn = document.querySelector(".btn-cancel-modal");
  if (closeBtn) {
    closeBtn.addEventListener("click", closeModal);
  }
}

/**
 * Initialize semua event handlers dan logic saat DOM ready
 */
function initializeApp() {
  // Initialize default data jika belum ada
  initializeDefaultData();

  // Setup semua event listeners
  setupNavToggle();
  setupScrollButton();
  setupKeyboardShortcuts();
  setupFormSubmissions();
  setupAdminLink();
  setupSelectAllListener();
  setupMassActionButtons();
  setupLogoutButton();
  setupCloseModalButton();

  // Render halaman utama
  renderFrontJobs();
}

/**
 * Jalankan app saat DOM sudah siap
 */
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeApp);
} else {
  initializeApp();
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
