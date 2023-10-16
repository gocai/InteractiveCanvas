import "./style.css";

const app: HTMLDivElement = document.querySelector("#app")!;

const gameName = "small title change";

document.title = gameName;

const header = document.createElement("h1");
header.innerHTML = gameName;
app.append(header);

//step 1
const canvas = document.getElementById("canvas") as HTMLCanvasElement;
canvas.querySelector("#canvas");
const ctx = canvas.getContext("2d")!;
const cWidth = canvas.width = 256;
const cHeight = canvas.height = 256;
const a = 0;
const b = 0;
ctx.fillStyle = "white";
ctx.fillRect(a, b, cWidth, cHeight);
ctx.strokeStyle = "black";
ctx.strokeRect(a, b, canvas.width, canvas.height);




