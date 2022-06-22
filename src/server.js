import * as http from "http";
import * as net from "net";
import "dotenv/config"; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import

let port = process.env.PORT;
let hostName = process.env.HOSTNAME;
let host = process.env.HOST;
let pathName = `http://${hostName}:${port}`;

const users = [];

// http.get(`http://${hostName}:${port}`, (res) => {
//     const { statusCode } = res;
//     const contentType = res.headers["content-type"];

//     let error;
//     // Any 2xx status code signals a successful response but
//     // here we're only checking for 200.
//     if (statusCode !== 200) {
//         error = new Error("Request Failed.\n" + `Status Code: ${statusCode}`);
//     } else if (!/^application\/json/.test(contentType)) {
//         error = new Error(
//             "Invalid content-type.\n" +
//                 `Expected application/json but received ${contentType}`
//         );
//     }
//     if (error) {
//         console.error(error.message);
//         // Consume response data to free up memory
//         res.resume();
//         return;
//     }

//     res.setEncoding("utf8");
//     let rawData = "";
//     res.on("data", (chunk) => {
//         rawData += chunk;
//     });
//     res.on("end", () => {
//         try {
//             const parsedData = JSON.parse(rawData);
//             console.log(parsedData);
//         } catch (e) {
//             console.error(e.message);
//         }
//     });
// }).on("error", (e) => {
//     console.error(`Got error: ${e.message}`);
// });

let server = http.createServer((req, res) => {
    // socket.on("data", function (data) {
    //     var buff = Buffer.from(data);
    // });

    const result = routintg(req, res);
    res.write(result);
    res.end();
});
function routintg(req, res) {
    try {
        const baseUrl = "/api/users";
        const urlArray = req.url.split("/");
        const isBaseUrl = urlArray.slice(0, 3).join("/") === baseUrl;

        if (req.url === baseUrl) return usersManipulation(req, res);
        else if (urlArray.length === 4 && isBaseUrl) {
            const id = urlArray[3];
            return usersManipulationId(req, res, id);
        } else {
            res.writeHead(404, { "Content-Type": "text/plain" });
            const errorMessage = {
                message: "There is no such resource. Please try again"
            };
            return JSON.stringify(errorMessage);
        }
    } catch (error) {
        console.log(error);
    }
}
function usersManipulation(req, res) {
    try {
        const method = req.method;
        if (method === "GET") return getUsers(req, res);
        else if (method === "POST") {
            res.writeHead(200, { "Content-Type": "application/json" });
            return JSON.stringify({
                data: "Hello World!"
            });
        } else {
            res.writeHead(400, { "Content-Type": "text/plain" });
            const errorMessage = {
                message: "The resourse is OK. But the requested data is invalid"
            };
            return JSON.stringify(errorMessage);
        }
    } catch (error) {
        console.log(error);
    }
}
function usersManipulationId(req, res, id) {
    try {
        const method = req.method;
        if (method === "GET") return getUserById(req, res, id);
        else {
            res.writeHead(400, { "Content-Type": "text/plain" });
            const errorMessage = {
                message: "The resourse is OK. But the requested data is invalid"
            };
            return JSON.stringify(errorMessage);
        }
    } catch (error) {
        console.log(error);
    }
}

server.on("clientError", (err, socket) => {
    if (err.code === "ECONNRESET" || !socket.writable) {
        return;
    }

    socket.end("HTTP/1.1 400 Bad Request\r\n\r\n");
});

server.on("connect", (req, clientSocket, head) => {
    // Connect to an origin server
    const { portNew, hostname } = new URL(`http://${req.url}`);
    const serverSocket = net.connect(portNew || "8o", hostname, () => {
        clientSocket.write(
            "HTTP/1.1 200 Connection Established\r\n" +
                "Proxy-agent: Node.js-Proxy\r\n" +
                "\r\n"
        );
        serverSocket.write(head);
        serverSocket.pipe(clientSocket);
        clientSocket.pipe(serverSocket);
    });
});

server.listen(port, hostName, () => {
    const options = {
        port: port,
        host: hostName,
        method: "CONNECT",
        path: pathName
    };

    const req = http.request(options);
    req.end();

    req.on("connect", (res, socket, head) => {
        console.log("got connected!");

        // Make a request over an HTTP tunnel
        socket.write(
            "GET / HTTP/1.1\r\n" +
                "Host: www.google.com:80\r\n" +
                "Connection: close\r\n" +
                "\r\n"
        );
        socket.on("data", (chunk) => {
            console.log(chunk.toString());
        });
        socket.on("end", () => {
            server.close();
        });
    });
    req.on("error", (err, socket) => {
        if (err.code === "ECONNRESET" || !socket.writable) {
            return;
        }

        socket.end("HTTP/1.1 400 Bad Request\r\n\r\n");
    });
});

server.on("error", (err) => {
    socket.end("HTTP/1.1 400 Bad Request\r\n\r\n");
});

function getUsers(req, res) {
    try {
        res.writeHead(200, { "Content-Type": "text/plain" });
        return JSON.stringify(users);
    } catch (error) {
        console.log(error);
    }
}
function getUserById(req, res, id) {
    const found = (element) => element.id === id;

    try {
        if (users.some(found)) {
            res.writeHead(200, { "Content-Type": "text/plain" });
            return JSON.stringify(users);
        } else {
            res.writeHead(400, { "Content-Type": "text/plain" });
            const errorMessage = {
                message: "The resourse is OK. But the requested data is invalid"
            };
            return JSON.stringify(errorMessage);
        }
    } catch (error) {
        console.log(error);
    }
}
function createUser(req, res) {
    try {
        res.writeHead(200, { "Content-Type": "text/plain" });
        return JSON.stringify(users);
    } catch (error) {
        console.log(error);
    }
}
