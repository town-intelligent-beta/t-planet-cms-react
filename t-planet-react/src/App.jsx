import Nav from "./pages/components/Nav";
import Footer from "./pages/components/Footer";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Kpi from "./pages/kpi/Kpi";
import ProjectContent from "./pages/kpi/components/ProjectContent";
import AdminAgentDashboard from "./pages/backend/AdminAgentDashboard";
import CsmAgent from "./pages/backend/CmsAgent";
import CmsProjectDetail from "./pages/backend/CmsProjectDetail";
import CmsPlanInfo from "./pages/backend/CmsProject/CmsPlanInfo";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./utils/ProtectRoute";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col">
          {/* Fixed Navigation */}
          <div className="fixed top-0 left-0 right-0 z-50">
            <Nav />
          </div>

          {/* Main Content with Padding for Fixed Nav */}
          <main className="flex-grow mt-20">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/kpi" element={<Kpi />} />
              <Route path="/content/:id" element={<ProjectContent />} />
              <Route path="/tplanet_signin" element={<SignIn />} />
              <Route path="/tplanet_signup" element={<SignUp />} />
              <Route
                path="/backend/admin_agent_dashboard"
                element={<AdminAgentDashboard />}
              />
              <Route path="/backend/cms_agent" element={<CsmAgent />} />
              <Route
                path="/backend/cms_project_detail/:id"
                element={<CmsProjectDetail />}
              />
              <Route
                path="/backend/cms_plan_info/:id"
                element={<CmsPlanInfo />}
              />
            </Routes>
          </main>

          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
