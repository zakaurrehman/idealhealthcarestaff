"use client";

import { useState } from "react";
import {
  Job,
  Application,
  FacilityInquiry,
  ApplicationStatus,
  FacilityInquiryStatus,
  StaffUser,
  StaffPermissions,
  AdminSession
} from "@/types";
import { DataLayerStatus } from "@/lib/db";
import {
  adminCreateJob,
  adminSetJobStatus,
  adminSetApplicationStatus,
  adminSetInquiryStatus,
  adminImportCsvJobs,
  adminLogout,
  adminCreateStaffUser,
  adminUpdateStaffPermissions,
  adminToggleStaffActive,
  adminResetStaffPassword,
  adminDeleteStaffUser
} from "@/app/actions/admin";
import { DEPARTMENTS, SPECIALTIES, US_STATES, EMPLOYMENT_TYPES, FACILITY_TYPES } from "@/lib/constants";
import {
  LayoutDashboard,
  Briefcase,
  Users,
  Building2,
  Upload,
  LogOut,
  Plus,
  Search,
  Filter,
  Download,
  CheckCircle2,
  AlertCircle,
  FileText,
  Clock,
  Sparkles,
  ExternalLink,
  Eye,
  X,
  Shield,
  KeyRound,
  UserCheck,
  UserX,
  ShieldAlert
} from "lucide-react";
import Link from "next/link";

interface AdminDashboardClientProps {
  session: AdminSession;
  initialJobs: Job[];
  initialApplications: Application[];
  initialInquiries: FacilityInquiry[];
  initialStaffUsers?: StaffUser[];
  dataLayerStatus?: DataLayerStatus;
}

