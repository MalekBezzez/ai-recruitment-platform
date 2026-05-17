import FuseUtils from '@fuse/utils';
import FuseLoading from '@fuse/core/FuseLoading';
import { Navigate } from 'react-router-dom';
import settingsConfig from 'app/configs/settingsConfig';
import Error404Page from '../main/404/Error404Page';

// Auth
import SignInConfig from '../main/sign-in/SignInConfig';
import SignUpConfig from '../main/sign-up/SignUpConfig';
import SignOutConfig from '../main/sign-out/SignOutConfig';
import ChangePasswordConfig from '../main/change-password/ChangePasswordConfig';
import ResetPasswordConfig from '../main/reset-password/ResetPasswordConfig';
import ResetPassword1Config from '../main/resetpassword/ResetPassword1Config';

// Example / Dashboard
import ExampleConfig from '../main/example/ExampleConfig';
import EmployeeByManagerConfig from '../main/EmployeeByManager/EmployeeByManagerConfig';
// Employees & Account
import AddAccountConfig from '../main/add-account/AddAccountConfig';
import EmployeeListConfig from '../main/Employees-list/EmployeeListConfig';
import EmployeeProfileConfig from '../main/Employee-profile/EmployeeProfileConfig';
import EmployeeUpdateConfig from '../main/Employee-update/EmployeeUpdateConfig';

// Insurance & Diploma
import addInsuranceConfig from '../main/add-insurrance/addInsurranceConfig';
import InsuranceListConfig from '../main/insurrance-list/InsurranceListConfig';
import InsuranceProfileConfig from '../main/insurrance-profile/InsurranceProfileConfig';
import UpdateInsuranceConfig from '../main/Insurrance-update/UpdateInsuranceConfig';
import uploadPhotoConfig from '../main/uploadphoto/uploadphotoconfig';
import DiplomaManagementConfig from '../main/DiplomaManagement/DiplomaManagementConfig';
import PredictionResultListConfig from '../main/PredictionResultList/PredictionResultLisConfig';
// Leave Management

import LeaveRequestListConfig from '../main/liste-des-demande-conges/LeaveRequestListConfig';
import LeaveRequestListConfigrh from '../main/liste-des-demande-conges rh/LeaveRequestListConfigrh';
import LeaveRequestDetailsConfig from '../main/LeaveRequestDetails/LeaveRequestDetailsConfig';
import LeaveRequestDetailConfig from '../main/LeaveRequestDetail/LeaveRequestDetailConfig';
import addLeaveRequestsConfig from '../main/addLeaveRequests/addLeaveRequestsConfig';
import LeaveRequestEmployeeListConfig from '../main/LeaveRequestEmployeeList/LeaveRequestEmployeeListConfig';
import LeaveRequestListEmployeeConfig from '../main/LeaveRequestListEmployeePage/LeaveRequestListEmployeeConfig';
import DecisionProcessingConfig from '../main/DecisionProcessing/DecisionProcessingConfig';
import DecisionProcessingConfigrh from '../main/DecisionProcessing copy/DecisionProcessingConfigrh';
import AddLeaveTypeConfig from '../main/AddLeaveType/AddLeaveTypeConfig';
import LeaveTypesListConfig from '../main/leave-type-list/LeaveTypesListConfig';
import RHValidatedLeavesConfig from '../main/acceptedleave/RHValidatedLeaveConfig';
import HistoricLeaveManagerConfig from '../main/historicLeaveManager/historicLeaveManagerConfig';
import HistoryWorkflowLeaveListConfig from '../main/HistoryWorkflowLeaveList/HistoryWorkflowLeaveListConfig';
import HomeWelcomeConfig from '../main/Home/HomeWelcomeConfig';

// Departments & Contracts
import AddDepartmentConfig from '../main/AddDepartment/AddDepartmentConfig';
import DepartmentListConfig from '../main/DepartmentList/DepartmentListConfig';
import AddContractTypeConfig from '../main/AddContractType/AddContractTypeConfig';
import ContractTypeListConfig from '../main/ContractTypeList/ContractTypeListConfig';

