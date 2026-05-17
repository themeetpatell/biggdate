import Link from "next/link";
import { sql } from "@/lib/db";
import { AdminLiveFeed } from "./AdminLiveFeed";
import { InactiveUsersPanel } from "./InactiveUsersPanel";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface KpiRow {
  signups_today: string;
  dau: string;
  wau: string;
  mau: string;
  total_profiles: string;
}

interface FunnelRow {
  intros_7d: string;
  connected_7d: string;
  passes_7d: string;
  debriefs_7d: string;
}

interface CohortRow {
  signup_day: string;
  cohort_size: string;
  d0: string;
  d1: string;
  d7: string;
  d14: string;
  d30: string;
}

interface RecentSignupRow {
  user_id: string;
  name: string | null;
  city: string | null;
  gender: string | null;
  age: number | null;
  occurred_at: string;
}

interface FunnelStepRow {
  signups: string;
  onboarding_phase1: string;
  onboarding_phase2: string;
  first_match_viewed: string;
  first_soul_knock_sent: string;
  first_thread_unlocked: string;
  first_paid: string;
}

async function loadKpis(): Promise<KpiRow> {
  const rows = await sql`
    select
      (select count(*) from analytics_events
        where event_name = 'signup'
          and occurred_at >= now() - interval '24 hours') as signups_today,
      (select count(distinct user_id) from analytics_events
        where user_id is not null
          and occurred_at >= now() - interval '24 hours') as dau,
      (select count(distinct user_id) from analytics_events
        where user_id is not null
          and occurred_at >= now() - interval '7 days') as wau,
      (select count(distinct user_id) from analytics_events
        where user_id is not null
          and occurred_at >= now() - interval '30 days') as mau,
      (select count(*) from profiles) as total_profiles
  `;
  return rows[0] as unknown as KpiRow;
}

async function loadFunnel(): Promise<FunnelRow> {
  const rows = await sql`
    select
      (select count(*) from intros where created_at >= now() - interval '7 days') as intros_7d,
      (select count(*) from intros
        where created_at >= now() - interval '7 days'
          and (status = 'connected' or connected_at is not null)) as connected_7d,
      (select count(*) from passes where created_at >= now() - interval '7 days') as passes_7d,
      (select count(*) from debriefs where created_at >= now() - interval '7 days') as debriefs_7d
  `;
  return rows[0] as unknown as FunnelRow;
}

async function loadCohorts(): Promise<CohortRow[]> {
  const rows = await sql`
    select
      signup_day::text as signup_day,
      cohort_size,
      d0, d1, d7, d14, d30
    from cohort_retention
    where signup_day >= (current_date - interval '14 days')::date
    order by signup_day desc
    limit 14
  `;
  return rows as unknown as CohortRow[];
}

async function loadFunnel30d(): Promise<FunnelStepRow> {
  // Distinct-user counts at each funnel step over the last 30 days. We count
  // distinct users so a single user reaching first_paid is one conversion,
  // not many. Each step is independent — drop-off is computed in the UI.
  const rows = await sql`
    select
      count(distinct user_id) filter (where event_name = 'signup')                       as signups,
      count(distinct user_id) filter (where event_name = 'onboarding_phase1_complete')   as onboarding_phase1,
      count(distinct user_id) filter (where event_name = 'onboarding_phase2_complete')   as onboarding_phase2,
      count(distinct user_id) filter (where event_name = 'first_match_viewed')           as first_match_viewed,
      count(distinct user_id) filter (where event_name = 'first_soul_knock_sent')        as first_soul_knock_sent,
      count(distinct user_id) filter (where event_name = 'first_thread_unlocked')        as first_thread_unlocked,
      count(distinct user_id) filter (where event_name = 'first_paid')                   as first_paid
    from analytics_events
    where user_id is not null
      and occurred_at >= now() - interval '30 days'
  `;
  return rows[0] as unknown as FunnelStepRow;
}

async function loadRecentSignups(): Promise<RecentSignupRow[]> {
  const rows = await sql`
    select
      e.user_id::text as user_id,
      p.name,
      p.city,
      p.gender,
      p.age,
      e.occurred_at::text as occurred_at
    from analytics_events e
    left join profiles p on p.user_id = e.user_id
    where e.event_name = 'signup'
    order by e.occurred_at desc
    limit 20
  `;
  return rows as unknown as RecentSignupRow[];
}

const PINK = "#e91e8c";
const CARD = "#111";
const BORDER = "#222";
const DIM = "#666";
const TEXT = "#e5e5e5";

