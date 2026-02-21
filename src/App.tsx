import { Route, Routes } from "react-router-dom"

// Component
import LandingPageLayout from "./landing_page/Layout"

import Home from "./landing_page/home/Home"

function App() {
  return (
    <Routes>
      <Route element={<LandingPageLayout />}>
        <Route index element={<Home />} />
      </Route>
    </Routes>
  )
}

export default App
