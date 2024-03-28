import "./utils/tracker";
import { config } from "dotenv";

import express from 'express';
import body from "body-parser";
import cors from "cors";

import { createServer } from 'http';
import { Logs } from './utils/logs';

import { JsonDatabase } from "wio.db";
import InstaTracker from "./utils/insta";

config();
const app = express();
const server = createServer(app);
const logs = new Logs();
const db = new JsonDatabase({ databasePath: "./database.json" });

app.set("trust proxy", true);
app.use(body.json());
app.use(body.urlencoded({ extended: true }));
app.use(cors({ origin: "*"}));

app.route("*").get(async (req, res, next) => {
    logs.info(`IP: ${req.ip?.replace("::ffff:", "")} | PATH: ${req.path} | METHOD: ${req.method} | QUERY: ${JSON.stringify(req.query)} | BODY: ${JSON.stringify(req.body)} | PARAMS: ${JSON.stringify(req.params)}`);
    return next();
});

app.route("/").get((req, res) => {
    res.status(200).send({ api: { message: "Welcome to AWSXU API.", status: 200 }, support: "https://discord.gg/awsxu" });
});

app.route("/discord/:id").get(async (req, res) => {
    try {
        const { id } = req.params;
        const findUser = await db.get(id as string);

        if (!findUser) return res.status(404).send({ api: { message: "User not found.", status: 404 }, support: "https://discord.gg/awsxu" });
        return res.status(200).send({ api: { message: "User found.", status: 200, data: findUser }, support: "https://discord.gg/awsxu" });
    } catch (e) {
        logs.error(e as any);
        res.status(500).send({ api: { message: "Internal error.", status: 500 }, support: "https://discord.gg/awsxu" });
    }
});

app.route("/instagram/:username").get(async (req, res) => {
    try {
        const { username } = req.params;
        const resInsta = await InstaTracker(username as string);
        
        return res.status(201).send(resInsta);
    } catch (e) {
        console.log(e)
    }
});

server.listen(80, () => logs.success("Server Online!"));
process.on('uncaughtException', (error, origin) => { return });
process.on('uncaughtExceptionMonitor', (error, origin) => { return });
