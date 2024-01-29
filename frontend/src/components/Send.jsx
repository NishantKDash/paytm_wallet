export default function Send() {
  return (
    <div className="h-1/3 w-1/3 justify-center text-center px-6 py-10 lg:px-8 bg-slate-100 shadow-lg">
      <h1 className="text-2xl font-bold">Send Money</h1>
      <div className="flex py-6">
        <div className="bg-orange-500 rounded-full px-6 py-4">H</div>
        <p className="font-bold p-4">Harkirat Singh</p>
      </div>
      <div>
        <label className="block font-bold text-left">Amount (in Rs)</label>
        <input
          className="block w-full my-4 h-10 rounded-md border-2"
          placeholder="Enter Amount"
          type="number"
          min="0"
        ></input>
        <button className="bg-green-500 w-full h-10 rounded-md text-white hover:bg-green-700 ">
          Initate Transfer
        </button>
      </div>
    </div>
  );
}
