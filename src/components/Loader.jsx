import "../styles/loader.css";

export default function Loader() {
  return (
    <div className="loader-screen">
      <div className="loader-stars">✨ ⭐ 🌈 💖</div>

      <h1>Little Artist Studio</h1>
      <p>Loading magical tools...</p>

      <div className="loader-bar">
        <span></span>
      </div>
    </div>
  );
}