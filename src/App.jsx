import { useEffect, useState } from "react";
import "./App.css";

export default function App() {
  // ---------- STATE (data that changes and re-renders the page) ----------
  const [users, setUsers] = useState([]);       // data from the API
  const [search, setSearch] = useState("");     // text typed in search box
  const [selected, setSelected] = useState(null); // user clicked for details
  const [loading, setLoading] = useState(true); // true while fetching
  const [error, setError] = useState("");       // error message if fetch fails
  const [sortAZ, setSortAZ] = useState(false);  // sort toggle
  const [favorites, setFavorites] = useState([]); // list of favorite user ids

  // ---------- FETCH DATA (runs once when the page loads) ----------
  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load data");
        return res.json();
      })
      .then((data) => setUsers(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  // ---------- HELPERS ----------
  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  // ---------- DERIVED DATA (search, then sort) ----------
  let visibleUsers = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase())
  );
  if (sortAZ) {
    visibleUsers = [...visibleUsers].sort((a, b) => a.name.localeCompare(b.name));
  }

  // ---------- UI ----------
  return (
    <div className="app">
      <h1>API Integration</h1>
      <p className="subtitle">
        {users.length} users loaded · {favorites.length} favorites
      </p>

      <div className="controls">
        <input
          className="search"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="btn" onClick={() => setSortAZ(!sortAZ)}>
          {sortAZ ? "Sorted A–Z ✓" : "Sort A–Z"}
        </button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !error && visibleUsers.length === 0 && <p>No users found</p>}

      <div className="grid">
        {visibleUsers.map((u) => (
          <div key={u.id} className="card" onClick={() => setSelected(u)}>
            <button
              className="heart"
              onClick={(e) => {
                e.stopPropagation(); // don't open the modal when clicking the heart
                toggleFavorite(u.id);
              }}
            >
              {favorites.includes(u.id) ? "❤️" : "🤍"}
            </button>
            <div className="avatar">{u.name[0]}</div>
            <h3>{u.name}</h3>
            <p>{u.email}</p>
          </div>
        ))}
      </div>

      {selected && (
        <div className="overlay" onClick={() => setSelected(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>{selected.name}</h2>
            <p>📧 {selected.email}</p>
            <p>📞 {selected.phone}</p>
            <p>🌐 {selected.website}</p>
            <p>🏢 {selected.company.name}</p>
            <p>📍 {selected.address.city}</p>
            <button className="btn" onClick={() => setSelected(null)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
