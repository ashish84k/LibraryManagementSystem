import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("lmsToken");
    localStorage.removeItem("lmsUser");
    navigate("/auth/login", { replace: true });
  };

  return (
    <div>
      <h1>Welcome to Home</h1>
      <button
        onClick={handleLogout}
        className="px-4 py-2 bg-red-500 text-white rounded"
      >
        Logout
      </button>
    </div>
  );
}
