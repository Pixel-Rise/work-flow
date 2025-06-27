// App.tsx
import { ThemeProvider } from "@/components/theme-provider";
import { LanguageProvider } from "@/components/language-provider";
import { TitleProvider } from "@/components/title-provider";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "@/pages/home-page";
import ReportsPage from "@/pages/reports-page";
import DaysOffPage from "@/pages/days-off-page";
import ProjectsPage from "@/pages/projects-page";
import ChatsPage from "@/pages/chats-page";
import LoginPage from "@/pages/login-page";
import TasksPage from "@/pages/tasks-page";
import AppLayout from "@/layouts/app-layout";
import AuthLayout from "@/layouts/auth-layout";
import { PrimaryColorProvider } from "@/components/primary-color-provider";

function App() {
  return (
    <ThemeProvider>
      <PrimaryColorProvider>
        <TitleProvider>
          <LanguageProvider>
            <BrowserRouter>
              <Routes>
                <Route
                  path="/"
                  element={
                    <AppLayout >
                      <HomePage />
                    </AppLayout>
                  }
                />
                <Route
                  path="/projects"
                  element={
                    <AppLayout>
                      <ProjectsPage />
                    </AppLayout>
                  }
                />
                <Route
                  path="/reports"
                  element={
                    <AppLayout>
                      <ReportsPage />
                    </AppLayout>
                  }
                />
                <Route
                  path="/days-off"
                  element={
                    <AppLayout>
                      <DaysOffPage />
                    </AppLayout>
                  }
                />
                <Route
                  path="/chats"
                  element={
                    <AppLayout>
                      <ChatsPage />
                    </AppLayout>
                  }
                />
                <Route
                  path="/tasks/:projectId"
                  element={
                    <AppLayout>
                      <TasksPage />
                    </AppLayout>
                  }
                />
                <Route
                  path="/login"
                  element={
                    <AuthLayout>
                      <LoginPage />
                    </AuthLayout>
                  }
                />
              </Routes>
            </BrowserRouter>
          </LanguageProvider>
        </TitleProvider>
      </PrimaryColorProvider>
    </ThemeProvider>
  );
}

export default App;
