import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import { RoleProtectedRoute } from "@/components/auth/RoleProtectedRoute";
import { ThemeProvider } from "@/components/ThemeProvider";
import Index from "./pages/Index";
import AdminDashboard from "./pages/AdminDashboard";
import CoursesPage from "./pages/admin/CoursesPage";
import LessonsPage from "./pages/admin/LessonsPage";
import QuizzesPage from "./pages/admin/QuizzesPage";
import ChallengesPage from "./pages/admin/ChallengesPage";
import ProfilePage from "./pages/admin/ProfilePage";
import SettingsPage from "./pages/admin/SettingsPage";
import NotificationsPage from "./pages/admin/NotificationsPage";
import UsersPage from "./pages/admin/UsersPage";
import CreateCoursePage from "./pages/admin/CreateCoursePage";
import EditCoursePage from "./pages/admin/EditCoursePage";
import ViewCoursePage from "./pages/admin/ViewCoursePage";
import CreateLessonPage from "./pages/admin/CreateLessonPage";
import EditLessonPage from "./pages/admin/EditLessonPage";
import ViewLessonPage from "./pages/admin/ViewLessonPage";
import CreateQuizPage from "./pages/admin/CreateQuizPage";
import CreateChallengePage from "./pages/admin/CreateChallengePage";
import LanguagesPage from "./pages/admin/LanguagesPage";
import CreateLanguagePage from "./pages/admin/CreateLanguagePage";
import EditLanguagePage from "./pages/admin/EditLanguagePage";
import ViewLanguagePage from "./pages/admin/ViewLanguagePage";
import AnalyticsPage from "./pages/admin/AnalyticsPage";
import NotFound from "./pages/NotFound";
import QuestionsPage from "./pages/admin/QuestionsPage";
import CreateQuestionPage from "./pages/admin/CreateQuestionPage";
import EditQuestionPage from "./pages/admin/EditQuestionPage";
import ViewQuestionPage from "./pages/admin/ViewQuestionPage";
import ViewQuizPage from "./pages/admin/ViewQuizPage";
import EditQuizPage from "./pages/admin/EditQuizPage";
import CertificatesPage from "./pages/admin/CertificatesPage";
import ProctorEventsPage from "./pages/admin/ProctorEventsPage";

