import "./style.css";

class LineCommand {
  points: { x: number, y: number }[];
  lineThickness: number;
  lineColor: string;
  constructor(x:number, y:number, thickness: number, lineColor:string) {
    this.points = [{ x, y }];
    this.lineThickness = thickness;
    this.lineColor = lineColor;
  }
  display(ctx: CanvasRenderingContext2D) {
    ctx.strokeStyle = this.lineColor;
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
  cursorThickness: number;
  cursorColor: string;
  constructor(x:number, y:number, cursorThickness: number,cursorColor: string) {
    this.x = x;
    this.y = y;
    this.cursorThickness = cursorThickness;
    this.cursorColor = cursorColor;
  }
  display(ctx: CanvasRenderingContext2D) {
    const originalFill = ctx.fillStyle;
    ctx.font = `${this.cursorThickness + 32}px monospace`;
    ctx.fillStyle = this.cursorColor;
    ctx.fillText("*", this.x - 8, this.y+16);
    console.log(`displaycursor works: ${this.x}, ${this.y},`, ctx.font);
    ctx.fillStyle = originalFill;
  }
}
let currentSticker: string | null = null;
let stickerCommand: StickerCommand | null = null;

class StickerCommand {
  x: number;
  y: number;
  sticker: string | null;
  constructor(x:number, y:number,sticker:string | null) {
    this.x = x;
    this.y = y;
    this.sticker = sticker;
  }
  display(ctx: CanvasRenderingContext2D) {
    const originalFill = ctx.fillStyle;
    ctx.font = "24px monospace";
    ctx.fillStyle = "black";
    if (this.sticker) {
      ctx.fillText(this.sticker, this.x, this.y);
    }
    ctx.fillStyle = originalFill;
  }
  drag(x:number, y:number) {
    this.x = x;
    this.y = y;
  }
}

const stickerButton = document.createElement("button");
  stickerButton.innerHTML = currentSticker? currentSticker:"🧀";
stickerButton.addEventListener("click", () => {
  currentSticker = "🧀"; //eventually, make an array or list of available stickers instead of just cheese
  //stickerCommand = new StickerCommand(e.offsetX, e.offsetY, currentSticker);
  console.log(currentSticker);
});

const customStickerMaker = document.createElement("button");
customStickerMaker.innerHTML = "Make a custom sticker!";
customStickerMaker.addEventListener("click", () => {
  const customStickerText = prompt("Custom sticker?");
  if (customStickerText == "" || customStickerText == null) {
    return;
  }
  const customStickerButton = document.createElement("button");
  customStickerButton.innerHTML = customStickerText;
  customStickerButton.addEventListener("click", () => {
    currentSticker = `${customStickerText}`;
  });
  app.append(customStickerButton);
});


const penButton = document.createElement("button");
  penButton.innerHTML = currentSticker? currentSticker:"🖊️";
penButton.addEventListener("click", () => {
  currentSticker = null;
  stickerCommand = null;
  //console.log(currentSticker); //debugging
});



const app: HTMLDivElement = document.querySelector("#app")!;
const rangeInput = document.createElement("input");
rangeInput.type = "range";
rangeInput.id = "stringRange";
rangeInput.min = "0";
rangeInput.max = "2";
rangeInput.step = "1";


const gameName = "Doodle :)";

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
let currentThickness = 6;
let currentColor = "black";


const lines: (LineCommand|StickerCommand)[] = []; //equivalent to "linecommand"
//let currentLine:LineCommand|null = null;
const redoLines: (LineCommand|StickerCommand)[] = [];
let cursorMouse: CursorCommand | null = null;


const bus = new EventTarget();

function notify(name:string) {
  bus.dispatchEvent(new Event(name));
}
bus.addEventListener("drawing-changed", redraw);
bus.addEventListener("tool-moved", redraw);

canvas.addEventListener("mouseenter", (e) => {
  cursorMouse = new CursorCommand(e.offsetX, e.offsetY,currentThickness,currentColor);
});

canvas.addEventListener("mousedown", (e) => {
  cursor.active = true;
  cursor.x = e.offsetX;
  cursor.y = e.offsetY;
  //currentLine = new LineCommand(cursor.x,cursor.y,currentThickness);
  //lines.push(currentLine);
  if (currentSticker) {
    lines.push(new StickerCommand(e.offsetX, e.offsetY, currentSticker));
  } else {
    lines.push(new LineCommand(e.offsetX,e.offsetY,currentThickness,currentColor));
  }
  //currentLine.push({ x: cursor.x, y: cursor.y });
  redoLines.splice(zero, redoLines.length);
  notify("drawing-changed");
  
  
  });
  

  
  canvas.addEventListener("mousemove", (event) => {
    if (cursor.active) {
      //points.push(currentLine);
      lines[lines.length - 1].drag(event.offsetX, event.offsetY);
      lines[lines.length - 1].display(ctx);
    }
    if (currentSticker) {
      stickerCommand = new StickerCommand(event.offsetX, event.offsetY, currentSticker);
    }
    cursorMouse = new CursorCommand(event.offsetX, event.offsetY,currentThickness,currentColor);
    notify("tool-moved");
    console.log(currentThickness);
  });
  
  
  canvas.addEventListener("mouseup", () => {
    cursor.active = false;
    //currentLine = null;
    notify("drawing-changed");
  });

canvas.addEventListener("mouseout", () => {
  cursor.active = false;
  stickerCommand = null;
  cursorMouse = null;
});
  
