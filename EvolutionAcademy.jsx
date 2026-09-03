"use client";
// Evolution Academy — hybrid front-end shell (Learner / Trainer / Admin).
// Renders sample data by default (demo mode). To go live, see lib/moodle.js
// and the loadLive() example noted at the bottom of this file.

import React, { useState } from "react";

/*
  EVOLUTION ACADEMY — Hybrid front-end (full shell)
  Roles: Learner · Trainer · Admin  (switch in the top-right)
  Learner: Dashboard, My courses, Course detail, Catalogue, Certificates, Grades, Profile
  Trainer: Grading queue, My learners, Catalogue, Profile
  Admin:   Users, Courses, Reports, Profile
  All data mirrors Moodle Web Services shapes → swap sampleData for a
  server-side Vercel proxy (holds the WS token) to go live. UI unchanged.
*/

const T = {
  indigo: "#4F46E5", indigo700: "#4338CA", indigo900: "#1E1B4B", indigo50: "#EEF0FE",
  ink: "#1E1B4B", slate: "#3F4658", muted: "#7A8194", gold: "#EFC531", amber: "#B8931F",
  green: "#12A150", maroon: "#96324A", canvas: "#F6F7FB", card: "#FFFFFF",
  line: "#EAECF3", line2: "#F0F1F6",
};

const COURSES = {
  11: { id: 11, fullname: "AML & Compliance Essentials", category: "Compliance", grad: ["#6366F1", "#4338CA"], initials: "AM", progress: 62, meta: "Module 3 of 5 · 45 min left", last: "Last opened 2 days ago", trainer: { name: "Toluwani Olaogun", initials: "TO", grad: ["#12A150", "#0B7A3B"] }, summary: "5 modules · 18 activities · ~3 hours", grade: 84 },
  12: { id: 12, fullname: "Consultative Selling Skills", category: "Sales", grad: ["#12A150", "#0B7A3B"], initials: "SS", progress: 38, meta: "Module 2 of 4 · Quiz due Friday", last: "Last opened yesterday", trainer: { name: "Iveren Igba", initials: "II", grad: ["#6366F1", "#4338CA"] }, summary: "4 modules · 14 activities · ~2.5 hours", grade: 71 },
  13: { id: 13, fullname: "Leading High-Performing Teams", category: "Leadership", grad: ["#96324A", "#6D223A"], initials: "LE", progress: 12, meta: "Module 1 of 6 · Just started", last: "Enrolled last week", trainer: { name: "Victor Oyesina", initials: "VO", grad: ["#96324A", "#6D223A"] }, summary: "6 modules · 22 activities · ~4 hours", grade: null },
};
const inProgress = [COURSES[11], COURSES[12], COURSES[13]];

const CONTENTS = {
  11: [
    { name: "Module 3 · Customer Due Diligence", meta: "3 of 4 done", modules: [
      { modname: "resource", name: "What is CDD?", sub: "Reading · 8 min", status: "done" },
      { modname: "url", name: "Risk-based approach", sub: "Video · 12 min", status: "done" },
      { modname: "resource", name: "Identifying red flags", sub: "Reading · 6 min", status: "done" },
      { modname: "quiz", name: "Module 3 Quiz", sub: "Quiz · 10 questions · Due 27 Aug", status: "due" },
    ]},
    { name: "Module 4 · Ongoing Monitoring", meta: "Not started", modules: [
      { modname: "resource", name: "Transaction monitoring basics", sub: "Reading · 10 min", status: "todo" },
      { modname: "url", name: "Case study: suspicious activity", sub: "Video · 15 min", status: "todo" },
      { modname: "assign", name: "Practical: file a SAR", sub: "Assignment · Due 2 Sep", status: "todo" },
      { modname: "forum", name: "Discussion: grey areas", sub: "Forum", status: "todo" },
    ]},
  ],
  12: [{ name: "Module 2 · Understanding Needs", meta: "1 of 3 done", modules: [
    { modname: "resource", name: "The discovery conversation", sub: "Reading · 9 min", status: "done" },
    { modname: "url", name: "Asking better questions", sub: "Video · 11 min", status: "todo" },
    { modname: "quiz", name: "Needs quiz", sub: "Quiz · 8 questions · Due Fri", status: "due" },
  ]}],
  13: [{ name: "Module 1 · Foundations of Leadership", meta: "Just started", modules: [
    { modname: "resource", name: "What great leaders do", sub: "Reading · 7 min", status: "todo" },
    { modname: "url", name: "Leadership styles", sub: "Video · 14 min", status: "todo" },
  ]}],
};

const deadlines = [
  { day: "27", mon: "Aug", title: "Compliance Quiz 3", sub: "Due in 2 days · AML & Compliance", due: true },
  { day: "29", mon: "Aug", title: "Selling Skills — Roleplay", sub: "Due Friday · Consultative Selling", due: false },
  { day: "02", mon: "Sep", title: "Reflective Journal", sub: "Next week · Leadership", due: false },
];

const catalogue = [
  { id: 11, initials: "AM", grad: ["#6366F1", "#4338CA"], cat: "Compliance", title: "AML & Compliance Essentials", desc: "Core anti-money-laundering knowledge every staff member needs.", meta: "5 modules · 3h" },
  { id: 12, initials: "SS", grad: ["#12A150", "#0B7A3B"], cat: "Sales", title: "Consultative Selling Skills", desc: "Move from pitching to problem-solving with customers.", meta: "4 modules · 2.5h" },
  { id: 13, initials: "LE", grad: ["#96324A", "#6D223A"], cat: "Leadership", title: "Leading High-Performing Teams", desc: "Practical habits for new and aspiring team leads.", meta: "6 modules · 4h" },
  { id: 14, initials: "ON", grad: ["#4338CA", "#312E81"], cat: "Onboarding", title: "Welcome to Credit Direct", desc: "Everything a new hire needs in their first two weeks.", meta: "3 modules · 1.5h" },
  { id: 15, initials: "PR", grad: ["#818CF8", "#4F46E5"], cat: "Product", title: "Our Lending Products", desc: "Know every product, inside out, to serve customers better.", meta: "4 modules · 2h" },
  { id: 16, initials: "DS", grad: ["#0EA5A5", "#0B7A7A"], cat: "Digital Skills", title: "Excel for Everyday Work", desc: "From formulas to clean dashboards, without the jargon.", meta: "5 modules · 3h" },
];
const categories = ["All", "Compliance", "Sales", "Leadership", "Onboarding", "Product", "Digital Skills"];