const page: React.CSSProperties = {
  minHeight: "100vh",
  background: "#090909",
  color: TEXT,
  padding: 28,
  fontFamily: "ui-monospace, monospace",
};
const section: React.CSSProperties = {
  background: CARD,
  borderRadius: 10,
  padding: 18,
  marginBottom: 18,
  border: `1px solid ${BORDER}`,
};
const sectionTitle: React.CSSProperties = {
  fontSize: 11,
  color: DIM,
  marginBottom: 14,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  fontWeight: 700,
};
const tileGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
  gap: 12,
};
const tile: React.CSSProperties = {
  background: "#0c0c0c",
  border: `1px solid ${BORDER}`,
  borderRadius: 8,
  padding: 14,
};
const tileLabel: React.CSSProperties = {
  fontSize: 10,
  color: DIM,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  marginBottom: 8,
};
const tileValue: React.CSSProperties = {
  fontSize: 26,
  fontWeight: 700,
  color: TEXT,
};
const table: React.CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
  fontSize: 12,
};
const th: React.CSSProperties = {
  textAlign: "left",
  padding: "8px 10px",
  color: DIM,
  fontSize: 10,
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  borderBottom: `1px solid ${BORDER}`,
};
const td: React.CSSProperties = {
  padding: "10px",
  borderBottom: `1px solid ${BORDER}`,
  color: TEXT,
};

function n(v: string | number | null | undefined): number {
  if (v == null) return 0;
  return typeof v === "number" ? v : parseInt(v, 10) || 0;
}

function pct(num: string | number, denom: string | number): string {
  const d = n(denom);
  if (d === 0) return "—";
  return `${Math.round((n(num) / d) * 100)}%`;
}