  function redraw() {
    ctx.fillRect(zero, zero, canvas.width, canvas.height);
    for (const line of lines) {
      line.display(ctx);
    }
    if (cursorMouse) {
      cursorMouse.display(ctx);
    }if (stickerCommand) {
      stickerCommand.display(ctx);
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
  thinButton.innerHTML = "thin";
thinButton.addEventListener("click", () => {
  
    currentThickness = 1;
    //lines[lines.length - 1].lineThickness = currentThickness;
    ctx.lineWidth = currentThickness;
    notify("drawing-changed");
    console.log("thin works");
  }
);
  
const thickButton = document.createElement("button");
  thickButton.innerHTML = "THICK";
thickButton.addEventListener("click", () => {

  currentThickness = 15;
    
    //lines[lines.length-1].lineThickness = currentThickness;
    ctx.lineWidth = currentThickness;
    notify("drawing-changed");
    console.log("thick works");
  }
);

const normButton = document.createElement("button");
  normButton.innerHTML = "Regular";
normButton.addEventListener("click", () => {

  currentThickness = 8;
    
    //lines[lines.length-1].lineThickness = currentThickness;
    ctx.lineWidth = currentThickness;
    notify("drawing-changed");
    console.log("thick works");
  }
);

const exportButton = document.createElement("button");
exportButton.innerHTML = "Click to Export";
exportButton.addEventListener("click", () => {
  const exportCanvas = document.createElement("canvas");
  exportCanvas.width = 1024;
  exportCanvas.height = 1024;
  const exportContext = exportCanvas.getContext("2d")!;
  exportContext.scale(4, 4);
  for (const line of lines) {
    line.display(exportContext);
  }
  const exportUrl = exportCanvas.toDataURL("image/png");
  const download = document.createElement("a");
  download.href = exportUrl;
  download.download = "doodle.png";
  download.click();
});
const rainbowColors: string[] = [
  "red",
  "orange",
  "yellow",
  "green",
  "blue",
  "purple",
  "black",
];
const colorButton = document.createElement("button");
colorButton.innerHTML = "color";
//let i = 0;
colorButton.addEventListener("click", () => {
  /*if (i >= rainbowColors.length) {
    i = 0;
  }
  currentColor = rainbowColors[i];
  colorButton.innerHTML = rainbowColors[i];
  colorButton.style.color = currentColor;
  i++;*/
  const randomColor = Math.floor(Math.random() * rainbowColors.length);
  currentColor = rainbowColors[randomColor];
  colorButton.innerHTML = currentColor;
  colorButton.style.color = currentColor;
});
  
app.append(thinButton,normButton, thickButton, stickerButton, penButton,colorButton, customStickerMaker,exportButton,);

//step 8 is like cursorcommand, but with stickers
