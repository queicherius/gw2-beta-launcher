const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow

// (Required) global reference of the window object
let mainWindow

// Create the browser window with all of our shiny content
function createWindow () {
  mainWindow = new BrowserWindow({frame: false})
  mainWindow.setFullScreen(true)
  mainWindow.loadURL(`file://${__dirname}/index.html`)

  // Attach the close handler
  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

// Create the browser window when electron initialized
app.on('ready', createWindow)

// Actually quit the application on OS X
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// Actually open the application on OS X
app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
})
