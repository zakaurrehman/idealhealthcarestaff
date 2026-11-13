"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { RotateCcw, Search, SlidersHorizontal, X } from "lucide-react";
import { US_STATES, DEPARTMENTS, SPECIALTIES, EMPLOYMENT_TYPES } from "@/lib/constants";

export default function JobFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [department, setDepartment] = useState(searchParams.get("department") || "all");
  const [specialty, setSpecialty] = useState(searchParams.get("specialty") || "all");
  const [state, setState] = useState(searchParams.get("state") || "all");
  const [employmentType, setEmploymentType] = useState(searchParams.get("employmentType") || "all");
  const [sortBy, setSortBy] = useState(searchParams.get("sortBy") || "newest");

  // Apply filters by pushing query params to URL
  const applyFilters = (overrides?: {
    search?: string;
    department?: string;
    specialty?: string;
    state?: string;
    employmentType?: string;
    sortBy?: string;
  }) => {
    const params = new URLSearchParams();

    const currentSearch = overrides?.search !== undefined ? overrides.search : search;
    const currentDept = overrides?.department !== undefined ? overrides.department : department;
    const currentSpec = overrides?.specialty !== undefined ? overrides.specialty : specialty;
    const currentState = overrides?.state !== undefined ? overrides.state : state;
    const currentEmp = overrides?.employmentType !== undefined ? overrides.employmentType : employmentType;
    const currentSort = overrides?.sortBy !== undefined ? overrides.sortBy : sortBy;

    if (currentSearch.trim()) params.set("search", currentSearch.trim());
    if (currentDept && currentDept !== "all") params.set("department", currentDept);
    if (currentSpec && currentSpec !== "all") params.set("specialty", currentSpec);
    if (currentState && currentState !== "all") params.set("state", currentState);
    if (currentEmp && currentEmp !== "all") params.set("employmentType", currentEmp);
    if (currentSort && currentSort !== "newest") params.set("sortBy", currentSort);

    router.push(`/jobs?${params.toString()}`, { scroll: false });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters();
  };

  const handleDepartmentTab = (dept: string) => {
    setDepartment(dept);
    applyFilters({ department: dept });
  };

  const handleReset = () => {
    setSearch("");
    setDepartment("all");
    setSpecialty("all");
    setState("all");
    setEmploymentType("all");
    setSortBy("newest");
    router.push("/jobs", { scroll: false });
  };

  const removeFilter = (key: "search" | "department" | "specialty" | "state" | "employmentType") => {
    if (key === "search") {
      setSearch("");
      applyFilters({ search: "" });
    } else if (key === "department") {
      setDepartment("all");
      applyFilters({ department: "all" });
    } else if (key === "specialty") {
      setSpecialty("all");
      applyFilters({ specialty: "all" });
    } else if (key === "state") {
      setState("all");
      applyFilters({ state: "all" });
    } else if (key === "employmentType") {
      setEmploymentType("all");
      applyFilters({ employmentType: "all" });
    }
  };

  const hasActiveFilters = Boolean(
    search.trim() ||
      (department && department !== "all") ||
      (specialty && specialty !== "all") ||
      (state && state !== "all") ||
      (employmentType && employmentType !== "all") ||
      (sortBy && sortBy !== "newest")
  );

  const activeChips: { key: "search" | "department" | "specialty" | "state" | "employmentType"; label: string }[] = [];
  if (search.trim()) activeChips.push({ key: "search", label: `“${search.trim()}”` });
  if (department !== "all") activeChips.push({ key: "department", label: department });
  if (specialty !== "all") activeChips.push({ key: "specialty", label: specialty });
  if (state !== "all") activeChips.push({ key: "state", label: `State: ${state}` });
  if (employmentType !== "all") activeChips.push({ key: "employmentType", label: employmentType });

  const tabClass = (active: boolean) =>
    `shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
      active ? "bg-ink text-canvas" : "bg-surface-2 text-ink-2 hover:bg-line hover:text-ink"
    }`;

  return (
    <div className="mb-8 rounded-[1.75rem] border border-line bg-surface p-5 shadow-soft sm:p-6">
      {/* Discipline tabs */}
      <div className="-mx-1 overflow-x-auto px-1 pb-1 no-scrollbar" role="group" aria-label="Filter by discipline">
        <div className="flex min-w-max items-center gap-2">
          <button
            type="button"
            onClick={() => handleDepartmentTab("all")}
            aria-pressed={department === "all"}
            className={tabClass(department === "all")}
          >
            All disciplines
          </button>
          {DEPARTMENTS.map((dept) => (
            <button
              key={dept}
              type="button"
              onClick={() => handleDepartmentTab(dept)}
              aria-pressed={department === dept}
              className={tabClass(department === dept)}
            >
              {dept}
            </button>
          ))}
        </div>
      </div>

      {/* Keyword search */}
      <form onSubmit={handleSearchSubmit} role="search" className="mt-5 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <label htmlFor="job-search" className="sr-only">
            Search by role, specialty, or city
          </label>
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-3" aria-hidden />
          <input
            id="job-search"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by role, specialty, or city — e.g. ICU RN, Dallas"
            className="field-input pl-11 pr-10"
          />
          {search && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                applyFilters({ search: "" });
              }}
              className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-ink-3 hover:bg-surface-2 hover:text-ink"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex gap-3">
          <button type="submit" className="btn-accent flex-1 sm:flex-none sm:rounded-xl">
            Search jobs
          </button>
          <button
            type="button"
            onClick={() => setMobileOpen((o) => !o)}
            aria-expanded={mobileOpen}
            aria-controls="job-filter-panel"
            className="btn-secondary sm:hidden"
          >
            <SlidersHorizontal className="h-4 w-4" aria-hidden />
            Filters{activeChips.length > 0 && ` (${activeChips.length})`}
          </button>
        </div>
      </form>

      {/* Detailed filters */}
      <div
        id="job-filter-panel"
        className={`mt-5 border-t border-line pt-5 ${mobileOpen ? "block" : "hidden sm:block"}`}
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label htmlFor="f-specialty" className="field-label">
              Clinical specialty
            </label>
            <select
              id="f-specialty"
              value={specialty}
              onChange={(e) => {
                setSpecialty(e.target.value);
                applyFilters({ specialty: e.target.value });
              }}
              className="field-input py-2.5 text-sm"
            >
              <option value="all">All specialties</option>
              {SPECIALTIES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="f-state" className="field-label">
              US state
            </label>
            <select
              id="f-state"
              value={state}
              onChange={(e) => {
                setState(e.target.value);
                applyFilters({ state: e.target.value });
              }}
              className="field-input py-2.5 text-sm"
            >
              <option value="all">All states (nationwide)</option>
              {US_STATES.map((st) => (
                <option key={st.code} value={st.code}>
                  {st.name} ({st.code})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="f-type" className="field-label">
              Contract type
            </label>
            <select
              id="f-type"
              value={employmentType}
              onChange={(e) => {
                setEmploymentType(e.target.value);
                applyFilters({ employmentType: e.target.value });
              }}
              className="field-input py-2.5 text-sm"
            >
              <option value="all">All contract types</option>
              {EMPLOYMENT_TYPES.map((emp) => (
                <option key={emp} value={emp}>
                  {emp}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="f-sort" className="field-label">
              Sort by
            </label>
            <select
              id="f-sort"
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                applyFilters({ sortBy: e.target.value });
              }}
              className="field-input py-2.5 text-sm"
            >
              <option value="newest">Most recent postings</option>
              <option value="pay">Highest weekly pay</option>
            </select>
          </div>
        </div>

        {hasActiveFilters && (
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4 text-sm">
            <ul className="flex flex-wrap items-center gap-2" aria-label="Active filters">
              {activeChips.map((chip) => (
                <li key={chip.key}>
                  <button
                    type="button"
                    onClick={() => removeFilter(chip.key)}
                    className="inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-3 py-1.5 font-medium text-brand-ink transition-colors hover:bg-brand/15"
                    aria-label={`Remove filter ${chip.label}`}
                  >
                    {chip.label}
                    <X className="h-3.5 w-3.5" aria-hidden />
                  </button>
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={handleReset}
              className="ml-auto inline-flex items-center gap-1.5 font-semibold text-ink-2 transition-colors hover:text-ink"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden />
              Reset all
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
