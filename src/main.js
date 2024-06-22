
var LineCommand = /** @class */ (function () {
    function LineCommand(x, y, thickness, lineColor) {
        this.points = [{ x: x, y: y }];
        this.lineThickness = thickness;
        this.lineColor = lineColor;
    }
    LineCommand.prototype.display = function (ctx) {
        ctx.strokeStyle = this.lineColor;
        ctx.lineWidth = this.lineThickness;
        ctx.beginPath();
        var _a = this.points[0], x = _a.x, y = _a.y;
        ctx.moveTo(x, y);
        for (var _i = 0, _b = this.points; _i < _b.length; _i++) {
            var _c = _b[_i], x_1 = _c.x, y_1 = _c.y;
            ctx.lineTo(x_1, y_1);
        }
        ctx.stroke();
    };
    LineCommand.prototype.drag = function (x, y) {
        this.points.push({ x: x, y: y });
    };
    return LineCommand;
}());
var CursorCommand = /** @class */ (function () {
    function CursorCommand(x, y, cursorThickness, cursorColor) {
        this.x = x;
        this.y = y;
        this.cursorThickness = cursorThickness;
        this.cursorColor = cursorColor;
    }
    CursorCommand.prototype.display = function (ctx) {
        var originalFill = ctx.fillStyle;
        ctx.font = "".concat(this.cursorThickness + 32, "px monospace");
        ctx.fillStyle = this.cursorColor;
        ctx.fillText("*", this.x - 8, this.y + 16);
        console.log("displaycursor works: ".concat(this.x, ", ").concat(this.y, ","), ctx.font);
        ctx.fillStyle = originalFill;
    };
    return CursorCommand;
}());
var currentSticker = null;
var stickerCommand = null;
var StickerCommand = /** @class */ (function () {
    function StickerCommand(x, y, sticker) {
        this.x = x;
        this.y = y;
        this.sticker = sticker;
    }
    StickerCommand.prototype.display = function (ctx) {
        var originalFill = ctx.fillStyle;
        ctx.font = "24px monospace";
        ctx.fillStyle = "black";
        if (this.sticker) {
            ctx.fillText(this.sticker, this.x, this.y);
        }
        ctx.fillStyle = originalFill;
    };
    StickerCommand.prototype.drag = function (x, y) {
        this.x = x;
        this.y = y;
    };
    return StickerCommand;
}());
var stickerButton = document.createElement("button");
stickerButton.innerHTML = currentSticker ? currentSticker : "🧀";
stickerButton.addEventListener("click", function () {
    currentSticker = "🧀"; //eventually, make an array or list of available stickers instead of just cheese
    //stickerCommand = new StickerCommand(e.offsetX, e.offsetY, currentSticker);
    console.log(currentSticker);
});
var customStickerMaker = document.createElement("button");
customStickerMaker.innerHTML = "Make a custom sticker!";
customStickerMaker.addEventListener("click", function () {
    var customStickerText = prompt("Custom sticker?");
    if (customStickerText == "" || customStickerText == null) {
        return;
    }
    var customStickerButton = document.createElement("button");
    customStickerButton.innerHTML = customStickerText;
    customStickerButton.addEventListener("click", function () {
        currentSticker = "".concat(customStickerText);
    });
    app.append(customStickerButton);
});
var penButton = document.createElement("button");
penButton.innerHTML = currentSticker ? currentSticker : "🖊️";
penButton.addEventListener("click", function () {
    currentSticker = null;
    stickerCommand = null;
    //console.log(currentSticker); //debugging
});
var app = document.querySelector("#app");
var rangeInput = document.createElement("input");
rangeInput.type = "range";
rangeInput.id = "stringRange";
rangeInput.min = "0";
rangeInput.max = "2";
rangeInput.step = "1";
var gameName = "Draw Something!";
document.title = gameName;
var header = document.createElement("h1");
header.innerHTML = gameName;
header.style.textAlign = "center";
app.append(header);
//step 1
var canvas = document.getElementById("canvas");
canvas.querySelector("#canvas");
var ctx = canvas.getContext("2d");
canvas.height = 800;
canvas.width = 800;
ctx.fillStyle = "white";
ctx.fillRect(0, 0, canvas.width, canvas.height);
canvas.style.cursor = "none";
var cursor = { active: false, x: 0, y: 0 };
var zero = 0;
var currentThickness = 6;
var currentColor = "black";
var lines = []; //equivalent to "linecommand"
//let currentLine:LineCommand|null = null;
var redoLines = [];
var cursorMouse = null;
var bus = new EventTarget();
function notify(name) {
    bus.dispatchEvent(new Event(name));
}
bus.addEventListener("drawing-changed", redraw);
bus.addEventListener("tool-moved", redraw);
canvas.addEventListener("mouseenter", function (e) {
    cursorMouse = new CursorCommand(e.offsetX, e.offsetY, currentThickness, currentColor);
});
canvas.addEventListener("mousedown", function (e) {
    cursor.active = true;
    cursor.x = e.offsetX;
    cursor.y = e.offsetY;
    //currentLine = new LineCommand(cursor.x,cursor.y,currentThickness);
    //lines.push(currentLine);
    if (currentSticker) {
        lines.push(new StickerCommand(e.offsetX, e.offsetY, currentSticker));
    }
    else {
        lines.push(new LineCommand(e.offsetX, e.offsetY, currentThickness, currentColor));
    }
    //currentLine.push({ x: cursor.x, y: cursor.y });
    redoLines.splice(zero, redoLines.length);
    notify("drawing-changed");
});
canvas.addEventListener("mousemove", function (event) {
    if (cursor.active) {
        //points.push(currentLine);
        lines[lines.length - 1].drag(event.offsetX, event.offsetY);
        lines[lines.length - 1].display(ctx);
    }
    if (currentSticker) {
        stickerCommand = new StickerCommand(event.offsetX, event.offsetY, currentSticker);
    }
    cursorMouse = new CursorCommand(event.offsetX, event.offsetY, currentThickness, currentColor);
    notify("tool-moved");
    console.log(currentThickness);
});
canvas.addEventListener("mouseup", function () {
    cursor.active = false;
    //currentLine = null;
    notify("drawing-changed");
});
canvas.addEventListener("mouseout", function () {
    cursor.active = false;
    stickerCommand = null;
    cursorMouse = null;
});
function redraw() {
    ctx.fillRect(zero, zero, canvas.width, canvas.height);
    for (var _i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
        var line = lines_1[_i];
        line.display(ctx);
    }
    if (cursorMouse) {
        cursorMouse.display(ctx);
    }
    if (stickerCommand) {
        stickerCommand.display(ctx);
    }
    console.log("redraw was called");
}
var clear = document.createElement("button");
clear.innerHTML = "clear";
app.append(clear);
clear.addEventListener("click", (clearCanvas));
function clearCanvas() {
    lines.splice(zero, lines.length);
    console.log(lines);
    notify("drawing-changed");
}
var undoButton = document.createElement("button");
undoButton.innerHTML = "undo";
app.append(undoButton);
undoButton.addEventListener("click", (undoCanvas));
function undoCanvas() {
    console.log(lines.length);
    if (lines.length > zero) {
        redoLines.push(lines.pop());
        notify("drawing-changed");
    }
}
var redoButton = document.createElement("button");
redoButton.innerHTML = "redo";
app.append(redoButton);
redoButton.addEventListener("click", (redoCanvas));
function redoCanvas() {
    console.log(redoLines.length);
    if (redoLines.length > zero) {
        lines.push(redoLines.pop());
        notify("drawing-changed");
    }
}
var thinButton = document.createElement("button");
thinButton.innerHTML = "thin";
thinButton.addEventListener("click", function () {
    currentThickness = 1;
    //lines[lines.length - 1].lineThickness = currentThickness;
    ctx.lineWidth = currentThickness;
    notify("drawing-changed");
    console.log("thin works");
});
var thickButton = document.createElement("button");
thickButton.innerHTML = "THICK";
thickButton.addEventListener("click", function () {
    currentThickness = 15;
    //lines[lines.length-1].lineThickness = currentThickness;
    ctx.lineWidth = currentThickness;
    notify("drawing-changed");
    console.log("thick works");
});
var normButton = document.createElement("button");
normButton.innerHTML = "Regular";
normButton.addEventListener("click", function () {
    currentThickness = 8;
    //lines[lines.length-1].lineThickness = currentThickness;
    ctx.lineWidth = currentThickness;
    notify("drawing-changed");
    console.log("thick works");
});
var exportButton = document.createElement("button");
exportButton.innerHTML = "Click to Export";
exportButton.addEventListener("click", function () {
    var exportCanvas = document.createElement("canvas");
    exportCanvas.width = 1024;
    exportCanvas.height = 1024;
    var exportContext = exportCanvas.getContext("2d");
    exportContext.scale(4, 4);
    for (var _i = 0, lines_2 = lines; _i < lines_2.length; _i++) {
        var line = lines_2[_i];
        line.display(exportContext);
    }
    var exportUrl = exportCanvas.toDataURL("image/png");
    var download = document.createElement("a");
    download.href = exportUrl;
    download.download = "doodle.png";
    download.click();
});
var rainbowColors = [
    "red",
    "orange",
    "yellow",
    "green",
    "blue",
    "purple",
    "black",
];
var colorButton = document.createElement("button");
colorButton.innerHTML = "color";
let i = 0;
colorButton.addEventListener("click", function () {
    if (i >= rainbowColors.length) {
      i = 0;
    }
    currentColor = rainbowColors[i];
    colorButton.innerHTML = rainbowColors[i];
    colorButton.style.color = currentColor;
    i++;
    
});
app.append(thinButton, normButton, thickButton, stickerButton, penButton, colorButton, customStickerMaker, exportButton);
//step 8 is like cursorcommand, but with stickers
