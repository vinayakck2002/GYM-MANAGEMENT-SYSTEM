import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

import DashboardPage from "./pages/DashboardPage";
import AddMemberPage from "./pages/AddMemberPage";
import MemberListPage from "./pages/MemberListPage";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen p-6">
        <h1 className="text-3xl font-bold text-center text-red-500 mb-6">
          🏋️ Gym Management System
        </h1>

        <Navbar />

        <Routes>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/add-member" element={<AddMemberPage />} />
          <Route path="/members" element={<MemberListPage />} />
          <Route path="*" element={<DashboardPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
