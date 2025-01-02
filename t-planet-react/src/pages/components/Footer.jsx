import TownWayIcon from "../../assets/townWay-icon.svg";
import FbIcon from "../../assets/fb-icon.svg";
import LinkedinIcon from "../../assets/linkedin-icon.svg";
import InstagramIcon from "../../assets/instagram-icon.svg";
import YoutubeIcon from "../../assets/youtube-icon.svg";
import { Container, Row, Col } from "react-bootstrap";

const Footer = () => {
  const socialLinks = [
    {
      href: "/",
      imgSrc: TownWayIcon,
      height: "35px",
    },
    {
      href: "https://www.facebook.com/townway104",
      imgSrc: FbIcon,
      height: "25px",
    },
    {
      href: "https://www.linkedin.com/company/townintelligent",
      imgSrc: LinkedinIcon,
      height: "25px",
    },
    {
      href: "https://www.instagram.com/townway104",
      imgSrc: InstagramIcon,
      height: "25px",
    },
    {
      href: "https://www.youtube.com/user/forus999",
      imgSrc: YoutubeIcon,
      height: "25px",
    },
  ];

  const navLinks = [
    { id: "about_fot1", href: "/", text: "關於 Second Home" },
    { href: "/kpi", text: "永續專案" },
    { href: "/news_list", text: "最新消息" },
    {
      id: "contact_us_fot1",
      href: "/contact_us",
      text: "聯絡我們",
      hidden: true,
    },
    { href: "https://privacy.townway.com.tw/", text: "隱私權條款" },
  ];

  return (
    <footer className="bg-nav">
      <Container fluid>
        <Row className="justify-center pt-4">
          {/* Desktop Navigation */}
          <Col lg={9} className="d-none d-lg-block">
            <div className="h-100 flex items-center justify-center md:justify-start mt-2 mt-lg-0 z-18">
              {navLinks.map((link, index) => (
                <p
                  key={index}
                  className="mr-3 mb-0"
                  id={link.id}
                  style={link.hidden ? { display: "none" } : {}}
                >
                  <a
                    href={link.href}
                    className="text-black no-underline px-0 font-bold"
                  >
                    {link.text}
                  </a>
                </p>
              ))}
            </div>
          </Col>

          {/* Social Media Icons */}
          <Col lg={3} className="mb-4 mb-lg-0">
            <div className="flex h-100 items-center justify-center lg:justify-end">
              <div className="flex flex-row">
                {socialLinks.map((link, index) => (
                  <a
                    key={index}
                    className="text-decoration-none"
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      className={`${
                        index !== socialLinks.length - 1 ? "mr-1" : ""
                      } footer_images`}
                      src={link.imgSrc}
                      alt=""
                      style={{ height: link.height }}
                    />
                  </a>
                ))}
              </div>
            </div>
          </Col>

          {/* Mobile Navigation */}
          <div className="flex flex-wrap justify-center d-lg-none z-18">
            {navLinks.map((link, index) => (
              <p
                key={`mobile-${index}`}
                className={`${
                  index !== navLinks.length - 1 ? "mr-3" : ""
                } mb-0`}
                id={link.id?.replace("fot1", "fot2")}
                style={link.hidden ? { display: "none" } : {}}
              >
                <a
                  href={link.href}
                  className="text-black no-underline px-0 font-bold"
                >
                  {link.text}
                </a>
              </p>
            ))}
          </div>
        </Row>

        {/* Copyright */}
        <div className="py-4">
          <div className="text-center">
            <p id="copyright" className="font-bold mb-0">
              Copyright © 2023 Second Home
            </p>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
