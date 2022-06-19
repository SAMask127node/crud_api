import * as http from "http";
import "dotenv/config"; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import

let port = process.env.PORT;
let host = process.env.HOSTNAME;

let server = http.createServer((req, res) => {
    console.log("Thanks for the request");
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Gravies");
});

server.listen(port, host, () => {
    console.log(`Server on the board ${host}:${port}`);
});

server.on("error", (err) => {
    console.error(`Got error: ${err.message}`);
    // Check if retry is needed
    // if (req.reusedSocket && err.code === 'ECONNRESET') {
    //   retriableRequest();
    // }
});
