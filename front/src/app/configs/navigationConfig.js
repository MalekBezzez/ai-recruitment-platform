import i18next from 'i18next';
import ar from './navigation-i18n/ar';
import en from './navigation-i18n/en';
import tr from './navigation-i18n/tr';

// Register translation bundles
i18next.addResourceBundle('en', 'navigation', en);
i18next.addResourceBundle('tr', 'navigation', tr);
i18next.addResourceBundle('ar', 'navigation', ar);

const user = JSON.parse(localStorage.getItem('user') || '{}');
const managerId = user?.user?.id;

// Combined navigation configuration
const navigationConfig = [
  {
    id: 'employee-management',
    title: 'Employees',
    type: 'item',
    icon: 'heroicons-outline:users', // 👥 Ressources humaines
    url: 'employee-list',
  },
  {
    id: 'leave-section',
    title: 'Leave Requests',
    type: 'item',
    icon: 'heroicons-outline:calendar', // 📅 Congés / Absences
    url: 'LeaveRequestEmployeeList',
  },
  {
    id: 'imputation-management',
    title: 'Timesheet',
    type: 'item',
    icon: 'heroicons-outline:clock', // 🕒 Suivi du temps
    url: 'timesheet',
  },
  {
    id: 'project-management',
    title: 'Projects',
    type: 'item',
    icon: 'heroicons-outline:briefcase', // 💼 Projets professionnels
    url: 'projectlist',
  },
  {
  id: 'questionnaire',
  title: 'Questionnaire',
  type: 'item',
  icon: 'heroicons-outline:clipboard-check', // 📝 Questionnaire icon
  url: 'surveys',
},
{
  id: 'Discussion',
  title: 'Discussion Analyses',
  type: 'item',
  icon: 'heroicons-outline:chat-alt-2', 
  url: 'prediction-results',
},
  {
    id: 'job-offers',
    title: 'Job Offers',
    type: 'item',
    icon: 'heroicons-outline:clipboard-list', // 📣 Offres d’emploi
    url: 'my-offers',
  }, 
  {
    id: 'job-application',
    title: 'Job Applications',
    type: 'item',
    icon: 'heroicons-outline:document-text', // 📄 Candidatures
    url: '/job-offers/applications',
  },
 {
    id: 'training-recommendation',
    title: 'Training Recommendation',
    type: 'item',
    icon: 'heroicons-outline:academic-cap', // 🎓 Formation / Apprentissage
    url: 'training-recommendation-plan',
  },
  {
    id: 'career-pathing',
    title: 'Career Pathing Recommendation',
    type: 'item',
    icon: 'heroicons-outline:trending-up', // 📈 Progression / Carrière
    url: 'career-pathing-recommendation-plan',
  },
  // Workplace Settings
  {
    id: 'Workplace settings',
    title: 'Workplace Settings',
    type: 'collapse',
    icon: 'heroicons-outline:home', // 🏢 Réglages liés au lieu de travail
    children: [
      {
        id: 'Rooms',
        title: 'Rooms',
        type: 'item',
        icon: 'heroicons-outline:cube', // 🧊 Salles, pièces
        url: 'room-list',
      },
      {
        id: 'Sites',
        title: 'Sites',
        type: 'item',
        icon: 'heroicons-outline:location-marker', // 📍 Localisation
        url: 'site-list',
      },
    ],
  },

  // Legal Settings
  {
    id: 'Legal settings',
    title: 'Legal Settings',
    type: 'collapse',
    icon: 'heroicons-outline:scale', // ⚖️ Paramètres juridiques
    children: [
      {
        id: 'contracts',
        title: 'Contracts',
        type: 'item',
        icon: 'heroicons-outline:document-text', // ✅ Contrats validés
        url: 'ContractTypeList',
      },
      {
        id: 'Payslip',
        title: 'Payslip',
        type: 'item',
        icon: 'heroicons-outline:currency-dollar' ,
        url: 'payslip-list',
      },
      {
        id: 'insurance',
        title: 'Insurances',
        type: 'item',
        icon: 'heroicons-outline:shield-check', // 🛡️ Assurances
        url: 'insurrance-list',
      },
      {
        id: 'working modes',
        title: 'Working Modes',
        type: 'item',
        icon: 'heroicons-outline:briefcase', // 🔁 Télétravail / présentiel
        url: 'work-mode-list',
      },
    ],
  },

  // Others
  {
    id: 'others',
    title: 'Others',
    type: 'collapse',
    icon: 'heroicons-outline:ellipsis-horizontal-circle', // ⭕ Regroupement divers
    children: [
      {
        id: 'clients',
        title: 'Clients',
        type: 'item',
        icon: 'heroicons-outline:user-circle', // 👤 Relation client
        url: 'clients',
      },
      {
        id: 'departments',
        title: 'Departments',
        type: 'item',
        icon: 'heroicons-outline:view-grid', // 🏛️ Structures internes
        url: 'DepartmentList',
      },
      {
        id: 'Diplomas',
        title: 'Diplomas',
        type: 'item',
        icon: 'heroicons-outline:academic-cap', // 🎓 Diplômes, certificats
        url: 'diploma-type',
      },
    ],
  },
];

export default navigationConfig;
