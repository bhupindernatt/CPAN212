import http from "http";
import fs from "fs";
import path from "path";

const app = http.createServer((req, res) => {
  if (req.url === "/") {
    res.end("Welcome to the server");
  } else if (req.url === "/aboutus") {
    const webpage = fs.readFileSync(path.join("html", "aboutus.html"));
    res.end(webpage);
  } else if (req.url === "/contactus") {
    const webpage1 = fs.readFileSync(path.join("html", "contactus.html"));
    res.end(webpage1);
  } else if (req.url === "/login") {
    const webpage = fs.readFileSync(path.join("html", "login.html"));
    res.end(webpage);
  } else {
    res.end("Page Not Found");
  }
});

const port = process.env.port || 8000;

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});

