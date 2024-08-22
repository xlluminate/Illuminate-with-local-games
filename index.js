const http = require("node:http");
const path = require("node:path");
const express = require("express");
const chalk = require("chalk");

const app = express();
const PORT = process.env.PORT || 8080;

console.log(chalk.yellow("starting..."));

app.use(express.static(path.join(process.cwd(), "public")));

app.use((req, res) => {
    res.status(404).sendFile(path.join(process.cwd(), "public", "404.html"));
});

const server = http.createServer(app);

server.listen(PORT, () => {
    console.log(chalk.green(`running on http://localhost:${PORT}`));
});
