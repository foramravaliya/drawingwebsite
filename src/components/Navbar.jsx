import { NavLink } from "react-router-dom";
import "../styles/navbar.css";

export default function Navbar() {
  return (
    <nav className="navbar">
      <NavLink to="/" className="logo">
        <div className="logo-icon">🐾</div>
        <div>
          LITTLE ARTIST
          <br />
          <span>STUDIO</span>
        </div>
      </NavLink>

      <div className="nav-links">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/draw">Draw</NavLink>
        <NavLink to="/coloring">Coloring</NavLink>
        <NavLink to="/gallery">Gallery</NavLink>
      </div>
    </nav>
  );
}