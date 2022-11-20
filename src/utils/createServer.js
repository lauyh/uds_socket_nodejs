const net = require("net");
const { parseJSON } = require("./parseJSON");
let connections = {};
let SHUTDOWN = false;

// const wait = (ms) => new Promise((res) => setTimeout(res, ms));

const createUDSServer = async (socket) => {
  console.log("-> creating unix domain server");
  const server = net
    .createServer((stream) => {
      console.log("-> connected...");
      let self = Date.now();
      connections[self] = stream;

      stream.on("data", async (data) => {
        data = data.toString("ascii");
        // console.log("[DEBUG] | stream | ", stream);
        console.log(">> [onData] data: ", data);
        if (data !== "\n" && data !== "") {
          // stream.resume();
          console.log("[DEBUG]::parsing data");
          data = parseJSON(data);
          console.log("[DEBUG]::[parsedData]::", data);
          if (data != false && data["method"] == "echo") {
            const response = JSON.stringify({
              id: data.id,
              result: data.params,
            });
            console.log("[DEBUG]::response:", response);

            stream.write(response, "ascii", () => {
              console.log("response was written into bytes");
            });

            stream.pipe(stream);
            console.log("[DEBUG]::data sent");
          }
        }
      });

      stream.on("error", (error) => {
        console.error("[ERROR]::", JSON.stringify(error));
        delete connections[self];
      });

      stream.on("end", () => {
        console.log("<- client disconnected");
        // stream.unpipe(stream);
      });
      // stream.pipe(stream);
    })
    .listen(socket)
    .on("connection", () => {
      console.log("<- connected");
    });
  return server;
};

const cleanup = () => {
  if (!SHUTDOWN) {
    SHUTDOWN = true;
    console.log("\n", "<<-- Terminating.", "\n");
    if (Object.keys(connections).length) {
      let clients = Object.keys(connections);
      while (clients.length) {
        let client = clients.pop();
        connections[client].write("__disconnect");
        connections[client].end();
      }
    }
    server.close();
    process.exit(0);
  }
};

module.exports = {
  createUDSServer,
  cleanup,
};
