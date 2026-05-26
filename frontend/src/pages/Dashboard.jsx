import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import "../CssStyles/Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [editingEventId, setEditingEventId] = useState(null);
  const [linkedUsers, setLinkedUsers] = useState([]);
  const [inviteCode, setInviteCode] = useState("");
  const [linkMessage, setLinkMessage] = useState("");

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
function startEditing(event) {
  setEditingEventId(event.id);

  setEventForm({
    title: event.title,
    description: event.description || "",
    start_datetime: event.start_datetime.slice(0, 16),
    end_datetime: event.end_datetime.slice(0, 16),
    visibility: event.visibility,
    color: event.color,
  });
}

function cancelEditing() {
  setEditingEventId(null);

  setEventForm({
    title: "",
    description: "",
    start_datetime: "",
    end_datetime: "",
    visibility: "private",
    color: "#3b82f6",
  });
}

async function handleUpdateEvent(e) {
  e.preventDefault();

  try {
    await API.put(`/events/${editingEventId}`, eventForm);

    cancelEditing();
    fetchEvents();
  } catch (err) {
    console.log(err.response?.data || err.message);
  }
}

async function handleDeleteEvent(eventId) {
  const confirmed = window.confirm("Are you sure you want to delete this event?");

  if (!confirmed) return;

  try {
    await API.delete(`/events/${eventId}`);
    fetchEvents();
  } catch (err) {
    console.log(err.response?.data || err.message);
  }
}

async function fetchLinkedUsers() {
  try {
    const response = await API.get("/links/");
    setLinkedUsers(response.data);
  } catch (err) {
    console.log(err.response?.data || err.message);
  }
}

async function handleLinkUser(e) {
  e.preventDefault();
  setLinkMessage("");

  try {
    const response = await API.post("/links/", {
      invite_code: inviteCode,
    });

    setLinkMessage(response.data.message);
    setInviteCode("");
    fetchLinkedUsers();
  } catch (err) {
    setLinkMessage(err.response?.data?.detail || "Could not link user");
  }
}

  useEffect(() => {
    fetchUser();
    fetchEvents();
    fetchLinkedUsers();
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
          <h2>{editingEventId ? "Edit Event" : "Create Event"}</h2>

          <form
              className="event-form"
              onSubmit={editingEventId ? handleUpdateEvent : handleCreateEvent}
            >
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

            <button type="submit">
              {editingEventId ? "Update Event" : "Create Event"}
            </button>

            {editingEventId && (
              <button type="button" className="cancel-button" onClick={cancelEditing}>
                Cancel Edit
              </button>
            )}
          </form>
        </div>
        <div className="dashboard-card">
          <h2>Linked Users</h2>

          <form className="event-form" onSubmit={handleLinkUser}>
            <input
              type="text"
              placeholder="Enter invite code"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              required
            />

            <button type="submit">Link User</button>
          </form>

          {linkMessage && <p className="link-message">{linkMessage}</p>}

          <div className="linked-users-list">
            {linkedUsers.length === 0 ? (
              <p>No linked users yet.</p>
            ) : (
              linkedUsers.map((linkedUser) => (
                <div key={linkedUser.id} className="linked-user-card">
                  <strong>{linkedUser.username}</strong>
                  <p>{linkedUser.email}</p>
                </div>
              ))
            )}
          </div>
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
                  <div className="event-actions">
                    <button type="button" onClick={() => startEditing(event)}>
                      Edit
                    </button>

                    <button
                      type="button"
                      className="delete-button"
                      onClick={() => handleDeleteEvent(event.id)}
                    >
                      Delete
                    </button>
                  </div>
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