const grades = [
  { course: "AML & Compliance Essentials", items: [
    { name: "Module 1 Quiz", grade: "92%", range: "0–100", status: "done" },
    { name: "Module 2 Quiz", grade: "88%", range: "0–100", status: "done" },
    { name: "Module 3 Quiz", grade: "—", range: "0–100", status: "due" },
  ]},
  { course: "Consultative Selling Skills", items: [
    { name: "Needs quiz", grade: "71%", range: "0–100", status: "done" },
    { name: "Roleplay assignment", grade: "—", range: "0–100", status: "due" },
  ]},
];

const certificates = [
  { course: "Welcome to Credit Direct", date: "12 Jun 2026", initials: "ON", grad: ["#4338CA", "#312E81"] },
  { course: "Data Protection Basics", date: "03 May 2026", initials: "DP", grad: ["#6366F1", "#4338CA"] },
  { course: "Customer Service Excellence", date: "18 Apr 2026", initials: "CS", grad: ["#12A150", "#0B7A3B"] },
  { course: "Fire Safety & Evacuation", date: "27 Mar 2026", initials: "FS", grad: ["#96324A", "#6D223A"] },
];

// Trainer data
const gradingQueue = [
  { learner: "Adeola Bello", initials: "AB", grad: ["#6366F1", "#4338CA"], course: "AML & Compliance", activity: "Practical: file a SAR", type: "Assignment", submitted: "2h ago" },
  { learner: "Chidi Okonkwo", initials: "CO", grad: ["#12A150", "#0B7A3B"], course: "Consultative Selling", activity: "Roleplay recording", type: "Assignment", submitted: "Yesterday" },
  { learner: "Fatima Sani", initials: "FS", grad: ["#96324A", "#6D223A"], course: "AML & Compliance", activity: "Module 3 essay", type: "Assignment", submitted: "Yesterday" },
  { learner: "Emeka Obi", initials: "EO", grad: ["#818CF8", "#4F46E5"], course: "Leading Teams", activity: "Reflective journal", type: "Assignment", submitted: "2 days ago" },
];
const learners = [
  { name: "Iveren Igba", course: "AML & Compliance", progress: 92, last: "Today", status: ["On track", T.green, "#E6F6EC"] },
  { name: "Victor Oyesina", course: "Consultative Selling", progress: 48, last: "Yesterday", status: ["Behind", T.amber, "#FBF3D4"] },
  { name: "Adeola Bello", course: "Leading Teams", progress: 12, last: "3 days ago", status: ["At risk", T.maroon, "#FBE9EE"] },
  { name: "Chidi Okonkwo", course: "AML & Compliance", progress: 100, last: "Last week", status: ["Complete", T.green, "#E6F6EC"] },
];

// Admin data
const users = [
  { name: "Samuel Olanipekun", email: "samuel.o@creditdirect.ng", role: "Administrator", roleColor: [T.maroon, "#FBE9EE"], status: "Active", last: "Now" },
  { name: "Toluwani Olaogun", email: "toluwani.o@creditdirect.ng", role: "Trainer", roleColor: [T.indigo700, T.indigo50], status: "Active", last: "1h ago" },
  { name: "Iveren Igba", email: "iveren.i@creditdirect.ng", role: "Learner", roleColor: ["#0B7A3B", "#E6F6EC"], status: "Active", last: "Today" },
  { name: "Victor Oyesina", email: "victor.o@creditdirect.ng", role: "Learner", roleColor: ["#0B7A3B", "#E6F6EC"], status: "Active", last: "Yesterday" },
  { name: "Edwina Olanipekun", email: "edwina.o@creditdirect.ng", role: "Manager", roleColor: ["#8A6D0B", "#FBF3D4"], status: "Active", last: "2 days ago" },
  { name: "Adeola Bello", email: "adeola.b@creditdirect.ng", role: "Learner", roleColor: ["#0B7A3B", "#E6F6EC"], status: "Suspended", last: "3 wks ago" },
];
const adminCourses = [
  { name: "AML & Compliance Essentials", cat: "Compliance", enrolled: 128, visible: true },
  { name: "Consultative Selling Skills", cat: "Sales", enrolled: 64, visible: true },
  { name: "Leading High-Performing Teams", cat: "Leadership", enrolled: 22, visible: true },
  { name: "Welcome to Credit Direct", cat: "Onboarding", enrolled: 210, visible: true },
  { name: "Our Lending Products", cat: "Product", enrolled: 0, visible: false },
];

const catColor = (c) => ({
  Compliance: [T.indigo700, T.indigo50], Sales: ["#0B7A3B", "#E6F6EC"], Leadership: [T.maroon, "#FBE9EE"],
  Onboarding: [T.indigo700, T.indigo50], Product: [T.indigo700, T.indigo50], "Digital Skills": ["#0B7A7A", "#E1F5F5"],
}[c] || [T.indigo700, T.indigo50]);

