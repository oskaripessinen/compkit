import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/home"
import Generator from "./pages/generator"
import AuthCallback from "./pages/authCallback"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/generator" element={<Generator />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
      </Routes>
    </BrowserRouter>
  )
}