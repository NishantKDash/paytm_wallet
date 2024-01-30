import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Signin from "./components/Signin";
import Signup from "./components/Signup";
function App() {
  function AuthenticatedRoute({ children }) {
    if (localStorage.getItem("token") != null) return children;
    else return <Navigate to="/signin"></Navigate>;
  }
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <AuthenticatedRoute>
                <Dashboard></Dashboard>
              </AuthenticatedRoute>
            }
          ></Route>
          <Route path="/signup" element={<Signup></Signup>}></Route>
          <Route path="/signin" element={<Signin></Signin>}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
