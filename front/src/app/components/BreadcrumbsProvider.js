import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

const Ctx = createContext(null);
export const useBreadcrumbsStack = () => useContext(Ctx);

// Pas de reset automatique (historique global).
// Pour reset sur '/', mets: new Set(['/'])
const ROOT_ROUTES = new Set([]);

const KEY = 'app.breadcrumbs.stack';
const loadStack = () => {
  try {
    const data = JSON.parse(sessionStorage.getItem(KEY));
    if (Array.isArray(data) && data.length > 0) return data;
  } catch {}
  return [{ label: 'Home', to: '/home' }];
};
const saveStack = (s) => {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(s));
  } catch (e) {
    // storage désactivé ? on ignore
    console.warn('[Breadcrumbs] sessionStorage error:', e);
  }
};

const isLikelyId = (s) =>
  /^\d+$/.test(s) || /^[0-9a-f]{24}$/i.test(s) || /^[0-9a-f-]{32,}$/i.test(s);

const lastSeg = (path) => (path || '/').split('/').filter(Boolean).pop() || 'Home';
const toTitleCase = (s) => (s || '').replace(/\b\w/g, (c) => c.toUpperCase());

// Libellés précis (exhaustif, tu peux en ajouter)
const LABEL_OVERRIDES = {
  home: 'home',
  example: 'Example',
  '404': 'Not Found',
  loading: 'Loading',
  add: 'Add', edit: 'Edit', detail: 'Detail',
  answer: 'Answer', answers: 'Answers', applications: 'Applications', valid: 'Valid',
  survey: 'Survey', surveys: 'Surveys',

  // auth
  'sign-in': 'Sign In', 'sign-out': 'Sign Out', 'sign-up': 'Sign Up',
  'change-password': 'Change Password',
  'reset-password': 'Reset Password', 'reset-password1': 'Reset Password',

  // employees & accounts
  'employee-list': 'Employees', employeelist: 'Employees',
  'employee-profile': 'Employee Profile', employeeprofile: 'Employee Profile',
  'employee-update': 'Employee Update', employeeupdate: 'Employee Update',
  'employees-by-manager': 'Employees by Manager', employeesbymanager: 'Employees by Manager',
  'add-account': 'Add Account', addaccount: 'Add Account',
  'employee-channel-list': 'Employee & Channel', employeechannellist: 'Employee & Channel',

  // leaves & RH
  'demande-conge-list': 'Leave Requests', demandecongelist: 'Leave Requests',
  'demande-conge-listrh': 'Leave Requests (RH)', demandecongelistrh: 'Leave Requests (RH)',
  validatedleaves: 'Validated Leaves', leavetypeslist: 'Leave Types',
  addleavetype: 'Add Leave Type', addleaverequest: 'Add Leave Request',
  leaverequestdetail: 'Leave Request Detail', detaildemande: 'Request Details',
  leaverequestemployeelist: 'Employee Leave Requests', leaverequestlistemployee: 'Employee Leave Requests',
  decision: 'Decision', decisionrh: 'RH Decision',
  historicleavemanager: 'Leave History (Manager)',
  historyworkflowleavelist: 'Leave Workflow History',

  // projects & tasks
  projectlist: 'Projects', projectprofile: 'Project Profile', projectphases: 'Project Phases',
  addproject: 'Add Project', addphase: 'Add Phase',
  editphase: 'Edit Phase', editproject: 'Edit Project',
  addtask: 'Add Task', phasetasks: 'Phase Tasks', tasks: 'Tasks',
  'add-subtask': 'Add Subtask', addsubtask: 'Add Subtask', subtasks: 'Subtasks',

  // payslips
  'payslip-list': 'Payslips', paysliplist: 'Payslips',
  'payslip-view': 'Payslip',  payslipview: 'Payslip',

  // clients & survey
  clients: 'Clients',
  'create-questionnaire': 'Create Questionnaire', createquestionnaire: 'Create Questionnaire',
  questionnaires: 'Questionnaires',
  'survey-management': 'Survey Management', surveymanagement: 'Survey Management',
  'answers-overview': 'Answers Overview', answersoverview: 'Answers Overview',
  'satisfaction-analysis': 'Satisfaction Analysis', satisfactionanalysis: 'Satisfaction Analysis',
  messageanalyse: 'Message Analysis',

  // interviews
  'schedule-interview': 'Schedule Interview', scheduleinterview: 'Schedule Interview',
  'interviews-list': 'Interviews', interviewslist: 'Interviews',
  'all-interviews-list': 'All Interviews', allinterviewslist: 'All Interviews',

  // job offers
  'add-joboffer': 'Add Job Offer', addjoboffer: 'Add Job Offer',
  'edit-joboffer': 'Edit Job Offer', editjoboffer: 'Edit Job Offer',
  'offers-applications': 'Offers Applications', offersapplications: 'Offers Applications',
  'offers-process': 'Offers Process', offersprocess: 'Offers Process',
  'manage-candidates': 'Manage Candidates', managecandidates: 'Manage Candidates',
  'my-offers': 'My Offers', myoffers: 'My Offers',
  'offer-details': 'Offer Details', offerdetails: 'Offer Details',
  'my-joboffer-request-history': 'My JobOffer Request History', myjobofferrequesthistory: 'My JobOffer Request History',
  'my-requests': 'My Requests', myrequests: 'My Requests',
  'job-offers': 'Job Offers', joboffers: 'Job Offers',

  // timesheet
  timesheet: 'Timesheet', imputations: 'Imputations',

  // currency / site / room / work-mode
  'currency-list': 'Currencies', currencylist: 'Currencies',
  'add-currency': 'Add Currency', addcurrency: 'Add Currency',
  'site-list': 'Sites', sitelist: 'Sites',
  'add-site': 'Add Site', addsite: 'Add Site',
  'room-list': 'Rooms', roomlist: 'Rooms',
  'add-room': 'Add Room', addroom: 'Add Room',
  'work-mode-list': 'Work Modes', workmodelist: 'Work Modes',
  'add-work-mode': 'Add Work Mode', addworkmode: 'Add Work Mode',

  // department / contracts
  adddepartment: 'Add Department', departmentlist: 'Departments',
  addcontracttype: 'Add Contract Type', contracttypelist: 'Contract Types',

  // evaluations
  addyearevaluation: 'Add Year Evaluation',
  yearevaluation: 'Year Evaluation',
  edityearevaluation: 'Edit Year Evaluation',

  // career / training
  'career-pathing-start': 'Career Pathing Start', careerpathingstart: 'Career Pathing Start',
  'career-pathing-results': 'Career Pathing Results', careerpathingresults: 'Career Pathing Results',
  'career-pathing-recommendation-plan': 'Career Pathing Plan', careerpathingrecommendationplan: 'Career Pathing Plan',
  'training-recommendation-start': 'Training Recommendation Start', trainingrecommendationstart: 'Training Recommendation Start',
  'training-recommendation-tabs': 'Training Recommendation Tabs', trainingrecommendationtabs: 'Training Recommendation Tabs',
  'training-recommendation-plan': 'Training Recommendation Plan', trainingrecommendationplan: 'Training Recommendation Plan',
  'coaching-results': 'Coaching Results', coachingresults: 'Coaching Results',
  'self-training-results': 'Self-Training Results', selftrainingresults: 'Self-Training Results',
  'structured-training-results': 'Structured Training Results', structuredtrainingresults: 'Structured Training Results',

  // analysis / predictions / stream
  analyseresults: 'Analysis Results',
  analyseresultss: 'Analysis Results (Stream)',
  'prediction-results': 'Prediction Results', predictionresults: 'Prediction Results',

  // insurance / diploma
  addinsurance: 'Add Insurance',
  'insurrance-list': 'Insurance List', insurrancelist: 'Insurance List',
  'insurrance-profile': 'Insurance Profile', insurranceprofile: 'Insurance Profile',
  'insurrance-update': 'Insurance Update', insurranceupdate: 'Insurance Update',
  diplomamanagementpage: 'Diploma Management',
  'diploma-type': 'Diploma Types', diplomatype: 'Diploma Types',
};

