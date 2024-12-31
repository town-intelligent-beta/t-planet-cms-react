import { useEffect } from "react";
import Logo from "../../assets/2nd-home.svg";
import User from "../../assets/user.svg";

export default function Nav() {
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
  }, []);

  return (
    <nav className="flex items-center justify-between p-4 bg-nav w-full">
      <div className="flex items-center w-full">
        <a href="/" className="text-lg font-bold">
          <img
            src={Logo}
            width="400"
            className="d-inline-block align-top"
            alt="Second Home logo"
          />
        </a>

        <div className="flex w-full">
          <ul className="navbar-nav ml-auto flex gap-3 justify-end text-lg flex-row font-bold">
            <li id="index" className="">
              <a id="about_nav" className="nav-link" href="/">
                關於 Second Home{" "}
              </a>
            </li>
            <li id="kpi" className="nav-item">
              <a className="nav-link" href="/kpi">
                永續專案
              </a>
            </li>
            <li id="" className="nav-item">
              <a className="nav-link" href="/news_list">
                解決方案
              </a>
            </li>
            <li id="news_list" className="nav-item">
              <a className="nav-link" href="/news_list">
                最新消息
              </a>
            </li>
            <li id="contact_us" className="nav-item">
              <a className="nav-link" href="/contact_us">
                聯絡我們
              </a>
            </li>
            <li
              id="account_status"
              className="nav-item flex align-items-center"
            >
              <img className="align-top" src={User} alt="" />
              <a className="nav-link px-0" href="/tplanet_signin">
                登入
              </a>
              <span className="nav-link px-1 align-middle mb-0.5">/</span>
              <a className="nav-link px-0" href="/tplanet_signup">
                註冊
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
