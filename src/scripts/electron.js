const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow

// (Required) global reference of the window object
let mainWindow

// Create the browser window with all of our shiny content
function createWindow () {
  mainWindow = new BrowserWindow({frame: false, icon: __dirname + '/assets/favicon.png'})
  mainWindow.setFullScreen(true)
  mainWindow.loadURL(`file://${__dirname}/../launcher.html`)

  // Attach the close handler
  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

// Create the browser window when electron initialized
app.on('ready', createWindow)

// Actually quit the application on OS X
app.on('window-all-closed', function () {
  app.quit()
})
