import { isMaster } from "cluster";
import { Fleet } from "eris-fleet";
import { Options } from "eris-fleet/dist/sharding/Admiral";
import path from "path";
import { inspect } from "util";
import { bot } from "./config.json";

const options: Options = {
    path: path.join(__dirname, "./structures/Watchdog.js"),
    token: bot.token,
    clientOptions: {
        disableEvents: { TYPING_START: true },
    },
    lessLogging: true,
    shards: 1,
};

const Admiral = new Fleet(options);

if (isMaster) {
    // Code to only run for your master process
    Admiral.on("log", (m) => console.log(m));
    // Admiral.on("debug", (m) => console.debug(m));
    Admiral.on("warn", (m) => console.warn(m));
    Admiral.on("error", (m) => console.error(inspect(m)));

    // Logs stats when they arrive
    //Admiral.on("stats", (m) => console.log(m));
}
