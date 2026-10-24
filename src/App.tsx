import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AdminProvider } from "@/contexts/AdminContext";
import { LanguageProvider } from "@/i18n";
import Layout from "@/components/Layout";
import Index from "./pages/Index";
import ProjectsPage from "./pages/ProjectsPage";
import ProjectDetailPage from "./pages/ProjectDetailPage";
import BlogPage from "./pages/BlogPage";
import BlogPostPage from "./pages/BlogPostPage";
import SkillsPage from "./pages/SkillsPage";
import AboutPage from "./pages/AboutPage";
import EngagementsPage from "./pages/EngagementsPage";
import EngagementChapterPage from "./pages/engagements/EngagementChapterPage";
import ActivitiesPage from "./pages/engagements/ActivitiesPage";
import ContactPage from "./pages/ContactPage";
import NotificationsPage from "./pages/NotificationsPage";
import NotFound from "./pages/NotFound";
import PublicCVPage from "./pages/PublicCVPage";
import AdminOnly from "@/components/AdminOnly";
import AdminLoginPage from "./pages/AdminLoginPage";
import BackendWakeNotice from "@/components/BackendWakeNotice";
import Loader from "@/components/Loader";
import CustomCursor from "@/components/CustomCursor";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LanguageProvider>
      <AdminProvider>
        <Toaster />
        <Sonner />
        <BackendWakeNotice />
        <Loader />
        <CustomCursor />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route element={<Layout fullBleed><Index /></Layout>} path="/" />
            <Route element={<Layout fullBleed><ProjectsPage /></Layout>} path="/projets" />
            <Route element={<Layout fullBleed><ProjectsPage /></Layout>} path="/projets/:category" />
            <Route element={<Layout><ProjectDetailPage /></Layout>} path="/projet/:slug" />
            <Route element={<Layout><BlogPage /></Layout>} path="/blog" />
            <Route element={<Layout><BlogPostPage /></Layout>} path="/blog/:slug" />
            <Route element={<Layout><SkillsPage /></Layout>} path="/competences" />
            <Route element={<Layout><AboutPage /></Layout>} path="/about" />
            {/* Engagements: visible to the admin only for now */}
            <Route element={<Layout><AdminOnly><EngagementsPage /></AdminOnly></Layout>} path="/engagements" />
            <Route element={<Layout><AdminOnly><ActivitiesPage /></AdminOnly></Layout>} path="/engagements/hors-ecran" />
            <Route element={<Layout><AdminOnly><EngagementChapterPage /></AdminOnly></Layout>} path="/engagements/:slug" />
            <Route element={<Layout><ContactPage /></Layout>} path="/contact" />
            <Route element={<Layout><PublicCVPage /></Layout>} path="/cv" />
            <Route element={<Layout><NotificationsPage /></Layout>} path="/notifications" />
            <Route element={<Layout><AdminLoginPage /></Layout>} path="/admin" />

            {/* 404 */}
            <Route path="*" element={<Layout><NotFound /></Layout>} />
          </Routes>
        </BrowserRouter>
      </AdminProvider>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
