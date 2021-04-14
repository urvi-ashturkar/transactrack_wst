const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const con = require("./connection");
const PortfolioRoutes = require("./routes/portfolio");
const cors = require("cors");

const app = express();
app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true,
  })
);
app.use(express.static(path.join(__dirname, "../client/App")));
app.use(bodyParser.json());
app.use("/portfolio", PortfolioRoutes);
app.use("/portfolio/:id", PortfolioRoutes);

// const corsOptions = {
//   origin: ["http://localhost:3000"],
//   methods: ["GET", "POST"],
//   //   credentials: false, //access-control-allow-credentials:true
//   //   optionSuccessStatus: 200,
// };
// app.use(cors(corsOptions));
app.listen(5000, () => console.log("listening on port 5000"));
