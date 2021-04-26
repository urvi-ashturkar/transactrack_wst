const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const LoginRoutes = require("./routes/login");
const RegisterRoutes = require("./routes/register");
const DashboardRoutes = require("./routes/dashboard")
const cors = require("cors");

const app = express();
app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "DELETE"],
    credentials: true,
  })
);
app.use(express.static(path.join(__dirname, "../client/App")));
app.use(bodyParser.json());
app.use("/login", LoginRoutes);
app.use("/register", RegisterRoutes);
app.use("/dashboard", DashboardRoutes);

app.listen(5000, () => console.log("listening on port 5000"));
