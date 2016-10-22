const exec = require('child_process').exec
const remote = require('electron').remote
const runningProcesses = require('ps-list')
const config = new (require('electron-config'))()

// Start the launcher with a set of arguments
function startLauncher (args) {
  return launcherIsRunning().then((running) => {
    if (running) {
      window.alert('Guild Wars 2 is already running.')
      return Promise.reject()
    }

    return process.platform === 'win32'
      ? startLauncherWindows(args)
      : startLauncherMac(args)
  })
}

function startLauncherMac (args) {
  const executablePath = config.get('executablePath').replace(/ /g, '\\ ')
  const command = `${executablePath}/contents/MacOS/cider --use-dos-cwd C:GW2 -- C:\\\\GW2\\\\GW2.exe ${args}`

  // Force the inofficial launcher into the foreground and the official one into the background
  const focusInterval = setInterval(() => remote.getCurrentWindow().focus(), 25)
  setTimeout(() => focusInterval ? clearInterval(focusInterval) : 'noop', 10 * 1000)

  // Execute the command. This will keep running until the program exits (patching done / game closed)
  return new Promise((resolve, reject) => {
    exec(command, function (err) {
      focusInterval ? clearInterval(focusInterval) : 'noop'

      if (err) {
        return reject(err)
      }

      return resolve()
    })
  })
}

function startLauncherWindows (args) {
  let executablePath = config.get('executablePath')
  let command = `"${executablePath}" ${args}`

  // Force the inofficial launcher into the foreground and the official one into the background
  const focusInterval = setInterval(() => remote.getCurrentWindow().focus(), 25)
  setTimeout(() => focusInterval ? clearInterval(focusInterval) : 'noop', 10 * 1000)

  return new Promise((resolve, reject) => {
    // Execute the command
    const spawned = exec(command)

    // If the command failed with an error code, exit out asap
    spawned.on('exit', function (code) {
      if (code === 0) {
        return
      }

      focusInterval ? clearInterval(focusInterval) : 'noop'
      return reject()
    })

    // Check the process list for the running process and exit out when it disappears
    // This is needed because the command that gets spawned on windows immediately exits on success
    // and we want to see if it still runs to show patching information
    let checkInterval
    setTimeout(() => {
      checkInterval = setInterval(exitWhenDone, 500)
    }, 2 * 1000)

    function exitWhenDone () {
      launcherIsRunning().then((running) => {
        if (running) {
          return
        }

        focusInterval ? clearInterval(focusInterval) : 'noop'
        checkInterval ? clearInterval(checkInterval) : 'noop'
        return resolve()
      })
    }
  })
}

// Check if a process is running based on the name
function launcherIsRunning () {
  const executablePath = config.get('executablePath')

  // Windows
  if (process.platform === 'win32') {
    const nameRegex = new RegExp(executablePath.replace(/.*[\\\/](.*?)\.exe$/, '$1') + '(-64)?.exe')
    return runningProcesses().then(function (processes) {
      return processes
          .filter(process => process.name.match(nameRegex))
          .length > 0
    })
  }

  // Mac OS
  const nameRegex = new RegExp(executablePath.replace(/.*[\\\/](.*?)\.app$/, '$1') + '(-64)?.app')
  return runningProcesses().then(function (processes) {
    return processes
        .filter(process => process.cmd.match(nameRegex))
        .length > 0
  })
}

module.exports = startLauncher
