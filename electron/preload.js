const { contextBridge } = require("electron");

window.addEventListener("DOMContentLoaded", () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector);
    if (element) element.innerText = text;
  };

  for (const dependency of ["chrome", "node", "electron"]) {
    replaceText(`${dependency}-version`, process.versions[dependency]);
  }
});

contextBridge.exposeInMainWorld("electronAPI", {
  NODE_VERSION: process.versions.node,
  CHROME_VERSION: process.versions.chrome,
  ELECTRON_VERSION: process.versions.electron,
});
