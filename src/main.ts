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

function drawCanvas() {
    ctx.fillStyle = "white";
    ctx.fillRect(a, b, canvas.width, canvas.height);
    ctx.strokeStyle = "black";
    ctx.strokeRect(a, b, canvas.width, canvas.height);
}
drawCanvas();
//step 2


const cursor = { active: false, x: 0, y: 0 };

canvas.addEventListener("mousedown", (e) => {
    cursor.active = true;
    cursor.x = e.offsetX;
    cursor.y = e.offsetY;
  });
  
  canvas.addEventListener("mousemove", (event) => {
    if (cursor.active) {
      ctx.beginPath();
      ctx.moveTo(cursor.x, cursor.y);
      ctx.lineTo(event.offsetX, event.offsetY);
      ctx.stroke();
      cursor.x = event.offsetX;
      cursor.y = event.offsetY;
    }
  });
  
  window.addEventListener("mouseup", () => {
    cursor.active = false;
  });
  
  const clear = document.createElement("button");
  clear.innerHTML = "clear";
  app.append(clear);
  
  clear.addEventListener("click", () => {
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawCanvas();
  });



