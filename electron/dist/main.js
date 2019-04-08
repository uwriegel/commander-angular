"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var path = require("path");
var url = require("url");
var win;
var createWindow = function () {
    win = new electron_1.BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    });
    console.log(process.cwd());
    win.loadURL(url.format({
        pathname: path.join(__dirname, "/../../dist/commander/index.html"),
        protocol: "file:",
        slashes: true
    }));
    win.on("closed", function () { return win = null; });
};
electron_1.app.on("ready", createWindow);
electron_1.app.on("activate", function () {
    if (win === null)
        createWindow();
});
//# sourceMappingURL=main.js.map