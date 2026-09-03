// Client helpers for LIVE data (used when NEXT_PUBLIC_DEMO_MODE=false).
// They call the same-origin proxy at /api/moodle, which holds the token.
//
// The UI in components/EvolutionAcademy.jsx currently renders sample data.
// When Moodle is populated and auth is in place, wire these in (see the
// commented `loadLive()` example at the bottom of the component) and map the
// raw Moodle responses into the small UI shapes the components expect.

export async function ws(wsfunction, params = {}) {
  const q = new URLSearchParams({ wsfunction, ...params });
  const res = await fetch(`/api/moodle?${q.toString()}`);
  if (!res.ok) throw new Error(`Moodle proxy error (${res.status})`);
  return res.json();
}

// --- raw calls (return Moodle's native JSON) ---
export const getSiteInfo = () => ws('core_webservice_get_site_info');
export const getUserCourses = (userid) => ws('core_enrol_get_users_courses', { userid });
export const getCatalogue = () => ws('core_course_get_courses_by_field');
export const getCategories = () => ws('core_course_get_categories');
export const getCourseContents = (courseid) => ws('core_course_get_contents', { courseid });
export const getGrades = (userid, courseid) =>
  ws('gradereport_user_get_grade_items', { userid, courseid });

// --- small helpers to derive UI fields from Moodle data ---
export function initialsFrom(name = '') {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase();
}

const GRADIENTS = [
  ['#6366F1', '#4338CA'], ['#12A150', '#0B7A3B'], ['#96324A', '#6D223A'],
  ['#4338CA', '#312E81'], ['#818CF8', '#4F46E5'], ['#0EA5A5', '#0B7A7A'],
];
export function gradientFor(id = 0) {
  return GRADIENTS[Math.abs(Number(id)) % GRADIENTS.length];
}

// Example: map core_enrol_get_users_courses -> the dashboard course shape.
export function mapUserCourse(c) {
  return {
    id: c.id,
    fullname: c.fullname,
    category: c.categoryname || 'Course',
    grad: gradientFor(c.id),
    initials: initialsFrom(c.fullname),
    progress: typeof c.progress === 'number' ? Math.round(c.progress) : 0,
    meta: c.summary ? String(c.summary).replace(/<[^>]+>/g, '').slice(0, 60) : '',
    last: c.lastaccess ? 'Recently active' : 'Not started yet',
  };
}
