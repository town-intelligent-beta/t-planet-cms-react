import TownWayIcon from "../../assets/townWay-icon.svg";
import FbIcon from "../../assets/fb-icon.svg";
import LinkedinIcon from "../../assets/linkedin-icon.svg";
import InstagramIcon from "../../assets/instagram-icon.svg";
import YoutubeIcon from "../../assets/youtube-icon.svg";

const Footer = () => {
  return (
    <footer className="bg-nav">
      <div className="container mx-auto">
        <div className="flex justify-center">
          <div className="hidden lg:block lg:w-9/12">
            <div className="h-full flex items-center justify-center lg:justify-start lg:mt-0 text-lg font-bold">
              <p className="mr-3 mb-0">
                <a
                  id="about_fot1"
                  href="/"
                  className="text-black no-underline px-0"
                >
                  關於 Second Home
                </a>
              </p>
              <p className="mr-3 mb-0">
                <a href="/kpi" className="px-0 text-black no-underline">
                  永續專案
                </a>
              </p>
              <p className="mr-3 mb-0">
                <a href="/news_list" className="text-black no-underline px-0 ">
                  最新消息
                </a>
              </p>
              <p id="contact_us_fot1" className="mr-3 mb-0">
                <a href="/contact_us" className="text-black no-underline px-0 ">
                  聯絡我們
                </a>
              </p>
              <p className="mr-3 mb-0">
                <a
                  className="text-black no-underline px-0"
                  href="https://privacy.townway.com.tw/"
                >
                  隱私權條款
                </a>
              </p>
            </div>
          </div>
          <div className="flex lg:w-3/12 mb-4 mt-2 lg:mb-0">
            <div className="flex h-full items-center justify-center lg:justify-end">
              <a
                className="text-decoration-none"
                href="#"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  className="mr-1 footer_images"
                  src={TownWayIcon}
                  alt=""
                  style={{ height: "35px" }}
                />
              </a>
              <a
                className="text-decoration-none"
                href="https://www.facebook.com/townway104"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  className="mr-1 footer_images"
                  src={FbIcon}
                  alt=""
                  style={{ height: "25px" }}
                />
              </a>
              <a
                className="text-decoration-none"
                href="https://www.linkedin.com/company/townintelligent"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  className="mr-1 footer_images"
                  src={LinkedinIcon}
                  alt=""
                  style={{ height: "25px" }}
                />
              </a>
              <a
                className="text-decoration-none"
                href="https://www.instagram.com/townway104"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  className="mr-1 footer_images"
                  src={InstagramIcon}
                  alt=""
                  style={{ height: "25px" }}
                />
              </a>
              <a
                className="text-decoration-none"
                href="https://www.youtube.com/user/forus999"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  className="footer_images"
                  src={YoutubeIcon}
                  alt=""
                  style={{ height: "25px" }}
                />
              </a>
            </div>
          </div>
          {/* mobile */}
          <div className="flex flex-wrap justify-center lg:hidden text-lg font-bold">
            <p className="mr-3 mb-0">
              <a
                id="about_fot2"
                className="text-black no-underline px-0"
                href="/"
              >
                關於 Second Home
              </a>
            </p>
            <p className="mr-3 mb-0">
              <a className="text-black no-underline px-0 " href="/kpi">
                永續專案
              </a>
            </p>
            <p className="mr-3 mb-0">
              <a className="text-black no-underline px-0" href="/news_list">
                最新消息
              </a>
            </p>
            <p id="contact_us_fot2" className="mr-3 mb-0">
              <a className="text-black no-underline px-0" href="/contact_us">
                聯絡我們
              </a>
            </p>
            <p className="mb-0">
              <a
                className="text-black no-underline px-0"
                href="https://privacy.townway.com.tw/"
              >
                隱私權條款
              </a>
            </p>
          </div>
        </div>
        <div className="py-4">
          <div className="text-center">
            <p id="copyright" className="font-bold mb-0">
              Copyright © 2023 SECOND HOME
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
