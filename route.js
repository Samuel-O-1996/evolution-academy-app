// Server-side proxy to Moodle Web Services.
// The token lives ONLY here (server env), never in the browser. This also
// solves CORS, since the browser calls this same-origin route, not Moodle.

const ALLOWED = new Set([
  'core_webservice_get_site_info',
  'core_enrol_get_users_courses',
  'core_course_get_courses_by_field',
  'core_course_get_contents',
  'core_completion_get_activities_completion_status',
  'core_completion_get_course_completion_status',
  'gradereport_user_get_grade_items',
  'core_enrol_get_enrolled_users',
  'enrol_self_enrol_user',
  'core_course_get_categories',
]);

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const wsfunction = searchParams.get('wsfunction');

  if (!wsfunction || !ALLOWED.has(wsfunction)) {
    return Response.json({ error: 'Function not allowed' }, { status: 400 });
  }

  const base = process.env.MOODLE_URL;
  const token = process.env.MOODLE_TOKEN;
  if (!base || !token) {
    return Response.json(
      { error: 'Server not configured. Set MOODLE_URL and MOODLE_TOKEN.' },
      { status: 500 }
    );
  }

  const url = new URL(base.replace(/\/+$/, '') + '/webservice/rest/server.php');
  url.searchParams.set('wstoken', token);
  url.searchParams.set('wsfunction', wsfunction);
  url.searchParams.set('moodlewsrestformat', 'json');
  // pass through any extra params (userid, field, value, courseid, etc.)
  for (const [k, v] of searchParams) {
    if (k !== 'wsfunction') url.searchParams.set(k, v);
  }

  try {
    const res = await fetch(url.toString(), { cache: 'no-store' });
    const data = await res.json();
    return Response.json(data);
  } catch (e) {
    return Response.json({ error: 'Upstream request failed' }, { status: 502 });
  }
}

/*
  SECURITY TO-DO before this serves real per-user data in production:
  This route currently trusts any 'userid' passed to it (the service token can
  read any user's data). Add authentication so a signed-in learner can only
  request THEIR OWN userid — mirror the auth model you use on the Performance
  Portal, or gate this behind Entra SSO. Do not expose per-user endpoints
  publicly without that check.
*/
