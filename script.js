// ----- DRAWING SYSTEM -----
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let isDrawing = false;
let lastX = 0;
let lastY = 0;

let brushColor = "black";
let brushSize = 5;

// Start drawing
canvas.addEventListener("mousedown", (e) => {
    isDrawing = true;
    const rect = canvas.getBoundingClientRect();
    lastX = e.clientX - rect.left;
    lastY = e.clientY - rect.top;
});

// Draw
canvas.addEventListener("mousemove", (e) => {
    if (!isDrawing) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.strokeStyle = brushColor;
    ctx.lineWidth = brushSize;
    ctx.lineCap = "round";

    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);
    ctx.stroke();

    lastX = x;
    lastY = y;
});

// Stop drawing
canvas.addEventListener("mouseup", () => {
    isDrawing = false;
});

canvas.addEventListener("mouseleave", () => {
    isDrawing = false;
});

/* --- MULTI-ROOM CANVAS --- */
const rooms = {
  "Anime Room": { history: [], redoList: [], imageData: null },
  "Realistic Art": { history: [], redoList: [], imageData: null },
  "Pixel Art": { history: [], redoList: [], imageData: null },
  "18+ (Blurred for minors)": { history: [], redoList: [], imageData: null }
};

let currentRoom = "Anime Room";

/* --- Helper to load a room --- */
function loadRoom(roomName){
  // Save current room canvas
  rooms[currentRoom].imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  rooms[currentRoom].history = [...history];
  rooms[currentRoom].redoList = [...redoList];

  // Switch to new room
  currentRoom = roomName;

  // Load new room canvas
  if(rooms[currentRoom].imageData){
    ctx.putImageData(rooms[currentRoom].imageData, 0, 0);
  } else {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  // Load room-specific history
  history = [...rooms[currentRoom].history];
  redoList = [...rooms[currentRoom].redoList];
}

/* --- Room Buttons --- */
document.querySelectorAll('#rooms button').forEach(btn => {
  btn.onclick = () => loadRoom(btn.textContent);
});

/* --- Override saveHistory to be room-specific --- */
function saveHistory(){
  history.push(ctx.getImageData(0,0,canvas.width,canvas.height));
  rooms[currentRoom].history = [...history];
  rooms[currentRoom].redoList = [...redoList];
}
