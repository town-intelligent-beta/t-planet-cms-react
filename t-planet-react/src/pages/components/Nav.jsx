import { useEffect } from "react";
import Logo from "../../assets/2nd-home.svg";
import User from "../../assets/user.svg";
import { Navbar, Nav, Container } from "react-bootstrap";

export default function Str_Nav() {
  useEffect(() => {
    const links = document.querySelectorAll(".nav-link");
    links.forEach((link) => {
      if (link.href === window.location.href) {
        link.style.opacity = "1";
      } else {
        link.style.opacity = "0.5";
      }
      link.addEventListener("mouseover", () => {
        link.style.opacity = "0.7";
      });
      link.addEventListener("mouseout", () => {
        if (link.href === window.location.href) {
          link.style.opacity = "1";
        } else {
          link.style.opacity = "0.5";
        }
      });
    });

    // Set navbar animation
    const navbar = document.querySelector(".navbar");
    if (navbar) {
      let lastScrollTop = 0;

      const handleScroll = () => {
        const scrollTop = window.scrollY;
        if (scrollTop > lastScrollTop) {
          navbar.classList.add("opacity-70");
        } else {
          navbar.classList.remove("opacity-70");
        }
        lastScrollTop = scrollTop;
      };

      const handleHover = () => {
        navbar.classList.remove("opacity-70");
      };

      navbar.addEventListener("mouseenter", handleHover);
      window.addEventListener("scroll", handleScroll);

      return () => {
        navbar.removeEventListener("mouseenter", handleHover);
        window.removeEventListener("scroll", handleScroll);
      };
    }
  }, []);

  return (
    <Navbar
      expand="xl"
      className="flex items-center justify-between bg-nav w-full navbar"
    >
      <Container fluid>
        <Navbar.Brand href="/" className="d-none d-md-block my-md-1">
          <img src={Logo} alt="" className="logo-pc" />
        </Navbar.Brand>
        <Navbar.Brand href="/" className="d-md-none">
          <img src={Logo} alt="" className="logo-mobile" />
        </Navbar.Brand>

        <Navbar.Toggle
          aria-controls="navbarSupportedContent"
          className="mr-md-5"
        />

        <Navbar.Collapse id="navbarSupportedContent">
          <Nav className="ms-xl-auto text-lg font-bold">
            <Nav.Item id="index">
              <Nav.Link href="/" className="fw-bold">
                關於 Second Home
              </Nav.Link>
            </Nav.Item>

            <Nav.Item id="kpi">
              <Nav.Link href="/kpi">永續專案</Nav.Link>
            </Nav.Item>

            <Nav.Item id="solution">
              <Nav.Link href="/solution">解決方案</Nav.Link>
            </Nav.Item>

            <Nav.Item id="news_list">
              <Nav.Link href="/news_list">最新消息</Nav.Link>
            </Nav.Item>

            <Nav.Item id="contact_us">
              <Nav.Link href="/contact_us">聯絡我們</Nav.Link>
            </Nav.Item>

            <Nav.Item id="account_status" className="d-flex align-items-center">
              <img src={User} alt="" className="align-top" />
              <Nav.Link href="/tplanet_signin" className="px-0">
                登入
              </Nav.Link>
              <span className="nav-link px-1 align-middle mb-0.5">/</span>
              <Nav.Link href="/tplanet_signup" className="px-0">
                註冊
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
