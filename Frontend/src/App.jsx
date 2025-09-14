import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import LoginPage from "./pages/auth/Login";
import RegisterPage from "./pages/auth/Register";
import AdminPage from "./pages/admin/AdminPage";
import UserPage from "./pages/user/UserPage";
import PrivateRoute from "./pages/routes/PrivateRoute";
import RoleRoute from "./pages/routes/RoleRoute";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public route */}
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/register" element={<RegisterPage />} />

        {/* Protected routes */}
        <Route element={<PrivateRoute />}>
          {/* Role-based nested routes */}
          <Route element={<RoleRoute roles={["Admin"]} />}>
            <Route path="/admin" element={<AdminPage />} />
          </Route>

          <Route element={<RoleRoute roles={["User", "Admin"]} />}>
            <Route path="/user" element={<UserPage />} />
          </Route>
        </Route>
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
};

export default App;