// Projects & Tasks
import AddProjectConfig from '../main/AddProject/AddProjectConfig';
import ProjectListConfig from '../main/ProjectList/ProjectListConfig';
import AddPhaseConfig from '../main/AddPhase/AddPhaseConfig';
import PhaseListByProjectConfig from '../main/PhaseListByProject/PhaseListByProjectConfig';
import AddTaskConfig from '../main/AddTask/AddTaskConfig';
import TaskListByPhaseConfig from '../main/TaskListByPhase/TaskListByPhaseConfig';
import TaskEditConfig from '../main/EditTask/TaskEditConfig ';
import AddSubtaskConfig from '../main/AddSubtask/AddSubtaskConfig';
import ProjectDetailPageConfig from '../main/ProjectDetail/ProjectDetailPageConfig';
import TaskSubtaskConfig from '../main/TaskSubtask/TaskSubtaskConfig';
import TaskDetailConfig from '../main/TaskDetail/TaskDetailConfig';
import EditPhaseConfig from '../main/EditPhase/EditPhaseConfig';
import EditProjectConfig from '../main/EditProject/EditProjectConfig';
// Evaluations
import AddYearEvaluationConfig from '../main/add-YearEvaluation/AddYearEvaluationConfig';
import YearEvaluationEmployeeConfig from '../main/YearEvaluationEmployee/YearEvaluationEmployeeConfig';
import EditYearEvaluationConfig from '../main/yearevaluation-update/EditYearEvaluationConfig';

// Client & Survey
import AddClientConfig from '../main/AddClient/AddClientConfig';
import ClientListConfig from '../main/ClientList/ClientListConfig';
import ClientProfileConfig from '../main/ClientProfile/ClientProfileConfig';
import EditClientConfig from '../main/EditClient/EditClientConfig';
import QuestionnaireCreateConfig from '../main/CreateQuestionnaire/QuestionnaireCreateConfig';
import QuestionnaireListConfig from '../main/QuestionnaireList/QuestionnaireListConfig';
import AnswerQuestionnaireConfig from '../main/AnswerQuestionnaire/AnswerQuestionnaireConfig';
import SatisfactionAnalysisConfig from '../main/SatisfactionAnalysis/SatisfactionAnalysisConfig';
import AnswersByQuestionnaireConfig from '../main/AnswersByQuestionnaire/AnswersByQuestionnaireConfig';
import SurveyManagementConfig from '../main/SurveyManagementPage/SurveyManagementConfig';
import SurveyListConfig from '../main/SurveyList/SurveyListConfig';
import AnalyseResultConfig from '../main/AnalyseResults/AnalyseResultConfig';
import RespondentListPageConfig from '../main/RespondentList/RespondentListPageConfig';
import EmployeeAnswersPageConfig from '../main/EmployeeAnswers/EmployeeAnswersPageConfig';
import ChannelManagerConfig from '../main/ChannelManagerPage/ChannelManagerConfig';
import EmployeeAndChannelConfig from '../main/EmployeeAndChannelList/EmployeeAndChannelConfig ';
import payslipListConfig from '../main/PayslipList/PayslipListConfig';
import PayslipDetailConfig from '../main/PayslipDetail/PayslipDetailConfig';
import AnalyseResultStreamConfig from '../main/AnalysisStream/AnalyseResultConfig' ;
import MessageAnalyseConfig from '../main/MessageAnalyse/MessageAnalyseConfig' ;
// Job Offers
import AddJobPage from '../main/add-job/AddJob';
import OffersProcess from '../main/offers-process/OffersProcess';
import JobApplications from '../main/job-applications/JobApplications';
import MyOffers from '../main/my-offers/MyOffers';
import ManageCandidates from '../main/manage-candidates/ManageCandidates';
import OfferDetails from '../main/offer-details/OfferDetails';
import AddJobConfig from '../main/add-job/AddJobConfig';
import OffersProcessConfig from '../main/offers-process/OffersProcessConfig';
import JobApplicationsConfig from '../main/job-applications/JobApplicationsConfig';
import MyOffersConfig from '../main/my-offers/MyOffersConfig';
import ManageCandidatesConfig from '../main/manage-candidates/ManageCandidatesConfig';
import OfferDetailsConfig from '../main/offer-details/OfferDetailsConfig';
import MyOfferProcessHistoryConfig from '../main/my-offers-process-history/MyOfferProcessHistoryConfig';
import MyTaskConfig from '../main/my-task/MyTaskConfig';
import MyTaskHistoryConfig from '../main/my-task-history/MyTaskHistoryConfig';
import TrainingRecommendationSummaryConfig from '../main/training-recommendation-summary/TrainingRecommendationSummaryConfig';
import SelfTrainingViewConfig from '../main/self-training-view/SelfTrainingViewConfig';
import CoachingViewConfig from '../main/coaching-view/CoachingViewConfig';
import StructuredTrainingViewConfig from '../main/structured-training-view/StructuredTrainingViewConfig';
import TrainingTabsPageConfig from '../main/training-rec-tabs-page/TrainingTabsPageConfig';
import DecisionJobOfferConfig from '../main/decision-joboffer/DecisionJobOfferConfig';
// ✅ Career Pathing Recommendation (MISSING in file 2)
import CareerRecommendationSummaryConfig from '../main/career-recommendation-summary/CareerRecommendationSummaryConfig';
import CareerPathingResultsConfig from '../main/career-pathing-results/CareerPathingResultsConfig';

