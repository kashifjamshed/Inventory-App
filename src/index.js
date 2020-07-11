const express = require("express");
const app = express();
const mongoose = require("mongoose");
const date = require("./middlewares/requestDate");
const inventory = require("./routes/inventory");

//connecting mongoose database
mongoose
  .connect("mongodb://localhost/inventoryData", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database Connected");
  })
  .catch((error) => {
    console.log("ERROR:" + error.message);
  });

app.use(express.json()); //in-Built middleware
app.use(date); //date middleware
app.use("/api/inventory", inventory); //inventory routes

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running at port ${port}`);
});
