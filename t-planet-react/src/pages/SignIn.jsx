import GoogleLogo from "../assets/google-logo.svg";
import Warning from "../assets/warning-icon.svg";
import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";
import { getGroup } from "./utils/Accounts";
import { useAuth } from "./utils/ProtectRoute";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const { setIsAuthenticated } = useAuth();

  const signin = async (formdata) => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_HOST_URL_TPLANET}/accounts/signin`,
        {
          method: "POST",
          body: formdata,
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("登入失敗");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      setError(true);
      console.error("登入錯誤:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("username", email);
      formData.append("email", email);
      formData.append("password", password);
      const result = await signin(formData);

      // 假設登入成功後的處理，例如儲存 token 等
      if (result.token) {
        localStorage.setItem("jwt", result.token);
        localStorage.setItem("username", result.username);
        localStorage.setItem("email", email);
        await getGroup(email);
        setIsAuthenticated(true);
        navigate("/backend/admin_agent_dashboard");
      }
    } catch (error) {
      // 錯誤已經在 signin 函數中處理
      console.error("提交表單時發生錯誤:", error);
    }
  };

  useEffect(() => {
    // Initialize Google API
    const initGoogleClient = () => {
      window.gapi.load("client:auth2", () => {
        window.gapi.client.init({
          clientId:
            "1080674192413-b1vnqslm4gif3p9ntaj4ifl4i572p0bn.apps.googleusercontent.com",
          scope: "profile",
          discoveryDocs: [
            "https://www.googleapis.com/discovery/v1/apis/people/v1/rest",
          ],
        });
      });
    };

    // Load Google API Script
    const loadGoogleScript = () => {
      const script = document.createElement("script");
      script.src = "https://apis.google.com/js/api.js";
      script.onload = () => initGoogleClient();
      document.body.appendChild(script);
    };

    loadGoogleScript();
  }, []);

  const handleEidGoogleLogin = async (idToken, res) => {
    const formData = new FormData();
    formData.append("email", res.result.emailAddresses[0].value);
    formData.append("username", res.result.names[0].displayName);
    formData.append("token", idToken);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_HOST_URL_EID}/accounts/oauth/google`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      return await response.json();
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const auth2 = window.gapi.auth2.getAuthInstance();
      const googleUser = await auth2.signIn();

      const userId = googleUser.getId();
      console.log(`user_id: ${userId}`);

      const authResponse = googleUser.getAuthResponse(true);
      const idToken = authResponse.id_token;

      const peopleResponse = await window.gapi.client.people.people.get({
        resourceName: "people/me",
        personFields: "names,emailAddresses",
      });

      const resultJSON = await handleEidGoogleLogin(idToken, peopleResponse);

      try {
        localStorage.setItem("jwt", resultJSON.token);
        localStorage.setItem("username", resultJSON.username);
        localStorage.setItem("email", resultJSON.emailAddresses[0].value);
        navigate("/backend/admin_agent_dashboard");
      } catch (e) {
        alert("登入失敗，請洽系統管理員！");
      }
    } catch (error) {
      console.error("Google登入失敗:", error);
    }
  };

  return (
    <div className="w-1/2 mx-auto mb-5">
      <h2 className="text-center mt-5">登入</h2>
      <form>
        <div className="row justify-content-center mt-3">
          <div className="col-11 col-sm-5 shadow-sm rounded-xl py-2 mb-2 flex flex-col gap-3">
            <div className="form-group">
              <input
                type="email"
                className={`rounded-xl w-full h-10 px-3 bg-buttonBg ${
                  error ? "border-red" : ""
                }`}
                id="email"
                aria-describedby="emailHelp"
                placeholder="電子郵件"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
            </div>
            <div className="form-group mb-0">
              <input
                type="password"
                className={`rounded-xl w-full h-10 px-3 bg-buttonBg ${
                  error ? "border border-red" : ""
                }`}
                placeholder="密碼"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
            </div>
          </div>
        </div>

        <div className="row justify-content-center mt-2">
          <div className="col-11 col-sm-5">
            <Button
              variant="dark"
              type="submit"
              className="btn btn-block btn-dark w-full"
              onClick={handleSubmit}
            >
              登入
            </Button>
          </div>
        </div>

        <div className="flex justify-center mt-3">
          <div className="w-1/3 px-0">
            <div className="flex justify-between">
              {error ? (
                <p id="wrong-pw" className="mb-0 pt-1 text-center text-danger">
                  <small className="flex gap-2 items-center text-base">
                    <img
                      className="w-8 h-8 pb-1 pr-1"
                      src={Warning}
                      alt="Warning"
                    />
                    您輸入的帳號密碼錯誤，請再次確認。
                    <a href="/tplanet_forget_pw" className="text-danger">
                      <u>忘記密碼？</u>
                    </a>
                  </small>
                </p>
              ) : (
                <p className="mb-0">
                  <a
                    href="/tplanet_forget_pw"
                    className="no-underline hover:underline text-dark"
                  >
                    忘記密碼？
                  </a>
                </p>
              )}
              <a
                href="/tplanet_signup.html"
                className="ml-auto no-underline hover:underline"
              >
                建立帳戶
              </a>
            </div>
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
          <div className="flex justify-center">
            <Button
              variant="outline-secondary"
              className="p-2"
              onClick={handleGoogleLogin}
            >
              <div className="flex justify-center">
                <img className="mr-1 w-5" src={GoogleLogo} alt="google logo" />
                <small className="text-dark">透過 Google 登入</small>
              </div>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