export default function AdminDashboardClient({
  session,
  initialJobs,
  initialApplications,
  initialInquiries,
  initialStaffUsers = [],
  dataLayerStatus,
}: AdminDashboardClientProps) {
  const isSuperAdmin = session.role === "super_admin";
  const canViewDashboard = isSuperAdmin || Boolean(session.permissions?.dashboard);
  const canViewJobs = isSuperAdmin || Boolean(session.permissions?.jobs?.view);
  const canCreateJobs = isSuperAdmin || Boolean(session.permissions?.jobs?.create);
  const canEditJobs = isSuperAdmin || Boolean(session.permissions?.jobs?.edit);
  const canDeleteJobs = isSuperAdmin || Boolean(session.permissions?.jobs?.delete);
  const canViewApplications = isSuperAdmin || Boolean(session.permissions?.applications?.view);
  const canEditApplications = isSuperAdmin || Boolean(session.permissions?.applications?.edit);
  const canDeleteApplications = isSuperAdmin || Boolean(session.permissions?.applications?.delete);
  const canViewFacilities = isSuperAdmin || Boolean(session.permissions?.facilities?.view);
  const canEditFacilities = isSuperAdmin || Boolean(session.permissions?.facilities?.edit);
  const canDeleteFacilities = isSuperAdmin || Boolean(session.permissions?.facilities?.delete);
  const canImportCsv = isSuperAdmin;
  const canManageStaff = isSuperAdmin;

  const defaultTab = canViewDashboard
    ? "overview"
    : canViewJobs
    ? "jobs"
    : canViewApplications
    ? "applications"
    : canViewFacilities
    ? "facilities"
    : "overview";

  const [activeTab, setActiveTab] = useState<"overview" | "jobs" | "applications" | "facilities" | "import" | "staff">(defaultTab);
  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const [applications, setApplications] = useState<Application[]>(initialApplications);
  const [inquiries, setInquiries] = useState<FacilityInquiry[]>(initialInquiries);
  const [staffUsers, setStaffUsers] = useState<StaffUser[]>(initialStaffUsers);

  // Job form modal state
  const [createJobModalOpen, setCreateJobModalOpen] = useState(false);
  const [jobFormSubmitting, setJobFormSubmitting] = useState(false);
  const [jobFormError, setJobFormError] = useState<string | null>(null);

  // Staff Modals State
  const [addStaffModalOpen, setAddStaffModalOpen] = useState(false);
  const [editPermissionsStaff, setEditPermissionsStaff] = useState<StaffUser | null>(null);
  const [resetPasswordStaff, setResetPasswordStaff] = useState<StaffUser | null>(null);
  const [staffFormSubmitting, setStaffFormSubmitting] = useState(false);
  const [staffFormError, setStaffFormError] = useState<string | null>(null);

  // New Staff Form State
  const [newStaffName, setNewStaffName] = useState("");
  const [newStaffEmail, setNewStaffEmail] = useState("");
  const [newStaffPassword, setNewStaffPassword] = useState("");
  const [newStaffPermissions, setNewStaffPermissions] = useState<StaffPermissions>({
    dashboard: true,
    jobs: { view: true, create: false, edit: false, delete: false },
    applications: { view: true, edit: true, delete: false },
    facilities: { view: true, edit: false, delete: false },
  });

  // Edit Permissions Form State
  const [editingPermissions, setEditingPermissions] = useState<StaffPermissions | null>(null);

  // Reset Password Form State
  const [newPasswordVal, setNewPasswordVal] = useState("");

  // Search & Filter States
  const [jobSearch, setJobSearch] = useState("");
  const [jobStatusFilter, setJobStatusFilter] = useState("all");

  const [appSearch, setAppSearch] = useState("");
  const [appStatusFilter, setAppStatusFilter] = useState("all");

  const [inqSearch, setInqSearch] = useState("");
  const [inqStatusFilter, setInqStatusFilter] = useState("all");

  // CSV Import State
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvParsedRows, setCsvParsedRows] = useState<any[]>([]);
  const [csvImporting, setCsvImporting] = useState(false);
  const [csvReport, setCsvReport] = useState<{ imported: number; failed: number; errors: string[] } | null>(null);

  // Status message
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  // Job Creation Handler
  const handleCreateJob = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setJobFormSubmitting(true);
    setJobFormError(null);

    const formData = new FormData(e.currentTarget);
    const res = await adminCreateJob(formData);

    setJobFormSubmitting(false);
    if (!res.success) {
      setJobFormError(res.error || "Failed to create job.");
    } else if (res.job) {
      setJobs([res.job, ...jobs]);
      setCreateJobModalOpen(false);
      if (res.isPersisted) {
        showNotification(`Job position "${res.job.title}" saved to PostgreSQL database.`);
      } else {
        showNotification(`Job position "${res.job.title}" created in session memory.`);
      }
    }
  };

  // Job Status Change Handler
  const handleJobStatusChange = async (id: string, status: "draft" | "published" | "closed") => {
    const res = await adminSetJobStatus(id, status);
    if (res.success) {
      setJobs(jobs.map(j => j.id === id ? { ...j, status } : j));
      showNotification(`Job status updated to ${status}.`);
    } else {
      alert("Error: " + res.error);
    }
  };

  // Application Status Change Handler
  const handleAppStatusChange = async (id: string, status: ApplicationStatus) => {
    const res = await adminSetApplicationStatus(id, status);
    if (res.success) {
      setApplications(applications.map(a => a.id === id ? { ...a, status } : a));
      showNotification(`Application status updated to ${status}.`);
    } else {
      alert("Error: " + res.error);
    }
  };

  // Facility Inquiry Status Change Handler
  const handleInquiryStatusChange = async (id: string, status: FacilityInquiryStatus) => {
    const res = await adminSetInquiryStatus(id, status);
    if (res.success) {
      setInquiries(inquiries.map(i => i.id === id ? { ...i, status } : i));
      showNotification(`Facility order status updated to ${status}.`);
    } else {
      alert("Error: " + res.error);
    }
  };

  // CSV Parse Handler
  const handleCsvFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCsvReport(null);
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCsvFile(file);

      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        if (!text) return;

        const lines = text.split(/\r?\n/).filter(line => line.trim() !== "");
        if (lines.length <= 1) {
          alert("The uploaded CSV is empty or has only headers.");
          return;
        }

        const headers = lines[0].split(",").map(h => h.trim().toLowerCase().replace(/['"]/g, ""));
        const rows = lines.slice(1).map(line => {
          const values = line.split(",").map(v => v.trim().replace(/^["']|["']$/g, ""));
          const rowObj: any = {};
          headers.forEach((h, idx) => {
            rowObj[h] = values[idx] || "";
          });
          return rowObj;
        });

        setCsvParsedRows(rows);
      };
      reader.readAsText(file);
    }
  };

  // CSV Import Submit
  const handleExecuteImport = async () => {
    if (csvParsedRows.length === 0) return;
    setCsvImporting(true);
    setCsvReport(null);

    const res = await adminImportCsvJobs(csvParsedRows);
    setCsvImporting(false);
    setCsvReport(res);

    if (res.imported > 0) {
      showNotification(`Import complete. ${res.imported} jobs created.`);
      window.location.reload();
    }
  };

  // CSV Exports
  const exportApplicationsCsv = () => {
    const headers = ["ID", "Candidate Name", "Email", "Phone", "Specialty", "Experience", "License State", "Status", "Created At"];
    const rows = applications.map(a => [
      a.id,
      `"${a.fullName}"`,
      `"${a.email}"`,
      `"${a.phone}"`,
      `"${a.specialty}"`,
      `"${a.yearsOfExperience}"`,
      `"${a.primaryLicenseState || ""}"`,
      `"${a.status}"`,
      `"${a.createdAt}"`,
    ]);
    const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    downloadCsv(csvContent, `IHS_Applications_Export_${new Date().toISOString().slice(0, 10)}.csv`);
  };

  const exportInquiriesCsv = () => {
    const headers = ["ID", "Facility Name", "Contact", "Email", "Phone", "Location", "Facility Type", "Staffing Need", "Status", "Created At"];
    const rows = inquiries.map(i => [
      i.id,
      `"${i.facilityName}"`,
      `"${i.contactName}"`,
      `"${i.email}"`,
      `"${i.phone}"`,
      `"${i.city}, ${i.state}"`,
      `"${i.facilityType}"`,
      `"${i.staffingNeeds}"`,
      `"${i.status}"`,
      `"${i.createdAt}"`,
    ]);
    const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    downloadCsv(csvContent, `IHS_Facility_Leads_Export_${new Date().toISOString().slice(0, 10)}.csv`);
  };

  const downloadCsv = (content: string, filename: string) => {
    const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered Jobs
  const filteredJobs = jobs.filter(j => {
    const matchesSearch = !jobSearch || j.title.toLowerCase().includes(jobSearch.toLowerCase()) || j.specialty.toLowerCase().includes(jobSearch.toLowerCase());
    const matchesStatus = jobStatusFilter === "all" || j.status === jobStatusFilter;
    return matchesSearch && matchesStatus;
  });

  // Filtered Applications
  const filteredApps = applications.filter(a => {
    const matchesSearch = !appSearch || a.fullName.toLowerCase().includes(appSearch.toLowerCase()) || a.specialty.toLowerCase().includes(appSearch.toLowerCase());
    const matchesStatus = appStatusFilter === "all" || a.status === appStatusFilter;
    return matchesSearch && matchesStatus;
  });

  // Filtered Inquiries
  const filteredInquiries = inquiries.filter(i => {
    const matchesSearch = !inqSearch || i.facilityName.toLowerCase().includes(inqSearch.toLowerCase()) || i.contactName.toLowerCase().includes(inqSearch.toLowerCase());
    const matchesStatus = inqStatusFilter === "all" || i.status === inqStatusFilter;
    return matchesSearch && matchesStatus;
  });

  // ====================================================================
  // STAFF MANAGEMENT HANDLERS
  // ====================================================================

  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    setStaffFormSubmitting(true);
    setStaffFormError(null);

    const res = await adminCreateStaffUser({
      name: newStaffName,
      email: newStaffEmail,
      password: newStaffPassword,
      permissions: newStaffPermissions,
    });

    setStaffFormSubmitting(false);
    if (!res.success) {
      setStaffFormError(res.error || "Failed to create staff account.");
    } else if (res.staff) {
      setStaffUsers([res.staff, ...staffUsers]);
      setAddStaffModalOpen(false);
      setNewStaffName("");
      setNewStaffEmail("");
      setNewStaffPassword("");
      setNewStaffPermissions({
        dashboard: true,
        jobs: { view: true, create: false, edit: false, delete: false },
        applications: { view: true, edit: true, delete: false },
        facilities: { view: true, edit: false, delete: false },
      });
      showNotification(`Staff member ${res.staff.name} created successfully.`);
    }
  };

  const handleSaveStaffPermissions = async () => {
    if (!editPermissionsStaff || !editingPermissions) return;
    setStaffFormSubmitting(true);
    setStaffFormError(null);

    const res = await adminUpdateStaffPermissions(editPermissionsStaff.id, editingPermissions);
    setStaffFormSubmitting(false);

    if (!res.success) {
      setStaffFormError(res.error || "Failed to update permissions.");
    } else if (res.staff) {
      setStaffUsers(staffUsers.map(s => s.id === editPermissionsStaff.id ? res.staff! : s));
      setEditPermissionsStaff(null);
      showNotification(`Permissions updated for ${res.staff.name}.`);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetPasswordStaff) return;
    setStaffFormSubmitting(true);
    setStaffFormError(null);

    const res = await adminResetStaffPassword(resetPasswordStaff.id, newPasswordVal);
    setStaffFormSubmitting(false);

    if (!res.success) {
      setStaffFormError(res.error || "Failed to reset password.");
    } else {
      setResetPasswordStaff(null);
      setNewPasswordVal("");
      showNotification(`Password updated for ${resetPasswordStaff.name}.`);
    }
  };

  const displayName = session.name && session.name !== "Super Administrator" ? session.name : null;
  const NAV_TABS = [
    { id: "overview" as const, label: "Overview", icon: LayoutDashboard, show: canViewDashboard },
    { id: "staff" as const, label: "Staff", count: staffUsers.length, icon: Shield, show: canManageStaff },
    { id: "jobs" as const, label: "Jobs", count: jobs.length, icon: Briefcase, show: canViewJobs },
    { id: "applications" as const, label: "Applications", count: applications.length, icon: Users, show: canViewApplications },
    { id: "facilities" as const, label: "Facility orders", count: inquiries.length, icon: Building2, show: canViewFacilities },
    { id: "import" as const, label: "CSV import", icon: Upload, show: canImportCsv },
  ].filter((t) => t.show);

  return (
    <div className="min-h-screen bg-canvas pb-16 text-ink">
      {/* ── Portal header (spruce panel, matches the public site) ── */}
      <section className="px-3 pt-3 sm:px-4">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-spruce text-white">
          <div className="absolute inset-0 bg-dots-light" aria-hidden />
          <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-teal-400/15 blur-[100px]" aria-hidden />
          <div className="relative flex flex-col gap-6 px-6 py-8 sm:px-10 sm:py-10 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="eyebrow eyebrow-on-dark">Staffing operations portal</p>
              <h1 className="mt-4 font-display text-[2rem] font-medium leading-tight text-white sm:text-[2.5rem]">
                Welcome back{displayName ? `, ${displayName.split(" ")[0]}` : ""}.
              </h1>
              <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-spruce-50/70">
                {isSuperAdmin ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-coral-400/15 px-3 py-1 text-xs font-semibold text-coral-200 ring-1 ring-inset ring-coral-300/30">
                    <Shield className="h-3.5 w-3.5" aria-hidden />
                    Super Admin
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-400/15 px-3 py-1 text-xs font-semibold text-teal-200 ring-1 ring-inset ring-teal-300/30">
                    <Users className="h-3.5 w-3.5" aria-hidden />
                    Staff Admin
                  </span>
                )}
                <span>
                  Signed in as <span className="font-medium text-white">{session.email}</span>
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <Link href="/" target="_blank" className="btn-on-dark btn-sm">
                View public site
                <ExternalLink className="h-3.5 w-3.5" aria-hidden />
              </Link>
              <button
                onClick={async () => {
                  await adminLogout();
                  window.location.reload();
                }}
                className="btn-light btn-sm"
              >
                <LogOut className="h-3.5 w-3.5" aria-hidden />
                Log out
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Notification Toast */}
      {notification && (
        <div
          role="status"
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-2xl border border-white/10 bg-spruce px-5 py-3.5 text-sm text-white shadow-float animate-fade-in-up"
        >
          <CheckCircle2 className="h-4 w-4 text-teal-300" aria-hidden />
          <span>{notification}</span>
        </div>
      )}

      {/* ── Section navigation: pill tabs ── */}
      <div className="sticky top-[5.5rem] z-30 mx-auto mt-6 max-w-7xl px-4 sm:px-8">
        <nav
          aria-label="Admin sections"
          className="no-scrollbar flex gap-1 overflow-x-auto rounded-full border border-line bg-surface/90 p-1.5 shadow-soft backdrop-blur-xl"
        >
          {NAV_TABS.map(({ id, label, count, icon: Icon }) => {
            const active = activeTab === id;
            return (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                aria-current={active ? "page" : undefined}
                className={`flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full px-4 py-2.5 text-sm font-medium transition-colors ${
                  active ? "bg-brand text-brand-on shadow-sm" : "text-ink-2 hover:bg-surface-2 hover:text-ink"
                }`}
              >
                <Icon className="h-4 w-4" aria-hidden />
                {label}
                {typeof count === "number" && (
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                      active ? "bg-white/20 text-brand-on" : "bg-surface-2 text-ink-3"
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>


      {/* Main Tab Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">

        {/* ==================================================================== */}
        {/* TAB 1: OVERVIEW DASHBOARD */}
        {/* ==================================================================== */}
        {activeTab === "overview" && canViewDashboard && (
          <div className="space-y-8">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  label: "Active jobs",
                  value: jobs.filter((j) => j.status === "published").length,
                  note: `${jobs.length} total postings`,
                  icon: Briefcase,
                  tone: "bg-brand-soft text-brand-ink",
                },
                {
                  label: "Applications",
                  value: applications.length,
                  note: `${applications.filter((a) => a.status === "new").length} awaiting review`,
                  icon: Users,
                  tone: "bg-accent-soft text-accent-ink",
                },
                {
                  label: "Facility inquiries",
                  value: inquiries.length,
                  note: `${inquiries.filter((i) => i.status === "new").length} new leads`,
                  icon: Building2,
                  tone: "bg-brand-soft text-brand-ink",
                },
              ].map(({ label, value, note, icon: Icon, tone }) => (
                <div key={label} className="rounded-[1.5rem] border border-line bg-surface p-6 shadow-soft">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-ink-3">{label}</span>
                    <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${tone}`}>
                      <Icon className="h-5 w-5" aria-hidden />
                    </span>
                  </div>
                  <p className="mt-4 font-display text-5xl font-medium tracking-tight text-ink">{value}</p>
                  <p className="mt-2 text-sm text-ink-3">{note}</p>
                </div>
              ))}

              {/* Data layer status */}
              <div className="rounded-[1.5rem] border border-line bg-surface p-6 shadow-soft">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-ink-3">Data storage</span>
                  <span
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                      dataLayerStatus?.mode === "database"
                        ? "bg-brand-soft text-brand-ink"
                        : "bg-amber-50 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300"
                    }`}
                  >
                    <Sparkles className="h-5 w-5" aria-hidden />
                  </span>
                </div>
                <p className="mt-4 flex items-center gap-2 font-display text-xl font-medium text-ink">
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${
                      dataLayerStatus?.mode === "database" ? "bg-brand-bright" : "bg-amber-500"
                    }`}
                  />
                  {dataLayerStatus?.mode === "database" ? "Live database" : "Temporary memory"}
                </p>
                <p className="mt-2 text-sm text-ink-3">
                  {dataLayerStatus?.mode === "database"
                    ? "Connected to Supabase"
                    : "Configure Supabase so data is saved"}
                </p>
              </div>
            </div>

            {/* Quick Actions Panel */}
            <div className="rounded-[1.5rem] border border-line bg-surface p-6 shadow-soft sm:p-8">
              <h2 className="mb-5 font-display text-xl font-medium text-ink">Quick actions</h2>
              <div className="flex flex-wrap gap-3">
                {canCreateJobs && (
                  <button
                    onClick={() => {
                      setActiveTab("jobs");
                      setCreateJobModalOpen(true);
                    }}
                    className="btn-accent btn-sm"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Post New Job Opening</span>
                  </button>
                )}
                {canViewApplications && (
                  <button
                    onClick={() => setActiveTab("applications")}
                    className="btn-secondary btn-sm"
                  >
                    <Users className="w-4 h-4 text-ink-3" />
                    <span>Review Pending Candidate Files</span>
                  </button>
                )}
                {canViewFacilities && (
                  <button
                    onClick={() => setActiveTab("facilities")}
                    className="btn-secondary btn-sm"
                  >
                    <Building2 className="w-4 h-4 text-ink-3" />
                    <span>Manage Facility Contracts</span>
                  </button>
                )}
                {canManageStaff && (
                  <button
                    onClick={() => setActiveTab("staff")}
                    className="btn-secondary btn-sm"
                  >
                    <Shield className="w-4 h-4 text-purple-500" />
                    <span>Manage Staff Accounts</span>
                  </button>
                )}
                {canImportCsv && (
                  <button
                    onClick={() => setActiveTab("import")}
                    className="btn-secondary btn-sm"
                  >
                    <Upload className="w-4 h-4 text-ink-3" />
                    <span>Batch CSV Import</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB: STAFF MANAGEMENT (SUPER ADMIN ONLY) */}
        {/* ==================================================================== */}
        {activeTab === "staff" && canManageStaff && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-medium text-ink font-display">Staff Administration & Permissions</h2>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                    Super Admin Console
                  </span>
                </div>
                <p className="text-xs text-ink-3 mt-1">
                  Authorize recruitment coordinators, assign granular module permissions, and manage account statuses.
                </p>
              </div>
              <button
                onClick={() => {
                  setStaffFormError(null);
                  setAddStaffModalOpen(true);
                }}
                className="btn-accent text-xs px-4 py-2.5 flex items-center gap-1.5 font-bold shadow-md rounded-xl cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Staff Member</span>
              </button>
            </div>

            {/* Staff Table */}
            <div className="bg-surface rounded-2xl border border-line overflow-hidden shadow-sm">
              <table className="w-full text-left text-xs">
                <thead className="bg-surface-2 border-b border-line text-ink-2 uppercase tracking-wider font-bold">
                  <tr>
                    <th className="py-3.5 px-5">Staff Member</th>
                    <th className="py-3.5 px-5">Role</th>
                    <th className="py-3.5 px-5">Status</th>
                    <th className="py-3.5 px-5">Permitted Modules</th>
                    <th className="py-3.5 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line text-ink-2">
                  {staffUsers.map((s) => (
                    <tr key={s.id} className="hover:bg-surface-2 transition-colors">
                      <td className="py-4 px-5">
                        <div className="font-bold text-ink text-sm">{s.name}</div>
                        <div className="text-ink-3 text-xs font-mono">{s.email}</div>
                        <div className="text-[10px] text-ink-3 mt-0.5">Added: {new Date(s.createdAt).toLocaleDateString()}</div>
                      </td>
                      <td className="py-4 px-5">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                          <Users className="w-3 h-3 text-blue-500" />
                          Staff Admin
                        </span>
                      </td>
                      <td className="py-4 px-5">
                        {s.isActive ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-brand-soft text-brand-ink border border-brand/25">
                            <span className="w-1.5 h-1.5 rounded-full bg-brand-bright" />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                            Deactivated
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-5">
                        <div className="flex flex-wrap gap-1.5 max-w-sm">
                          {s.permissions?.dashboard && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-surface-2 text-ink-2 border border-line">
                              Dashboard
                            </span>
                          )}
                          {s.permissions?.jobs?.view && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                              Jobs ({[
                                s.permissions.jobs.view && "View",
                                s.permissions.jobs.create && "Create",
                                s.permissions.jobs.edit && "Edit",
                                s.permissions.jobs.delete && "Delete"
                              ].filter(Boolean).join(", ")})
                            </span>
                          )}
                          {s.permissions?.applications?.view && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-brand-soft text-brand-ink border border-brand/25">
                              Applications ({[
                                s.permissions.applications.view && "View",
                                s.permissions.applications.edit && "Edit",
                                s.permissions.applications.delete && "Delete"
                              ].filter(Boolean).join(", ")})
                            </span>
                          )}
                          {s.permissions?.facilities?.view && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-50 text-sky-800 border border-sky-200">
                              Facilities ({[
                                s.permissions.facilities.view && "View",
                                s.permissions.facilities.edit && "Edit",
                                s.permissions.facilities.delete && "Delete"
                              ].filter(Boolean).join(", ")})
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setStaffFormError(null);
                              setEditPermissionsStaff(s);
                              setEditingPermissions({ ...s.permissions });
                            }}
                            className="px-2.5 py-1.5 rounded-lg border border-line bg-surface hover:bg-surface-2 text-ink-2 text-xs font-semibold cursor-pointer shadow-sm"
                            title="Edit Permissions"
                          >
                            Permissions
                          </button>
                          <button
                            onClick={() => {
                              setStaffFormError(null);
                              setResetPasswordStaff(s);
                              setNewPasswordVal("");
                            }}
                            className="px-2.5 py-1.5 rounded-lg border border-line bg-surface hover:bg-surface-2 text-ink-2 text-xs font-semibold cursor-pointer shadow-sm"
                            title="Reset Staff Password"
                          >
                            Password
                          </button>
                          <button
                            onClick={async () => {
                              const newActive = !s.isActive;
                              const res = await adminToggleStaffActive(s.id, newActive);
                              if (res.success && res.staff) {
                                setStaffUsers(staffUsers.map(u => u.id === s.id ? res.staff! : u));
                                showNotification(`Account for ${s.name} ${newActive ? 'activated' : 'deactivated'}.`);
                              }
                            }}
                            className={`px-2.5 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer transition-colors shadow-sm ${
                              s.isActive
                                ? "border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100"
                                : "border-brand/25 bg-brand-soft text-brand-ink hover:bg-brand-soft"
                            }`}
                          >
                            {s.isActive ? "Deactivate" : "Activate"}
                          </button>
                          <button
                            onClick={async () => {
                              if (confirm(`Remove staff coordinator account for ${s.name}?`)) {
                                const res = await adminDeleteStaffUser(s.id);
                                if (res.success) {
                                setStaffUsers(staffUsers.filter(u => u.id !== s.id));
                                showNotification(`Staff member ${s.name} removed.`);
                              }
                              }
                            }}
                            className="p-1.5 rounded-lg border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs cursor-pointer"
                            title="Delete staff account"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {staffUsers.length === 0 && (
                <div className="p-10 text-center text-xs text-ink-3">
                  No staff members created yet. Click &quot;Add Staff Member&quot; to authorize a coordinator.
                </div>
              )}
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 2: JOBS MANAGEMENT */}
        {/* ==================================================================== */}
        {activeTab === "jobs" && canViewJobs && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-xl font-bold text-ink">Active Job Postings</h2>
                <p className="text-xs text-ink-3">Publish, unpublish, close, and manage hospital assignments.</p>
              </div>
              {canCreateJobs && (
                <button
                  onClick={() => setCreateJobModalOpen(true)}
                  className="btn-accent btn-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create New Job</span>
                </button>
              )}
            </div>

            {/* Filter controls */}
            <div className="bg-surface p-4 rounded-lg border border-line flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 text-ink-3 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter jobs by title or specialty..."
                  value={jobSearch}
                  onChange={(e) => setJobSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs rounded border border-line-strong bg-transparent focus:outline-none focus:ring-1 focus:ring-brand/30"
                />
              </div>

              <select
                value={jobStatusFilter}
                onChange={(e) => setJobStatusFilter(e.target.value)}
                className="text-xs px-3 py-1.5 rounded border border-line-strong bg-surface"
              >
                <option value="all">All Statuses</option>
                <option value="published">Published Only</option>
                <option value="draft">Drafts Only</option>
                <option value="closed">Closed Only</option>
              </select>
            </div>

            {/* Jobs Table */}
            <div className="bg-surface rounded-lg border border-line overflow-hidden shadow-sm">
              <table className="w-full text-left text-xs text-ink-2">
                <thead className="bg-surface-2 border-b border-line text-ink-3 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="py-3 px-4">Title & Specialty</th>
                    <th className="py-3 px-4">Location</th>
                    <th className="py-3 px-4">Contract / Shift</th>
                    <th className="py-3 px-4">Pay Range</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {filteredJobs.map((j) => (
                    <tr key={j.id} className="hover:bg-surface-2">
                      <td className="py-3.5 px-4">
                        <Link href={`/jobs/${j.slug}`} target="_blank" className="font-bold text-ink hover:text-brand-ink">
                          {j.title}
                        </Link>
                        <div className="text-[11px] text-ink-3">{j.department} • {j.specialty}</div>
                      </td>
                      <td className="py-3.5 px-4 font-medium">
                        {j.locationCity}, {j.locationState}
                      </td>
                      <td className="py-3.5 px-4">
                        <div>{j.employmentType}</div>
                        <div className="text-[11px] text-ink-3">{j.shift}</div>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-ink">
                        {j.payRange || "Standard"}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          j.status === "published" ? "bg-brand-soft text-brand-ink border border-brand/25" :
                          j.status === "draft" ? "bg-surface-2 text-ink-2 border border-line" :
                          "bg-rose-50 text-rose-800 border border-rose-200"
                        }`}>
                          {j.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {canEditJobs ? (
                          <select
                            value={j.status}
                            onChange={(e) => handleJobStatusChange(j.id, e.target.value as any)}
                            className="text-xs px-2 py-1 rounded border border-line-strong bg-surface font-medium cursor-pointer"
                          >
                            <option value="draft">Draft</option>
                            <option value="published">Published</option>
                            <option value="closed">Closed</option>
                          </select>
                        ) : (
                          <span className="text-[11px] text-ink-3 italic">View only</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredJobs.length === 0 && (
                <div className="p-8 text-center text-xs text-ink-3">
                  No jobs match your filter criteria.
                </div>
              )}
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 3: CANDIDATE APPLICATIONS */}
        {/* ==================================================================== */}
        {activeTab === "applications" && canViewApplications && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-xl font-bold text-ink">Candidate Applications</h2>
                <p className="text-xs text-ink-3">Submissions from nurses and allied health clinicians.</p>
              </div>

              <button
                onClick={exportApplicationsCsv}
                className="btn-secondary text-xs px-3.5 py-2 flex items-center gap-1.5 font-medium cursor-pointer"
              >
                <Download className="w-4 h-4 text-ink-3" />
                <span>Export Applications (CSV)</span>
              </button>
            </div>

            {/* Filter controls */}
            <div className="bg-surface p-4 rounded-lg border border-line flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 text-ink-3 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter by clinician name or specialty..."
                  value={appSearch}
                  onChange={(e) => setAppSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs rounded border border-line-strong bg-transparent focus:outline-none focus:ring-1 focus:ring-brand/30"
                />
              </div>

              <select
                value={appStatusFilter}
                onChange={(e) => setAppStatusFilter(e.target.value)}
                className="text-xs px-3 py-1.5 rounded border border-line-strong bg-surface"
              >
                <option value="all">All Application Statuses</option>
                <option value="new">New Submissions</option>
                <option value="reviewed">Under Clinical Review</option>
                <option value="contacted">Contacted</option>
                <option value="screening">Screening</option>
                <option value="placed">Successfully Placed</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            {/* Applications Table */}
            <div className="bg-surface rounded-lg border border-line overflow-hidden shadow-sm">
              <table className="w-full text-left text-xs text-ink-2">
                <thead className="bg-surface-2 border-b border-line text-ink-3 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="py-3 px-4">Clinician Candidate</th>
                    <th className="py-3 px-4">Specialty & Experience</th>
                    <th className="py-3 px-4">License State</th>
                    <th className="py-3 px-4">Submitted Date</th>
                    <th className="py-3 px-4">Review Status</th>
                    <th className="py-3 px-4 text-right">Workflow</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {filteredApps.map((a) => (
                    <tr key={a.id} className="hover:bg-surface-2">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-ink">{a.fullName}</div>
                        <div className="text-[11px] text-ink-3">{a.email} • {a.phone}</div>
                        {a.resumeUrl && (
                          <a
                            href={a.resumeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] text-brand-ink hover:underline mt-1"
                          >
                            <FileText className="w-3 h-3" />
                            <span>View Resume Document</span>
                          </a>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-ink">{a.specialty}</div>
                        <div className="text-[11px] text-ink-3">{a.yearsOfExperience.replace(/\s*years?$/i, "")} years experience</div>
                      </td>
                      <td className="py-3.5 px-4 font-medium">
                        {a.primaryLicenseState || "Not Specified"}
                      </td>
                      <td className="py-3.5 px-4 text-ink-3 text-[11px]">
                        {new Date(a.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          a.status === "new" ? "bg-blue-50 text-blue-800 border border-blue-200" :
                          a.status === "reviewed" ? "bg-amber-50 text-amber-800 border border-amber-200" :
                          a.status === "contacted" ? "bg-purple-50 text-purple-800 border border-purple-200" :
                          a.status === "screening" ? "bg-indigo-50 text-indigo-800 border border-indigo-200" :
                          a.status === "placed" ? "bg-emerald-50 text-emerald-800 border border-emerald-200" :
                          "bg-surface-2 text-ink-2 border border-line"
                        }`}>
                          {a.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {canEditApplications ? (
                          <select
                            value={a.status}
                            onChange={(e) => handleAppStatusChange(a.id, e.target.value as ApplicationStatus)}
                            className="text-xs px-2 py-1 rounded border border-line-strong bg-surface font-medium cursor-pointer"
                          >
                            <option value="new">New</option>
                            <option value="reviewed">Reviewed</option>
                            <option value="contacted">Contacted</option>
                            <option value="screening">Screening</option>
                            <option value="placed">Placed</option>
                            <option value="archived">Archived</option>
                          </select>
                        ) : (
                          <span className="text-[11px] text-ink-3 italic">View only</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredApps.length === 0 && (
                <div className="p-8 text-center text-xs text-ink-3">
                  No applications match your filter criteria.
                </div>
              )}
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 4: FACILITY ORDERS & INQUIRIES */}
        {/* ==================================================================== */}
        {activeTab === "facilities" && canViewFacilities && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-xl font-bold text-ink">Hospital & Facility Staffing Inquiries</h2>
                <p className="text-xs text-ink-3">Contract requests submitted by hospital partners and health systems.</p>
              </div>

              <button
                onClick={exportInquiriesCsv}
                className="btn-secondary text-xs px-3.5 py-2 flex items-center gap-1.5 font-medium cursor-pointer"
              >
                <Download className="w-4 h-4 text-ink-3" />
                <span>Export Facility Inquiries (CSV)</span>
              </button>
            </div>

            {/* Filter controls */}
            <div className="bg-surface p-4 rounded-lg border border-line flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 text-ink-3 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter by facility name or contact person..."
                  value={inqSearch}
                  onChange={(e) => setInqSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs rounded border border-line-strong bg-transparent focus:outline-none focus:ring-1 focus:ring-brand/30"
                />
              </div>

              <select
                value={inqStatusFilter}
                onChange={(e) => setInqStatusFilter(e.target.value)}
                className="text-xs px-3 py-1.5 rounded border border-line-strong bg-surface"
              >
                <option value="all">All Order Statuses</option>
                <option value="new">New Inquiries</option>
                <option value="contacted">Contacted</option>
                <option value="in_discussion">In Discussion</option>
                <option value="agreement_sent">Agreement Sent</option>
                <option value="active_client">Active Client</option>
                <option value="closed">Closed / Fulfilled</option>
              </select>
            </div>

            {/* Inquiries Table */}
            <div className="bg-surface rounded-lg border border-line overflow-hidden shadow-sm">
              <table className="w-full text-left text-xs text-ink-2">
                <thead className="bg-surface-2 border-b border-line text-ink-3 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="py-3 px-4">Hospital / Facility</th>
                    <th className="py-3 px-4">Contact Person</th>
                    <th className="py-3 px-4">Location</th>
                    <th className="py-3 px-4">Requested Specialties</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Workflow</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {filteredInquiries.map((i) => (
                    <tr key={i.id} className="hover:bg-surface-2">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-ink">{i.facilityName}</div>
                        <div className="text-[11px] text-ink-3">{i.facilityType}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-ink">{i.contactName}</div>
                        <div className="text-[11px] text-ink-3">{i.email} • {i.phone}</div>
                      </td>
                      <td className="py-3.5 px-4 font-medium">
                        {i.city}, {i.state}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="max-w-xs truncate text-[11px] text-ink-2">
                          {i.staffingNeeds}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          i.status === "new" ? "bg-blue-50 text-blue-800 border border-blue-200" :
                          i.status === "contacted" ? "bg-purple-50 text-purple-800 border border-purple-200" :
                          i.status === "in_discussion" ? "bg-amber-50 text-amber-800 border border-amber-200" :
                          i.status === "agreement_sent" ? "bg-sky-50 text-sky-800 border border-sky-200" :
                          i.status === "active_client" ? "bg-emerald-50 text-emerald-800 border border-emerald-200" :
                          "bg-surface-2 text-ink-2 border border-line"
                        }`}>
                          {i.status.replace("_", " ")}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {canEditFacilities ? (
                          <select
                            value={i.status}
                            onChange={(e) => handleInquiryStatusChange(i.id, e.target.value as FacilityInquiryStatus)}
                            className="text-xs px-2 py-1 rounded border border-line-strong bg-surface font-medium cursor-pointer"
                          >
                            <option value="new">New</option>
                            <option value="contacted">Contacted</option>
                            <option value="in_discussion">In Discussion</option>
                            <option value="agreement_sent">Agreement Sent</option>
                            <option value="active_client">Active Client</option>
                            <option value="closed">Closed</option>
                          </select>
                        ) : (
                          <span className="text-[11px] text-ink-3 italic">View only</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredInquiries.length === 0 && (
                <div className="p-8 text-center text-xs text-ink-3">
                  No facility inquiries match your filter criteria.
                </div>
              )}
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 5: BATCH CSV JOB IMPORT (SUPER ADMIN ONLY) */}
        {/* ==================================================================== */}
        {activeTab === "import" && canImportCsv && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-ink">Batch CSV Job Import</h2>
              <p className="text-xs text-ink-3">Bulk upload multiple healthcare assignment openings from a standardized spreadsheet.</p>
            </div>

            <div className="bg-surface p-6 sm:p-8 rounded-2xl border border-line space-y-6 shadow-sm">
              <div className="p-4 bg-surface-2 rounded-xl border border-line text-xs text-ink-2 space-y-2">
                <div className="font-bold text-ink flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-brand-ink" />
                  <span>Required CSV Column Headers</span>
                </div>
                <p>Ensure your CSV file contains the following column headers (case-insensitive):</p>
                <div className="font-mono text-[11px] bg-surface p-2.5 rounded border border-line text-ink overflow-x-auto">
                  title, department, specialty, locationCity, locationState, employmentType, shift, payRange, durationWeeks, description
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-ink-2 mb-2">
                  Select CSV File to Upload
                </label>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleCsvFileChange}
                  className="block w-full text-xs text-ink-3 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100 cursor-pointer"
                />
              </div>

              {csvParsedRows.length > 0 && (
                <div className="space-y-4">
                  <div className="text-xs font-semibold text-ink-2">
                    Preview: Found <span className="text-brand-ink font-bold">{csvParsedRows.length}</span> rows ready for import.
                  </div>

                  <div className="max-h-48 overflow-y-auto border border-line rounded-lg text-[11px]">
                    <table className="w-full text-left">
                      <thead className="bg-surface-2 border-b border-line">
                        <tr>
                          <th className="py-2 px-3">Title</th>
                          <th className="py-2 px-3">Specialty</th>
                          <th className="py-2 px-3">City, State</th>
                          <th className="py-2 px-3">Pay Range</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-line">
                        {csvParsedRows.slice(0, 5).map((row, idx) => (
                          <tr key={idx}>
                            <td className="py-2 px-3 font-semibold">{row.title || "-"}</td>
                            <td className="py-2 px-3">{row.specialty || "-"}</td>
                            <td className="py-2 px-3">{row.locationcity || row.locationCity}, {row.locationstate || row.locationState}</td>
                            <td className="py-2 px-3">{row.payrange || row.payRange || "Standard"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <button
                    onClick={handleExecuteImport}
                    disabled={csvImporting}
                    className="btn-accent px-5 py-2.5 text-xs font-semibold cursor-pointer"
                  >
                    {csvImporting ? "Importing Assignments..." : `Execute Import (${csvParsedRows.length} Jobs)`}
                  </button>
                </div>
              )}

              {csvReport && (
                <div className="p-4 bg-surface-2 rounded-xl border border-line text-xs space-y-1">
                  <div className="font-bold text-ink">Import Execution Results:</div>
                  <p className="text-emerald-700 dark:text-emerald-400 font-semibold">
                    Successfully Imported: {csvReport.imported} jobs
                  </p>
                  <p>Skipped / Failed: {csvReport.failed} rows</p>
                  {csvReport.errors.length > 0 && (
                    <ul className="list-disc pl-5 text-rose-700 text-[11px] space-y-1">
                      {csvReport.errors.map((err, i) => (
                        <li key={i}>{err}</li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

      </div>

      {/* ==================================================================== */}
      {/* CREATE JOB MODAL */}
      {/* ==================================================================== */}
      {createJobModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-spruce/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-surface rounded-xl shadow-2xl border border-line max-w-2xl w-full p-6 sm:p-8 my-8 relative">
            <button
              onClick={() => setCreateJobModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-ink-3 hover:text-ink rounded-lg hover:bg-surface-2 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-ink mb-1">Create New Job Posting</h3>
            <p className="text-xs text-ink-3 mb-6">Enter position parameters to publish or save as draft.</p>

            {jobFormError && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded">
                {jobFormError}
              </div>
            )}

            <form onSubmit={handleCreateJob} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-ink-2 mb-1">Job Title *</label>
                <input
                  required
                  type="text"
                  name="title"
                  placeholder="e.g. Registered Nurse - Intensive Care Unit"
                  className="w-full px-3 py-2 text-xs rounded border border-line-strong bg-transparent focus:outline-none focus:ring-1 focus:ring-brand/30"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-ink-2 mb-1">Department</label>
                  <select name="department" defaultValue="Nursing" className="w-full px-3 py-2 text-xs rounded border border-line-strong bg-surface">
                    {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-ink-2 mb-1">Specialty *</label>
                  <select name="specialty" defaultValue={SPECIALTIES[0]} className="w-full px-3 py-2 text-xs rounded border border-line-strong bg-surface">
                    {SPECIALTIES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-ink-2 mb-1">City *</label>
                  <input required type="text" name="locationCity" placeholder="Dallas" className="w-full px-3 py-2 text-xs rounded border border-line-strong bg-transparent" />
                </div>

                <div>
                  <label className="block font-bold text-ink-2 mb-1">State *</label>
                  <select name="locationState" defaultValue="TX" className="w-full px-3 py-2 text-xs rounded border border-line-strong bg-surface">
                    {US_STATES.map(st => <option key={st.code} value={st.code}>{st.name} ({st.code})</option>)}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-ink-2 mb-1">Employment Type</label>
                  <select name="employmentType" defaultValue="Travel Contract" className="w-full px-3 py-2 text-xs rounded border border-line-strong bg-surface">
                    {EMPLOYMENT_TYPES.map(e => <option key={e} value={e}>{e}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-ink-2 mb-1">Shift Schedule</label>
                  <input type="text" name="shift" defaultValue="12-Hour Nights (3x12)" className="w-full px-3 py-2 text-xs rounded border border-line-strong bg-transparent" />
                </div>

                <div>
                  <label className="block font-bold text-ink-2 mb-1">Estimated Compensation</label>
                  <input type="text" name="payRange" placeholder="$2,600 - $3,100 / week" className="w-full px-3 py-2 text-xs rounded border border-line-strong bg-transparent" />
                </div>

                <div>
                  <label className="block font-bold text-ink-2 mb-1">Contract Duration (Weeks)</label>
                  <input type="number" name="durationWeeks" defaultValue={13} className="w-full px-3 py-2 text-xs rounded border border-line-strong bg-transparent" />
                </div>
              </div>

              <div>
                <label className="block font-bold text-ink-2 mb-1">Position Description *</label>
                <textarea required rows={3} name="description" placeholder="Clinical role overview..." className="w-full px-3 py-2 text-xs rounded border border-line-strong bg-transparent" />
              </div>

              <div>
                <label className="block font-bold text-ink-2 mb-1">Responsibilities (One per line)</label>
                <textarea rows={3} name="responsibilities" defaultValue={"Provide acute bedside patient care.\nAdminister medications per protocol.\nCollaborate with hospital clinical staff."} className="w-full px-3 py-2 text-xs rounded border border-line-strong bg-transparent font-mono" />
              </div>

              <div>
                <label className="block font-bold text-ink-2 mb-1">Qualifications (One per line)</label>
                <textarea rows={3} name="qualifications" defaultValue={"Active state or compact nursing license.\nCurrent AHA BLS & ACLS certifications.\nMinimum 2 years bedside hospital experience."} className="w-full px-3 py-2 text-xs rounded border border-line-strong bg-transparent font-mono" />
              </div>

              <div>
                <label className="block font-bold text-ink-2 mb-1">Benefits (One per line)</label>
                <textarea rows={2} name="benefits" defaultValue={"Tax-free travel stipends.\nDay-one medical, dental, and vision insurance."} className="w-full px-3 py-2 text-xs rounded border border-line-strong bg-transparent font-mono" />
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-line">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" name="isUrgent" value="true" className="rounded border-line-strong text-brand-ink" />
                  <span className="font-semibold text-ink-2">Flag as Priority / Urgent Opening</span>
                </label>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setCreateJobModalOpen(false)}
                    className="px-4 py-2 text-xs text-ink-2 hover:bg-surface-2 rounded cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={jobFormSubmitting}
                    className="btn-accent px-5 py-2 text-xs font-semibold cursor-pointer"
                  >
                    {jobFormSubmitting ? "Creating Job..." : "Publish Job Opening"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* ADD STAFF MODAL (SUPER ADMIN ONLY) */}
      {/* ==================================================================== */}
      {addStaffModalOpen && isSuperAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-spruce/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-surface rounded-2xl shadow-2xl border border-line max-w-xl w-full p-6 sm:p-8 my-8 relative">
            <button
              onClick={() => setAddStaffModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-ink-3 hover:text-ink rounded-lg hover:bg-surface-2 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 mb-1">
              <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
                <Shield className="w-4 h-4" />
              </div>
              <h3 className="text-xl font-medium text-ink font-display">Add Staff Member</h3>
            </div>
            <p className="text-xs text-ink-3 mb-6">Create a Staff Administrator login and assign section permissions.</p>

            {staffFormError && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{staffFormError}</span>
              </div>
            )}

            <form onSubmit={handleCreateStaff} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-ink-2 mb-1">Staff Member Full Name *</label>
                <input
                  required
                  type="text"
                  value={newStaffName}
                  onChange={(e) => setNewStaffName(e.target.value)}
                  placeholder="e.g. Sarah Jenkins, RN Coordinator"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-line-strong bg-surface-2 text-ink focus:outline-none focus:ring-1 focus:ring-brand/30"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-ink-2 mb-1">Email Address (Login Username) *</label>
                  <input
                    required
                    type="email"
                    value={newStaffEmail}
                    onChange={(e) => setNewStaffEmail(e.target.value)}
                    placeholder="s.jenkins@idealhealthcarestaffing.com"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-line-strong bg-surface-2 text-ink focus:outline-none focus:ring-1 focus:ring-brand/30"
                  />
                </div>
                <div>
                  <label className="block font-bold text-ink-2 mb-1">Initial Password *</label>
                  <input
                    required
                    type="text"
                    value={newStaffPassword}
                    onChange={(e) => setNewStaffPassword(e.target.value)}
                    placeholder="Min 8 characters"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-line-strong bg-surface-2 text-ink focus:outline-none focus:ring-1 focus:ring-brand/30 font-mono"
                  />
                </div>
              </div>

              {/* Permissions Matrix */}
              <div className="pt-3 border-t border-line">
                <label className="block font-bold text-ink mb-2 uppercase text-[11px] tracking-wider">
                  Module Permissions Matrix
                </label>

                {/* Dashboard Overview */}
                <div className="p-3 rounded-xl bg-surface-2 border border-line mb-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newStaffPermissions.dashboard}
                      onChange={(e) => setNewStaffPermissions({ ...newStaffPermissions, dashboard: e.target.checked })}
                      className="rounded text-brand-ink w-4 h-4"
                    />
                    <div>
                      <span className="font-bold text-ink">Dashboard Overview</span>
                      <p className="text-[10px] text-ink-3">Can view operational KPI summary metrics</p>
                    </div>
                  </label>
                </div>

                {/* Jobs Module */}
                <div className="p-3 rounded-xl bg-surface-2 border border-line mb-3 space-y-2">
                  <span className="font-bold text-ink block">Jobs Management</span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newStaffPermissions.jobs.view}
                        onChange={(e) => setNewStaffPermissions({
                          ...newStaffPermissions,
                          jobs: { ...newStaffPermissions.jobs, view: e.target.checked }
                        })}
                        className="rounded text-brand-ink"
                      />
                      <span>View Jobs</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newStaffPermissions.jobs.create}
                        onChange={(e) => setNewStaffPermissions({
                          ...newStaffPermissions,
                          jobs: { ...newStaffPermissions.jobs, create: e.target.checked }
                        })}
                        className="rounded text-brand-ink"
                      />
                      <span>Create</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newStaffPermissions.jobs.edit}
                        onChange={(e) => setNewStaffPermissions({
                          ...newStaffPermissions,
                          jobs: { ...newStaffPermissions.jobs, edit: e.target.checked }
                        })}
                        className="rounded text-brand-ink"
                      />
                      <span>Edit Status</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newStaffPermissions.jobs.delete}
                        onChange={(e) => setNewStaffPermissions({
                          ...newStaffPermissions,
                          jobs: { ...newStaffPermissions.jobs, delete: e.target.checked }
                        })}
                        className="rounded text-brand-ink"
                      />
                      <span>Delete</span>
                    </label>
                  </div>
                </div>

                {/* Candidate Applications */}
                <div className="p-3 rounded-xl bg-surface-2 border border-line mb-3 space-y-2">
                  <span className="font-bold text-ink block">Candidate Applications</span>
                  <div className="grid grid-cols-3 gap-2">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newStaffPermissions.applications.view}
                        onChange={(e) => setNewStaffPermissions({
                          ...newStaffPermissions,
                          applications: { ...newStaffPermissions.applications, view: e.target.checked }
                        })}
                        className="rounded text-brand-ink"
                      />
                      <span>View Files</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newStaffPermissions.applications.edit}
                        onChange={(e) => setNewStaffPermissions({
                          ...newStaffPermissions,
                          applications: { ...newStaffPermissions.applications, edit: e.target.checked }
                        })}
                        className="rounded text-brand-ink"
                      />
                      <span>Edit Status</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newStaffPermissions.applications.delete}
                        onChange={(e) => setNewStaffPermissions({
                          ...newStaffPermissions,
                          applications: { ...newStaffPermissions.applications, delete: e.target.checked }
                        })}
                        className="rounded text-brand-ink"
                      />
                      <span>Delete</span>
                    </label>
                  </div>
                </div>

                {/* Facility Inquiries */}
                <div className="p-3 rounded-xl bg-surface-2 border border-line mb-3 space-y-2">
                  <span className="font-bold text-ink block">Facility Contracts & Inquiries</span>
                  <div className="grid grid-cols-3 gap-2">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newStaffPermissions.facilities.view}
                        onChange={(e) => setNewStaffPermissions({
                          ...newStaffPermissions,
                          facilities: { ...newStaffPermissions.facilities, view: e.target.checked }
                        })}
                        className="rounded text-brand-ink"
                      />
                      <span>View Orders</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newStaffPermissions.facilities.edit}
                        onChange={(e) => setNewStaffPermissions({
                          ...newStaffPermissions,
                          facilities: { ...newStaffPermissions.facilities, edit: e.target.checked }
                        })}
                        className="rounded text-brand-ink"
                      />
                      <span>Edit Status</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newStaffPermissions.facilities.delete}
                        onChange={(e) => setNewStaffPermissions({
                          ...newStaffPermissions,
                          facilities: { ...newStaffPermissions.facilities, delete: e.target.checked }
                        })}
                        className="rounded text-brand-ink"
                      />
                      <span>Delete</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-line">
                <button
                  type="button"
                  onClick={() => setAddStaffModalOpen(false)}
                  className="px-4 py-2 text-xs text-ink-2 hover:bg-surface-2 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={staffFormSubmitting}
                  className="btn-accent px-5 py-2 text-xs font-bold rounded-xl cursor-pointer shadow-md"
                >
                  {staffFormSubmitting ? "Creating Staff Account..." : "Create Staff Account"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* EDIT STAFF PERMISSIONS MODAL (SUPER ADMIN ONLY) */}
      {/* ==================================================================== */}
      {editPermissionsStaff && editingPermissions && isSuperAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-spruce/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-surface rounded-2xl shadow-2xl border border-line max-w-xl w-full p-6 sm:p-8 my-8 relative">
            <button
              onClick={() => setEditPermissionsStaff(null)}
              className="absolute top-4 right-4 p-1.5 text-ink-3 hover:text-ink rounded-lg hover:bg-surface-2 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 mb-1">
              <div className="w-8 h-8 rounded-lg bg-brand-soft text-brand-ink flex items-center justify-center">
                <KeyRound className="w-4 h-4" />
              </div>
              <h3 className="text-xl font-medium text-ink font-display">
                Permissions: {editPermissionsStaff.name}
              </h3>
            </div>
            <p className="text-xs text-ink-3 mb-6 font-mono">{editPermissionsStaff.email}</p>

            {staffFormError && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{staffFormError}</span>
              </div>
            )}

            <div className="space-y-4 text-xs">
              {/* Dashboard */}
              <div className="p-3 rounded-xl bg-surface-2 border border-line">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingPermissions.dashboard}
                    onChange={(e) => setEditingPermissions({ ...editingPermissions, dashboard: e.target.checked })}
                    className="rounded text-brand-ink w-4 h-4"
                  />
                  <div>
                    <span className="font-bold text-ink">Dashboard Overview</span>
                    <p className="text-[10px] text-ink-3">Access to high-level operational counts</p>
                  </div>
                </label>
              </div>

              {/* Jobs */}
              <div className="p-3 rounded-xl bg-surface-2 border border-line space-y-2">
                <span className="font-bold text-ink block">Jobs Management</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingPermissions.jobs.view}
                      onChange={(e) => setEditingPermissions({
                        ...editingPermissions,
                        jobs: { ...editingPermissions.jobs, view: e.target.checked }
                      })}
                      className="rounded text-brand-ink"
                    />
                    <span>View Jobs</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingPermissions.jobs.create}
                      onChange={(e) => setEditingPermissions({
                        ...editingPermissions,
                        jobs: { ...editingPermissions.jobs, create: e.target.checked }
                      })}
                      className="rounded text-brand-ink"
                    />
                    <span>Create</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingPermissions.jobs.edit}
                      onChange={(e) => setEditingPermissions({
                        ...editingPermissions,
                        jobs: { ...editingPermissions.jobs, edit: e.target.checked }
                      })}
                      className="rounded text-brand-ink"
                    />
                    <span>Edit Status</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingPermissions.jobs.delete}
                      onChange={(e) => setEditingPermissions({
                        ...editingPermissions,
                        jobs: { ...editingPermissions.jobs, delete: e.target.checked }
                      })}
                      className="rounded text-brand-ink"
                    />
                    <span>Delete</span>
                  </label>
                </div>
              </div>

              {/* Applications */}
              <div className="p-3 rounded-xl bg-surface-2 border border-line space-y-2">
                <span className="font-bold text-ink block">Candidate Applications</span>
                <div className="grid grid-cols-3 gap-2">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingPermissions.applications.view}
                      onChange={(e) => setEditingPermissions({
                        ...editingPermissions,
                        applications: { ...editingPermissions.applications, view: e.target.checked }
                      })}
                      className="rounded text-brand-ink"
                    />
                    <span>View Files</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingPermissions.applications.edit}
                      onChange={(e) => setEditingPermissions({
                        ...editingPermissions,
                        applications: { ...editingPermissions.applications, edit: e.target.checked }
                      })}
                      className="rounded text-brand-ink"
                    />
                    <span>Edit Status</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingPermissions.applications.delete}
                      onChange={(e) => setEditingPermissions({
                        ...editingPermissions,
                        applications: { ...editingPermissions.applications, delete: e.target.checked }
                      })}
                      className="rounded text-brand-ink"
                    />
                    <span>Delete</span>
                  </label>
                </div>
              </div>

              {/* Facilities */}
              <div className="p-3 rounded-xl bg-surface-2 border border-line space-y-2">
                <span className="font-bold text-ink block">Facility Contracts & Inquiries</span>
                <div className="grid grid-cols-3 gap-2">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingPermissions.facilities.view}
                      onChange={(e) => setEditingPermissions({
                        ...editingPermissions,
                        facilities: { ...editingPermissions.facilities, view: e.target.checked }
                      })}
                      className="rounded text-brand-ink"
                    />
                    <span>View Orders</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingPermissions.facilities.edit}
                      onChange={(e) => setEditingPermissions({
                        ...editingPermissions,
                        facilities: { ...editingPermissions.facilities, edit: e.target.checked }
                      })}
                      className="rounded text-brand-ink"
                    />
                    <span>Edit Status</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingPermissions.facilities.delete}
                      onChange={(e) => setEditingPermissions({
                        ...editingPermissions,
                        facilities: { ...editingPermissions.facilities, delete: e.target.checked }
                      })}
                      className="rounded text-brand-ink"
                    />
                    <span>Delete</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-line">
                <button
                  type="button"
                  onClick={() => setEditPermissionsStaff(null)}
                  className="px-4 py-2 text-xs text-ink-2 hover:bg-surface-2 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveStaffPermissions}
                  disabled={staffFormSubmitting}
                  className="btn-accent px-5 py-2 text-xs font-bold rounded-xl cursor-pointer shadow-md"
                >
                  {staffFormSubmitting ? "Saving Permissions..." : "Save Permissions"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* RESET STAFF PASSWORD MODAL (SUPER ADMIN ONLY) */}
      {/* ==================================================================== */}
      {resetPasswordStaff && isSuperAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-spruce/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-surface rounded-2xl shadow-2xl border border-line max-w-md w-full p-6 sm:p-8 my-8 relative">
            <button
              onClick={() => setResetPasswordStaff(null)}
              className="absolute top-4 right-4 p-1.5 text-ink-3 hover:text-ink rounded-lg hover:bg-surface-2 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 mb-1">
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                <KeyRound className="w-4 h-4" />
              </div>
              <h3 className="text-xl font-medium text-ink font-display">
                Reset Staff Password
              </h3>
            </div>
            <p className="text-xs text-ink-3 mb-6">
              Assign a new password for <strong className="text-ink">{resetPasswordStaff.name}</strong> ({resetPasswordStaff.email}).
            </p>

            {staffFormError && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{staffFormError}</span>
              </div>
            )}

            <form onSubmit={handleResetPassword} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-ink-2 mb-1">New Password (Min 8 characters) *</label>
                <input
                  required
                  type="text"
                  value={newPasswordVal}
                  onChange={(e) => setNewPasswordVal(e.target.value)}
                  placeholder="Enter new password..."
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-line-strong bg-surface-2 text-ink focus:outline-none focus:ring-1 focus:ring-brand/30 font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-line">
                <button
                  type="button"
                  onClick={() => setResetPasswordStaff(null)}
                  className="px-4 py-2 text-xs text-ink-2 hover:bg-surface-2 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={staffFormSubmitting}
                  className="btn-accent px-5 py-2 text-xs font-bold rounded-xl cursor-pointer shadow-md"
                >
                  {staffFormSubmitting ? "Updating Password..." : "Update Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
