"use strict";

const express = require("express");
const morgan = require("morgan");

const {
  getSongs,
  addSong,
  deleteSong,
} = require("./handlers");

const PORT = 4000;

express()
  .use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Methods",
      "OPTIONS, HEAD, GET, PUT, POST, DELETE"
    );
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  })
  .use(morgan("tiny"))
  .use(express.static("./server/assets"))
  .use(express.json())
  .use(express.urlencoded({ extended: false }))
  .use("/", express.static(__dirname + "/"))

  .get("/api/get-disliked-songs/:displayName", getSongs)
  .post("/api/add-song/", addSong)
  .delete("/api/delete-song/:displayName/:songId", deleteSong)

  .listen(PORT, () => console.info(`Listening on port ${PORT}`));
