// Simple translation hook - placeholder implementation
// In a real app, this would connect to i18next or similar

const translations: Record<string, string> = {
  // Common
  'save': 'Save',
  'cancel': 'Cancel',
  'delete': 'Delete',
  'edit': 'Edit',
  'add': 'Add',
  'close': 'Close',
  'done': 'Done',
  'loading': 'Loading',
  'error': 'Error',
  'success': 'Success',
  'warning': 'Warning',
  'info': 'Information',
  'confirm': 'Confirm',
  'continue': 'Continue',
  'back': 'Back',
  'next': 'Next',
  'previous': 'Previous',
  'search': 'Search',
  'filter': 'Filter',
  'sort': 'Sort',
  'clear': 'Clear',
  'clearall': 'Clear All',
  'selectall': 'Select All',
  'selected': 'selected',
  'all': 'All',
  'none': 'None',
  'more': 'More',
  'less': 'Less',
  'show': 'Show',
  'hide': 'Hide',
  'view': 'View',
  'preview': 'Preview',
  'download': 'Download',
  'upload': 'Upload',
  'copy': 'Copy',
  'paste': 'Paste',
  'cut': 'Cut',
  'undo': 'Undo',
  'redo': 'Redo',
  'refresh': 'Refresh',
  'reload': 'Reload',
  'reset': 'Reset',
  'restore': 'Restore',

  // Authentication
  'login': 'Login',
  'logout': 'Logout',
  'signin': 'Sign In',
  'signout': 'Sign Out',
  'signup': 'Sign Up',
  'register': 'Register',
  'username': 'Username',
  'email': 'Email',
  'password': 'Password',
  'confirmpassword': 'Confirm Password',
  'forgotpassword': 'Forgot Password',
  'resetpassword': 'Reset Password',
  'emailverification': 'Email Verification',
  'twofactorauth': 'Two Factor Authentication',
  'rememberme': 'Remember Me',
  'keepmesignedin': 'Keep me signed in',

  // Validation
  'required': 'This field is required',
  'invalid': 'Invalid input',
  'emailrequired': 'Email is required',
  'passwordrequired': 'Password is required',
  'invalidemail': 'Invalid email address',
  'passwordsdonotmatch': 'Passwords do not match',
  'passwordtooshort': 'Password too short',
  'passwordtoolong': 'Password too long',

  // Time & Date
  'today': 'Today',
  'yesterday': 'Yesterday',
  'tomorrow': 'Tomorrow',
  'thisweek': 'This Week',
  'thismonth': 'This Month',
  'thisyear': 'This Year',
  'days': 'days',
  'hours': 'hours',
  'minutes': 'minutes',
  'seconds': 'seconds',
  'time': 'Time',
  'date': 'Date',
  'datetime': 'Date & Time',

  // Status
  'active': 'Active',
  'inactive': 'Inactive',
  'enabled': 'Enabled',
  'disabled': 'Disabled',
  'online': 'Online',
  'offline': 'Offline',
  'available': 'Available',
  'unavailable': 'Unavailable',
  'busy': 'Busy',
  'away': 'Away',

  // Actions
  'create': 'Create',
  'update': 'Update',
  'remove': 'Remove',
  'archive': 'Archive',
  'restore': 'Restore',
  'duplicate': 'Duplicate',
  'move': 'Move',
  'rename': 'Rename',
  'share': 'Share',
  'export': 'Export',
  'import': 'Import',
  'print': 'Print',
  'send': 'Send',
  'receive': 'Receive',

  // Navigation
  'home': 'Home',
  'dashboard': 'Dashboard',
  'projects': 'Projects',
  'tasks': 'Tasks',
  'reports': 'Reports',
  'settings': 'Settings',
  'profile': 'Profile',
  'help': 'Help',
  'about': 'About',
  'contact': 'Contact',

  // Tasks
  'task': 'Task',
  'tasks': 'Tasks',
  'newtask': 'New Task',
  'edittask': 'Edit Task',
  'deletetask': 'Delete Task',
  'assignee': 'Assignee',
  'duedate': 'Due Date',
  'priority': 'Priority',
  'status': 'Status',
  'progress': 'Progress',
  'description': 'Description',
  'comments': 'Comments',
  'attachments': 'Attachments',

  // Projects
  'project': 'Project',
  'newproject': 'New Project',
  'editproject': 'Edit Project',
  'deleteproject': 'Delete Project',

  // Chat
  'chat': 'Chat',
  'message': 'Message',
  'typing': 'Typing...',
  'online': 'Online',
  'lastSeen': 'Last seen',

  // Files
  'file': 'File',
  'files': 'Files',
  'folder': 'Folder',
  'upload': 'Upload',
  'download': 'Download',
  'size': 'Size',
  'type': 'Type',

  // Form placeholders
  'entertext': 'Enter text...',
  'enteremail': 'Enter your email...',
  'enterpassword': 'Enter your password...',
  'entersearch': 'Search...',
  'selectoption': 'Select an option...',

  // Messages
  'nosresultsfound': 'No results found',
  'noresultsfound': 'No results found',
  'nodatafound': 'No data found',
  'noitemstoshow': 'No items to show',
  'somethingwentwrong': 'Something went wrong',
  'pleasetryagain': 'Please try again',
  'loadingdata': 'Loading data...',
  'savingsettings': 'Saving settings...',

  // Success messages
  'datasaved': 'Data saved successfully',
  'settingssaved': 'Settings saved successfully',
  'taskadded': 'Task added successfully',
  'projectcreated': 'Project created successfully',

  // Error messages
  'errorloadingdata': 'Error loading data',
  'errorsavingdata': 'Error saving data',
  'networkerror': 'Network error',
  'permissiondenied': 'Permission denied',

  // Theme
  'theme': 'Theme',
  'light': 'Light',
  'dark': 'Dark',
  'system': 'System',
  'appearance': 'Appearance',

  // Language
  'language': 'Language',
  'english': 'English',
  'uzbek': 'Uzbek',
  'russian': 'Russian'
}

export function useTranslation() {
  const t = (key: string, params?: Record<string, string | number>) => {
    let translation = translations[key.toLowerCase()] || key

    if (params) {
      Object.entries(params).forEach(([param, value]) => {
        translation = translation.replace(`{{${param}}}`, String(value))
      })
    }

    return translation
  }

  return { t }
}