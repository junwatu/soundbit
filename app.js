const express = require("express");
const app = express();
const path = require("path");

app.use(express.static(path.join(__dirname, ".")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
})

app.listen(3003, () => console.log("App running on port 3003"));
