import Nav from "./pages/components/Nav";
import Footer from "./pages/components/Footer";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
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
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
