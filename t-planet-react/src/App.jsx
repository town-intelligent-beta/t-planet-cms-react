import Nav from "./pages/components/Nav";
import Footer from "./pages/components/Footer";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <Nav />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
        <Routes>
          <Route path="/tplanet_signin" element={<SignIn />} />
        </Routes>
      </BrowserRouter>
      <Footer />
    </>
  );
}

export default App;
