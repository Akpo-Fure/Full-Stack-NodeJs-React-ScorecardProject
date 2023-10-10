import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignupScreen from "./screens/signupScreen";
import LoginScreen from "./screens/loginScreen";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/users/signup" element={<SignupScreen />} />
        <Route path="/users/login" element={<LoginScreen />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
