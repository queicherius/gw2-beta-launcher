const exec = require('child_process').exec
const remote = require('electron').remote
const config = new (require('electron-config'))()
const {encrypt, decrypt} = require('./crypto.js')

// Bind event handlers and execute function on load
document.querySelector('.login-button').addEventListener('click', logIntoGame)
document.querySelector('.close-button').addEventListener('click', quit)
loadLoginData()

// Execute a shell command on the user's computer
function execute (command, callback) {
  exec(command, function (err, stdout) {
    if (err) return window.alert('Executing a shell command failed')
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

  // Do some dumb validation
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

  // -email sets the users username
  // -password sets the users password
  // -nopatchui skips the launcher UI
  let command = `"C:\\Program Files (x86)\\Guild Wars 2\\Gw2.exe" -email "${username}" -password "${password}" -nopatchui`

  // Run the patcher and close the browser window in the background after the game should have started
  execute(command, function () {
    setTimeout(quit, 5000)
  })
}
