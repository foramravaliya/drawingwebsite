import { useRef, useState } from "react";
import Navbar from "../components/Navbar";
import "../styles/coloring.css";

export default function Coloring() {
  const canvasRef = useRef(null);
  const [selectedPicture, setSelectedPicture] = useState(null);
  const [activeColor, setActiveColor] = useState("#ff7bac");

 const colors = [
   "#ffadad","#ffd6a5","#fdffb6","#caffbf","#9bf6ff","#a0c4ff","#bdb2ff","#ffc6ff",

   "#ff8fab","#fb6f92","#ff4d6d","#ff758f","#ffb3c1","#ffccd5",

   "#f94144","#f3722c","#f8961e","#f9844a","#f9c74f",

   "#90be6d","#43aa8b","#4d908e","#577590","#277da1",

   "#d8f3dc","#b7e4c7","#95d5b2","#74c69d","#52b788",

   "#caf0f8","#ade8f4","#90e0ef","#48cae4","#00b4d8",

   "#4361ee","#3a0ca3","#7209b7","#b5179e","#f72585",

   "#e9ecef","#dee2e6","#ced4da","#adb5bd","#6c757d",

   "#f8edeb","#fcd5ce","#fae1dd","#f9dcc4","#fec89a",

   "#ffbe0b","#fb5607","#ff006e","#8338ec","#3a86ff",

   "#06d6a0","#1b9aaa","#ef476f","#ffc43d","#d7263d",

   "#2ec4b6","#cbf3f0","#ffbf69","#ff9f1c","#e71d36",

   "#22223b","#4a4e69","#9a8c98","#c9ada7","#f2e9e4",

   "#d8e2dc","#ffe5d9","#ffcad4","#f4acb7","#9d8189",

   "#03045e","#0077b6","#00b4d8","#90e0ef","#caf0f8",

   "#588157","#3a5a40","#344e41","#dad7cd","#a3b18a",

   "#ff595e","#ffca3a","#8ac926","#1982c4","#6a4c93",

   "#ffb5a7","#fcd5ce","#f8edeb","#fec89a","#faedcd",

   "#d9ed92","#b5e48c","#99d98c","#76c893","#52b69a",

   "#168aad","#1a759f","#1e6091","#184e77","#023e8a",

   "#000000","#222222","#444444","#666666","#888888",
   "#aaaaaa","#cccccc","#eeeeee","#ffffff"
 ];
  const pictures = [
    { name: "Burger", emoji: "🍔", image: "shapes/burger.png" },
    { name: "Pizza", emoji: "🍕", image: "/shapes/pizza.png" },
    { name: "Cake", emoji: "🍰", image: "/shapes/pastry.png" },
    { name: "Ice Cream", emoji: "🍦", image: "/shapes/iceCream.png" },
    { name: "Cat", emoji: "🐱", image: "/shapes/cat.png" },
    { name: "Dog", emoji: "🐶", image: "/shapes/dog.png" },
    { name: "Star", emoji: "⭐", image: "/shapes/star.png" },
    { name: "Heart", emoji: "❤️", image: "/shapes/heart.png" },
    { name: "Cat", emoji: "🐱", image: "/shapes/cat.png" },
    { name: "Penguin", emoji: "🐧", image: "/animals/penguin.png" },
    { name: "Sheep", emoji: "🐑", image: "/animals/sheep.png" },
      { name: "Owl", emoji: "🦉", image: "/animals/owl.png" },
       { name: "Mouse", emoji: "🐭", image: "/animals/mouse.png" },
        { name: "Bee", emoji: "🐝", image: "/animals/bee.png" },
  ];

  const openPicture = (pic) => {
    setSelectedPicture(pic);

    setTimeout(() => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const img = new Image();
      img.src = pic.image;

      img.onload = () => {
        ctx.drawImage(img, 80, 40, 360, 360);
      };
    }, 100);
  };

  const getPosition = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    return {
      x: Math.floor(((e.clientX - rect.left) * canvas.width) / rect.width),
      y: Math.floor(((e.clientY - rect.top) * canvas.height) / rect.height),
    };
  };

  const hexToRgb = (hex) => {
    const value = parseInt(hex.replace("#", ""), 16);

    return {
      r: (value >> 16) & 255,
      g: (value >> 8) & 255,
      b: value & 255,
    };
  };

  const colorsMatch = (a, b, tolerance = 30) => {
    return (
      Math.abs(a.r - b.r) <= tolerance &&
      Math.abs(a.g - b.g) <= tolerance &&
      Math.abs(a.b - b.b) <= tolerance
    );
  };

  const getPixel = (imageData, x, y) => {
    const index = (y * imageData.width + x) * 4;

    return {
      r: imageData.data[index],
      g: imageData.data[index + 1],
      b: imageData.data[index + 2],
      a: imageData.data[index + 3],
    };
  };

  const setPixel = (imageData, x, y, color) => {
    const index = (y * imageData.width + x) * 4;

    imageData.data[index] = color.r;
    imageData.data[index + 1] = color.g;
    imageData.data[index + 2] = color.b;
    imageData.data[index + 3] = 255;
  };

  const colorCanvas = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const { x, y } = getPosition(e);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const startColor = getPixel(imageData, x, y);
    const fillColor = hexToRgb(activeColor);

    if (startColor.r < 50 && startColor.g < 50 && startColor.b < 50) {
      return;
    }

    if (colorsMatch(startColor, fillColor, 5)) {
      return;
    }

    const stack = [[x, y]];
    const visited = new Uint8Array(canvas.width * canvas.height);

    while (stack.length > 0) {
      const [cx, cy] = stack.pop();

      if (cx < 0 || cy < 0 || cx >= canvas.width || cy >= canvas.height) {
        continue;
      }

      const visitedIndex = cy * canvas.width + cx;

      if (visited[visitedIndex]) continue;

      const currentColor = getPixel(imageData, cx, cy);

      if (!colorsMatch(currentColor, startColor)) continue;

      visited[visitedIndex] = 1;
      setPixel(imageData, cx, cy, fillColor);

      stack.push([cx + 1, cy]);
      stack.push([cx - 1, cy]);
      stack.push([cx, cy + 1]);
      stack.push([cx, cy - 1]);
    }

    ctx.putImageData(imageData, 0, 0);
  };

  const resetCanvas = () => {
    if (selectedPicture) openPicture(selectedPicture);
  };

  const saveColoring = () => {
    const canvas = canvasRef.current;
    const image = canvas.toDataURL("image/png");

    const link = document.createElement("a");
    link.download = `coloring-${Date.now()}.png`;
    link.href = image;
    link.click();

    const saved = JSON.parse(localStorage.getItem("little_artist_gallery") || "[]");
    saved.unshift({
      image,
      date: new Date().toLocaleDateString(),
    });

    localStorage.setItem("little_artist_gallery", JSON.stringify(saved.slice(0, 20)));
    alert("Coloring saved! 🎉");
  };

  if (!selectedPicture) {
    return (
      <>
        <Navbar />

        <section className="coloring-header">
          <h1>🖍️ Coloring Book</h1>
          <p>Pick a picture and color it!</p>
        </section>

        <section className="coloring-grid">
          {pictures.map((pic, index) => (
            <button
              key={index}
              className="coloring-card"
              onClick={() => openPicture(pic)}
            >
              <img src={pic.image} alt={pic.name} />
              <h3>{pic.emoji} {pic.name}</h3>
            </button>
          ))}
        </section>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="page-decoration star1">🖍️</div>
      <div className="page-decoration star2">✨</div>
      <div className="page-decoration star3">🌸</div>

      <section className="coloring-page">

      <div className="coloring-work-header">
        <button onClick={() => setSelectedPicture(null)}>← Back</button>
        <h1>{selectedPicture.emoji} {selectedPicture.name}</h1>
      </div>

      <section className="coloring-workspace">
        <aside className="coloring-palette">
          <h3>🎨 Colors</h3>

          <div className="active-color-box">
            <span style={{ backgroundColor: activeColor }}></span>
            <p>Active</p>
          </div>

          <div className="coloring-colors">
            {colors.map((color, index) => (
              <button
                key={index}
                style={{ backgroundColor: color }}
                onClick={() => setActiveColor(color)}
              />
            ))}
          </div>

          <button className="reset-btn" onClick={resetCanvas}>🔄 Reset</button>
          <button className="save-coloring-btn" onClick={saveColoring}>💾 Save</button>
        </aside>

        <main className="coloring-canvas-area">
          <canvas
            ref={canvasRef}
            width="520"
            height="480"
            className="coloring-canvas"
            onClick={colorCanvas}
          />
        </main>
      </section>
      </section>
    </>

  );
}