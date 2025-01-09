import { useEffect } from "react";
import Logo from "../../assets/2nd-home.svg";
import User from "../../assets/user.svg";
import Logout from "../../assets/logout.svg";
import Account from "../../assets/Account.png";
import Index from "../../assets/index.svg";
import Cooperate from "../../assets/cooperate.svg";
import AI from "../../assets/ai.svg";
import News from "../../assets/news.svg";
import ContactUs from "../../assets/contact_us.svg";
import Exclamation from "../../assets/exclamation.svg";
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import { logout } from "../utils/Accounts";
import { useAuth } from "../utils/ProtectRoute";

export default function Str_Nav() {
  const { isAuthenticated, isLoading } = useAuth();

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

  const menuItems = [
    {
      id: "profile",
      icon: Account,
      title: "帳號資訊",
      link: "/backend/profile/username",
      show: true,
    },
    {
      id: "admin_index",
      icon: Index,
      title: "首頁管理",
      link: "/backend/admin_index",
      show: true,
    },
    {
      id: "sustainable",
      icon: Cooperate,
      title: "永續專案專區",
      link: "/backend/cms_agent",
      show: true,
    },
    {
      id: "llm",
      icon: AI,
      title: "AI Eval",
      link: "/backend/cms_ai_gpt",
      show: true,
    },
    {
      id: "cms_news_list",
      icon: News,
      title: "最新消息",
      link: "/backend/cms_news_list",
      show: true,
    },
    {
      id: "cms_contact_us",
      icon: ContactUs,
      title: "聯絡我們",
      link: "/backend/cms_contact_us",
      show: true,
    },
    {
      id: "logout",
      icon: Logout,
      title: "登出",
      onClick: logout,
      show: true,
    },
    {
      id: "delete_account",
      icon: Exclamation,
      title: "刪除帳號",
      link: "/backend/admin_agent_accountDelete",
      show: true,
    },
  ];

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

            {isAuthenticated ? (
              <NavDropdown title="永續專案" id="basic-nav-dropdown">
                <NavDropdown.Item href="/kpi">跨區跨域</NavDropdown.Item>
                <NavDropdown.Item href="/kpi">公司個體</NavDropdown.Item>
              </NavDropdown>
            ) : (
              <Nav.Item id="kpi">
                <Nav.Link href="/kpi">永續專案</Nav.Link>
              </Nav.Item>
            )}

            {isAuthenticated ? null : (
              <Nav.Item id="solution">
                <Nav.Link href="/solution">解決方案</Nav.Link>
              </Nav.Item>
            )}

            <Nav.Item id="news_list">
              <Nav.Link href="/news_list">最新消息</Nav.Link>
            </Nav.Item>

            <Nav.Item id="contact_us">
              <Nav.Link href="/contact_us">聯絡我們</Nav.Link>
            </Nav.Item>
            {/* <li class="nav-item dropdown"><a class="nav-link dropdown-toggle" href="#" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><img src="/static/imgs/user.svg" width="30" height="30" class="d-inline-block align-top" alt=""></a><div class="dropdown-menu" style="left: -100px;"><a class="dropdown-item" href="/backend/admin_agent_dashboard.html"><img src="/static/imgs/index.svg" style="width: 25px; height: 25px;"> 首頁管理</a><a class="dropdown-item" href="/backend/cms_agent.html"><img src="/static/imgs/cooperate.svg" style="width: 25px; height: 25px;"> 永續專區</a><a class="dropdown-item" href="/backend/cms_news_list.html"><img src="/static/imgs/news.svg" style="width: 25px; height: 25px;"> 最新消息</a><a class="dropdown-item" href="/backend/cms_contact_us.html"><img src="/static/imgs/contact_us.svg" style="width: 25px; height: 25px;"> 聯繫我們</a><a class="dropdown-item" href="javascript:logout();"><img src="/static/imgs/logout.svg" style="width: 25px; height: 25px;"> 登出</a><a class="dropdown-item" href="/backend/admin_agent_accountDelete.html"><img src="/static/imgs/delete.svg" style="width: 25px; height: 25px;"> 刪除帳號</a></div></li></li> */}
            {isAuthenticated ? (
              <NavDropdown
                title={
                  <div className="inline-block align-top">
                    <img src={User} alt="" className="w-8" />
                  </div>
                }
                id="basic-nav-dropdown"
                align="end"
              >
                {menuItems.map(
                  (item) =>
                    item.show && (
                      <NavDropdown.Item
                        key={item.id}
                        onClick={item.onClick}
                        href={item.link}
                        className="dropdown-item"
                      >
                        <div className="flex items-center">
                          <img src={item.icon} alt="" className="w-6 mr-2" />
                          <span>{item.title}</span>
                        </div>
                      </NavDropdown.Item>
                    )
                )}
              </NavDropdown>
            ) : (
              <Nav.Item id="account_status" className="flex items-center">
                <img src={User} alt="" className="align-top" />
                <Nav.Link href="/tplanet_signin" className="px-0">
                  登入
                </Nav.Link>
                <span className="nav-link px-1 align-middle mb-0.5">/</span>
                <Nav.Link href="/tplanet_signup" className="px-0">
                  註冊
                </Nav.Link>
              </Nav.Item>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