const parentOf = (path) =>
  (path || '/').split('/').filter(Boolean).slice(-2, -1)[0] || '';

const formatShortId = (s) => (/^\d+$/).test(s) ? s : s.slice(0, 6); // 123 ou abc123

function humanizePath(path) {
  const seg = lastSeg(path);

  // Si dernier segment = ID ⇒ "ParentLabel #ID"
  if (isLikelyId(seg)) {
    const parent = parentOf(path) || 'Item';
    const key = parent.toLowerCase();

    const base =
      LABEL_OVERRIDES[key] ||
      toTitleCase(
        parent
          .replace(/[-_]+/g, ' ')
          .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
          .trim()
      );

    return `${base} #${formatShortId(seg)}`;
  }

  // Sinon, comportement normal
  const key = (seg || '').toLowerCase();
  if (LABEL_OVERRIDES[key]) return LABEL_OVERRIDES[key];

  const spaced = (seg || '')
    .replace(/[-_]+/g, ' ')
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/\s{2,}/g, ' ')
    .trim();

  return toTitleCase(spaced || 'home');
}


export default function BreadcrumbsProvider({ children }) {
  const location = useLocation();
  const navType = useNavigationType(); // 'PUSH' | 'POP' | 'REPLACE'
  const [stack, setStack] = useState(loadStack());
  const prevPathRef = useRef(location.pathname);

  const current = useMemo(
    () => ({ label: humanizePath(location.pathname), to: location.pathname }),
    [location.pathname]
  );

  useEffect(() => {
    let next = Array.isArray(stack) ? [...stack] : [{ label: 'Home', to: '/home' }];

    const isRoot = ROOT_ROUTES.has(location.pathname);
    const prevPath = prevPathRef.current;
    prevPathRef.current = location.pathname;

    if (navType === 'POP') {
      const idx = next.findIndex((c) => c.to === location.pathname);
      next = idx >= 0 ? next.slice(0, idx + 1) : [...next, current];

    } else if (navType === 'REPLACE') {
      const last = next[next.length - 1];
      if (!last) {
        next = [{ label: 'Home', to: '/home' }, current];
      } else if (last.to !== location.pathname) {
        next = [...next, current]; // REPLACE ≈ PUSH si chemin change
      } else {
        next = [...next.slice(0, -1), current]; // même page => update libellé
      }

    } else {
      // 'PUSH'
      if (isRoot) {
        next = [{ label: 'Home', to: '/home' }];
        if (location.pathname !== '/') next.push(current);
      } else {
        const last = next[next.length - 1];
        if (!last || last.to !== location.pathname) {
          const existing = next.findIndex((c) => c.to === location.pathname);
          next = existing >= 0 ? next.slice(0, existing + 1) : [...next, current];
        }
      }
    }

    if (next.length > 20) next = [next[0], ...next.slice(-19)];
    setStack(next);
    saveStack(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, navType]);

  const value = useMemo(() => ({ stack, setStack }), [stack]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
