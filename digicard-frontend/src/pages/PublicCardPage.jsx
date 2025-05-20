import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../api/axios";

export default function PublicCardPage() {
  const { slug } = useParams();
  const [card, setCard] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCard = async () => {
      try {
        const res = await axios.get(`/cards/public/${slug}`);
        setCard(res.data);
      } catch (err) {
        setError("Card not found or URL is invalid.");
      }
    };
    fetchCard();
  }, [slug]);

  if (error)
    return <div className="h-screen flex justify-center items-center text-red-500">{error}</div>;

  if (!card)
    return <div className="h-screen flex justify-center items-center">Loading...</div>;

  const qrUrl = `http://localhost:8000/cards/${slug}/qrcode`;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-10">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-gray-200 p-8 text-center">
        {card.profile_image_url && (
          <img
            src={card.profile_image_url}
            alt="Profile"
            className="w-28 h-28 mx-auto rounded-full object-cover border-4 border-white shadow-md mb-4"
          />
        )}

        <h1 className="text-3xl font-bold text-gray-800">{card.name}</h1>
        <p className="text-sm text-gray-500 mb-4">{card.title} at {card.company}</p>

        <div className="space-y-2 text-sm text-gray-700 mb-6">
          {card.email && (
            <p>
              📧 <a href={`mailto:${card.email}`} className="text-blue-600 hover:underline">{card.email}</a>
            </p>
          )}
          {card.phone && (
            <p>
              📞 <a href={`tel:${card.phone}`} className="text-blue-600 hover:underline">{card.phone}</a>
            </p>
          )}
          {card.website && (
            <p>
              🌐 <a href={card.website} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">{card.website}</a>
            </p>
          )}
          {card.linkedin && (
            <p>
              💼 <a href={card.linkedin} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">LinkedIn</a>
            </p>
          )}
        </div>

        {card.bio && (
          <p className="text-gray-600 text-sm italic border-t pt-4 mb-6">{card.bio}</p>
        )}

        {/* 📷 QR Code Section */}
<div className="flex flex-col items-center border-t pt-4">
  <p className="text-sm text-gray-500 mb-2">Scan to view this card</p>
  <img
    src={qrUrl}
    alt="QR Code"
    className="w-32 h-32 border rounded-md shadow-md"
  />

  {/* ✅ Download QR Code Button */}
  <a
    href={qrUrl}
    download={`qr_${slug}.png`}
    className="mt-3 inline-block text-sm text-white bg-blue-600 hover:bg-blue-700 px-4 py-1.5 rounded shadow"
  >
    Download QR Code
  </a>
</div>

        
      </div>
    </div>
  );
}