// ✅ Career Pathing main page (MISSING in file 2)
import CareerPathingConfig from '../main/career-pathing/CareerPathingConfig';
// Timesheet
import TimesheetConfig from '../main/TimeSheet/TimesheetConfig';
import ImputationDetailConfig from '../main/ImputationDetail/ImputationDetailConfig';
import InvalidImputationsByUserConfig from '../main/invalideinmputationByuser/InvalidImputationsByUserConfig';
import ScheduleInterviewConfig from '../main/schedule-interview/ScheduleInterviewConfig';
import InterviewsListConfig from '../main/interviews-list/InterviewsListConfig';
import AllInterviewsListConfig from '../main/all-intrerviews-list/AllInterviewsListConfig';
import DiplomaTypeOfferConfig from '../main/diploma-type-offer/DiplomaTypeOfferConfig';
import AddDiplomaTypeConfig from '../main/add-diploma-type-offer/AddDiplomaTypeConfig';
import WorkModeListConfig from '../main/work-mode/WorkModeListConfig';
import AddWorkModeConfig from '../main/add-work-mode/AddWorkModeConfig';
import SiteListConfig from '../main/site-list/SiteListConfig';
import AddSiteConfig from '../main/add-site/AddSiteConfig';
import RoomListConfig from '../main/room-list/RoomListConfig';
import AddRoomConfig from '../main/add-room/AddRoomConfig';
import CurrencyListConfig from '../main/currency-list/CurrencyListConfig';
import AddCurrencyConfig from '../main/add-currency/AddCurrencyConfig';

import ApplicationsListConfig from '../main/applications-list/ApplicationsListConfig';

