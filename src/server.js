import * as http from "http";
import "dotenv/config"; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import

let port = process.env.PORT;
let host = process.env.HOSTNAME;

const users = [];

const routing = {
    "/api/users": (req, res) => {
        console.log(req.url + "   " + res.statusCode);
        return { status: res.statusCode };
    }
};

const types = {
    object: JSON.stringify,
    string: (s) => s,
    undefined: () => "not found",
    function: (fn, req, res) => JSON.stringify(fn(req, res))
};

let server = http.createServer((req, res) => {
    if (req.url === "/api/users" && req.method === "GET") {
        getProducts(req, res);
    }

    // const data = routing[req.url];
    // const type = typeof data;
    // const serializer = types[type];
    // const result = serializer(data, req, res);
    // console.log("Thanks for the request");
    // new URL(req.url, `http://${req.headers.host}`);
});

server.on("clientError", (err, socket) => {
    if (err.code === "ECONNRESET" || !socket.writable) {
        return;
    }

    socket.end("HTTP/1.1 400 Bad Request\r\n\r\n");
});

server.listen(port, host, () => {
    console.log(`Server on the board ${host}:${port}`);
});

server.on("error", (err) => {
    console.error(`Got error: ${err.message}, code: ${err.code}`);
    // Check if retry is needed
    // if (req.reusedSocket && err.code === 'ECONNRESET') {
    //   retriableRequest();
    // }
});

async function getProducts(req, res) {
    try {
        res.writeHead(200, { "Content-Type": "text/plain" });
        res.end(JSON.stringify(users));
    } catch (error) {
        console.log(error);
    }
}
