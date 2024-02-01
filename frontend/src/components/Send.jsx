import axios from "axios";
import { useState, useEffect } from "react";
export default function Send({ payee }) {
  const [amount, setAmount] = useState("");
  let temp = "";
  useEffect(() => {
    temp = payee.firstName;
  }, [payee]);

  async function handleTransfer() {
    try {
      let res = await axios.post(
        `http://localhost:3000/api/v1/account/transfer`,
        {
          to: payee.payee.userId,
          amount: parseInt(amount),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      payee.setMessage(`Paid ${temp} INR ${amount} successfully`);
      payee.setPayee({});
    } catch (e) {
      payee.setPayee({});
      payee.setMessage(res.data.error);
    }
  }
  return (
    <div className="h-96 w-1/3 text-center px-6 py-10 lg:px-8 bg-slate-100 shadow-lg">
      <h1 className="text-2xl font-bold">Send Money</h1>
      <div className="flex py-6">
        <div className="bg-orange-500 rounded-full px-6 py-4">
          {payee.payee.firstName[0]}
        </div>
        <p className="font-bold p-4">{payee.payee.firstName}</p>
      </div>
      <div>
        <label className="block font-bold text-left">Amount (in Rs)</label>
        <input
          className="block w-full my-4 h-10 rounded-md border-2"
          placeholder="Enter Amount"
          type="number"
          min="0"
          onChange={(e) => {
            setAmount(e.target.value);
          }}
        ></input>
        <button
          className="bg-green-500 w-full h-10 rounded-md text-white hover:bg-green-700"
          onClick={handleTransfer}
        >
          Initate Transfer
        </button>
        <button
          className="bg-red-500 w-full h-10 rounded-md text-white hover:bg-red-700 my-1"
          onClick={() => {
            payee.setPayee({});
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
