import Notification from "./Notification";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
export default function Dashboard() {
  const [user, setUser] = useState({});
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  let navigate = useNavigate();

  useEffect(async () => {
    let res = await axios.get("http://localhost:3000/api/v1/user/user", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    });
    setUser({
      userId: res.data.userId,
      name: res.data.name,
      balance: res.data.balance,
    });
    let res1 = await axios.get("http://localhost:3000/api/v1/user/bulk", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    });
    console.log(res1.data.users);
    setUsers(res1.data.users);
  }, []);
  return (
    <div>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-10 lg:px-8">
        <div className="bg-slate-300 border border-sky-500 rounded-lg mx-1 flex items-center justify-between p-4 shadow-lg">
          <h1 className="text-lg font-bold">Paytm</h1>
          <div className="flex">
            <p className="text-lg font-bold">Hi {user.name}</p>
            <button
              className="mx-2 bg-green-200 rounded-full p-1 text-sm border-2 border-orange-300 hover:border-orange-600"
              onClick={() => {
                localStorage.removeItem("token");
                navigate("/signin");
              }}
            >
              Logout
            </button>
          </div>
        </div>
        <div className="bg-black rounded  w-56 my-4 mx-1 shadow-lg">
          <h2 className="font-bold text-white mx-1">
            Your Balance : INR {user.balance}
          </h2>
        </div>
        <div className="my-2 mx-1 shadow-lg">
          <input
            className="block w-full rounded-full border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-600 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            placeholder="Find users"
          ></input>
        </div>

        {message && message.length != 0 && (
          <div className="w-screen flex justify-center p-6">
            <Notification></Notification>
          </div>
        )}

        {users.map((user) => {
          return (
            <div className="grid grid-cols-10 gap-4 my-10">
              <div className="flex col-span-9 p-4">
                <div className="bg-slate-200 rounded-full px-6 py-4">
                  {user.firstName[0]}
                </div>
                <p className="font-bold p-4">
                  {user.firstName} {user.lastName}
                </p>
              </div>
              <div className="col-span-1 p-4">
                <button className="bg-black text-white rounded-lg p-4">
                  Send Money
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