const App = () => {
  // Create QueryClient inside the component to ensure proper React context
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 minutes
        retry: 1,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
          <AuthProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/admin" element={
                  <RoleProtectedRoute allowedRoles={['ROLE_ADMIN', 'ROLE_PROCTOR']}>
                    <AdminDashboard />
                  </RoleProtectedRoute>
                } />
                <Route path="/admin/languages" element={
                  <RoleProtectedRoute allowedRoles={['ROLE_PROCTOR', 'ROLE_ADMIN']}>
                    <LanguagesPage />
                  </RoleProtectedRoute>
                } />
                <Route path="/admin/languages/new" element={
                  <RoleProtectedRoute allowedRoles={['ROLE_PROCTOR']}>
                    <CreateLanguagePage />
                  </RoleProtectedRoute>
                } />
                <Route path="/admin/languages/:id/edit" element={
                  <RoleProtectedRoute allowedRoles={['ROLE_PROCTOR']}>
                    <EditLanguagePage />
                  </RoleProtectedRoute>
                } />
                <Route path="/admin/languages/:id/view" element={
                  <RoleProtectedRoute allowedRoles={['ROLE_PROCTOR']}>
                    <ViewLanguagePage />
                  </RoleProtectedRoute>
                } />
                <Route path="/admin/courses" element={
                  <RoleProtectedRoute allowedRoles={['ROLE_ADMIN', 'ROLE_PROCTOR']}>
                    <CoursesPage />
                  </RoleProtectedRoute>
                } />
                <Route path="/admin/courses/new" element={
                  <RoleProtectedRoute allowedRoles={['ROLE_PROCTOR']}>
                    <CreateCoursePage />
                  </RoleProtectedRoute>
                } />
                <Route path="/admin/courses/:id/edit" element={
                  <RoleProtectedRoute allowedRoles={['ROLE_PROCTOR']}>
                    <EditCoursePage />
                  </RoleProtectedRoute>
                } />
                <Route path="/admin/courses/:id/view" element={
                  <RoleProtectedRoute allowedRoles={['ROLE_ADMIN', 'ROLE_PROCTOR']}>
                    <ViewCoursePage />
                  </RoleProtectedRoute>
                } />
                <Route path="/admin/lessons" element={
                  <RoleProtectedRoute allowedRoles={['ROLE_ADMIN', 'ROLE_PROCTOR']}>
                    <LessonsPage />
                  </RoleProtectedRoute>
                } />
                <Route path="/admin/lessons/new" element={
                  <RoleProtectedRoute allowedRoles={['ROLE_PROCTOR']}>
                    <CreateLessonPage />
                  </RoleProtectedRoute>
                } />
                <Route path="/admin/lessons/:id/edit" element={
                  <RoleProtectedRoute allowedRoles={['ROLE_PROCTOR']}>
                    <EditLessonPage />
                  </RoleProtectedRoute>
                } />
                <Route path="/admin/lessons/:id/view" element={
                  <RoleProtectedRoute allowedRoles={['ROLE_ADMIN', 'ROLE_PROCTOR']}>
                    <ViewLessonPage />
                  </RoleProtectedRoute>
                } />
                <Route path="/admin/questions" element={
                  <RoleProtectedRoute allowedRoles={['ROLE_PROCTOR']}>
                    <QuestionsPage />
                  </RoleProtectedRoute>
                } />
                <Route path="/admin/questions/new" element={
                  <RoleProtectedRoute allowedRoles={['ROLE_PROCTOR']}>
                    <CreateQuestionPage />
                  </RoleProtectedRoute>
                } />
                <Route path="/admin/questions/:id/edit" element={
                  <RoleProtectedRoute allowedRoles={['ROLE_PROCTOR']}>
                    <EditQuestionPage />
                  </RoleProtectedRoute>
                } />
                <Route path="/admin/questions/:id/view" element={
                  <RoleProtectedRoute allowedRoles={['ROLE_PROCTOR']}>
                    <ViewQuestionPage />
                  </RoleProtectedRoute>
                } />
                <Route path="/admin/quizzes" element={
                  <RoleProtectedRoute allowedRoles={['ROLE_PROCTOR']}>
                    <QuizzesPage />
                  </RoleProtectedRoute>
                } />
                <Route path="/admin/quizzes/new" element={
                  <RoleProtectedRoute allowedRoles={['ROLE_PROCTOR']}>
                    <CreateQuizPage />
                  </RoleProtectedRoute>
                } />
                <Route path="/admin/quizzes/:id/view" element={
                  <RoleProtectedRoute allowedRoles={['ROLE_PROCTOR']}>
                    <ViewQuizPage />
                  </RoleProtectedRoute>
                } />
                <Route path="/admin/quizzes/:id/edit" element={
                  <RoleProtectedRoute allowedRoles={['ROLE_PROCTOR']}>
                    <EditQuizPage />
                  </RoleProtectedRoute>
                } />
                <Route path="/admin/challenges" element={
                  <RoleProtectedRoute allowedRoles={['ROLE_PROCTOR']}>
                    <ChallengesPage />
                  </RoleProtectedRoute>
                } />
                <Route path="/admin/challenges/new" element={
                  <RoleProtectedRoute allowedRoles={['ROLE_PROCTOR']}>
                    <CreateChallengePage />
                  </RoleProtectedRoute>
                } />
                <Route path="/admin/analytics" element={
                  <RoleProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                    <AnalyticsPage />
                  </RoleProtectedRoute>
                } />
                <Route path="/admin/profile" element={
                  <RoleProtectedRoute allowedRoles={['ROLE_ADMIN', 'ROLE_PROCTOR']}>
                    <ProfilePage />
                  </RoleProtectedRoute>
                } />
                <Route path="/admin/settings" element={
                  <RoleProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                    <SettingsPage />
                  </RoleProtectedRoute>
                } />
                <Route path="/admin/notifications" element={
                  <RoleProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                    <NotificationsPage />
                  </RoleProtectedRoute>
                } />
                <Route path="/admin/certificates" element={
                  <RoleProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                    <CertificatesPage />
                  </RoleProtectedRoute>
                } />
                <Route path="/admin/proctor-events" element={
                  <RoleProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                    <ProctorEventsPage />
                  </RoleProtectedRoute>
                } />
                <Route path="/admin/users" element={
                  <RoleProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                    <UsersPage />
                  </RoleProtectedRoute>
                } />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </AuthProvider>
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
