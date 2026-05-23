import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import "../styles/gallery.css";

export default function Gallery() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("little_artist_gallery") || "[]");
    setItems(saved);
  }, []);

  const clearGallery = () => {
    const confirmClear = window.confirm("Clear all saved drawings?");
    if (!confirmClear) return;

    localStorage.removeItem("little_artist_gallery");
    setItems([]);
  };

  return (
   <>
     <Navbar />

     <div className="page-decoration star1">🎨</div>
     <div className="page-decoration star2">💖</div>
     <div className="page-decoration star3">🌈</div>

     <section className="gallery-page">

      <section className="gallery-header">
        <h1>🖼️ My Gallery</h1>
        <p>All your saved artwork in one place!</p>

        {items.length > 0 && (
          <button onClick={clearGallery}>🗑 Clear Gallery</button>
        )}
      </section>

      {items.length === 0 ? (
        <div className="empty-gallery">
          <div>🎨</div>
          <h2>No artwork yet!</h2>
          <p>Go draw something beautiful.</p>
        </div>
      ) : (
        <section className="gallery-grid">
          {items.map((item, index) => (
            <div className="gallery-card" key={index}>
              <img src={item.image} alt={`Artwork ${index + 1}`} />

              <div className="gallery-info">
                <h3>Artwork #{index + 1}</h3>
                <p>{item.date}</p>
              </div>
            </div>
          ))}
        </section>
      )}
  </section>
    </>
  );
}