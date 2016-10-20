const config = new (require('electron-config'))()

// Bind event handler
document.querySelector('.confirm-button').addEventListener('click', confirmDisclaimers)

// Save that the user confirmed the disclaimer
function confirmDisclaimers () {
  config.set('disclaimerTicked', true)

  // Check if the user already has a path set, and redirect directly to the launcher if yes
  // This can happen on first startup, if the user has to read the disclaimer and has his launcher at a default location
  const executablePath = config.get('executablePath')
  if (executablePath) {
    window.location.href = `file://${__dirname}/../launcher.html`
  } else {
    window.location.href = `file://${__dirname}/../executable.html`
  }
}
