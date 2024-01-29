export default function Dashboard() {
  let users = ["Nishant Dash", "H Roshan", "Harkirat Singh", "D Bachchan"];
  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-10 lg:px-8">
      <div className="bg-slate-300 border border-sky-500 rounded-lg mx-1 flex items-center justify-between p-4 shadow-lg">
        <h1 className="text-lg font-bold">Paytm</h1>
        <h2 className="text-lg font-bold">Hi User</h2>
      </div>
      <div className="bg-black rounded  w-56 my-4 mx-1 shadow-lg">
        <h2 className="font-bold text-white mx-1">Your Balance : INR 3000</h2>
      </div>
      <div className="my-2 mx-1 shadow-lg">
        <input
          className="block w-full rounded-full border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-600 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          placeholder="Find users"
        ></input>
      </div>
      {users.map((user) => {
        return (
          <div className="grid grid-cols-10 gap-4 my-10">
            <div className="flex col-span-9 p-4">
              <div className="bg-slate-200 rounded-full px-6 py-4">
                {user[0]}
              </div>
              <p className="font-bold p-4">{user}</p>
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
  );
}
