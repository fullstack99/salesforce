import { configConnectionService } from "./api/connection";

const express = require("express");
import cors from "cors";
import cookieParser from "cookie-parser";

import apiRouter from "./api";
import { CLIENT_ORIGIN } from "./config/auth";

const app = express();
const httpServer = require("http").createServer(app);
const io = require("socket.io")(httpServer, {
  cors: {
    origin: CLIENT_ORIGIN,
    methods: ["GET", "POST"],
  },
});
const port = process.env.PORT || 5000;

// Add API middleware
app.use((req, res, next) => {
  console.log("Incoming request, url:", req.url);
  // ADDED REQUEST FOR HEALTH CHECK ON SERVER
  if (req.path === "/") {
    return res.send("Hello World!");
  }
  next();
});

app.use(cors()); //accept all for now, unsecure and update on deployment
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", apiRouter);

io.on("connection", (socket) => {
  console.log("socket connection");
  configConnectionService(socket);
  socket.on("data", (data) => {
    socket.broadcast.emit("user info", {
      ...data,
    });
  });
});
app.get('*', (req, res) => {
  console.log('in the index catch all');
  res.send(404);
})
httpServer.listen(port, () => {
  console.log(`app listening at http://localhost:${port}`);
});
