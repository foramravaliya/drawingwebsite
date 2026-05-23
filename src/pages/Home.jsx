import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/home.css";

export default function Home() {
  return (
    <>
      <Navbar />

      <section className="hero">
        <div className="blob blob1"></div>
        <div className="blob blob2"></div>
        <div className="blob blob3"></div>

        <h1>
          LITTLE ARTIST
          <span>STUDIO</span>
        </h1>

        <p>
          Unleash your imagination! <br />
          Draw, paint and create your own magical world.
        </p>

        <div className="hero-buttons">
          <Link to="/draw">
            <button className="primary-btn">🎨 Start Creating</button>
          </Link>

          <Link to="/coloring">
            <button className="secondary-btn">🖍️ Color Pictures</button>
          </Link>
        </div>
      </section>

      <section className="mascots">
        <span>🦎</span>
        <span>🦫</span>
        <span>👾</span>
        <span>🐉</span>
      </section>

      <section className="feature-grid">
        <Link to="/draw" className="feature-card">
          <div>🖌️</div>
          <h3>Free Draw</h3>
          <p>Brush, shapes, text and stickers.</p>
        </Link>

        <Link to="/coloring" className="feature-card">
          <div>🍕</div>
          <h3>Coloring Book</h3>
          <p>Pizza, animals, stars and more.</p>
        </Link>

        <Link to="/gallery" className="feature-card">
          <div>🖼️</div>
          <h3>My Gallery</h3>
          <p>Save and view your artwork.</p>
        </Link>
      </section>
    </>
  );
}