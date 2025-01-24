import fs from "fs";
import http from "http";

const app = http.createServer((req, res) => {
    if (req.url === "/") {
        try {
            const webpage = fs.readFileSync("homepage.html", "utf-8"); // Correctly read the file
            res.writeHead(200, { "Content-Type": "text/html" }); // Specify the content type
            res.end(webpage); // Send the HTML content
        } catch (err) {
            res.writeHead(500, { "Content-Type": "text/plain" });
            res.end("Error loading the homepage.");
        }
    } else {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("404 Not Found");
    }
});

const port = 9000;
app.listen(port, () => console.log(`Server running at http://localhost:${port}`));
