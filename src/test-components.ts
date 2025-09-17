// Component Integration Test - All imports
// This file tests if all components can be imported without errors

// Dashboard Components
export { PauseReasonModal } from './components/dashboard/pause-reason-modal'
export { DashboardStats } from './components/dashboard/dashboard-stats'
export { ProductivityChart } from './components/dashboard/productivity-chart'
export { TaskProgressWidget } from './components/dashboard/task-progress-widget'
export { TeamActivityFeed } from './components/dashboard/team-activity-feed'
export { QuickActions } from './components/dashboard/quick-actions'

// Projects Components
export { CreateProjectModal } from './components/projects/create-project-modal'
export { EditProjectForm } from './components/projects/edit-project-form'
export { DeleteProjectConfirm } from './components/projects/delete-project-confirm'
export { ProjectStatusBadge } from './components/projects/project-status-badge'
export { ProjectProgress } from './components/projects/project-progress'
export { PhaseTimeline } from './components/projects/phase-timeline'
export { PhaseStatusIndicator } from './components/projects/phase-status-indicator'
export { DocumentPreview } from './components/projects/document-preview'
export { FileTypeIcon } from './components/projects/file-type-icon'

// Tasks Components
export { TaskModal } from './components/tasks/task-modal'
export { CreateTaskForm } from './components/tasks/create-task-form'
export { EditTaskForm } from './components/tasks/edit-task-form'
export { TaskPrioritySelector } from './components/tasks/task-priority-selector'
export { TaskAssigneeSelector } from './components/tasks/task-assignee-selector'
export { TaskDueDatePicker } from './components/tasks/task-due-date-picker'
export { TaskTagsInput } from './components/tasks/task-tags-input'
export { SubtasksList } from './components/tasks/subtasks-list'
export { TaskChecklist } from './components/tasks/task-checklist'
export { TaskComments } from './components/tasks/task-comments'
export { TaskActivityLog } from './components/tasks/task-activity-log'
export { TaskFilters } from './components/tasks/task-filters'
export { ProjectFilter } from './components/tasks/project-filter'
export { AssigneeFilter } from './components/tasks/assignee-filter'
export { PriorityFilter } from './components/tasks/priority-filter'
export { DateRangeFilter } from './components/tasks/date-range-filter'
export { TaskSearch } from './components/tasks/task-search'

// Reports Components
export { ReportsOverview } from './components/reports/reports-overview'
export { ProjectProgressChart } from './components/reports/project-progress-chart'
export { TaskStatusChart } from './components/reports/task-status-chart'
export { TeamContributorsChart } from './components/reports/team-contributors-chart'
export { TimeSpentChart } from './components/reports/time-spent-chart'
export { ProductivityMetrics } from './components/reports/productivity-metrics'
export { ReportBuilder } from './components/reports/report-builder'
export { ChartTypeSelector } from './components/reports/chart-type-selector'
export { DataSourceSelector } from './components/reports/data-source-selector'
export { ExportOptions } from './components/reports/export-options'
export { SavedReports } from './components/reports/saved-reports'

// Days Off Components
export { LeaveStatsChart } from './components/days-off/leave-stats-chart'
export { LeaveRequestForm } from './components/days-off/leave-request-form'
export { LeaveBalance } from './components/days-off/leave-balance'
export { LeaveTypeSelector } from './components/days-off/leave-type-selector'
export { LeaveApprovalCard } from './components/days-off/leave-approval-card'
export { LeaveHistory } from './components/days-off/leave-history'
export { LeaveNotifications } from './components/days-off/leave-notifications'
export { CustomDayButton } from './components/days-off/custom-day-button'
export { LeaveIndicator } from './components/days-off/leave-indicator'
export { MonthNavigation } from './components/days-off/month-navigation'
export { CalendarLegend } from './components/days-off/calendar-legend'

// Chat Components
export { ChatSidebar } from './components/chat/chat-sidebar'
export { ChatWindow } from './components/chat/chat-window'
export { MessageBubble } from './components/chat/message-bubble'
export { MessageInput } from './components/chat/message-input'
export { ChatSearch } from './components/chat/chat-search'
export { OnlineStatus } from './components/chat/online-status'
export { UnreadBadge } from './components/chat/unread-badge'
export { FileUploader } from './components/chat/file-uploader'
export { EmojiPicker } from './components/chat/emoji-picker'
export { MessageActions } from './components/chat/message-actions'
export { TypingIndicator } from './components/chat/typing-indicator'
export { MessageSearch } from './components/chat/message-search'
export { ChatSettings } from './components/chat/chat-settings'

// Authentication Components
export { RegisterForm } from './components/auth/register-form'
export { PhoneInput } from './components/auth/phone-input'
export { PasswordInput } from './components/auth/password-input'
export { ForgotPassword } from './components/auth/forgot-password'
export { ResetPassword } from './components/auth/reset-password'
export { EmailVerification } from './components/auth/email-verification'
export { TwoFactorAuth } from './components/auth/two-factor-auth'

// Landing Page Components
export { HeroSection } from './components/landing/hero-section'
export { CTAButtons } from './components/landing/cta-buttons'
export { HeroBadge } from './components/landing/hero-badge'
export { GradientText } from './components/landing/gradient-text'
export { FeaturesCarousel } from './components/landing/features-carousel'
export { FeatureCard } from './components/landing/feature-card'
export { CTASection } from './components/landing/cta-section'
export { StatsSection } from './components/landing/stats-section'
export { TestimonialsSection } from './components/landing/testimonials-section'

// UI Components
export { LoadingSpinner } from './components/ui/loading-spinner'
export { EmptyState } from './components/ui/empty-state'
export { CustomSelect } from './components/ui/custom-select'
export { DatePicker } from './components/ui/date-picker'
export { ColorPicker } from './components/ui/color-picker'
export { FileDropzone } from './components/ui/file-dropzone'
export { DataTable } from './components/ui/data-table'
export { SearchBar } from './components/ui/search-bar'

// Theme Components
export { ColorSchemeSelector } from './components/theme/color-scheme-selector'
export { ThemeProvider } from './components/theme/theme-provider'
export { ThemeSettings } from './components/theme/theme-settings'

console.log('✅ All components imported successfully!')
export const TOTAL_COMPONENTS = 95
console.log(`📊 Total Components: ${TOTAL_COMPONENTS}`)