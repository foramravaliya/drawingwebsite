import { useRef, useState } from "react";
import Navbar from "../components/Navbar";
import "../styles/draw.css";

export default function Draw() {
  const canvasRef = useRef(null);
  const lastPointRef = useRef({ x: 0, y: 0 });

  const [isDrawing, setIsDrawing] = useState(false);
  const [activeTool, setActiveTool] = useState("brush");
  const [brushColor, setBrushColor] = useState("#ff7bac");
  const [brushSize, setBrushSize] = useState(12);
  const [opacity, setOpacity] = useState(100);
  const [history, setHistory] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [startPos, setStartPos] = useState(null);
  const [snapshot, setSnapshot] = useState(null);
  const [selectedSticker, setSelectedSticker] = useState(null);
const [rainbowMode, setRainbowMode] = useState(false);
const [cursorSparkle, setCursorSparkle] = useState(null);


  const colors = [
    "#ff7bac", "#ff5a99", "#ff6b6b", "#ff9a3c",
    "#ffd93d", "#ffec5c", "#6bcb77", "#4caf50",
    "#4d96ff", "#7b5ea7", "#b39ddb", "#ff80ab",
    "#00bcd4", "#26c6da", "#78909c", "#ffffff",
    "#3d2b5c", "#4e342e", "#000000", "#ff8a65"
  ];

  const getPosition = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    return {
      x: (e.nativeEvent.offsetX * canvas.width) / rect.width,
      y: (e.nativeEvent.offsetY * canvas.height) / rect.height,
    };
  };

  const saveState = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setHistory((prev) => [...prev, canvas.toDataURL()]);
    setRedoStack([]);
  };

const bucketFill = (startX, startY) => {
  saveState();

  const canvas = canvasRef.current;
  const ctx = canvas.getContext("2d");

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  const targetColor = getPixelColor(imageData, startX, startY);
  const fillColor = hexToRgb(brushColor);

  if (
    targetColor.r === fillColor.r &&
    targetColor.g === fillColor.g &&
    targetColor.b === fillColor.b
  ) {
    return;
  }

  const stack = [[startX, startY]];

  while (stack.length) {
    const [x, y] = stack.pop();

    if (x < 0 || y < 0 || x >= canvas.width || y >= canvas.height) continue;

    const currentColor = getPixelColor(imageData, x, y);

    if (
      currentColor.r === targetColor.r &&
      currentColor.g === targetColor.g &&
      currentColor.b === targetColor.b
    ) {
      setPixelColor(imageData, x, y, fillColor);

      stack.push([x + 1, y]);
      stack.push([x - 1, y]);
      stack.push([x, y + 1]);
      stack.push([x, y - 1]);
    }
  }

  ctx.putImageData(imageData, 0, 0);
};

const getPixelColor = (imageData, x, y) => {
  const index = (y * imageData.width + x) * 4;

  return {
    r: imageData.data[index],
    g: imageData.data[index + 1],
    b: imageData.data[index + 2],
    a: imageData.data[index + 3],
  };
};

const setPixelColor = (imageData, x, y, color) => {
  const index = (y * imageData.width + x) * 4;

  imageData.data[index] = color.r;
  imageData.data[index + 1] = color.g;
  imageData.data[index + 2] = color.b;
  imageData.data[index + 3] = 255;
};

const hexToRgb = (hex) => {
  const bigint = parseInt(hex.replace("#", ""), 16);

  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  };
};

const clearCanvas = () => {
  const confirmClear = window.confirm("Clear the canvas?");

  if (!confirmClear) return;

  saveState();

  const canvas = canvasRef.current;
  const ctx = canvas.getContext("2d");

  ctx.clearRect(0, 0, canvas.width, canvas.height);
};

const applyBackground = (color) => {
  saveState();

  const canvas = canvasRef.current;
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = color;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
};

/* ************** */
  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const { x, y } = getPosition(e);
    setStartPos({ x, y });
    lastPointRef.current = { x, y };

    if (
      activeTool === "line" ||
      activeTool === "rectangle" ||
      activeTool === "circle"
    ) {
      setSnapshot(ctx.getImageData(0, 0, canvas.width, canvas.height));
    }

    saveState();

    if (selectedSticker) {
      placeSticker(e);
      return;
    }

