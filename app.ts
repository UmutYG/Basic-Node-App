import * as fs from 'fs';
import * as http from 'http'
import { IncomingMessage, ServerResponse } from 'http';

const server = http.createServer((req: IncomingMessage, res: ServerResponse) => {
    console.log("Request method: ", req.method);
    console.log("Request url: ", req.url);

    if (req.url === '/') {
        res.write('<html>');
        res.write('<head><title>Basic Node App </title> </head>');
        res.write(
            '<body><form action="msg" method="post"><input type="text" name="msg"/> <button type="submit">Send!</button></form> </body>'
        );
        res.write('</html>');
        return res.end();
    }

    if(req.method === "POST" && req.url === '/msg') {
        const reqChunks: Buffer[] = [];
        req.on('data', (chunk: Buffer) => {
            console.log(`Incoming chunk ${chunk}`);
            reqChunks.push(chunk);
        });

        // Parse incoming data with chunks and buffer.
        req.on('end', () => {
            const parsedBody = Buffer.concat(reqChunks).toString();
            console.log(parsedBody);
            // name = value
            const message = parsedBody.split('=')[1];
            fs.writeFileSync('message.txt', message);
        });
        res.statusCode = 302;
        // Redirect user
        res.setHeader('Location', '/');
        return res.end();
    }

    res.setHeader('Content-Type', 'text/html');

    res.write('<html>');
    res.write('<head><title>Basic Node App </title> </head>');
    res.write('<body><h1>Hello from node app! </h1> </body>');
    res.write('</html>');
    res.end();
});

server.listen(3000);
