import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./tailwind.css"; // ✅ Make sure this line exists

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <div className="min-h-screen w-full bg-white text-gray-900">
      <App />
    </div>
  </React.StrictMode>
);
