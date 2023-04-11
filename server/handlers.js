"use strict";
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const { MongoClient } = require("mongodb");
const MONGO_URI = process.env.MONGO_URI;
const client = new MongoClient(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const getSongs = async (request, response) => {
    try {
        await client.connect();
        const db = client.db("Final_Project");
        const collection = request.params.displayName
        const songsCollection = db.collection(`${collection}`);
        console.log(songsCollection)
        const songs = await songsCollection.find().toArray();
        response
        .status(200)
        .json({ status: 200, data: songs, message: "All songs retrieved" });
    } catch (err) {
        console.error(err);
        response
        .status(500)
        .json({ status: 500, data: null, message: "Internal Server Error" });
    } finally {
        await client.close();
    }
    };

    const addSong = async (request, response) => {
        console.log("Console 1")
        try {
            console.log("Console 2")
            console.log(request.body)
            await client.connect();
            const db = client.db("Final_Project");
            const collectionName = request.body.displayname;
            const songsCollection = db.collection(collectionName);
            const track = request.body.track;
            const song = {
                name: track.name,
                artist: track.artists[0].name,
                album: track.album.name,
                _id: track.id,
            };
            const result = await songsCollection.insertOne(song);
            console.log(result)
            if (result.acknowledged === true) {
                response.status(201).json({ status: 201, message: "Song added successfully" });
            } else {
                response.status(500).json({ status: 500, message: "Failed to add song" });
            }
        } catch (err) {
            console.error(err);
            response.status(500).json({ status: 500, message: "Internal Server Error" });
        } finally {
            await client.close();
        }
    };

    const deleteSong = async (request, response) => {
        try {
            await client.connect();
            const db = client.db("Final_Project");
            const collectionName = request.params.displayName
            const songsCollection = db.collection(`${collectionName}`);
            const songId = request.params.songId;
            const result = await songsCollection.deleteOne({ _id: songId });
            if (result.acknowledged === true) {
                response.status(200).json({ status: 200, message: "Song deleted successfully" });
            } else {
                response.status(404).json({ status: 404, message: "Song not found" });
            }
        } catch (err) {
            console.error(err);
            response.status(500).json({ status: 500, message: "Internal Server Error" });
        } finally {
            await client.close();
        }
    };

module.exports = {
    getSongs,
    addSong,
    deleteSong,
};