const Icon = ({ d, size = 18, stroke = "currentColor", sw = 1.9 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">{d}</svg>
);
const icons = {
  home: <><path d="M3 12l9-8 9 8" /><path d="M5 10v10h14V10" /></>,
  book: <><path d="M4 5h11a2 2 0 012 2v12H6a2 2 0 01-2-2z" /><path d="M17 5h3v14h-3" /></>,
  grade: <><path d="M4 20V10M10 20V4M16 20v-7M22 20H2" /></>,
  cat: <><circle cx="12" cy="12" r="9" /><path d="M12 8v4l3 2" /></>,
  search: <><circle cx="11" cy="11" r="7" /><path d="M21 21l-4-4" /></>,
  bell: <><path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.7 21a2 2 0 01-3.4 0" /></>,
  chat: <><path d="M21 12a8 8 0 01-11.5 7.2L3 21l1.8-6.5A8 8 0 1121 12z" /></>,
  check: <><path d="M20 6L9 17l-5-5" /></>,
  star: <><path d="M12 2l2.4 7.4H22l-6 4.3 2.3 7.3-6.3-4.6L5.7 21 8 13.7 2 9.4h7.6z" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 8v4l3 2" /></>,
  play: <><circle cx="12" cy="12" r="9" /><path d="M10 9l5 3-5 3z" /></>,
  quiz: <><circle cx="12" cy="12" r="9" /><path d="M9.2 9a3 3 0 114 2.8c-.8.4-1.2.9-1.2 1.7" /><circle cx="12" cy="16.5" r="0.5" /></>,
  assign: <><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z" /></>,
  back: <><path d="M19 12H5M12 19l-7-7 7-7" /></>,
  users: <><circle cx="9" cy="8" r="3.2" /><path d="M3 20a6 6 0 0112 0M16 5.5a3 3 0 010 5.6M21 20a6 6 0 00-4-5.6" /></>,
  chart: <><path d="M4 20V10M10 20V4M16 20v-7M22 20H2" /></>,
  dl: <><path d="M12 3v12M7 11l5 4 5-4M5 21h14" /></>,
};
const modIcon = (m) => ({ resource: icons.book, page: icons.book, book: icons.book, url: icons.play, quiz: icons.quiz, assign: icons.assign, forum: icons.chat }[m] || icons.book);

const ROLE_NAV = {
  Learner: [["dashboard", "Dashboard", icons.home], ["mycourses", "My courses", icons.book], ["catalogue", "Course catalogue", icons.cat], ["certificates", "Certificates", icons.star], ["grades", "Grades", icons.grade]],
  Trainer: [["grading", "Grading queue", icons.assign], ["learners", "My learners", icons.users], ["catalogue", "Course catalogue", icons.cat]],
  Admin: [["users", "Users", icons.users], ["acourses", "Courses", icons.book], ["reports", "Reports", icons.chart]],
};
const ROLE_DEFAULT = { Learner: "dashboard", Trainer: "grading", Admin: "users" };

export default function EvolutionAcademy() {
  const [role, setRole] = useState("Learner");
  const [page, setPage] = useState("dashboard");
  const [courseId, setCourseId] = useState(null);
  const [filter, setFilter] = useState("All");
  const [enrolled, setEnrolled] = useState({});

  const openCourse = (id) => { setCourseId(id); setPage("course"); };
  const switchRole = (r) => { setRole(r); setPage(ROLE_DEFAULT[r]); };

  const Nav = ({ id, label, ic }) => {
    const on = page === id;
    return (
      <button onClick={() => setPage(id)} style={{ display: "flex", alignItems: "center", gap: 11, padding: "9px 11px", borderRadius: 10, border: 0, cursor: "pointer", width: "100%", textAlign: "left", fontFamily: "inherit", fontSize: 13.5, fontWeight: on ? 600 : 500, background: on ? T.indigo50 : "transparent", color: on ? T.indigo700 : T.slate }}>
        <Icon d={ic} stroke={on ? T.indigo : T.slate} /> {label}
      </button>
    );
  };

  const initials = { Learner: "SO", Trainer: "TO", Admin: "SO" }[role];
  const roleName = { Learner: "Samuel O.", Trainer: "Toluwani O.", Admin: "Samuel O." }[role];

  return (
    <div style={{ fontFamily: "Poppins, system-ui, sans-serif", background: T.canvas, color: T.slate, minHeight: "100vh", display: "grid", gridTemplateColumns: "248px 1fr" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap'); *{box-sizing:border-box} button:focus{outline:none}`}</style>

      <aside style={{ background: "#fff", borderRight: `1px solid ${T.line}`, padding: "22px 16px", display: "flex", flexDirection: "column", gap: 22, position: "sticky", top: 0, height: "100vh" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "4px 8px" }}>
          <div style={{ width: 34, height: 34, borderRadius: 9, background: "linear-gradient(135deg,#6366F1,#4338CA)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 15 }}>EA</div>
          <div><div style={{ fontWeight: 700, color: T.ink, fontSize: 15 }}>Evolution Academy</div><div style={{ fontSize: 10.5, color: T.muted, marginTop: -2 }}>Online</div></div>
        </div>
        <div>
          <div style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase", color: T.muted, padding: "0 10px", marginBottom: 4 }}>{role} menu</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>{ROLE_NAV[role].map(([id, label, ic]) => <Nav key={id} id={id} label={label} ic={ic} />)}</div>
        </div>
        <div style={{ marginTop: "auto", background: "linear-gradient(160deg,#312E81,#1E1B4B)", borderRadius: 14, padding: 16, color: "#fff" }}>
          <b style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 4 }}>Need a hand?</b>
          <p style={{ fontSize: 11.5, color: "#C7C9F7", lineHeight: 1.45, margin: "0 0 10px" }}>Find guides, or reach the L&amp;D team for anything you’re stuck on.</p>
          <button style={{ background: "#fff", color: T.indigo700, fontWeight: 600, fontSize: 11.5, padding: "6px 12px", borderRadius: 8, border: 0, cursor: "pointer", fontFamily: "inherit" }}>Get help</button>
        </div>
      </aside>

      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "14px 30px", background: "rgba(246,247,251,.9)", backdropFilter: "blur(8px)", position: "sticky", top: 0, zIndex: 5, borderBottom: `1px solid ${T.line}` }}>
          <div style={{ flex: 1, maxWidth: 380, display: "flex", alignItems: "center", gap: 9, background: "#fff", border: `1px solid ${T.line}`, borderRadius: 10, padding: "9px 13px" }}>
            <Icon d={icons.search} size={16} stroke={T.muted} />
            <input placeholder="Search…" style={{ border: 0, outline: 0, fontFamily: "inherit", fontSize: 13.5, color: T.slate, width: "100%", background: "none" }} />
          </div>
          <div style={{ flex: 1 }} />
          {/* role switcher */}
          <div style={{ display: "flex", background: "#fff", border: `1px solid ${T.line}`, borderRadius: 10, padding: 3, gap: 2 }}>
            {["Learner", "Trainer", "Admin"].map((r) => (
              <button key={r} onClick={() => switchRole(r)} style={{ fontFamily: "inherit", fontSize: 12, fontWeight: 600, padding: "6px 12px", borderRadius: 7, border: 0, cursor: "pointer", background: role === r ? T.indigo : "transparent", color: role === r ? "#fff" : T.muted }}>{r}</button>
            ))}
          </div>
          <button style={ib()}><span style={dot()} /><Icon d={icons.bell} stroke={T.slate} /></button>
          <button onClick={() => setPage("profile")} style={{ display: "flex", alignItems: "center", gap: 10, background: "none", border: 0, cursor: "pointer" }}>
            <div style={{ width: 38, height: 38, borderRadius: 11, background: "linear-gradient(135deg,#818CF8,#4338CA)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 600, fontSize: 14 }}>{initials}</div>
            <div style={{ lineHeight: 1.2, textAlign: "left" }}><b style={{ fontSize: 13, fontWeight: 600, color: T.ink, display: "block" }}>{roleName}</b><span style={{ fontSize: 11.5, color: T.muted }}>{role}</span></div>
          </button>
        </div>

        {page === "dashboard" && <Dashboard openCourse={openCourse} goCatalogue={() => setPage("catalogue")} />}
        {page === "mycourses" && <MyCourses openCourse={openCourse} />}
        {page === "catalogue" && <Catalogue filter={filter} setFilter={setFilter} enrolled={enrolled} setEnrolled={setEnrolled} openCourse={openCourse} />}
        {page === "certificates" && <Certificates />}
        {page === "grades" && <Grades />}
        {page === "course" && <CourseDetail id={courseId} back={() => setPage("mycourses")} />}
        {page === "profile" && <Profile role={role} />}
        {page === "grading" && <Grading />}
        {page === "learners" && <Learners />}
        {page === "users" && <Users />}
        {page === "acourses" && <AdminCourses />}
        {page === "reports" && <Reports />}
      </div>
    </div>
  );
}

function ib() { return { width: 38, height: 38, borderRadius: 10, background: "#fff", border: `1px solid ${T.line}`, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", cursor: "pointer" }; }
function dot() { return { position: "absolute", top: 9, right: 10, width: 7, height: 7, background: T.maroon, borderRadius: "50%", border: "2px solid #fff" }; }
function panel() { return { background: "#fff", border: `1px solid ${T.line}`, borderRadius: 16, padding: 18, marginBottom: 18 }; }
function panelH() { return { fontSize: 14, fontWeight: 600, color: T.ink, marginTop: 0, marginBottom: 14 }; }
function h1() { return { fontSize: 24, fontWeight: 700, color: T.ink, letterSpacing: "-.02em", margin: 0 }; }
function wrap(children) { return <div style={{ padding: "26px 30px 40px" }}>{children}</div>; }
function pageHead(title, sub) { return <div style={{ marginBottom: 20 }}><h1 style={h1()}>{title}</h1><p style={{ fontSize: 13.5, color: T.muted, marginTop: 3, marginBottom: 0 }}>{sub}</p></div>; }
function cardBox(children, extra) { return <div style={{ background: "#fff", border: `1px solid ${T.line}`, borderRadius: 16, overflow: "hidden", marginBottom: 16, ...extra }}>{children}</div>; }

function CourseCard({ c, openCourse }) {
  const [fg, bg] = catColor(c.category);
  return (
    <div style={{ background: "#fff", border: `1px solid ${T.line}`, borderRadius: 16, padding: 14, display: "flex", gap: 15 }}>
      <div style={{ width: 96, height: 96, borderRadius: 12, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 22, background: `linear-gradient(135deg,${c.grad[0]},${c.grad[1]})` }}>{c.initials}</div>
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
        <span style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: ".03em", textTransform: "uppercase", color: fg, background: bg, padding: "3px 8px", borderRadius: 6, alignSelf: "flex-start" }}>{c.category}</span>
        <h3 style={{ fontSize: 15, fontWeight: 600, color: T.ink, margin: "9px 0 3px" }}>{c.fullname}</h3>
        <div style={{ fontSize: 12, color: T.muted, marginBottom: 11 }}>{c.meta}</div>
        <div style={{ height: 7, background: T.line, borderRadius: 99, overflow: "hidden", marginBottom: 7 }}><div style={{ height: "100%", width: `${c.progress}%`, borderRadius: 99, background: "linear-gradient(90deg,#6366F1,#4338CA)" }} /></div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}><span style={{ fontSize: 11.5, color: T.muted, fontWeight: 500 }}>{c.last}</span><b style={{ fontSize: 12, color: T.indigo700, fontWeight: 600 }}>{c.progress}%</b></div>
      </div>
      <button onClick={() => openCourse(c.id)} style={{ alignSelf: "center", background: T.indigo50, color: T.indigo700, border: 0, fontFamily: "inherit", fontWeight: 600, fontSize: 12.5, padding: "9px 15px", borderRadius: 9, cursor: "pointer", whiteSpace: "nowrap" }}>Continue</button>
    </div>
  );
}

function Dashboard({ openCourse, goCatalogue }) {
  const stats = [
    { n: "4", l: "Courses in progress", bg: T.indigo50, stroke: T.indigo, ic: icons.book },
    { n: "12", l: "Courses completed", bg: "#E6F6EC", stroke: T.green, ic: icons.check },
    { n: "9", l: "Certificates earned", bg: "#FBF3D4", stroke: "#B8931F", ic: icons.star },
    { n: "86%", l: "Average score", bg: T.indigo50, stroke: T.indigo, ic: icons.clock },
  ];
  return wrap(<>
    <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 22, gap: 20 }}>
      <div><h1 style={h1()}>Good morning, Samuel</h1><p style={{ fontSize: 13.5, color: T.muted, marginTop: 3, marginBottom: 0 }}>You have 2 activities due this week. Keep the momentum going.</p></div>
      <button onClick={goCatalogue} style={{ background: T.indigo, color: "#fff", border: 0, fontFamily: "inherit", fontWeight: 600, fontSize: 13, padding: "10px 16px", borderRadius: 10, cursor: "pointer" }}>Browse catalogue</button>
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 26 }}>
      {stats.map((s, i) => (
        <div key={i} style={{ background: "#fff", border: `1px solid ${T.line}`, borderRadius: 16, padding: "16px 18px" }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}><Icon d={s.ic} stroke={s.stroke} sw={2} /></div>
          <div style={{ fontSize: 26, fontWeight: 700, color: T.ink, letterSpacing: "-.02em", lineHeight: 1 }}>{s.n}</div>
          <div style={{ fontSize: 12, color: T.muted, marginTop: 5, fontWeight: 500 }}>{s.l}</div>
        </div>
      ))}
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 22 }}>
      <div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <h2 style={{ fontSize: 15, fontWeight: 600, color: T.ink, margin: 0 }}>Continue learning</h2>
          <span style={{ fontSize: 12.5, color: T.indigo, fontWeight: 600, cursor: "pointer" }}>View all courses →</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>{inProgress.map((c) => <CourseCard key={c.id} c={c} openCourse={openCourse} />)}</div>
      </div>
      <div>
        <div style={panel()}>
          <h2 style={panelH()}>Your deadlines</h2>
          {deadlines.map((d, i) => (
            <div key={i} style={{ display: "flex", gap: 12, padding: "11px 0", borderBottom: i < deadlines.length - 1 ? `1px solid ${T.line2}` : 0 }}>
              <div style={{ width: 44, height: 44, flexShrink: 0, borderRadius: 10, background: d.due ? "#FBE9EE" : T.indigo50, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: d.due ? T.maroon : T.indigo700 }}>
                <b style={{ fontSize: 15, fontWeight: 700, lineHeight: 1 }}>{d.day}</b><span style={{ fontSize: 9.5, textTransform: "uppercase", letterSpacing: ".05em", fontWeight: 600 }}>{d.mon}</span>
              </div>
              <div><b style={{ fontSize: 13, color: T.ink, fontWeight: 600, display: "block" }}>{d.title}</b><span style={{ fontSize: 11.5, color: T.muted }}>{d.sub}</span></div>
            </div>
          ))}
        </div>
        <div style={panel()}>
          <h2 style={panelH()}>Explore by category</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>{categories.slice(1).map((c) => <span key={c} style={{ fontSize: 12, fontWeight: 500, color: T.slate, background: T.line2, borderRadius: 8, padding: "8px 12px", cursor: "pointer" }}>{c}</span>)}</div>
        </div>
      </div>
    </div>
  </>);
}

