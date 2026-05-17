// src/app/components/DynamicBreadcrumbs.jsx
import React from 'react';
import { Link as RouterLink, useLocation, generatePath } from 'react-router-dom';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';

/* 1) Utils */
function isLikelyId(s) {
  return (
    /^\d+$/.test(s) ||
    /^[0-9a-f]{24}$/i.test(s) ||
    /^[0-9a-f-]{32,}$/i.test(s)
  );
}
function titleize(s) {
  return s
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/* 2) Static labels */
const SEGMENT_LABELS = {
  home: 'Home',
  example: 'Example',
  '404': 'Not Found',
  loading: 'Loading',
  // auth
  'sign-in': 'Sign In', 'sign-out': 'Sign Out', 'sign-up': 'Sign Up',
  'change-password': 'Change Password', 'reset-password': 'Reset Password', 'reset-password1': 'Reset Password',
  // employees & accounts
  'employee-list': 'Employees', 'employee-profile': 'Employee Profile', 'employee-update': 'Employee Update',
  'employees-by-manager': 'Employees by Manager', 'add-account': 'Add Account', 'employee-channel-list': 'Employee & Channel',
  // leaves & RH
  'demande-conge-list': 'Leave Requests', 'demande-conge-listrh': 'Leave Requests (RH)',
  validatedleaves: 'Validated Leaves', leavetypeslist: 'Leave Types',
  addleavetype: 'Add Leave Type', addleaverequest: 'Add Leave Request',
  leaverequestdetail: 'Leave Request Detail', detaildemande: 'Request Details',
  leaverequestemployeelist: 'Employee Leave Requests', leaverequestlistemployee: 'Employee Leave Requests',
  decision: 'Decision', decisionrh: 'RH Decision',
  historicleavemanager: 'Leave History (Manager)', historyworkflowleavelist: 'Leave Workflow History',
  // projects & tasks
  projectlist: 'Projects', projectprofile: 'Project Profile', projectphases: 'Project Phases',
  addproject: 'Add Project', addphase: 'Add Phase', editphase: 'Edit Phase', editproject: 'Edit Project',
  addtask: 'Add Task', phasetasks: 'Phase Tasks', tasks: 'Tasks', detail: 'Detail', 'add-subtask': 'Add Subtask', subtasks: 'Subtasks',
  // payslips
  'payslip-list': 'Payslips', 'payslip-view': 'Payslip',
  // clients & survey
  clients: 'Clients', add: 'Add', edit: 'Edit', 'create-questionnaire': 'Create Questionnaire',
  questionnaires: 'Questionnaires', survey: 'Survey', 'survey-management': 'Survey Management',
  surveys: 'Surveys', 'answers-overview': 'Answers Overview', answers: 'Answers', answer: 'Answer',
  'satisfaction-analysis': 'Satisfaction Analysis', messageanalyse: 'Message Analysis',
  // interviews
  'schedule-interview': 'Schedule Interview', 'interviews-list': 'Interviews', 'all-interviews-list': 'All Interviews',
  // job offers
  'add-joboffer': 'Add Job Offer', 'edit-joboffer': 'Edit Job Offer',
  'offers-applications': 'Offers Applications', 'offers-process': 'Offers Process',
  'manage-candidates': 'Manage Candidates', 'my-offers': 'My Offers',
  'offer-details': 'Offer Details', 'my-joboffer-request-history': 'My JobOffer Request History',
  'my-requests': 'My Requests', 'job-offers': 'Job Offers', applications: 'Applications',
  // timesheet
  timesheet: 'Timesheet', imputations: 'Imputations', valid: 'Valid',
  // currency / site / room / work-mode
  'currency-list': 'Currencies', 'add-currency': 'Add Currency',
  'site-list': 'Sites', 'add-site': 'Add Site',
  'room-list': 'Rooms', 'add-room': 'Add Room',
  'work-mode-list': 'Work Modes', 'add-work-mode': 'Add Work Mode',
  // department / contracts
  adddepartment: 'Add Department', departmentlist: 'Departments',
  addcontracttype: 'Add Contract Type', contracttypelist: 'Contract Types',
  // evaluations
  addyearevaluation: 'Add Year Evaluation', yearevaluation: 'Year Evaluation', edityearevaluation: 'Edit Year Evaluation',
  // career / training
  'career-pathing-start': 'Career Pathing Start', 'career-pathing-results': 'Career Pathing Results',
  'career-pathing-recommendation-plan': 'Career Pathing Plan',
  'training-recommendation-start': 'Training Recommendation Start',
  'training-recommendation-tabs': 'Training Recommendation Tabs',
  'training-recommendation-plan': 'Training Recommendation Plan',
  'coaching-results': 'Coaching Results', 'self-training-results': 'Self-Training Results',
  'structured-training-results': 'Structured Training Results',
  // analysis / predictions / stream
  analyseresults: 'Analysis Results', analyseresultss: 'Analysis Results (Stream)', 'prediction-results': 'Prediction Results',
  // insurance / diploma
  addinsurance: 'Add Insurance', 'insurrance-list': 'Insurance List', 'insurrance-profile': 'Insurance Profile',
  'insurrance-update': 'Insurance Update', diplomamanagementpage: 'Diploma Management', 'diploma-type': 'Diploma Types',
};

/* 3) Targets for segments that carry an ID */
const ID_TARGETS = {
  'edit-joboffer': '/edit-joboffer/:id',
  'offer-details': '/offer-details/:id',
  'job-offers': '/job-offers/:id/applications',
  'employee-profile': '/Employee-profile/:id',
  clients: '/clients/:id',
  projectprofile: '/projectprofile/:projectId',
  projectphases: '/projectphases/:projectId',
  'payslip-view': '/payslip-view/:id',
  imputations: '/imputations/:imputationId',
  'interviews-list': '/interviews-list/:id',
  'schedule-interview': '/schedule-interview/edit/:id',
  'answers-overview': '/answers-overview/:questionnaireId',
  'satisfaction-analysis': '/satisfaction-analysis/:questionnaireId',
  decision: '/Decision/:id',
  decisionrh: '/Decisionrh/:id',
  leaverequestdetail: '/LeaveRequestDetail/:id',
  detaildemande: '/detaildemande/:id',
};

/* 4) Build target for an ID segment */
function resolveTarget(pathnames, index, baseTo, value) {
  if (!isLikelyId(value)) return baseTo;
  const prev = index > 0 ? pathnames[index - 1].toLowerCase() : null;
  const prevprev = index > 1 ? pathnames[index - 2].toLowerCase() : null;
  const porter = ID_TARGETS[prev] ? prev : (ID_TARGETS[prevprev] ? prevprev : null);
  if (!porter) return baseTo;
  const pattern = ID_TARGETS[porter];
  const params = {
    id: value, projectId: value, questionnaireId: value, employeId: value,
    phaseId: value, parentTaskId: value, applicationId: value, imputationId: value, userId: value,
  };
  return generatePath(pattern, params);
}

/* 5) Label */
function labelFromSegment(seg) {
  const key = seg.toLowerCase();
  if (SEGMENT_LABELS[key]) return SEGMENT_LABELS[key];
  return isLikelyId(seg) ? `#${seg}` : titleize(seg);
}

/* 6) Virtual parents: inject missing crumbs for flat routes */
const VIRTUAL_PARENTS = [
  {
    // /Employee-profile/:id  -> Employees › Employee Profile › #id
    test: (pathname) => /^\/Employee-profile\/[^/]+$/i.test(pathname),
    crumbs: [
      { to: '/employee-list', label: 'Employees' },
      { to: '/Employee-profile', label: 'Employee Profile' }, // non-clickable could be null
    ],
    // Which raw segments we should skip from the auto-generated map
    skipSegments: new Set(['Employee-profile'.toLowerCase()]),
  },
  // add more rules here if you have other “detail” pages with flat routes
];

/* 7) Component */
export default function DynamicBreadcrumbs() {
  const { pathname } = useLocation();
  const pathnames = pathname.split('/').filter(Boolean);

  // Virtual parents handling
  const vp = VIRTUAL_PARENTS.find((r) => r.test(pathname));
  const skip = vp?.skipSegments ?? new Set();

  return (
    <Breadcrumbs
      aria-label="breadcrumb"
      separator="›"
      sx={{ '& .MuiLink-root': { px: 1, py: 0.25, borderRadius: 1, bgcolor: 'action.hover', textDecoration: 'none' } }}
    >
      <Link component={RouterLink} to="/" underline="hover" color="inherit">
        Home
      </Link>

      {/* Inject virtual parents first (e.g., Employees → Employee Profile) */}
      {vp?.crumbs.map(({ to, label }) => (
        <Link
          key={`${to ?? 'nolink'}-${label}`}
          component={to ? RouterLink : 'span'}
          to={to || undefined}
          underline="hover"
          color="inherit"
        >
          {label}
        </Link>
      ))}

      {/* Then render the actual path segments, skipping those covered by virtual parents */}
      {pathnames.map((raw, index) => {
        const value = decodeURIComponent(raw);
        if (skip.has(value.toLowerCase())) return null;

        const baseTo = `/${pathnames.slice(0, index + 1).join('/')}`;
        const to = resolveTarget(pathnames, index, baseTo, value);
        const label = labelFromSegment(value);

        return (
          <Link component={RouterLink} to={to} underline="hover" color="inherit" key={to}>
            {label}
          </Link>
        );
      })}
    </Breadcrumbs>
  );
}
