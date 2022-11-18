const { createUDSServer, cleanup } = require("./utils/createServer");
const fs = require("fs");

let SOCKET_FILE = "";
let arg = process.argv;
arg.splice(0, 2);
SOCKET_FILE = arg[0];
console.log("> SOCKET_FILE: " + SOCKET_FILE);
if (SOCKET_FILE == "") {
  // console.log('err::expected socket path to be pass in as an argument')
  // process.exit(1)
  SOCKET_FILE = "./srv_socket";
}

console.log("->> Checking for leftover socket.");
fs.stat(SOCKET_FILE, async function (err, stats) {
  if (err) {
    // start server
    console.log(">> No leftover socket found.");
    server = await createUDSServer(SOCKET_FILE);
    return;
  }
  // remove file then start server
  console.log(">> Removing leftover socket.");
  fs.unlink(SOCKET_FILE, async function (err) {
    if (err) {
      // This should never happen.
      console.error(err);
      process.exit(0);
    }
    server = await createUDSServer(SOCKET_FILE);
    return;
  });
});

process.on("SIGINT", cleanup);
