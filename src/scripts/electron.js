const electron = require('electron')
const fs = require('fs')
const config = new (require('electron-config'))()
const app = electron.app
const BrowserWindow = electron.BrowserWindow

// (Required) global reference of the window object
let mainWindow

// Create the browser window with all of our shiny content
function createWindow () {
  var disclaimerTicked = config.get('disclaimerTicked')
  var executablePath = getExecutablePath()

  mainWindow = new BrowserWindow({frame: false, icon: `${__dirname}/assets/favicon.png`})
  mainWindow.setFullScreen(true)

  // Load the starting page based on what the user filled out already
  if (!disclaimerTicked) {
    mainWindow.loadURL(`file://${__dirname}/../disclaimer.html`)
  } else if (!executablePath) {
    mainWindow.loadURL(`file://${__dirname}/../executable.html`)
  } else {
    mainWindow.loadURL(`file://${__dirname}/../launcher.html`)
  }

  // Attach the close handler
  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

// Get the path of the gw2 launcher
function getExecutablePath () {
  let possiblePaths = [
    '/Applications/Guild\ Wars\ 2.app',
    'C:\\Program Files\\Guild Wars 2\\Gw2.exe',
    'C:\\Program Files (x86)\\Guild Wars 2\\Gw2.exe'
  ]

  // Load the previously saved path at the first spot
  let savedPath = config.get('executablePath')
  if (savedPath) {
    possiblePaths.unshift(savedPath)
  }

  // Go through all the paths and filter the ones out that are existing
  // (This also checks if the path the user chose still exists)
  possiblePaths = possiblePaths.filter(path => {
    try {
      fs.statSync(path)
      return true
    } catch (noop) {
      return false
    }
  })

  // The user will have to choose his launcher path
  if (possiblePaths.length === 0) {
    config.delete('executablePath')
    return false
  }

  // Save the first existing path as our path
  config.set('executablePath', possiblePaths[0])
  return true
}

// Create the browser window when electron initialized
app.on('ready', createWindow)

// Actually quit the application on OS X
app.on('window-all-closed', function () {
  app.quit()
})