function MyCourses({ openCourse }) {
  return wrap(<>
    {pageHead("My courses", "Everything you’re enrolled in, and how far you’ve come.")}
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>{inProgress.map((c) => <CourseCard key={c.id} c={c} openCourse={openCourse} />)}</div>
  </>);
}

function CourseDetail({ id, back }) {
  const c = COURSES[id]; const sections = CONTENTS[id] || [];
  const statusPill = { done: ["Completed", T.green, "#E6F6EC"], due: ["Due soon", T.maroon, "#FBE9EE"], todo: ["To do", T.muted, T.line2] };
  return wrap(<>
    <button onClick={back} style={{ display: "flex", alignItems: "center", gap: 7, background: "none", border: 0, color: T.muted, fontFamily: "inherit", fontSize: 12.5, cursor: "pointer", marginBottom: 14, padding: 0 }}><Icon d={icons.back} size={15} stroke={T.muted} /> Back to my courses</button>
    <div style={{ background: "#fff", border: `1px solid ${T.line}`, borderRadius: 16, overflow: "hidden", marginBottom: 22 }}>
      <div style={{ height: 120, background: `linear-gradient(120deg,${c.grad[0]},${c.grad[1]})`, position: "relative" }}>
        <span style={{ position: "absolute", top: 16, left: 22, fontSize: 10.5, fontWeight: 600, textTransform: "uppercase", letterSpacing: ".03em", color: "#fff", background: "rgba(255,255,255,.18)", padding: "3px 8px", borderRadius: 6 }}>{c.category}</span>
      </div>
      <div style={{ padding: "0 24px 22px", display: "flex", gap: 22, alignItems: "flex-start" }}>
        <div style={{ width: 88, height: 88, marginTop: -64, borderRadius: 18, background: "#fff", border: `1px solid ${T.line}`, boxShadow: "0 4px 16px rgba(30,27,75,.1)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 30, color: c.grad[1] }}>{c.initials}</div>
        <div style={{ flex: 1, paddingTop: 18 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: T.ink, letterSpacing: "-.02em", margin: "0 0 4px" }}>{c.fullname}</h1>
          <div style={{ fontSize: 13, color: T.muted }}>{c.summary} · Trainer: {c.trainer.name}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 14 }}>
            <div style={{ flex: 1, height: 8, background: T.line, borderRadius: 99, overflow: "hidden" }}><div style={{ height: "100%", width: `${c.progress}%`, background: "linear-gradient(90deg,#6366F1,#4338CA)", borderRadius: 99 }} /></div>
            <b style={{ fontSize: 13, color: T.indigo700 }}>{c.progress}% complete</b>
          </div>
        </div>
        <button style={{ marginTop: 18, background: T.indigo, color: "#fff", border: 0, fontFamily: "inherit", fontWeight: 600, fontSize: 13, padding: "10px 16px", borderRadius: 10, cursor: "pointer", whiteSpace: "nowrap" }}>Continue learning</button>
      </div>
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 22 }}>
      <div>
        {sections.map((sec, si) => (
          <div key={si} style={{ background: "#fff", border: `1px solid ${T.line}`, borderRadius: 16, marginBottom: 16, overflow: "hidden" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "15px 18px", borderBottom: `1px solid ${T.line2}` }}>
              <b style={{ fontSize: 14.5, color: T.ink, fontWeight: 600 }}>{sec.name}</b><span style={{ fontSize: 12, color: T.muted }}>{sec.meta}</span>
            </div>
            {sec.modules.map((m, mi) => {
              const [label, sfg, sbg] = statusPill[m.status]; const done = m.status === "done";
              return (
                <div key={mi} style={{ display: "flex", alignItems: "center", gap: 13, padding: "13px 18px", borderBottom: mi < sec.modules.length - 1 ? `1px solid ${T.line2}` : 0, cursor: "pointer" }}>
                  <div style={{ width: 34, height: 34, borderRadius: 9, background: done ? "#E6F6EC" : T.indigo50, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Icon d={done ? icons.check : modIcon(m.modname)} size={17} stroke={done ? T.green : T.indigo} sw={2} /></div>
                  <div style={{ flex: 1 }}><b style={{ fontSize: 13.5, color: T.ink, fontWeight: 600, display: "block" }}>{m.name}</b><span style={{ fontSize: 11.5, color: T.muted }}>{m.sub}</span></div>
                  <span style={{ fontSize: 11, fontWeight: 600, padding: "4px 9px", borderRadius: 6, color: sfg, background: sbg }}>{label}</span>
                </div>
              );
            })}
          </div>
        ))}
      </div>
      <div>
        <div style={panel()}><h2 style={panelH()}>Your progress</h2>
          {[["Activities done", "11 / 18"], ["Quizzes passed", "2 / 3"], ["Time spent", "1h 52m"], ["Grade so far", c.grade ? c.grade + "%" : "—"]].map((r, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, padding: "7px 0" }}><span style={{ color: T.muted }}>{r[0]}</span><b style={{ color: T.ink, fontWeight: 600 }}>{r[1]}</b></div>
          ))}
        </div>
        <div style={panel()}><h2 style={panelH()}>Your trainer</h2>
          <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
            <div style={{ width: 40, height: 40, borderRadius: 11, background: `linear-gradient(135deg,${c.trainer.grad[0]},${c.trainer.grad[1]})`, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 600 }}>{c.trainer.initials}</div>
            <div><b style={{ fontSize: 13, color: T.ink, display: "block" }}>{c.trainer.name}</b><span style={{ fontSize: 11.5, color: T.muted }}>Message · View profile</span></div>
          </div>
        </div>
        <div style={panel()}><h2 style={panelH()}>Certificate</h2><div style={{ fontSize: 12.5, color: T.muted, lineHeight: 1.5 }}>Complete all modules to unlock your certificate. You’re {c.progress}% of the way there.</div></div>
      </div>
    </div>
  </>);
}

