import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";

const frontend_url = import.meta.env.VITE_FRONTEND_URL;

export default function Dashboard() {
  const navigate = useNavigate();
  const [cards, setCards] = useState([]);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    title: "",
    company: "",
    email: "",
    phone: "",
    website: "",
    linkedin: "",
    bio: "",
    profile_image_url: "",
    slug: "",
  });

  const token = localStorage.getItem("token");

  const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const fetchCards = async () => {
    try {
      const res = await api.get("/cards/");
      setCards(res.data);
    } catch (err) {
      console.error("Failed to load cards", err);
    }
  };

  const checkAuth = async () => {
    if (!token) {
      navigate("/");
      return;
    }

    try {
      await api.get("/auth/me");
      fetchCards();
    } catch (err) {
      console.warn("Invalid token or session expired. Redirecting.");
      localStorage.removeItem("token");
      navigate("/");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const createCard = async (e) => {
    e.preventDefault();
    setError("");

    // Strip out empty optional URL fields
    const cleanedForm = Object.fromEntries(
      Object.entries(form).filter(([key, value]) => {
        const trimmed = value.trim();
        if (["website", "linkedin", "profile_image_url"].includes(key)) {
          return trimmed !== "";
        }
        return true;
      })
    );

    try {
      await api.post("/cards/", cleanedForm);
      setForm({
        name: "", title: "", company: "", email: "", phone: "",
        website: "", linkedin: "", bio: "", profile_image_url: "", slug: ""
      });
      fetchCards();
    } catch (err) {
      console.error("Failed to create card", err);
      if (err.response?.status === 422) {
        setError("Please fill all required fields correctly. Ensure slug is at least 3 characters, and all URLs are valid.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };

  const deleteCard = async (id) => {
    try {
      await api.delete(`/cards/${id}`);
      fetchCards();
    } catch (err) {
      console.error("Failed to delete", err);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">My Business Cards</h2>
        <button onClick={logout} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
          Logout
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 text-red-700 bg-red-100 border border-red-300 rounded">
          {error}
        </div>
      )}

      <form onSubmit={createCard} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {Object.keys(form).map((field) => (
          <input
            key={field}
            type="text"
            value={form[field]}
            placeholder={field.replace(/_/g, " ")}
            required={["name", "slug"].includes(field)}
            onChange={(e) => setForm({ ...form, [field]: e.target.value })}
            className="p-2 border rounded"
          />
        ))}
        <button type="submit" className="col-span-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
          + Create Card
        </button>
      </form>

      <ul className="space-y-4">
        {cards.map((card) => (
          <li key={card.id} className="p-4 border rounded shadow-sm flex justify-between items-center">
            <div>
              <p className="font-bold">{card.name} – {card.title}</p>
              <p className="text-sm text-gray-600">{card.company}</p>
              <a
                className="text-blue-500 text-sm underline"
                href={`${frontend_url}/cards/public/${card.slug}`}
                target="_blank"
                rel="noreferrer"
              >
                /cards/public/{card.slug}
              </a>
            </div>
            <button onClick={() => deleteCard(card.id)} className="text-red-600 hover:underline">
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
