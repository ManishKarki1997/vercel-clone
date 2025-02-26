import { BrowserRouter, Routes, Route } from "react-router";
import Home from "./features/home/pages/home";



function App() {


  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
