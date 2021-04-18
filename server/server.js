const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const LoginRoutes = require("./routes/login");
const RegisterRoutes = require("./routes/register");
const HeadRoutes = require("./routes/head_dashboard");
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
app.use("/login", LoginRoutes);
app.use("/register", RegisterRoutes);
app.use("/head", HeadRoutes);

// const corsOptions = {
//   origin: ["http://localhost:3000"],
//   methods: ["GET", "POST"],
//   //   credentials: false, //access-control-allow-credentials:true
//   //   optionSuccessStatus: 200,
// };
// app.use(cors(corsOptions));
app.listen(5000, () => console.log("listening on port 5000"));
