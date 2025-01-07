import React, { useState } from "react";
import GoogleLogo from "../assets/google-logo.svg";
import FacebookLogo from "../assets/fb-logo-s.png";
import Warning from "../assets/warning-icon.svg";
import Button from "react-bootstrap/Button";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [warningMessage, setWarningMessage] = useState("");

  const handleSubmit = async () => {
    if (password.length < 8 || confirmPassword.length < 8) {
      setWarningMessage("密碼不得少於 8 字元");
      return;
    }
    if (password !== confirmPassword) {
      setWarningMessage("兩次輸入的密碼不一致");
      return;
    }

    // const dataJSON = {
    //   username,
    //   password,
    //   email,
    // };

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    const urlencoded = new URLSearchParams();
    urlencoded.append("username", username);
    urlencoded.append("email", email);
    urlencoded.append("password", password);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_HOST_URL_TPLANET}/accounts/signup`,
        {
          method: "POST",
          headers: myHeaders,
          body: urlencoded,
          redirect: "follow",
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const returnData = await response.json();
      localStorage.setItem("jwt", returnData.token);
      localStorage.setItem("username", username);
      console.log("Get JWT from cookie", localStorage.getItem("jwt"));
      window.location.replace("/");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="w-1/2 mx-auto mb-5">
      <h2 className="text-center mt-5">註冊</h2>
      <form>
        <div className="row justify-content-center">
          <div className="col-11 col-sm-5 shadow-sm rounded-xl py-2 mb-2 flex flex-col gap-3">
            <div className="form-group">
              <input
                type="email"
                className="rounded-xl w-full h-10 px-3 bg-buttonBg"
                id="email"
                aria-describedby="emailHelp"
                placeholder="電子郵件"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                className="rounded-xl w-full h-10 px-3 bg-buttonBg"
                id="username"
                placeholder="使用者名稱"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                className="rounded-xl w-full h-10 px-3 bg-buttonBg"
                id="password"
                placeholder="密碼"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="form-group mb-0">
              <input
                type="password"
                className="rounded-xl w-full h-10 px-3 bg-buttonBg"
                id="cfm_password"
                placeholder="確認密碼"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <small id="war_msg" className="fz-xs text-danger">
                {warningMessage}
              </small>
            </div>
          </div>
        </div>
        <div className="row justify-center mt-3">
          <div className="col-11 col-sm-5">
            <div className="flex justify-between">
              <a href="/tplanet_forget_pw" className="text-dark no-underline">
                忘記密碼？
              </a>
              <a href="/tplanet_signup" className="ml-auto no-underline">
                建立帳戶
              </a>
            </div>
          </div>
        </div>
        <div className="d-flex justify-content-center mt-3">
          <div id="captcha"></div>
        </div>
        <div className="row justify-content-center mt-3">
          <div className="col-11 col-sm-5 px-0">
            <Button
              variant="dark"
              type="button"
              className="btn btn-block btn-dark w-full"
              onClick={handleSubmit}
            >
              註冊
            </Button>
          </div>
        </div>
      </form>
      <div className="row justify-content-center align-items-center h-100">
        <div className="col-11 col-sm-5">
          <div className="flex mt-3">
            <div className="w-2/5 mt-3 px-0">
              <hr className="border-sm" />
            </div>
            <div className="w-1/5 mt-3 pt-1 px-0 text-center">
              <p className="mb-0 text-dark">或</p>
            </div>
            <div className="w-2/5 mt-3 px-0">
              <hr className="border-sm" />
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex justify-center">
              <Button
                variant="outline-secondary"
                className="p-2 w-full"
                //onClick={handleGoogleLogin}
              >
                <div className="flex justify-center">
                  <img
                    className="mr-1 w-5"
                    src={GoogleLogo}
                    alt="google logo"
                  />
                  <small className="text-dark">透過 Google 登入</small>
                </div>
              </Button>
            </div>
            <div className="flex justify-center">
              <Button
                variant="outline-secondary"
                className="p-2 w-full"
                //onClick={handleGoogleLogin}
              >
                <div className="flex justify-center">
                  <img
                    className="mr-1 w-5"
                    src={FacebookLogo}
                    alt="facebook logo"
                  />
                  <small className="text-dark">透過 Facebook 登入</small>
                </div>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
