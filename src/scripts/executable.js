const config = new (require('electron-config'))()
const dialog = require('electron').remote.dialog

// Bind event handlers
document.querySelector('.confirm-button').addEventListener('click', setExecutablePath)

// Save executable that the user picked
function setExecutablePath () {
  let path = dialog.showOpenDialog({
    properties: ['openFile'], filters: [{name: 'Application', extensions: ['exe', 'app']}]
  })

  // If the path is not set (e.g. via "abort") or got set to a wrong file type, exit
  if (!path || !path[0].match(/\.(exe|app)$/)) {
    return
  }

  // Save the path and start the actual launcher
  config.set('executablePath', path[0])
  window.location.href = `file://${__dirname}/../launcher.html`
}
