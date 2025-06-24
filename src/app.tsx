// App.tsx
import { ThemeProvider } from "@/components/theme-provider";
import { LanguageProvider } from "@/components/language-provider";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "@/pages/home-page";
import ReportsPage from "@/pages/reports-page";
import DaysOffPage from "@/pages/days-off-page";
import ProjectsPage from "@/pages/projects-page";
import LoginPage from "@/pages/login-page";
import AppLayout from "@/layouts/app-layout";
import AuthLayout from "@/layouts/auth-layout";

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={
                <AppLayout>
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
    </ThemeProvider>
  );
}

export default App;
