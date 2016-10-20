const exec = require('child_process').exec
const remote = require('electron').remote
const config = new (require('electron-config'))()
const {encrypt, decrypt} = require('./crypto.js')

// Bind event handlers and execute function on load
document.querySelector('.login-button').addEventListener('click', logIntoGame)
document.querySelector('.close-button').addEventListener('click', quit)
loadLoginData()

// Start the launcher with a set of arguments
function startLauncher (arguments, callback) {
  const executablePath = config.get('executablePath')
  const command = process.platform === 'win32'
    ? `"${executablePath}" ${arguments}`
    : `${executablePath}/contents/MacOS/cider --use-dos-cwd C:GW2 -- C:\\GW2\\GW2.exe ${arguments}`

  exec(command, function (err, stdout) {
    if (err) return window.alert('Failed starting the launcher')
    callback(stdout)
  })
}

// Close the browser window
function quit () {
  let currentWindow = remote.getCurrentWindow()
  currentWindow.close()
}

// Load the previously saved username and password
function loadLoginData () {
  let savedUsername = config.get('username')
  let savedPassword = config.get('password')
  let savedRememberUsername = config.get('rememberUsername')
  let savedRememberPassword = config.get('rememberPassword')

  document.querySelector('#login-remember-name').checked = savedRememberUsername
  document.querySelector('#login-remember-password').checked = savedRememberPassword

  if (savedUsername) {
    document.querySelector('#login-name').value = savedUsername
  }

  if (savedPassword) {
    document.querySelector('#login-password').value = decrypt(savedPassword)
  }
}

// Start the official patcher with the supplied username and password
function logIntoGame () {
  let username = document.querySelector('#login-name').value
  let password = document.querySelector('#login-password').value

  // Do some trivial validation
  if (!username.match(/@/) || password === '') {
    window.alert('Email or password are not set')
    return
  }

  // If the user wants to, let them save their username and password
  let rememberUsername = document.querySelector('#login-remember-name').checked
  let rememberPassword = document.querySelector('#login-remember-password').checked

  if (rememberUsername) {
    config.set('username', username)
    config.set('rememberUsername', true)
  } else {
    config.delete('username')
    config.set('rememberUsername', false)
  }

  if (rememberPassword) {
    config.set('password', encrypt(password))
    config.set('rememberPassword', true)
  } else {
    config.delete('password')
    config.delete('salt')
    config.set('rememberPassword', false)
  }

  // Run the launcher and close the browser window in the background after the game should have started
  startLauncher(`-email "${username}" -password "${password}" -nopatchui`, function () {
    setTimeout(quit, 10000)
  })
}
