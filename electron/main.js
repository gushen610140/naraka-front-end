const { app, BrowserWindow } = require("electron");
const path = require("path");

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1440,
    height: 960,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      webSecurity: false, // 前端跨域
    },
  });

  win.loadURL("http://localhost:3000");
};

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
