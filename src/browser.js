const exec = require('child_process').exec
const remote = require('electron').remote

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

// When the login button is clicked, start the official patcher
document.querySelector('.login-button').addEventListener('click', function () {
  let username = document.querySelector('.login-name').value
  let password = document.querySelector('.login-password').value

  // -email sets the users username
  // -password sets the users password
  // -nopatchui skips the launcher UI
  let command = `"C:\\Program Files (x86)\\Guild Wars 2\\Gw2.exe" -email "${username}" -password "${password}" -nopatchui`

  // Run the patcher and close the browser window in the background after the game should have started
  execute(command, function () {
    setTimeout(quit, 5000)
  })
})

// Close the window when the "quit" button is clicked
document.querySelector('.close-button').addEventListener('click', quit)
