const exec = require('child_process').exec
const remote = require('electron').remote
const config = new (require('electron-config'))()
const {encrypt, decrypt} = require('./crypto.js')

// Bind event handlers and execute function on load
document.querySelector('.login-button').addEventListener('click', logIntoGame)
document.querySelector('.close-button').addEventListener('click', quit)
loadLoginData()
startPatching()

// Start the launcher with a set of arguments
function startLauncher (arguments, callback) {
  const executablePath = config.get('executablePath')
  const command = process.platform === 'win32'
    ? `"${executablePath}" ${arguments}`
    : `${executablePath.replace(/ /g, '\\ ')}/contents/MacOS/cider --use-dos-cwd C:GW2 -- C:\\\\GW2\\\\GW2.exe ${arguments}`

  // [HACKY] Make sure the launcher stays in focus
  const focusInterval = setInterval(() => {
    remote.getCurrentWindow().focus()
  }, 100)

  setTimeout(() => {
    focusInterval ? clearInterval(focusInterval) : 'noop'
  }, 3000)

  exec(command, function (err, stdout) {
    focusInterval ? clearInterval(focusInterval) : 'noop'
    callback(err, stdout)
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

// Start the official launcher to download the newest patch
function startPatching () {
  let patching = true

  startLauncher('-image', function (err) {
    patching = false
    document.querySelector('.patch-text').innerHTML = err
      ? 'Failed patching, please start the official launcher'
      : 'Finished patching'
    document.querySelector('.login-button').disabled = err ? true : false
  })

  // Show a fake status change if there seems to be stuff to download :>
  setTimeout(() => {
    if (patching) {
      document.querySelector('.patch-text').innerHTML = 'Downloading patch...'
    }
  }, 5000)
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
  const quitTimeout = setTimeout(quit, 5000)
  startLauncher(`-email "${username}" -password "${password}" -nopatchui`, function (err) {
    if (err) {
      clearTimeout(quitTimeout)
      return window.alert('Failed starting the launcher')
    }
  })
}