function Catalogue({ filter, setFilter, enrolled, setEnrolled, openCourse }) {
  const shown = filter === "All" ? catalogue : catalogue.filter((c) => c.cat === filter);
  return wrap(<>
    {pageHead("Course catalogue", "Browse everything on offer and enrol in what moves your career forward.")}
    <div style={{ display: "flex", gap: 9, marginBottom: 20, flexWrap: "wrap" }}>
      {categories.map((c) => { const on = filter === c; return <button key={c} onClick={() => setFilter(c)} style={{ fontSize: 12.5, fontWeight: 500, color: on ? "#fff" : T.slate, background: on ? T.indigo : "#fff", border: `1px solid ${on ? T.indigo : T.line}`, borderRadius: 9, padding: "8px 14px", cursor: "pointer", fontFamily: "inherit" }}>{c}</button>; })}
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 18 }}>
      {shown.map((c) => (
        <div key={c.id} style={{ background: "#fff", border: `1px solid ${T.line}`, borderRadius: 16, overflow: "hidden" }}>
          <div onClick={() => COURSES[c.id] && openCourse(c.id)} style={{ height: 96, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 26, position: "relative", background: `linear-gradient(135deg,${c.grad[0]},${c.grad[1]})`, cursor: "pointer" }}>
            <span style={{ position: "absolute", top: 12, left: 12, fontSize: 10.5, fontWeight: 600, textTransform: "uppercase", letterSpacing: ".03em", color: "#fff", background: "rgba(255,255,255,.2)", padding: "3px 8px", borderRadius: 6 }}>{c.cat}</span>{c.initials}
          </div>
          <div style={{ padding: "15px 16px 17px" }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: T.ink, margin: "0 0 5px" }}>{c.title}</h3>
            <p style={{ fontSize: 12, color: T.muted, lineHeight: 1.5, margin: "0 0 13px", minHeight: 36 }}>{c.desc}</p>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 11.5, color: T.muted }}>{c.meta}</span>
              <button onClick={() => setEnrolled((e) => ({ ...e, [c.id]: true }))} style={{ fontSize: 12, fontWeight: 600, color: enrolled[c.id] ? T.green : T.indigo700, background: "none", border: 0, cursor: "pointer", fontFamily: "inherit" }}>{enrolled[c.id] ? "✓ Enrolled" : "Enrol →"}</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  </>);
}

