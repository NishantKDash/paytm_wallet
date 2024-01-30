export default function Notification({ message }) {
  console.log(message);
  return (
    <div>
      <div className="bg-orange-400 w-96 h-10 rounded-md text-center">
        <p className="font-bold p-2">{message}</p>
      </div>
    </div>
  );
}
