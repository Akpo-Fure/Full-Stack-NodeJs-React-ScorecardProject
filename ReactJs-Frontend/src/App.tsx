import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomeScreen from "./screens/homeScreen";
import SignupScreen from "./screens/signupScreen";
import LoginScreen from "./screens/loginScreen";
import ForgotpasswordScreen from "./screens/forgotpasswordScreen";
import ResetpasswordScreen from "./screens/resetpasswordScreen";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/users/signup" element={<SignupScreen />} />
        <Route path="/users/login" element={<LoginScreen />} />
        <Route
          path="/users/forgotpassword"
          element={<ForgotpasswordScreen />}
        />
        <Route
          path="/users/resetpassword/:token"
          element={<ResetpasswordScreen />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