export default async function AdminDashboardPage() {
  const [kpis, funnel, cohorts, recent, funnel30d] = await Promise.all([
    loadKpis(),
    loadFunnel(),
    loadCohorts(),
    loadRecentSignups(),
    loadFunnel30d(),
  ]);

  const funnelSteps: { label: string; count: number }[] = [
    { label: "Signups", count: n(funnel30d.signups) },
    { label: "Onboarding ph.1", count: n(funnel30d.onboarding_phase1) },
    { label: "Onboarding ph.2", count: n(funnel30d.onboarding_phase2) },
    { label: "First match viewed", count: n(funnel30d.first_match_viewed) },
    { label: "First soul knock", count: n(funnel30d.first_soul_knock_sent) },
    { label: "First thread unlocked", count: n(funnel30d.first_thread_unlocked) },
    { label: "First paid", count: n(funnel30d.first_paid) },
  ];
  const funnelMax = funnelSteps[0]?.count || 1;

  const connectedRate = pct(funnel.connected_7d, funnel.intros_7d);
  const debriefRate = pct(funnel.debriefs_7d, funnel.connected_7d);

  return (
    <div style={page}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 22,
        }}
      >
        <h1 style={{ fontSize: 20, fontWeight: 700 }}>Admin · Dashboard</h1>
        <div style={{ display: "flex", gap: 14, fontSize: 12 }}>
          <Link href="/admin/pulse" style={{ color: PINK, textDecoration: "none" }}>
            Pulse →
          </Link>
          <Link
            href="/admin/photo-moderation"
            style={{ color: PINK, textDecoration: "none" }}
          >
            Photos →
          </Link>
        </div>
      </div>

      <div style={section}>
        <div style={sectionTitle}>Live counters</div>
        <div style={tileGrid}>
          <div style={tile}>
            <div style={tileLabel}>Signups 24h</div>
            <div style={{ ...tileValue, color: PINK }}>{n(kpis.signups_today)}</div>
          </div>
          <div style={tile}>
            <div style={tileLabel}>DAU</div>
            <div style={tileValue}>{n(kpis.dau)}</div>
          </div>
          <div style={tile}>
            <div style={tileLabel}>WAU</div>
            <div style={tileValue}>{n(kpis.wau)}</div>
          </div>
          <div style={tile}>
            <div style={tileLabel}>MAU</div>
            <div style={tileValue}>{n(kpis.mau)}</div>
          </div>
          <div style={tile}>
            <div style={tileLabel}>Total profiles</div>
            <div style={tileValue}>{n(kpis.total_profiles)}</div>
          </div>
        </div>
      </div>

      <div style={section}>
        <div style={sectionTitle}>Match funnel · 7d</div>
        <div style={tileGrid}>
          <div style={tile}>
            <div style={tileLabel}>Intros sent</div>
            <div style={tileValue}>{n(funnel.intros_7d)}</div>
          </div>
          <div style={tile}>
            <div style={tileLabel}>Connected</div>
            <div style={tileValue}>{n(funnel.connected_7d)}</div>
            <div style={{ fontSize: 10, color: DIM, marginTop: 4 }}>
              {connectedRate} of intros
            </div>
          </div>
          <div style={tile}>
            <div style={tileLabel}>Passes</div>
            <div style={tileValue}>{n(funnel.passes_7d)}</div>
          </div>
          <div style={tile}>
            <div style={tileLabel}>Debriefs</div>
            <div style={tileValue}>{n(funnel.debriefs_7d)}</div>
            <div style={{ fontSize: 10, color: DIM, marginTop: 4 }}>
              {debriefRate} of connected
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(420px, 1fr))",
          gap: 18,
        }}
      >
        <div style={section}>
          <div style={sectionTitle}>Live activity feed</div>
          <AdminLiveFeed />
        </div>

        <div style={section}>
          <div style={sectionTitle}>Cohort retention</div>
          <table style={table}>
            <thead>
              <tr>
                <th style={th}>Signup day</th>
                <th style={th}>Size</th>
                <th style={th}>D0</th>
                <th style={th}>D1</th>
                <th style={th}>D7</th>
                <th style={th}>D14</th>
                <th style={th}>D30</th>
              </tr>
            </thead>
            <tbody>
              {cohorts.length === 0 ? (
                <tr>
                  <td style={{ ...td, color: DIM }} colSpan={7}>
                    No cohorts yet.
                  </td>
                </tr>
              ) : (
                cohorts.map((c) => (
                  <tr key={c.signup_day}>
                    <td style={td}>{c.signup_day.slice(0, 10)}</td>
                    <td style={td}>{n(c.cohort_size)}</td>
                    <td style={td}>{pct(c.d0, c.cohort_size)}</td>
                    <td style={td}>{pct(c.d1, c.cohort_size)}</td>
                    <td style={td}>{pct(c.d7, c.cohort_size)}</td>
                    <td style={td}>{pct(c.d14, c.cohort_size)}</td>
                    <td style={td}>{pct(c.d30, c.cohort_size)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div style={section}>
        <div style={sectionTitle}>Funnel drop-off · 30d (distinct users)</div>
        <div>
          {funnelSteps.map((step, i) => {
            const prev = i === 0 ? null : funnelSteps[i - 1].count;
            const widthPct = Math.max(2, Math.round((step.count / funnelMax) * 100));
            const dropPct = prev && prev > 0
              ? Math.round(((prev - step.count) / prev) * 100)
              : null;
            return (
              <div key={step.label} style={{ marginBottom: 10 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 11,
                    color: DIM,
                    marginBottom: 4,
                  }}
                >
                  <span style={{ color: TEXT }}>{step.label}</span>
                  <span>
                    {step.count.toLocaleString()}
                    {dropPct !== null && dropPct > 0 ? (
                      <span style={{ color: "#f87171", marginLeft: 8 }}>
                        −{dropPct}%
                      </span>
                    ) : null}
                  </span>
                </div>
                <div
                  style={{
                    height: 10,
                    background: "#0c0c0c",
                    borderRadius: 5,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${widthPct}%`,
                      height: "100%",
                      background: i === funnelSteps.length - 1 ? "#22d3ee" : PINK,
                      transition: "width 200ms",
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={section}>
        <div style={sectionTitle}>Recent signups</div>
        <table style={table}>
          <thead>
            <tr>
              <th style={th}>When</th>
              <th style={th}>Name</th>
              <th style={th}>Age</th>
              <th style={th}>Gender</th>
              <th style={th}>City</th>
              <th style={th}>User ID</th>
            </tr>
          </thead>
          <tbody>
            {recent.length === 0 ? (
              <tr>
                <td style={{ ...td, color: DIM }} colSpan={6}>
                  No signups yet.
                </td>
              </tr>
            ) : (
              recent.map((r) => (
                <tr key={r.user_id + r.occurred_at}>
                  <td style={td}>{new Date(r.occurred_at).toLocaleString()}</td>
                  <td style={td}>{r.name ?? <span style={{ color: DIM }}>—</span>}</td>
                  <td style={td}>{r.age ?? "—"}</td>
                  <td style={td}>{r.gender ?? "—"}</td>
                  <td style={td}>{r.city || "—"}</td>
                  <td style={{ ...td, color: DIM, fontSize: 10 }}>
                    {r.user_id.slice(0, 8)}…
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div style={section}>
        <div style={sectionTitle}>Inactive users · reactivate</div>
        <InactiveUsersPanel />
      </div>
    </div>
  );
}
