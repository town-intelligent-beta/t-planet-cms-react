import Nav from "./pages/components/Nav";
import Footer from "./pages/components/Footer";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import AdminAgentDashboard from "./pages/backend/AdminAgentDashboard";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./pages/utils/ProtectRoute";

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
          <main className="flex-grow mt-16">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/tplanet_signin" element={<SignIn />} />
              <Route path="/tplanet_signup" element={<SignUp />} />
              <Route
                path="/backend/admin_agent_dashboard"
                element={<AdminAgentDashboard />}
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