if (activeTool === "bucket") {
  bucketFill(Math.floor(x), Math.floor(y));
  return;
}
    if (activeTool === "text") {
      const text = prompt("Enter text:");
      if (text) {
        ctx.font = `bold ${brushSize * 2}px Arial`;
        ctx.fillStyle = brushColor;
        ctx.globalAlpha = opacity / 100;
        ctx.fillText(text, x, y);
        ctx.globalAlpha = 1;
      }
      return;
    }

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

//draw
const draw = (e) => {
  if (!isDrawing) return;


  const canvas = canvasRef.current;
  const ctx = canvas.getContext("2d");
  const { x, y } = getPosition(e);
  setCursorSparkle({
    x,
    y,
    id: Date.now()
  });

  ctx.lineWidth = brushSize;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  if (activeTool === "eraser") {
    ctx.strokeStyle = "#ffffff";
  } else {
    ctx.strokeStyle = brushColor;
  }
  ctx.globalAlpha = opacity / 100;

  if (
    activeTool === "line" ||
    activeTool === "rectangle" ||
    activeTool === "circle"
  ) {
    if (snapshot) {
      ctx.putImageData(snapshot, 0, 0);
    }

    ctx.beginPath();

    if (activeTool === "line") {
      ctx.moveTo(startPos.x, startPos.y);
      ctx.lineTo(x, y);
    }

    if (activeTool === "rectangle") {
      ctx.rect(startPos.x, startPos.y, x - startPos.x, y - startPos.y);
    }

    if (activeTool === "circle") {
      const radius = Math.sqrt(
        Math.pow(x - startPos.x, 2) + Math.pow(y - startPos.y, 2)
      );

      ctx.arc(startPos.x, startPos.y, radius, 0, Math.PI * 2);
    }

    ctx.stroke();
    ctx.globalAlpha = 1;
    return;
  }

  if (activeTool === "brush" || activeTool === "eraser") {
    if (rainbowMode && activeTool === "brush") {
      const rainbowColors = [
        "#ff9aa2",
        "#ffdac1",
        "#ffffb5",
        "#b5ead7",
        "#c7ceea",
        "#d7bde2",
        "#f8c8dc",
      ];

      const last = lastPointRef.current;

      rainbowColors.forEach((color, index) => {
        const offset = (index - 3) * 3;

        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.moveTo(last.x, last.y + offset);
        ctx.lineTo(x, y + offset);
        ctx.stroke();
      });

      lastPointRef.current = { x, y };
    } else {
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  }

  ctx.globalAlpha = 1;
};

  const stopDrawing = (e) => {
    if (!isDrawing) {
      setStartPos(null);
      return;
    }

    if (
      activeTool !== "line" &&
      activeTool !== "rectangle" &&
      activeTool !== "circle"
    ) {
      setIsDrawing(false);
      setStartPos(null);
      setSnapshot(null);
      return;
    }

    if (!e) {
      setIsDrawing(false);
      setStartPos(null);
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const { x, y } = getPosition(e);

    ctx.strokeStyle = brushColor;
    ctx.lineWidth = brushSize;
    ctx.globalAlpha = opacity / 100;

    if (activeTool === "line") {
      ctx.beginPath();
      ctx.moveTo(startPos.x, startPos.y);
      ctx.lineTo(x, y);
      ctx.stroke();
    }

    if (activeTool === "rectangle") {
      ctx.strokeRect(startPos.x, startPos.y, x - startPos.x, y - startPos.y);
    }

    if (activeTool === "circle") {
      const radius = Math.sqrt(
        Math.pow(x - startPos.x, 2) + Math.pow(y - startPos.y, 2)
      );

      ctx.beginPath();
      ctx.arc(startPos.x, startPos.y, radius, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.globalAlpha = 1;
    setIsDrawing(false);
    setStartPos(null);
  };

  const undoCanvas = () => {
    if (history.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const lastState = history[history.length - 1];

    setRedoStack((prev) => [...prev, canvas.toDataURL()]);
    setHistory((prev) => prev.slice(0, -1));

    const img = new Image();
    img.src = lastState;

    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    };
  };

  const redoCanvas = () => {
    if (redoStack.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const redoState = redoStack[redoStack.length - 1];

    setHistory((prev) => [...prev, canvas.toDataURL()]);
    setRedoStack((prev) => prev.slice(0, -1));

    const img = new Image();
    img.src = redoState;

    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    };
  };

  const addSticker = (emoji) => {
    setSelectedSticker(emoji);
  };

const placeSticker = (e) => {
  if (!selectedSticker) return;

  saveState();

  const canvas = canvasRef.current;
  const ctx = canvas.getContext("2d");

  const { x, y } = getPosition(e);

  ctx.font = `${brushSize * 3}px Arial`;
  ctx.fillText(selectedSticker, x - 20, y + 20);
};

  const saveDrawing = () => {
    const canvas = canvasRef.current;

    const link = document.createElement("a");
    link.download = `little-artist-${Date.now()}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();

    const saved = JSON.parse(localStorage.getItem("little_artist_gallery") || "[]");
    saved.unshift({
      image: canvas.toDataURL("image/png"),
      date: new Date().toLocaleDateString(),
    });

    localStorage.setItem("little_artist_gallery", JSON.stringify(saved.slice(0, 20)));
    alert("Drawing saved! 🎉");
  };

  return (
      <>
        <Navbar />

        <div className="page-decoration star1">🌈</div>
        <div className="page-decoration star2">⭐</div>
        <div className="page-decoration star3">🦄</div>



      <div className="draw-topbar">
        <button className="back-btn" onClick={() => window.history.back()}>
          ← Back
        </button>

        <h1>🎨 Free Draw</h1>

        <div className="top-actions">
          <button className="clear-btn" onClick={clearCanvas}>
            🗑 Clear
          </button>

          <button className="save-btn" onClick={saveDrawing}>
            💾 Save
          </button>
        </div>
      </div>

      <section className="draw-page magical-bg">
        <aside className="left-tools">
          <button
            className={activeTool === "brush" ? "tool active" : "tool"}
            onClick={() => setActiveTool("brush")}
          >
            🖌 Brush
          </button>

           <button
             className={rainbowMode ? "tool active" : "tool"}
             onClick={() => {
               setRainbowMode(!rainbowMode);
               setActiveTool("brush");
             }}
           >
             🌈 Rainbow
           </button>
          <button
            className={activeTool === "eraser" ? "tool active" : "tool"}
            onClick={() => setActiveTool("eraser")}
          >
            🧹 Eraser
          </button>

<button
  className={activeTool === "bucket" ? "tool active" : "tool"}
  onClick={() => setActiveTool("bucket")}
>
  🪣 Bucket
</button>
<button
  className={activeTool === "line" ? "tool active" : "tool"}
  onClick={() => setActiveTool("line")}
>
  📏 Line
</button>

<button
  className={activeTool === "rectangle" ? "tool active" : "tool"}
  onClick={() => setActiveTool("rectangle")}
>
  ⬜ Rectangle
</button>

<button
  className={activeTool === "circle" ? "tool active" : "tool"}
  onClick={() => setActiveTool("circle")}
>
  ⭕ Circle
</button>
          <button
            className={activeTool === "text" ? "tool active" : "tool"}
            onClick={() => setActiveTool("text")}
          >
            🔤 Text
          </button>

          <button className="tool" onClick={undoCanvas}>
            ↩ Undo
          </button>

          <button className="tool" onClick={redoCanvas}>
            ↪ Redo
          </button>

          <div className="control-box">
            <label>
              Brush Size <span>{brushSize}px</span>
            </label>

            <input
              type="range"
              min="1"
              max="60"
              value={brushSize}
              onChange={(e) => setBrushSize(Number(e.target.value))}
            />
          </div>

          <div className="control-box">
            <label>
              Opacity <span>{opacity}%</span>
            </label>

            <input
              type="range"
              min="10"
              max="100"
              value={opacity}
              onChange={(e) => setOpacity(Number(e.target.value))}
            />
          </div>

          <h4>COLORS</h4>

          <div className="selected-color">
            <span style={{ backgroundColor: brushColor }}></span>
            <p>Selected</p>
          </div>

          <div className="color-grid">
            {colors.map((color, index) => (
              <button
                key={index}
                className="color-btn"
                style={{ backgroundColor: color }}
                onClick={() => {
                  setBrushColor(color);
                  setActiveTool("brush");
                  setRainbowMode(false);
                }}
              />
            ))}
          </div>

          <h4>BACKGROUNDS</h4>

         <div className="bg-buttons">
           <button onClick={() => applyBackground("#ffffff")}>⬜</button>
           <button onClick={() => applyBackground("#87ceeb")}>☁️</button>
           <button onClick={() => applyBackground("#90ee90")}>🌿</button>
           <button onClick={() => applyBackground("#ffb6c1")}>🦄</button>
           <button onClick={() => applyBackground("#191970")}>🌌</button>
           <button onClick={() => applyBackground("#ffd166")}>☀️</button>
         </div>
        </aside>



{selectedSticker && (
  <div className="selected-sticker-preview">
    Selected Sticker: {selectedSticker}
  </div>
)}
        <main className="canvas-area">
          <canvas
            ref={canvasRef}
            width="1400"
            height="850"
            className="main-canvas"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={(e) => stopDrawing(e)}
            onMouseLeave={() => {
              setIsDrawing(false);
              setStartPos(null);
              setSnapshot(null);
            }}
          ></canvas>

          {cursorSparkle && (
            <div
              key={cursorSparkle.id}
              className="sparkle"
              style={{
                left: `${(cursorSparkle.x / 1400) * 100}%`,
                top: `${(cursorSparkle.y / 850) * 100}%`,
              }}
            >
              ✨
            </div>
          )}


          <div className="bottom-sticker-panel">
           <StickerSection title="⭐ Favorites" items={["⭐", "🌟", "✨", "💫", "❤️", "💖", "💜", "💙", "🌈", "☀️", "🌙", "☁️"]} addSticker={addSticker} />

           <StickerSection title="🐾 Animals" items={["🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼", "🐨", "🐯", "🦁", "🐮", "🐷", "🐸", "🐵", "🐔", "🐧", "🐢", "🐘", "🦒", "🦄", "🐉"]} addSticker={addSticker} />

           <StickerSection title="🍔 Food" items={["🍕", "🍔", "🍟", "🌭", "🥪", "🌮", "🍩", "🍪", "🍰", "🧁", "🍦", "🍭", "🍬", "🍫", "🍎", "🍓", "🍉", "🍌", "🥭", "🍇", "🍒", "🥕"]} addSticker={addSticker} />

           <StickerSection title="🌿 Nature" items={["🌸", "🌺", "🌻", "🌷", "🌹", "🌼", "🌳", "🌴", "🌵", "🍀", "🍁", "🍂", "🌊", "🔥", "❄️", "🌧️", "⛈️", "🌤️"]} addSticker={addSticker} />

           <StickerSection title="🎪 Fun" items={["🎈", "🎁", "🎀", "🎉", "🎊", "🏆", "👑", "💎", "⚽", "🏀", "🎵", "🎸", "🎮", "🚀", "🛸", "🎭", "🎨", "🧸"]} addSticker={addSticker} />

           <StickerSection title="🚗 Vehicles" items={["🚗", "🚕", "🚌", "🚓", "🚑", "🚒", "🚜", "🚲", "🛴", "✈️", "🚁", "🚀", "⛵", "🚢"]} addSticker={addSticker} />

           <StickerSection title="😀 Faces" items={["😀", "😄", "😊", "😍", "😎", "🥳", "🤩", "😇", "🤠", "😋", "🤗", "😜", "😂", "😴", "😮", "😺"]} addSticker={addSticker} />
          </div>

        </main>


      </section>
    </>
  );
}

function StickerSection({ title, items, addSticker }) {
  return (
    <div className="sticker-section">
      <h3>{title}</h3>

      <div className="sticker-grid">
        {items.map((item, index) => (
          <button key={index} onClick={() => addSticker(item)}>
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}