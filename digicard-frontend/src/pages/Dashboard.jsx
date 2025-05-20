import { useEffect, useState } from "react";
import axios from "../api/axios";

const frontend_url = import.meta.env.VITE_FRONTEND_URL;


export default function Dashboard() {
  const [cards, setCards] = useState([]);
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

  const fetchCards = async () => {
    try {
      const res = await axios.get("/cards", { withCredentials: true });
      setCards(res.data);
    } catch (err) {
      console.error("Failed to load cards", err);
    }
  };

  const createCard = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/cards", form, { withCredentials: true });
      setForm({ name: "", title: "", company: "", email: "", phone: "", website: "", linkedin: "", bio: "", profile_image_url: "", slug: "" });
      fetchCards(); // Refresh list
    } catch (err) {
      console.error("Failed to create card", err);
    }
  };

  const deleteCard = async (id) => {
    try {
      await axios.delete(`/cards/${id}`, { withCredentials: true });
      fetchCards();
    } catch (err) {
      console.error("Failed to delete", err);
    }
  };

  useEffect(() => {
    fetchCards();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">My Business Cards</h2>

      <form onSubmit={createCard} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {Object.keys(form).map((field) => (
          <input
            key={field}
            type="text"
            value={form[field]}
            placeholder={field.replace(/_/g, " ")}
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
              <a className="text-blue-500 text-sm underline" href={`${frontend_url}/cards/public/${card.slug}`} target="_blank" rel="noreferrer">
                /cards/public/{card.slug}
              </a>
            </div>
            <button onClick={() => deleteCard(card.id)} className="text-red-600 hover:underline">Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
