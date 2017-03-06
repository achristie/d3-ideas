const express = require("express");
const app = express();
const path = require("path");

app.use(express.static("public"));
app.use(
  "/scripts",
  express.static(path.join(__dirname, "/node_modules/d3/build/"))
);

app.listen(3000, () => `Listening on 3000`);
