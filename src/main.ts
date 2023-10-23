import "./style.css";

class LineCommand {
  points: { x: number, y: number }[];
  lineThickness: number;
  constructor(x:number, y:number, thickness: number) {
    this.points = [{ x, y }];
    this.lineThickness = thickness;
  }
  display(ctx: CanvasRenderingContext2D) {
    ctx.strokeStyle = "black";
    ctx.lineWidth = this.lineThickness;
    ctx.beginPath();
    const { x, y } = this.points[0];
    ctx.moveTo(x, y);
    for (const { x, y } of this.points) {
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
  drag(x:number, y:number) {
    this.points.push({ x, y });
  }
}

class CursorCommand {
  x: number;
  y: number;
  constructor(x:number, y:number) {
    this.x = x;
    this.y = y;
  }
  displayCursor(ctx: CanvasRenderingContext2D) {
    const originalFill = ctx.fillStyle;
    ctx.font = "32px monospace";
    ctx.fillStyle = "black";
    ctx.fillText("*", this.x - 8, this.y+16);
    console.log(`displaycursor works: ${this.x}, ${this.y},`, ctx.font);
    ctx.fillStyle = originalFill;
  }
}

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
ctx.fillStyle = "white";
ctx.fillRect(0, 0, canvas.width, canvas.height);
canvas.style.cursor = "none";


const cursor = { active: false, x: 0, y: 0 };
const zero = 0;
let currentThickness = 2;


const lines: LineCommand[] = []; //equivalent to "linecommand"
let currentLine:LineCommand|null = null;
const redoLines: LineCommand[] = [];
let cursorMouse : CursorCommand | null = null;


const bus = new EventTarget();

function notify(name:string) {
  bus.dispatchEvent(new Event(name));
}
bus.addEventListener("drawing-changed", redraw);
bus.addEventListener("tool-moved", redraw);

canvas.addEventListener("mouseenter", (e) => {
  cursorMouse = new CursorCommand(e.offsetX, e.offsetY);
});

canvas.addEventListener("mousedown", (e) => {
  cursor.active = true;
  cursor.x = e.offsetX;
  cursor.y = e.offsetY;
  currentLine = new LineCommand(cursor.x,cursor.y,currentThickness);
  lines.push(currentLine);
  redoLines.splice(zero, redoLines.length);
  //currentLine.push({ x: cursor.x, y: cursor.y });
  notify("drawing-changed");
  
  
  });
  

  
  canvas.addEventListener("mousemove", (event) => {
    if (cursor.active) {
      
      cursor.x = event.offsetX;
      cursor.y = event.offsetY;
      //points.push(currentLine);
      currentLine!.drag(cursor.x, cursor.y);
    }
    cursorMouse = new CursorCommand(event.offsetX, event.offsetY);
    notify("tool-moved");
    console.log(currentThickness);
  });
  
  
  canvas.addEventListener("mouseup", () => {
    cursor.active = false;
    currentLine = null;
    notify("drawing-changed");
  });
  
  function redraw() {
    ctx.fillRect(zero, zero, canvas.width, canvas.height);
    for (const line of lines) {
      line.display(ctx);
    }
    if (cursorMouse) {
      cursorMouse.displayCursor(ctx);
    }
    console.log("redraw was called");
  }

  const clear = document.createElement("button");
  clear.innerHTML = "clear";
  app.append(clear);
  
clear.addEventListener("click", (clearCanvas));
function clearCanvas() {
  lines.splice(zero, lines.length);
  console.log(lines);
  notify("drawing-changed");
  }

  const undoButton = document.createElement("button");
  undoButton.innerHTML = "undo";
  app.append(undoButton);

undoButton.addEventListener("click", (undoCanvas));
function undoCanvas() {
  console.log(lines.length);
  if (lines.length > zero) {
    redoLines.push(lines.pop()!);
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
    lines.push(redoLines.pop()!);
    notify("drawing-changed");
  }
}

const thinButton = document.createElement("button");
  thinButton.innerHTML = "<-";
thinButton.addEventListener("click", () => {
  if (currentThickness >= 1) {
    currentThickness--;
    //lines[lines.length - 1].lineThickness = currentThickness;
    ctx.lineWidth = currentThickness;
    notify("drawing-changed");
    console.log("thin works");
  }
});
  
const thickButton = document.createElement("button");
  thickButton.innerHTML = "->";
thickButton.addEventListener("click", () => {
  if (currentThickness < 15) {
    currentThickness++;
    //lines[lines.length-1].lineThickness = currentThickness;
    ctx.lineWidth = currentThickness;
    notify("drawing-changed");
    console.log("thick works");
  }
});
  
app.append(thinButton, thickButton);

//step 7 is the cursor thingy, the asterisk that the prof has for the cursor