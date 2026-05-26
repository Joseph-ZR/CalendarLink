import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  async function fetchUser() {
    try {
      const response = await API.get("/users/me");
      setUser(response.data);
    } catch {
      localStorage.removeItem("token");
      navigate("/login");
    }
  }

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <main style={{ padding: "2rem" }}>
      <h1>CalendarLink Dashboard</h1>

      {user ? (
        <>
          <p>Logged in as: {user.username}</p>
          <p>Email: {user.email}</p>
          <p>Invite Code: {user.invite_code}</p>
        </>
      ) : (
        <p>Loading...</p>
      )}

      <button onClick={handleLogout}>Logout</button>
    </main>
  );
}

export default Dashboard;