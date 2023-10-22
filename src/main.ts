import "./style.css";

const app: HTMLDivElement = document.querySelector("#app")!;

const gameName = "small title change";

document.title = gameName;

const header = document.createElement("h1");
header.innerHTML = gameName;
header.style.textAlign = "center";
app.append(header);

//step 1

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
canvas.querySelector("#canvas");
const ctx = canvas.getContext("2d")!;
canvas.height = 256;
canvas.width = 256;

const a = 0;
const b = 0;
const cursor = { active: false, x: 0, y: 0 };
const one = 1;
const zero = 0;

function drawCanvas() {
    ctx.fillStyle = "white";
    ctx.fillRect(a, b, canvas.width, canvas.height);
    ctx.strokeStyle = "black";
    ctx.strokeRect(a, b, canvas.width, canvas.height);
}
drawCanvas();

interface Point{
  x: number;
  y: number;
}

const points: Point[][] = [];
let currentLine: Point[] = [];
const redoLines: Point[][] = [];


const bus = new EventTarget();

function notify(name:string) {
  bus.dispatchEvent(new Event(name));
}
bus.addEventListener("drawing-changed", redraw);



canvas.addEventListener("mousedown", (e) => {
  cursor.active = true;
  cursor.x = e.offsetX;
  cursor.y = e.offsetY;
  currentLine = [];
  points.push(currentLine);
  redoLines.splice(zero, redoLines.length);
  currentLine.push({ x: cursor.x, y: cursor.y });
  notify("drawing-changed");
  
  
  });
  

  
  canvas.addEventListener("mousemove", (event) => {
    if (cursor.active) {
      
      cursor.x = event.offsetX;
      cursor.y = event.offsetY;
      //points.push(currentLine);
      currentLine.push({ x: cursor.x, y: cursor.y });
      notify("drawing-changed");
    }
  });
  
  
  canvas.addEventListener("mouseup", () => {
    cursor.active = false;
    currentLine = [];
    notify("drawing-changed");
  });
  
  function redraw() {
    ctx.clearRect(zero, zero, canvas.width, canvas.height);
    drawCanvas();
    for (const line of points) {
      if (line.length > one) {
        ctx.beginPath();
        const { x, y } = line[zero];
        ctx.moveTo(x, y);
        for (const { x, y } of line) {
          ctx.lineTo(x, y);
        }
        ctx.stroke();
        
      }
    }
    console.log("redraw was called");
  }

  const clear = document.createElement("button");
  clear.innerHTML = "clear";
  app.append(clear);
  
clear.addEventListener("click", (clearCanvas));
function clearCanvas() {
  // eslint-disable-next-line @typescript-eslint/no-magic-numbers
  points.splice(0, points.length);
  console.log(points);
  notify("drawing-changed");
  }

  const undoButton = document.createElement("button");
  undoButton.innerHTML = "undo";
  app.append(undoButton);

undoButton.addEventListener("click", (undoCanvas));
function undoCanvas() {
  console.log(points.length);
  if (points.length > zero) {
    redoLines.push(points.pop()!);
    notify("drawing-changed");
  }
}

  const redoButton = document.createElement("button");
  redoButton.innerHTML = "redo";
  app.append(redoButton);

redoButton.addEventListener("click", (redoCanvas));
function redoCanvas() {
  console.log(redoLines.length);
  if (redoLines.length > zero) {
    points.push(redoLines.pop()!);
    notify("drawing-changed");
  }
}