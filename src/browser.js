const exec = require('child_process').exec
const remote = require('electron').remote

// Bind event handlers and execute function on load
document.querySelector('.login-button').addEventListener('click', logIntoGame)
document.querySelector('.close-button').addEventListener('click', quit)
loadLoginData()

// Execute a shell command on the user's computer
function execute (command, callback) {
  exec(command, function (err, stdout) {
    if (err) return handleError(err)
    callback(stdout)
  })
}

// Close the browser window
function quit () {
  let currentWindow = remote.getCurrentWindow()
  currentWindow.close()
}

// Show an error box on any errors
function handleError (err) {
  window.alert('An error happened. :(\n' + err.message)
}

// Load the previously saved username and password
function loadLoginData () {
  let savedUsername = localStorage.getItem('username')
  let savedPassword = localStorage.getItem('password')
  let savedRememberUsername = localStorage.getItem('rememberUsername') === 'true'
  let savedRememberPassword = localStorage.getItem('rememberPassword') === 'true'

  document.querySelector('#login-remember-name').checked = savedRememberUsername
  document.querySelector('#login-remember-password').checked = savedRememberPassword

  if (savedUsername) {
    document.querySelector('#login-name').value = savedUsername
  }

  if (savedPassword) {
    document.querySelector('#login-password').value = savedPassword
  }
}

// Start the official patcher with the supplied username and password
function logIntoGame () {
  let username = document.querySelector('#login-name').value
  let password = document.querySelector('#login-password').value

  // If the user wants to, let them save their username and password
  let rememberUsername = document.querySelector('#login-remember-name').checked
  let rememberPassword = document.querySelector('#login-remember-password').checked

  if (rememberUsername) {
    localStorage.setItem('username', username)
    localStorage.setItem('rememberUsername', true)
  } else {
    localStorage.removeItem('username')
    localStorage.setItem('rememberUsername', false)
  }

  if (rememberPassword) {
    localStorage.setItem('password', password)
    localStorage.setItem('rememberPassword', true)
  } else {
    localStorage.removeItem('password')
    localStorage.setItem('rememberPassword', false)
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
