var exec = require('child_process').exec;
var remote = require('electron').remote;

console.log('Window shit')

function execute (command, callback) {
  exec(command, function (error, stdout, stderr) {
    callback(stdout);
  });
};

// execute(command, function (output) {
//   console.log('Seems do be done patching');
//
//   setTimeout(function () {
//     var window = remote.getCurrentWindow();
//     window.close();
//   }, 3000)
// });

document.querySelector(".login-btn").addEventListener("click", function (e) {

  var username = document.querySelector('.login-name').value
  var password = document.querySelector('.login-password').value
  var command = '"C:\\Program Files (x86)\\Guild Wars 2\\Gw2.exe" -email "' + username + '" -password "' + password + '" -nopatchui'
  console.log(command)

  // call the function
  execute(command, function (output) {
    console.log(output);

    setTimeout(function () {
      var window = remote.getCurrentWindow();
      window.close();
    }, 3000)
  });

});

document.querySelector(".close-button").addEventListener("click", function (e) {
  var window = remote.getCurrentWindow();
  window.close();
}); 