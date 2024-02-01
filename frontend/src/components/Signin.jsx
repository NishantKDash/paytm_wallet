import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import Notification from "./Notification";

export default function Signin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  let navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      setMessage("");
    }, 5 * 1000);
  }, [message]);

  async function handleSubmit(e) {
    e.preventDefault();
    let user_dto = {
      username: email,
      password: password,
    };
    try {
      let res = await axios.post(
        "http://localhost:3000/api/v1/user/signin",
        user_dto
      );
      localStorage.setItem("token", res.data.token);
      navigate("/");
    } catch (e) {
      console.log(e);
      setMessage(e.response.data.error);
    }
  }
  return (
    <div>
      <div className="flex min-h-[840px] flex-col bg-white">
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <img
              className="mx-auto h-10 w-auto"
              src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
              alt="CompanyLogo"
            ></img>
            <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
              Sign in to your account
            </h2>
          </div>
          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium leading-6 text-gray-900">
                  Email Address
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autocomplete="email"
                    required=""
                    class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Password
                  </label>
                </div>
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autocomplete="password"
                    required=""
                    class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                  />
                </div>
              </div>
              <div>
                <button
                  className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  onClick={handleSubmit}
                >
                  Sign in !
                </button>
              </div>
            </form>
            <p className="mt-10 text-center text-sm text-gray-500">
              Not a member ?
              <Link
                className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500 mx-1"
                to="/signup"
              >
                Sign up !
              </Link>
            </p>
          </div>
        </div>

        {message && message.length != 0 && (
          <div className="flex justify-center p-6">
            <Notification message={message}></Notification>
          </div>
        )}
      </div>
    </div>
  );
}
