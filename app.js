const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const PORT = 5002;
const { MONGOURI } = require("./keys");

mongoose.connect(MONGOURI);
mongoose.connection.on("connected", () => {
  console.log("connected to mongo");
});

mongoose.connection.on("error", (err) => {
  console.log("mongo connecting", err);
});
app.use(cors());

require("./models/user");
require("./models/item");
require("./models/order");

app.use(express.json());
app.use(require("./routes/user"));
app.use(require("./routes/item"));
app.use(require("./routes/order"));

app.listen(PORT, () => {
  console.log("server is running", PORT);
});