function Certificates() {
  return wrap(<>
    {pageHead("Certificates", "Every course you’ve completed — download and share your achievements.")}
    <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 18 }}>
      {certificates.map((c, i) => (
        <div key={i} style={{ background: "#fff", border: `1px solid ${T.line}`, borderRadius: 16, overflow: "hidden", display: "flex" }}>
          <div style={{ width: 110, flexShrink: 0, background: `linear-gradient(150deg,${c.grad[0]},${c.grad[1]})`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#fff", gap: 8 }}>
            <div style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(255,255,255,.18)", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon d={icons.star} size={22} stroke="#fff" sw={1.6} /></div>
            <b style={{ fontSize: 18, fontWeight: 800 }}>{c.initials}</b>
          </div>
          <div style={{ padding: "18px 20px", flex: 1, display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: ".05em", textTransform: "uppercase", color: T.green }}>Completed</span>
            <h3 style={{ fontSize: 15.5, fontWeight: 600, color: T.ink, margin: "6px 0 4px" }}>{c.course}</h3>
            <div style={{ fontSize: 12, color: T.muted, marginBottom: 14 }}>Issued {c.date}</div>
            <button style={{ marginTop: "auto", alignSelf: "flex-start", display: "flex", alignItems: "center", gap: 7, background: T.indigo50, color: T.indigo700, border: 0, fontFamily: "inherit", fontWeight: 600, fontSize: 12.5, padding: "8px 14px", borderRadius: 9, cursor: "pointer" }}><Icon d={icons.dl} size={15} stroke={T.indigo700} sw={2} /> Download PDF</button>
          </div>
        </div>
      ))}
    </div>
  </>);
}

function Grades() {
  return wrap(<>
    {pageHead("Grades", "Your scores and feedback across every course.")}
    {grades.map((g, i) => (
      <div key={i} style={{ background: "#fff", border: `1px solid ${T.line}`, borderRadius: 16, marginBottom: 16, overflow: "hidden" }}>
        <div style={{ padding: "15px 18px", borderBottom: `1px solid ${T.line2}`, fontWeight: 600, color: T.ink, fontSize: 14.5 }}>{g.course}</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 120px 120px 120px", padding: "10px 18px", borderBottom: `1px solid ${T.line2}`, fontSize: 11, textTransform: "uppercase", letterSpacing: ".05em", color: T.muted, fontWeight: 600 }}>
          <div>Item</div><div>Grade</div><div>Range</div><div>Status</div>
        </div>
        {g.items.map((it, j) => { const done = it.status === "done"; return (
          <div key={j} style={{ display: "grid", gridTemplateColumns: "1fr 120px 120px 120px", padding: "12px 18px", borderBottom: j < g.items.length - 1 ? `1px solid ${T.line2}` : 0, fontSize: 13, alignItems: "center" }}>
            <div style={{ color: T.slate }}>{it.name}</div>
            <div style={{ fontWeight: 700, color: done ? T.ink : T.muted }}>{it.grade}</div>
            <div style={{ color: T.muted }}>{it.range}</div>
            <div><span style={{ fontSize: 11, fontWeight: 600, padding: "4px 10px", borderRadius: 99, color: done ? T.green : T.maroon, background: done ? "#E6F6EC" : "#FBE9EE" }}>{done ? "Graded" : "Pending"}</span></div>
          </div>
        ); })}
      </div>
    ))}
  </>);
}

