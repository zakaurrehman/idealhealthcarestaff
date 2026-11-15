"use client";

import { useCallback, useState } from "react";
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
import { CalendarDays, DollarSign, Mail, MapPin, UserPlus, UserRound, Zap } from "lucide-react";
import Link from "next/link";
import {
  AdminModal,
  BulletListField,
  Field,
  FormError,
  FormSection,
  IconInput,
  JobPreview,
  PasswordField,
  PermissionsEditor,
  Segmented,
  Switch,
  type JobPreviewData,
} from "./AdminFormKit";

const EMPTY_JOB_PREVIEW: JobPreviewData = {
  title: "",
  department: "Nursing",
  specialty: SPECIALTIES[0],
  city: "",
  state: "TX",
  employmentType: "Travel Contract",
  shift: "12-Hour Nights (3x12)",
  durationWeeks: "13",
  payRange: "",
  description: "",
  isUrgent: false,
  status: "published",
};

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
  // Live preview for the Create Job dialog (reads the uncontrolled form)
  const [jobPreview, setJobPreview] = useState<JobPreviewData>(EMPTY_JOB_PREVIEW);
  const updateJobPreview = (form: HTMLFormElement) => {
    const fd = new FormData(form);
    const s = (k: string) => String(fd.get(k) ?? "");
    setJobPreview({
      title: s("title"),
      department: s("department"),
      specialty: s("specialty"),
      city: s("locationCity"),
      state: s("locationState"),
      employmentType: s("employmentType"),
      shift: s("shift"),
      durationWeeks: s("durationWeeks"),
      payRange: s("payRange"),
      description: s("description"),
      isUrgent: fd.get("isUrgent") === "true",
      status: s("status") || "published",
    });
  };
  const closeCreateJob = useCallback(() => {
    setCreateJobModalOpen(false);
    setJobPreview(EMPTY_JOB_PREVIEW);
  }, []);

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
      closeCreateJob();
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
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-3" />
                <input
                  type="text"
                  placeholder="Filter jobs by title or specialty..."
                  value={jobSearch}
                  onChange={(e) => setJobSearch(e.target.value)}
                  className="field-input py-2.5 pl-10 text-sm"
                />
              </div>

              <select
                value={jobStatusFilter}
                onChange={(e) => setJobStatusFilter(e.target.value)}
                className="field-input w-auto py-2.5 text-sm"
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
                            className="field-input w-auto cursor-pointer rounded-full py-1.5 pl-3 pr-9 text-xs font-medium"
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
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-3" />
                <input
                  type="text"
                  placeholder="Filter by clinician name or specialty..."
                  value={appSearch}
                  onChange={(e) => setAppSearch(e.target.value)}
                  className="field-input py-2.5 pl-10 text-sm"
                />
              </div>

              <select
                value={appStatusFilter}
                onChange={(e) => setAppStatusFilter(e.target.value)}
                className="field-input w-auto py-2.5 text-sm"
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
                            className="field-input w-auto cursor-pointer rounded-full py-1.5 pl-3 pr-9 text-xs font-medium"
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
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-3" />
                <input
                  type="text"
                  placeholder="Filter by facility name or contact person..."
                  value={inqSearch}
                  onChange={(e) => setInqSearch(e.target.value)}
                  className="field-input py-2.5 pl-10 text-sm"
                />
              </div>

              <select
                value={inqStatusFilter}
                onChange={(e) => setInqStatusFilter(e.target.value)}
                className="field-input w-auto py-2.5 text-sm"
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
                            className="field-input w-auto cursor-pointer rounded-full py-1.5 pl-3 pr-9 text-xs font-medium"
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
                  className="block w-full text-xs text-ink-3 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-brand-soft file:text-brand-ink hover:file:bg-brand-soft/70 cursor-pointer"
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
      {/* CREATE JOB MODAL — sectioned form + live public preview */}
      {/* ==================================================================== */}
      <AdminModal
        open={createJobModalOpen}
        onClose={closeCreateJob}
        size="xl"
        icon={Briefcase}
        title="Create a job posting"
        description="Fill in the details — the preview shows exactly how it will look on the website."
        footer={
          <>
            <button type="button" onClick={closeCreateJob} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" form="create-job-form" disabled={jobFormSubmitting} className="btn-accent">
              {jobFormSubmitting ? "Saving…" : "Save job posting"}
            </button>
          </>
        }
      >
        <div className="grid lg:grid-cols-12">
          <form
            id="create-job-form"
            onSubmit={handleCreateJob}
            onChange={(e) => updateJobPreview(e.currentTarget)}
            className="space-y-10 px-6 py-7 sm:px-8 lg:col-span-7 lg:border-r lg:border-line"
          >
            <FormError message={jobFormError} />

            <FormSection step={1} title="Role basics" description="What the position is and where it sits.">
              <Field label="Job title" htmlFor="job-title" required>
                <input
                  id="job-title"
                  required
                  type="text"
                  name="title"
                  placeholder="e.g. Registered Nurse – Intensive Care Unit"
                  className="field-input"
                />
              </Field>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Department" htmlFor="job-department">
                  <select id="job-department" name="department" defaultValue="Nursing" className="field-input">
                    {DEPARTMENTS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Specialty" htmlFor="job-specialty" required>
                  <select id="job-specialty" name="specialty" defaultValue={SPECIALTIES[0]} className="field-input">
                    {SPECIALTIES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>
            </FormSection>

            <FormSection step={2} title="Location & schedule" description="Where and when the clinician will work.">
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="City" htmlFor="job-city" required>
                  <IconInput icon={MapPin} id="job-city" required type="text" name="locationCity" placeholder="Dallas" />
                </Field>
                <Field label="State" htmlFor="job-state" required>
                  <select id="job-state" name="locationState" defaultValue="TX" className="field-input">
                    {US_STATES.map((st) => (
                      <option key={st.code} value={st.code}>
                        {st.name} ({st.code})
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Employment type" htmlFor="job-type">
                  <select id="job-type" name="employmentType" defaultValue="Travel Contract" className="field-input">
                    {EMPLOYMENT_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Shift schedule" htmlFor="job-shift">
                  <IconInput icon={Clock} id="job-shift" type="text" name="shift" defaultValue="12-Hour Nights (3x12)" />
                </Field>
              </div>
            </FormSection>

            <FormSection step={3} title="Compensation & duration">
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Estimated pay" htmlFor="job-pay" hint="Shown on the job card, e.g. $2,600 – $3,100 / week">
                  <IconInput icon={DollarSign} id="job-pay" type="text" name="payRange" placeholder="$2,600 - $3,100 / week" />
                </Field>
                <Field label="Contract length (weeks)" htmlFor="job-weeks">
                  <IconInput icon={CalendarDays} id="job-weeks" type="number" min={1} name="durationWeeks" defaultValue={13} />
                </Field>
              </div>
            </FormSection>

            <FormSection step={4} title="Role details" description="Press Enter in a list to add the next item.">
              <Field label="Position description" htmlFor="job-description" required>
                <textarea
                  id="job-description"
                  required
                  rows={4}
                  name="description"
                  placeholder="A short overview of the unit, facility and what makes this role a great fit…"
                  className="field-input resize-y"
                />
              </Field>
              <BulletListField
                name="responsibilities"
                label="Responsibilities"
                addLabel="Add responsibility"
                placeholder="e.g. Provide acute bedside patient care"
                defaultItems={[
                  "Provide acute bedside patient care.",
                  "Administer medications per protocol.",
                  "Collaborate with hospital clinical staff.",
                ]}
              />
              <BulletListField
                name="qualifications"
                label="Qualifications"
                addLabel="Add qualification"
                placeholder="e.g. Current AHA BLS & ACLS"
                defaultItems={[
                  "Active state or compact nursing license.",
                  "Current AHA BLS & ACLS certifications.",
                  "Minimum 2 years bedside hospital experience.",
                ]}
              />
              <BulletListField
                name="benefits"
                label="Benefits"
                addLabel="Add benefit"
                placeholder="e.g. Day-one medical coverage"
                defaultItems={["Tax-free travel stipends.", "Day-one medical, dental, and vision insurance."]}
              />
            </FormSection>

            <FormSection step={5} title="Publishing">
              <Segmented
                name="status"
                defaultValue="published"
                options={[
                  { value: "published", label: "Publish now", hint: "Visible on the website immediately" },
                  { value: "draft", label: "Save as draft", hint: "Hidden until you publish it" },
                ]}
              />
              <Switch
                name="isUrgent"
                value="true"
                icon={Zap}
                label="Priority opening"
                description="Adds a “Priority need” badge to the job card"
              />
            </FormSection>
          </form>

          {/* Live preview */}
          <aside className="hidden bg-surface-2/50 px-6 py-7 sm:px-8 lg:col-span-5 lg:block">
            <div className="sticky top-0">
              <p className="eyebrow">Live preview</p>
              <p className="mt-2 text-sm text-ink-3">How the card will appear on the jobs page.</p>
              <div className="mt-5">
                <JobPreview data={jobPreview} />
              </div>
              <p className="mt-4 flex items-center gap-2 text-xs text-ink-3">
                <span
                  className={`h-2 w-2 rounded-full ${jobPreview.status === "draft" ? "bg-amber-500" : "bg-brand-bright"}`}
                />
                {jobPreview.status === "draft" ? "Will be saved as a draft (not public)" : "Will be published immediately"}
              </p>
            </div>
          </aside>
        </div>
      </AdminModal>

      {/* ==================================================================== */}
      {/* ADD STAFF MODAL (SUPER ADMIN ONLY) */}
      {/* ==================================================================== */}
      <AdminModal
        open={addStaffModalOpen && isSuperAdmin}
        onClose={() => setAddStaffModalOpen(false)}
        size="lg"
        icon={UserPlus}
        tone="accent"
        title="Add a staff member"
        description="Create a Staff Admin login and choose exactly what they can access."
        footer={
          <>
            <button type="button" onClick={() => setAddStaffModalOpen(false)} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" form="add-staff-form" disabled={staffFormSubmitting} className="btn-accent">
              {staffFormSubmitting ? "Creating account…" : "Create staff account"}
            </button>
          </>
        }
      >
        <form id="add-staff-form" onSubmit={handleCreateStaff} className="space-y-10 px-6 py-7 sm:px-8">
          <FormError message={staffFormError} />
          <FormSection step={1} title="Account details" description="They will sign in with this email and password.">
            <Field label="Full name" htmlFor="staff-name" required>
              <IconInput
                icon={UserRound}
                id="staff-name"
                required
                type="text"
                value={newStaffName}
                onChange={(e) => setNewStaffName(e.target.value)}
                placeholder="e.g. Sarah Jenkins"
                autoComplete="off"
              />
            </Field>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Email address" htmlFor="staff-email" required hint="Used as their login username">
                <IconInput
                  icon={Mail}
                  id="staff-email"
                  required
                  type="email"
                  value={newStaffEmail}
                  onChange={(e) => setNewStaffEmail(e.target.value)}
                  placeholder="name@company.com"
                  autoComplete="off"
                />
              </Field>
              <Field label="Initial password" htmlFor="staff-password" required hint="Share it securely; they can be reset anytime">
                <PasswordField id="staff-password" value={newStaffPassword} onChange={setNewStaffPassword} />
              </Field>
            </div>
          </FormSection>
          <FormSection step={2} title="Permissions" description="Tap to switch each action on or off.">
            <PermissionsEditor value={newStaffPermissions} onChange={setNewStaffPermissions} />
          </FormSection>
        </form>
      </AdminModal>

      {/* ==================================================================== */}
      {/* EDIT STAFF PERMISSIONS MODAL (SUPER ADMIN ONLY) */}
      {/* ==================================================================== */}
      <AdminModal
        open={Boolean(editPermissionsStaff && editingPermissions && isSuperAdmin)}
        onClose={() => setEditPermissionsStaff(null)}
        size="lg"
        icon={KeyRound}
        title={`Permissions · ${editPermissionsStaff?.name ?? ""}`}
        description={editPermissionsStaff?.email}
        footer={
          <>
            <button type="button" onClick={() => setEditPermissionsStaff(null)} className="btn-secondary">
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveStaffPermissions}
              disabled={staffFormSubmitting}
              className="btn-accent"
            >
              {staffFormSubmitting ? "Saving…" : "Save permissions"}
            </button>
          </>
        }
      >
        <div className="space-y-6 px-6 py-7 sm:px-8">
          <FormError message={staffFormError} />
          {editingPermissions && <PermissionsEditor value={editingPermissions} onChange={setEditingPermissions} />}
        </div>
      </AdminModal>

      {/* ==================================================================== */}
      {/* RESET STAFF PASSWORD MODAL (SUPER ADMIN ONLY) */}
      {/* ==================================================================== */}
      <AdminModal
        open={Boolean(resetPasswordStaff && isSuperAdmin)}
        onClose={() => setResetPasswordStaff(null)}
        size="sm"
        icon={KeyRound}
        tone="amber"
        title="Reset password"
        description={
          resetPasswordStaff ? (
            <>
              Set a new password for <strong className="font-semibold text-ink">{resetPasswordStaff.name}</strong>.
            </>
          ) : undefined
        }
        footer={
          <>
            <button type="button" onClick={() => setResetPasswordStaff(null)} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" form="reset-password-form" disabled={staffFormSubmitting} className="btn-accent">
              {staffFormSubmitting ? "Updating…" : "Update password"}
            </button>
          </>
        }
      >
        <form id="reset-password-form" onSubmit={handleResetPassword} className="space-y-5 px-6 py-7 sm:px-8">
          <FormError message={staffFormError} />
          <Field label="New password" htmlFor="reset-password" required hint={resetPasswordStaff?.email}>
            <PasswordField id="reset-password" value={newPasswordVal} onChange={setNewPasswordVal} />
          </Field>
        </form>
      </AdminModal>

    </div>
  );
}
