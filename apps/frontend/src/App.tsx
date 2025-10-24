import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "@/pages/home"
import Generator from "@/pages/generator"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/generator" element={<Generator />} />
      </Routes>
    </BrowserRouter>
  )
}