// Aggregate all configs
const routeConfigs = [
    // Core & Auth
  PredictionResultListConfig,  ExampleConfig, SignInConfig, SignUpConfig, SignOutConfig, ChangePasswordConfig, ResetPasswordConfig, ResetPassword1Config,
// Applications
ApplicationsListConfig,CareerPathingConfig,CareerPathingResultsConfig, CareerRecommendationSummaryConfig, TrainingRecommendationSummaryConfig, SelfTrainingViewConfig, CoachingViewConfig, StructuredTrainingViewConfig, TrainingTabsPageConfig,
 ,
// Interviews
ScheduleInterviewConfig, InterviewsListConfig, AllInterviewsListConfig,DecisionJobOfferConfig ,

// Diploma / Work Mode / Site / Room
DiplomaTypeOfferConfig, AddDiplomaTypeConfig, WorkModeListConfig, AddWorkModeConfig,
SiteListConfig, AddSiteConfig, RoomListConfig, AddRoomConfig,

// Currency
CurrencyListConfig, AddCurrencyConfig,

// Decision Job Offer
 ,

    // Employees & Accounts
    EmployeeByManagerConfig , AddAccountConfig, EmployeeListConfig, EmployeeProfileConfig, EmployeeUpdateConfig,
payslipListConfig , PayslipDetailConfig,
    // Insurance & Diploma
    addInsuranceConfig, InsuranceListConfig, InsuranceProfileConfig, UpdateInsuranceConfig, uploadPhotoConfig, DiplomaManagementConfig,

    // Leave & RH
 LeaveRequestListConfig, LeaveRequestListConfigrh, LeaveRequestDetailsConfig, LeaveRequestDetailConfig,
    addLeaveRequestsConfig, LeaveRequestEmployeeListConfig, LeaveRequestListEmployeeConfig, DecisionProcessingConfig,
    DecisionProcessingConfigrh, AddLeaveTypeConfig, LeaveTypesListConfig, RHValidatedLeavesConfig, HistoricLeaveManagerConfig,
    HistoryWorkflowLeaveListConfig,
SatisfactionAnalysisConfig ,MessageAnalyseConfig ,
    // Departments & Contracts
    AddDepartmentConfig, DepartmentListConfig, AddContractTypeConfig, ContractTypeListConfig,

    // Projects & Tasks
    AddProjectConfig, ProjectListConfig, AddPhaseConfig, PhaseListByProjectConfig, AddTaskConfig, TaskListByPhaseConfig,
    TaskEditConfig, AddSubtaskConfig, ProjectDetailPageConfig, TaskSubtaskConfig, TaskDetailConfig,EditPhaseConfig ,
    EditProjectConfig ,

    // Evaluations
    AddYearEvaluationConfig, YearEvaluationEmployeeConfig, EditYearEvaluationConfig,

    // Clients & Survey
    AddClientConfig, ClientListConfig, ClientProfileConfig, EditClientConfig, QuestionnaireCreateConfig, QuestionnaireListConfig,
    AnswerQuestionnaireConfig, AnswersByQuestionnaireConfig, SurveyManagementConfig, SurveyListConfig, AnalyseResultConfig,
    RespondentListPageConfig, EmployeeAnswersPageConfig, ChannelManagerConfig, EmployeeAndChannelConfig,

    // Job Offers
    AddJobConfig, OffersProcessConfig, JobApplicationsConfig, MyOffersConfig, ManageCandidatesConfig, OfferDetailsConfig,
    MyOfferProcessHistoryConfig, MyTaskConfig, MyTaskHistoryConfig,HomeWelcomeConfig,

    // Timesheet
    TimesheetConfig, ImputationDetailConfig, InvalidImputationsByUserConfig,AnalyseResultStreamConfig
];

// Routes definition
const routes = [
    ...FuseUtils.generateRoutesFromConfigs(routeConfigs, settingsConfig.defaultAuth),

    // Default redirect
    {
        path: '/',
        element: <Navigate to="/example" />,
        auth: settingsConfig.defaultAuth,
    },

    // Standalone job offer routes
    { path: 'add-joboffer', element: <AddJobPage /> },
    { path: 'edit-joboffer/:id', element: <AddJobPage /> },
    { path: 'offers-applications', element: <JobApplications /> },
    { path: 'offers-process', element: <OffersProcess /> },
    { path: 'manage-candidates', element: <ManageCandidates /> },
    { path: 'my-offers', element: <MyOffers /> },
    { path: 'offer-details/:id', element: <OfferDetails /> },

    // Loading and error
    { path: 'loading', element: <FuseLoading /> },
    { path: '404', element: <Error404Page /> },
    { path: '*', element: <Navigate to="404" /> }
];

export default routes;
