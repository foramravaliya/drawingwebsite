import { useRef, useState } from "react";
import Navbar from "../components/Navbar";
import "../styles/draw.css";
import { stickerCategories } from "../data/stickers";

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
const [sparkles, setSparkles] = useState([]);
const [activeStickerCategory, setActiveStickerCategory] = useState("Favorites");
const [placedStickers, setPlacedStickers] = useState([]);
const [draggingSticker, setDraggingSticker] = useState(null);
const [selectedPlacedSticker, setSelectedPlacedSticker] = useState(null);

const playSound = (src) => {
  const audio = new Audio(src);
  audio.volume = 0.4;
  audio.play();
};

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

  const getPosition = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    return {
      x: ((e.clientX - rect.left) * canvas.width) / rect.width,
      y: ((e.clientY - rect.top) * canvas.height) / rect.height,
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

  playSound("/sounds/erase.mp3");
  saveState();

  const canvas = canvasRef.current;
  const ctx = canvas.getContext("2d");

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  setPlacedStickers([]);
  setSelectedPlacedSticker(null);
  setSelectedSticker(null);
  setSparkles([]);
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
      e.preventDefault();
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
    e.preventDefault();
  if (!isDrawing) return;
if (draggingSticker) {
  dragSticker(e);
  return;
}

  const canvas = canvasRef.current;
  const ctx = canvas.getContext("2d");
  const { x, y } = getPosition(e);
setSparkles((prev) => {
  const updated = [
    ...prev.slice(-12),
    {
      x,
      y,
      id: Date.now() + Math.random(),
      emoji: rainbowMode ? "🌈" : "✨",
    },
  ];

  return updated;
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
      if (e) e.preventDefault();
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

   const { x, y } = getPosition(e);

   const ctx = canvasRef.current.getContext("2d");

   ctx.font = `${brushSize * 3}px Arial`;
   ctx.fillText(selectedSticker, x, y);

   playSound("/sounds/pop.mp3");

   setPlacedStickers((prev) => [
     ...prev,
     {
       id: Date.now(),
       emoji: selectedSticker,
       x,
       y,
       size: brushSize * 3,
       rotation: 0,
     },
   ]);
 };

const startStickerDrag = (id) => {
  setDraggingSticker(id);
};

const dragSticker = (e) => {
  if (!draggingSticker) return;

  const { x, y } = getPosition(e);

  setPlacedStickers((prev) =>
    prev.map((sticker) =>
      sticker.id === draggingSticker
        ? { ...sticker, x, y }
        : sticker
    )
  );
};

const stopStickerDrag = () => {
  setDraggingSticker(null);
};

  const saveDrawing = () => {
    const canvas = canvasRef.current;
    const image = canvas.toDataURL("image/png");

    const saved = JSON.parse(localStorage.getItem("little_artist_gallery") || "[]");

    saved.unshift({
      image,
      date: new Date().toLocaleDateString(),
    });

    localStorage.setItem("little_artist_gallery", JSON.stringify(saved.slice(0, 20)));

    playSound("/sounds/save.mp3");
    alert("Saved to gallery! 🎉");
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

      <button
        className="mobile-tools-btn"
        onClick={() => document.body.classList.toggle("show-tools")}
      >
        🛠 Tools
      </button>

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
            playSound("/sounds/magic.mp3");
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

        <input
          type="color"
          value={brushColor}
          onChange={(e) => {
            setBrushColor(e.target.value);
            setActiveTool("brush");
            setRainbowMode(false);
          }}
          className="custom-color-picker"
        />

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
        <div className="canvas-wrapper">
          <canvas
            ref={canvasRef}
            width="1400"
            height="850"
            className="main-canvas"
            onPointerDown={startDrawing}
            onPointerMove={draw}
            onPointerUp={stopDrawing}
            onPointerCancel={stopDrawing}
            onMouseLeave={() => {
              setIsDrawing(false);
              setStartPos(null);
              setSnapshot(null);
            }}
          ></canvas>

          {placedStickers.map((sticker) => (
            <div
              key={sticker.id}
              className="placed-sticker"
              style={{
                left: `${(sticker.x / 1400) * 100}%`,
                top: `${(sticker.y / 850) * 100}%`,
                fontSize: `${sticker.size}px`,
                transform: `translate(-50%, -50%) rotate(${sticker.rotation}deg)`,
              }}
              onMouseDown={() => {
                setSelectedPlacedSticker(sticker.id);
                startStickerDrag(sticker.id);
              }}
              onMouseUp={stopStickerDrag}
            >
              {sticker.emoji}
            </div>
          ))}

          {sparkles.map((sparkle) => (
            <div
              key={sparkle.id}
              className="sparkle"
              style={{
                left: `${(sparkle.x / 1400) * 100}%`,
                top: `${(sparkle.y / 850) * 100}%`,
              }}
            >
              {sparkle.emoji}
            </div>
          ))}
        </div>

        {selectedPlacedSticker && (
          <div className="sticker-controls">
            <button
              onClick={() => {
                setPlacedStickers((prev) =>
                  prev.map((s) =>
                    s.id === selectedPlacedSticker
                      ? { ...s, size: s.size + 8 }
                      : s
                  )
                );
              }}
            >
              🔍 Bigger
            </button>

            <button
              onClick={() => {
                setPlacedStickers((prev) =>
                  prev.map((s) =>
                    s.id === selectedPlacedSticker
                      ? { ...s, size: Math.max(20, s.size - 8) }
                      : s
                  )
                );
              }}
            >
              🔎 Smaller
            </button>

            <button
              onClick={() => {
                setPlacedStickers((prev) =>
                  prev.map((s) =>
                    s.id === selectedPlacedSticker
                      ? { ...s, rotation: s.rotation + 20 }
                      : s
                  )
                );
              }}
            >
              🔄 Rotate
            </button>

            <button
              onClick={() => {
                setPlacedStickers((prev) =>
                  prev.filter((s) => s.id !== selectedPlacedSticker)
                );
                setSelectedPlacedSticker(null);
              }}
            >
              ❌ Delete
            </button>
          </div>
        )}

        <div className="bottom-sticker-panel">
          <div className="sticker-tabs">
            {Object.keys(stickerCategories).map((category) => (
              <button
                key={category}
                className={
                  activeStickerCategory === category ? "active-sticker-tab" : ""
                }
                onClick={() => setActiveStickerCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="single-sticker-grid">
            {stickerCategories[activeStickerCategory].map((item, index) => (
              <button key={index} onClick={() => addSticker(item)}>
                {item}
              </button>
            ))}
          </div>
        </div>
      </main>
    </section>
  </>
);
}

