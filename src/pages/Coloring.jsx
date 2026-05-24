import { useRef, useState } from "react";
import Navbar from "../components/Navbar";
import "../styles/coloring.css";

export default function Coloring() {
  const canvasRef = useRef(null);
  const [selectedPicture, setSelectedPicture] = useState(null);
  const [activeColor, setActiveColor] = useState("#ff7bac");
  const [activeCategory, setActiveCategory] = useState("Animals");



 const colors = [
   "#000000", "#ffffff", "#808080", "#c0c0c0", "#ff0000", "#800000",
   "#ff4d4d", "#ff9999", "#ff7f00", "#ffa500", "#ffd580", "#cc5500",
   "#ffff00", "#fff176", "#fdd835", "#b8860b", "#008000", "#00a000",
   "#32cd32", "#90ee90", "#006400", "#228b22", "#2e8b57", "#9acd32",
   "#0000ff", "#1e90ff", "#87ceeb", "#000080", "#4d96ff", "#00bcd4",
   "#40e0d0", "#008b8b", "#800080", "#7b5ea7", "#b39ddb", "#da70d6",
   "#ff00ff", "#ff7bac", "#ff5a99", "#ffc0cb", "#8b4513", "#a0522d",
   "#d2691e", "#cd853f", "#deb887", "#f4a460", "#c19a6b", "#5c4033",
   "#f5deb3", "#ffe4c4", "#ffdab9", "#f8f8f8"
 ];
  const pictures = [
    { name: "Burger",  image: "shapes/burger.png" },
    { name: "Pizza", image: "/shapes/pizza.png" },
    { name: "Cake",  image: "/shapes/pastry.png" },
    { name: "Ice Cream", image: "/shapes/iceCream.png" },
    { name: "Cat",image: "/shapes/cat.png" },
    { name: "Dog", image: "/shapes/dog.png" },
    { name: "Star",  image: "/shapes/star.png" },
    { name: "Heart",  image: "/shapes/heart.png" },
    { name: "Cat", image: "/shapes/cat.png" },
    { name: "Penguin",  image: "/animals/penguin.png" },
    { name: "Sheep", image: "/animals/sheep.png" },
      { name: "Owl", image: "/animals/owl.png" },
       { name: "Mouse", image: "/animals/mouse.png" },
        { name: "Bee", image: "/animals/bee.png" },


       // Animals
       { name: "A1", image: "animals/a1.jpg" },
       { name: "A2", image: "animals/a2.jpg" },
       { name: "A3", image: "animals/a3.jpg" },
       { name: "A4", image: "animals/a4.jpg" },
       { name: "A5", image: "animals/a5.jpg" },
       { name: "A6", image: "animals/a6.jpg" },
       { name: "A7", image: "animals/a7.jpg" },
       { name: "A8", image: "animals/a8.jpg" },
       { name: "A9", image: "animals/a9.jpg" },
       { name: "A10", image: "animals/a10.jpg" },
       { name: "A11", image: "animals/a11.jpg" },
       { name: "A12", image: "animals/a12.jpg" },
       { name: "A13", image: "animals/a13.jpg" },
       { name: "A14", image: "animals/a14.jpg" },

       // Birds
       { name: "B1", image: "birds/b1.jpg" },
       { name: "B2", image: "birds/b2.jpg" },
       { name: "B3", image: "birds/b3.jpg" },
       { name: "B4", image: "birds/b4.jpg" },
       { name: "B5", image: "birds/b5.jpg" },
       { name: "B6", image: "birds/b6.jpg" },
       { name: "B7", image: "birds/b7.jpg" },
       { name: "B8", image: "birds/b8.jpg" },

       // Cartoon
       { name: "C1", image: "cartoon/c1.jpg" },
       { name: "C2", image: "cartoon/c2.jpg" },
       { name: "C3", image: "cartoon/c3.jpg" },
       { name: "C4", image: "cartoon/c4.jpg" },
       { name: "C5", image: "cartoon/c5.jpg" },
       { name: "C6", image: "cartoon/c6.jpg" },
       { name: "C7", image: "cartoon/c7.jpg" },
       { name: "C8", image: "cartoon/c8.jpg" },
       { name: "C9", image: "cartoon/c9.jpg" },
       { name: "C10", image: "cartoon/c10.jpg" },
       { name: "C11", image: "cartoon/c11.jpg" },
       { name: "C12", image: "cartoon/c12.jpg" },
       { name: "C13", image: "cartoon/c13.jpg" },
       { name: "C14", image: "cartoon/c14.jpg" },

       // Family
       { name: "F1", image: "family/f1.jpg" },
       { name: "F2", image: "family/f2.jpg" },
       { name: "F3", image: "family/f3.jpg" },
       { name: "F4", image: "family/f4.jpg" },
       { name: "F5", image: "family/f5.jpg" },
       { name: "F6", image: "family/f6.jpg" },
       { name: "F7", image: "family/f7.jpg" },
       { name: "F8", image: "family/f8.jpg" },
       { name: "F9", image: "family/f9.jpg" },
       { name: "F10", image: "family/f10.jpg" },

       // Flowers
       { name: "FL1", image: "flower/fl1.jpg" },
       { name: "FL2", image: "flower/fl2.jpg" },
       { name: "FL3", image: "flower/fl3.jpg" },
       { name: "FL4", image: "flower/fl4.jpg" },
       { name: "FL5", image: "flower/fl5.jpg" },
       { name: "FL6", image: "flower/fl6.jpg" },
       { name: "FL7", image: "flower/fl7.jpg" },
       { name: "FL8", image: "flower/fl8.jpg" },
       { name: "FL9", image: "flower/fl9.jpg" },
       { name: "FL10", image: "flower/fl10.jpg" },

       // Fruits
       { name: "FR1", image: "fruit/fr1.jpg" },
       { name: "FR2", image: "fruit/fr2.jpg" },
       { name: "FR3", image: "fruit/fr3.jpg" },
       { name: "FR4", image: "fruit/fr4.jpg" },
       { name: "FR5", image: "fruit/fr5.jpg" },
       { name: "FR6", image: "fruit/fr6.jpg" },
       { name: "FR7", image: "fruit/fr7.jpg" },
       { name: "FR8", image: "fruit/fr8.jpg" },
       { name: "FR9", image: "fruit/fr9.jpg" },
       { name: "FR10", image: "fruit/fr10.jpg" },
       { name: "FR11", image: "fruit/fr11.jpg" },
       { name: "FR12", image: "fruit/fr12.jpg" },
       { name: "FR13", image: "fruit/fr13.jpg" },
       { name: "FR14", image: "fruit/fr14.jpg" },
       { name: "FR15", image: "fruit/fr15.jpg" },
       { name: "FR16", image: "fruit/fr16.jpg" },
       { name: "FR17", image: "fruit/fr17.jpg" },
       { name: "FR18", image: "fruit/fr18.jpg" },

       // Nature
       { name: "N1", image: "nature/n1.jpg" },
       { name: "N2", image: "nature/n2.jpg" },
       { name: "N3", image: "nature/n3.jpg" },
       { name: "N4", image: "nature/n4.jpg" },
       { name: "N5", image: "nature/n5.jpg" },
       { name: "N6", image: "nature/n6.jpg" },
       { name: "N7", image: "nature/n7.jpg" },
       { name: "N8", image: "nature/n8.jpg" },
       { name: "N9", image: "nature/n9.jpg" },
       { name: "N10", image: "nature/n10.jpg" },
       { name: "N11", image: "nature/n11.jpg" },
       { name: "N12", image: "nature/n12.jpg" },
       { name: "N13", image: "nature/n13.jpg" },
       { name: "N14", image: "nature/n14.jpg" },
       { name: "N15", image: "nature/n15.jpg" },
       { name: "N16", image: "nature/n16.jpg" },
       { name: "N17", image: "nature/n17.jpg" },
       { name: "N18", image: "nature/n18.jpg" },
       { name: "N19", image: "nature/n19.jpg" },
       { name: "N20", image: "nature/n20.jpg" },
       { name: "N21", image: "nature/n21.jpg" },
       { name: "N22", image: "nature/n22.jpg" },
       { name: "N23", image: "nature/n23.jpg" },
       { name: "N24", image: "nature/n24.jpg" },
       { name: "N25", image: "nature/n25.jpg" },

  ];

const filteredPictures = pictures.filter((pic) =>
    pic.image.startsWith("/" + activeCategory.toLowerCase())
  );

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
       const maxWidth = 340;
       const maxHeight = 340;

       let width = img.width;
       let height = img.height;

       const scale = Math.min(maxWidth / width, maxHeight / height);

       width *= scale;
       height *= scale;

       const x = (canvas.width - width) / 2;
       const y = (canvas.height - height) / 2;

       ctx.drawImage(img, x, y, width, height);
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
              <h3>{pic.name}</h3>
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
        <h1> {selectedPicture.name}</h1>
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

          <input
            type="color"
            value={activeColor}
            onChange={(e) => setActiveColor(e.target.value)}
            className="custom-color-picker"
          />

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