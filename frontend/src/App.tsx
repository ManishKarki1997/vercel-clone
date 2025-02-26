import { BrowserRouter, Routes, Route } from "react-router";
import Home from "./features/home/pages/home";
import LoginPage from "./features/home/pages/login";
import SignupPage from "./features/home/pages/signup";



function App() {


  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