function Profile({ role }) {
  const Field = ({ label, value }) => (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: T.ink, marginBottom: 6 }}>{label}</label>
      <div style={{ border: `1.5px solid ${T.line}`, borderRadius: 11, padding: "11px 13px", fontSize: 13.5, color: T.slate, background: "#FAFBFE" }}>{value}</div>
    </div>
  );
  const Toggle = ({ label, on }) => (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 0", borderBottom: `1px solid ${T.line2}` }}>
      <span style={{ fontSize: 13, color: T.slate }}>{label}</span>
      <div style={{ width: 40, height: 23, borderRadius: 99, background: on ? T.indigo : T.line, position: "relative", cursor: "pointer" }}><div style={{ position: "absolute", top: 2.5, left: on ? 19 : 2.5, width: 18, height: 18, borderRadius: "50%", background: "#fff", transition: ".15s" }} /></div>
    </div>
  );
  return wrap(<>
    {pageHead("Profile & settings", "Manage your details and how the platform works for you.")}
    <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 22 }}>
      <div style={panel()}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
          <div style={{ width: 84, height: 84, borderRadius: 22, background: "linear-gradient(135deg,#818CF8,#4338CA)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 30, marginBottom: 14 }}>SO</div>
          <b style={{ fontSize: 17, color: T.ink }}>Samuel Olanipekun</b>
          <span style={{ fontSize: 12.5, color: T.muted, marginTop: 2 }}>{role} · Learning & Development</span>
          <span style={{ marginTop: 12, fontSize: 11, fontWeight: 600, padding: "5px 12px", borderRadius: 99, color: T.indigo700, background: T.indigo50 }}>Credit Direct</span>
          <button style={{ marginTop: 16, width: "100%", background: T.indigo, color: "#fff", border: 0, fontFamily: "inherit", fontWeight: 600, fontSize: 13, padding: "10px", borderRadius: 10, cursor: "pointer" }}>Edit photo</button>
        </div>
      </div>
      <div>
        <div style={panel()}>
          <h2 style={panelH()}>Your details</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Field label="Full name" value="Samuel Olanipekun" />
            <Field label="Email" value="samuel.o@creditdirect.ng" />
            <Field label="Department" value="Learning & Development" />
            <Field label="Timezone" value="Africa/Lagos" />
          </div>
          <button style={{ background: T.indigo, color: "#fff", border: 0, fontFamily: "inherit", fontWeight: 600, fontSize: 13, padding: "10px 18px", borderRadius: 10, cursor: "pointer" }}>Save changes</button>
        </div>
        <div style={panel()}>
          <h2 style={panelH()}>Preferences</h2>
          <Toggle label="Email me about upcoming deadlines" on={true} />
          <Toggle label="Email me when I’m enrolled in a course" on={true} />
          <Toggle label="Weekly progress summary" on={false} />
          <Toggle label="Show my profile to other learners" on={true} />
        </div>
      </div>
    </div>
  </>);
}

