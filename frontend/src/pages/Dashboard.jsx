import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import "../CssStyles/Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);

  const [eventForm, setEventForm] = useState({
    title: "",
    description: "",
    start_datetime: "",
    end_datetime: "",
    visibility: "private",
    color: "#3b82f6",
  });

  async function fetchUser() {
    try {
      const response = await API.get("/users/me");
      setUser(response.data);
    } catch {
      localStorage.removeItem("token");
      navigate("/login");
    }
  }

  async function fetchEvents() {
    try {
      const response = await API.get("/events/");
      setEvents(response.data);
    } catch (err) {
      console.log(err);
    }
  }

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  function handleEventChange(e) {
    setEventForm({
      ...eventForm,
      [e.target.name]: e.target.value,
    });
  }

  async function handleCreateEvent(e) {
    e.preventDefault();

    try {
      await API.post("/events/", eventForm);

      setEventForm({
        title: "",
        description: "",
        start_datetime: "",
        end_datetime: "",
        visibility: "private",
        color: "#3b82f6",
      });

      fetchEvents();
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  }

  useEffect(() => {
    fetchUser();
    fetchEvents();
  }, []);

  return (
    <main className="dashboard-page">
      <header className="dashboard-header">
        <div>
          <h1>CalendarLink Dashboard</h1>

          {user && (
            <>
              <p>Welcome back, {user.username}</p>
              <p>Invite Code: {user.invite_code}</p>
            </>
          )}
        </div>

        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </header>

      <section className="dashboard-grid">
        <div className="dashboard-card">
          <h2>Create Event</h2>

          <form className="event-form" onSubmit={handleCreateEvent}>
            <input
              name="title"
              placeholder="Event title"
              value={eventForm.title}
              onChange={handleEventChange}
              required
            />

            <textarea
              name="description"
              placeholder="Description"
              value={eventForm.description}
              onChange={handleEventChange}
            />

            <input
              name="start_datetime"
              type="datetime-local"
              value={eventForm.start_datetime}
              onChange={handleEventChange}
              required
            />

            <input
              name="end_datetime"
              type="datetime-local"
              value={eventForm.end_datetime}
              onChange={handleEventChange}
              required
            />

            <select
              name="visibility"
              value={eventForm.visibility}
              onChange={handleEventChange}
            >
              <option value="private">Private</option>
              <option value="shared">Shared</option>
              <option value="busy">Busy</option>
            </select>

            <input
              name="color"
              type="color"
              value={eventForm.color}
              onChange={handleEventChange}
            />

            <button type="submit">Create Event</button>
          </form>
        </div>

        <div className="dashboard-card">
          <h2>Your Events</h2>

          <div className="events-list">
            {events.length === 0 ? (
              <p>No events yet.</p>
            ) : (
              events.map((event) => (
                <article
                  key={event.id}
                  className="event-card"
                  style={{
                    borderLeft: `6px solid ${event.color}`,
                  }}
                >
                  <h3>{event.title}</h3>

                  <p>{event.description}</p>

                  <p className="event-meta">
                    {new Date(event.start_datetime).toLocaleString()} —{" "}
                    {new Date(event.end_datetime).toLocaleString()}
                  </p>

                  <p className="event-meta">
                    Visibility: {event.visibility}
                  </p>
                </article>
              ))
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

export default Dashboard;