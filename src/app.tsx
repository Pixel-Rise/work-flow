// App.tsx
import { ThemeProvider } from "@/components/theme-provider";
import { LanguageProvider } from "@/components/language-provider";
import { TitleProvider } from "@/components/title-provider";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "@/pages/home-page";
import ReportsPage from "@/pages/reports-page";
import DaysOffPage from "@/pages/days-off-page";
import ProjectsPage from "@/pages/projects-page";
import ChatsPage from "@/pages/chats-page";
import LoginPage from "@/pages/login-page";
import LandingPage from "@/pages/landing-page";
import TasksPage from "@/pages/tasks-page";
import AppLayout from "@/layouts/app-layout";
import PublicLayout from "@/layouts/public-layout";
import { PrimaryColorProvider } from "@/components/primary-color-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { authLoader, loginLoader, publicLoader } from "@/lib/auth-loader";
import { Toaster } from "@/components/ui/sonner";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    loader: publicLoader,
    element: (
      <PublicLayout>
        <LandingPage />
      </PublicLayout>
    ),
  },
  {
    path: "/dashboard",
    loader: authLoader,
    element: (
      <AppLayout>
        <HomePage />
      </AppLayout>
    ),
  },
  {
    path: "/projects",
    loader: authLoader,
    element: (
      <AppLayout>
        <ProjectsPage />
      </AppLayout>
    ),
  },
  {
    path: "/reports",
    loader: authLoader,
    element: (
      <AppLayout>
        <ReportsPage />
      </AppLayout>
    ),
  },
  {
    path: "/days-off",
    loader: authLoader,
    element: (
      <AppLayout>
        <DaysOffPage />
      </AppLayout>
    ),
  },
  {
    path: "/chats",
    loader: authLoader,
    element: (
      <AppLayout>
        <ChatsPage />
      </AppLayout>
    ),
  },
  {
    path: "/tasks/:projectId",
    loader: authLoader,
    element: (
      <AppLayout>
        <TasksPage />
      </AppLayout>
    ),
  },
  {
    path: "/login",
    loader: loginLoader,
    element: (
      <PublicLayout>
        <LoginPage />
      </PublicLayout>
    ),
  },
]);


function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <PrimaryColorProvider>
          <TitleProvider>
            <LanguageProvider>
              <RouterProvider router={router} />
              <Toaster 
                position="bottom-right" 
                richColors
                closeButton
                toastOptions={{
                  duration: 4000,
                }}
              />
            </LanguageProvider>
          </TitleProvider>
        </PrimaryColorProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