/* ---------------- TRAINER ---------------- */
function Grading() {
  return wrap(<>
    {pageHead("Grading queue", "Submissions waiting for your feedback, oldest first.")}
    <div style={{ background: "#fff", border: `1px solid ${T.line}`, borderRadius: 16, overflow: "hidden" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1.3fr 1fr 0.9fr 120px", padding: "12px 18px", borderBottom: `1px solid ${T.line2}`, fontSize: 11, textTransform: "uppercase", letterSpacing: ".05em", color: T.muted, fontWeight: 600 }}>
        <div>Learner</div><div>Activity</div><div>Course</div><div>Submitted</div><div></div>
      </div>
      {gradingQueue.map((g, i) => (
        <div key={i} style={{ display: "grid", gridTemplateColumns: "1.4fr 1.3fr 1fr 0.9fr 120px", padding: "13px 18px", borderBottom: i < gradingQueue.length - 1 ? `1px solid ${T.line2}` : 0, fontSize: 13, alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 9, background: `linear-gradient(135deg,${g.grad[0]},${g.grad[1]})`, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 600, fontSize: 12 }}>{g.initials}</div>
            <b style={{ color: T.ink, fontWeight: 600 }}>{g.learner}</b>
          </div>
          <div><div style={{ color: T.slate }}>{g.activity}</div><span style={{ fontSize: 11, color: T.muted }}>{g.type}</span></div>
          <div style={{ color: T.slate }}>{g.course}</div>
          <div style={{ color: T.muted }}>{g.submitted}</div>
          <div><button style={{ background: T.indigo, color: "#fff", border: 0, fontFamily: "inherit", fontWeight: 600, fontSize: 12.5, padding: "8px 16px", borderRadius: 9, cursor: "pointer" }}>Grade</button></div>
        </div>
      ))}
    </div>
  </>);
}
function Learners() {
  return wrap(<>
    {pageHead("My learners", "Progress across everyone in the courses you teach.")}
    <div style={{ background: "#fff", border: `1px solid ${T.line}`, borderRadius: 16, overflow: "hidden" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1.4fr 1.4fr 1fr 120px", padding: "12px 18px", borderBottom: `1px solid ${T.line2}`, fontSize: 11, textTransform: "uppercase", letterSpacing: ".05em", color: T.muted, fontWeight: 600 }}>
        <div>Learner</div><div>Course</div><div>Progress</div><div>Last active</div><div>Status</div>
      </div>
      {learners.map((l, i) => (
        <div key={i} style={{ display: "grid", gridTemplateColumns: "1.4fr 1.4fr 1.4fr 1fr 120px", padding: "13px 18px", borderBottom: i < learners.length - 1 ? `1px solid ${T.line2}` : 0, fontSize: 13, alignItems: "center" }}>
          <b style={{ color: T.ink, fontWeight: 600 }}>{l.name}</b>
          <div style={{ color: T.slate }}>{l.course}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <div style={{ flex: 1, height: 6, background: T.line, borderRadius: 99, overflow: "hidden", maxWidth: 90 }}><div style={{ height: "100%", width: `${l.progress}%`, background: "linear-gradient(90deg,#6366F1,#4338CA)", borderRadius: 99 }} /></div>
            <span style={{ fontSize: 12, color: T.muted, fontWeight: 600 }}>{l.progress}%</span>
          </div>
          <div style={{ color: T.muted }}>{l.last}</div>
          <div><span style={{ fontSize: 11, fontWeight: 600, padding: "4px 10px", borderRadius: 99, color: l.status[1], background: l.status[2] }}>{l.status[0]}</span></div>
        </div>
      ))}
    </div>
  </>);
}

/* ---------------- ADMIN ---------------- */
function Users() {
  return wrap(<>
    <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 20 }}>
      <div><h1 style={h1()}>Users</h1><p style={{ fontSize: 13.5, color: T.muted, marginTop: 3, marginBottom: 0 }}>Manage accounts, roles and access.</p></div>
      <button style={{ background: T.indigo, color: "#fff", border: 0, fontFamily: "inherit", fontWeight: 600, fontSize: 13, padding: "10px 16px", borderRadius: 10, cursor: "pointer" }}>+ Add user</button>
    </div>
    <div style={{ background: "#fff", border: `1px solid ${T.line}`, borderRadius: 16, overflow: "hidden" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1.8fr 1fr 0.9fr 0.9fr", padding: "12px 18px", borderBottom: `1px solid ${T.line2}`, fontSize: 11, textTransform: "uppercase", letterSpacing: ".05em", color: T.muted, fontWeight: 600 }}>
        <div>Name</div><div>Email</div><div>Role</div><div>Status</div><div>Last access</div>
      </div>
      {users.map((u, i) => (
        <div key={i} style={{ display: "grid", gridTemplateColumns: "1.6fr 1.8fr 1fr 0.9fr 0.9fr", padding: "13px 18px", borderBottom: i < users.length - 1 ? `1px solid ${T.line2}` : 0, fontSize: 13, alignItems: "center" }}>
          <b style={{ color: T.ink, fontWeight: 600 }}>{u.name}</b>
          <div style={{ color: T.muted }}>{u.email}</div>
          <div><span style={{ fontSize: 11, fontWeight: 600, padding: "4px 10px", borderRadius: 99, color: u.roleColor[0], background: u.roleColor[1] }}>{u.role}</span></div>
          <div><span style={{ fontSize: 12, color: u.status === "Active" ? T.green : T.maroon, fontWeight: 600 }}>{u.status}</span></div>
          <div style={{ color: T.muted }}>{u.last}</div>
        </div>
      ))}
    </div>
  </>);
}
function AdminCourses() {
  return wrap(<>
    <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 20 }}>
      <div><h1 style={h1()}>Courses</h1><p style={{ fontSize: 13.5, color: T.muted, marginTop: 3, marginBottom: 0 }}>Every course in the catalogue and its enrolment.</p></div>
      <button style={{ background: T.indigo, color: "#fff", border: 0, fontFamily: "inherit", fontWeight: 600, fontSize: 13, padding: "10px 16px", borderRadius: 10, cursor: "pointer" }}>+ New course</button>
    </div>
    <div style={{ background: "#fff", border: `1px solid ${T.line}`, borderRadius: 16, overflow: "hidden" }}>
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1.2fr 1fr 1fr", padding: "12px 18px", borderBottom: `1px solid ${T.line2}`, fontSize: 11, textTransform: "uppercase", letterSpacing: ".05em", color: T.muted, fontWeight: 600 }}>
        <div>Course</div><div>Category</div><div>Enrolled</div><div>Visibility</div>
      </div>
      {adminCourses.map((c, i) => (
        <div key={i} style={{ display: "grid", gridTemplateColumns: "2fr 1.2fr 1fr 1fr", padding: "13px 18px", borderBottom: i < adminCourses.length - 1 ? `1px solid ${T.line2}` : 0, fontSize: 13, alignItems: "center" }}>
          <b style={{ color: T.ink, fontWeight: 600 }}>{c.name}</b>
          <div style={{ color: T.slate }}>{c.cat}</div>
          <div style={{ color: T.slate }}>{c.enrolled}</div>
          <div><span style={{ fontSize: 11, fontWeight: 600, padding: "4px 10px", borderRadius: 99, color: c.visible ? T.green : T.muted, background: c.visible ? "#E6F6EC" : T.line2 }}>{c.visible ? "Visible" : "Hidden"}</span></div>
        </div>
      ))}
    </div>
  </>);
}
function Reports() {
  const stats = [
    { n: "384", l: "Total users", bg: T.indigo50, stroke: T.indigo, ic: icons.users },
    { n: "5", l: "Active courses", bg: "#E6F6EC", stroke: T.green, ic: icons.book },
    { n: "72%", l: "Avg. completion", bg: "#FBF3D4", stroke: "#B8931F", ic: icons.check },
    { n: "1,204", l: "Certificates issued", bg: T.indigo50, stroke: T.indigo, ic: icons.star },
  ];
  const completion = [
    { course: "Welcome to Credit Direct", pct: 94 }, { course: "AML & Compliance Essentials", pct: 68 },
    { course: "Data Protection Basics", pct: 61 }, { course: "Consultative Selling Skills", pct: 44 },
    { course: "Leading High-Performing Teams", pct: 22 },
  ];
  return wrap(<>
    {pageHead("Reports", "Platform-wide activity and completion at a glance.")}
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 22 }}>
      {stats.map((s, i) => (
        <div key={i} style={{ background: "#fff", border: `1px solid ${T.line}`, borderRadius: 16, padding: "16px 18px" }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}><Icon d={s.ic} stroke={s.stroke} sw={2} /></div>
          <div style={{ fontSize: 26, fontWeight: 700, color: T.ink, letterSpacing: "-.02em", lineHeight: 1 }}>{s.n}</div>
          <div style={{ fontSize: 12, color: T.muted, marginTop: 5, fontWeight: 500 }}>{s.l}</div>
        </div>
      ))}
    </div>
    <div style={panel()}>
      <h2 style={panelH()}>Completion by course</h2>
      {completion.map((c, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "9px 0" }}>
          <div style={{ width: 220, fontSize: 13, color: T.slate }}>{c.course}</div>
          <div style={{ flex: 1, height: 8, background: T.line, borderRadius: 99, overflow: "hidden" }}><div style={{ height: "100%", width: `${c.pct}%`, background: "linear-gradient(90deg,#6366F1,#4338CA)", borderRadius: 99 }} /></div>
          <b style={{ width: 42, textAlign: "right", fontSize: 13, color: T.indigo700 }}>{c.pct}%</b>
        </div>
      ))}
    </div>
  </>);
}
