import fs from "fs";
import util from "util";
import path from "path";
import { BaseClusterWorker } from "eris-fleet";
import { Client, Member } from "eris";
import CommandHandler from "../handlers/CommandHandler";
import CommandModule from "./CommandModule";
import { singleBar } from "../utils/CliProgress";
import BaseEvent from "./BaseEvent";
import BaseCommand from "./BaseCommand";
import Database from "./Database";
import config from "../config.json";
import schedule from "node-schedule";
import { IData } from "../models/dataschema";

const readdir = util.promisify(fs.readdir);

// Have a better way for this
interface Setup {
    bot: Client & { owners: string[] };
    clusterID: number;
    workerID: number;
}

export default class Watchdog extends BaseClusterWorker {
    public database: Database;
    private commandHandler: CommandHandler;
    public modules: CommandModule[] = [];
    private events: BaseEvent[] = [];

    constructor(setup: Setup) {
        super(setup);

        // Demonstration of the properties the cluster has (Keep reading for info on IPC):
        // console.log(this.workerID); // ID of the worker
        // console.log(this.clusterID); // The ID of the cluster

        this.launch();
    }

    async launch() {
        let application = await this.bot.getOAuthApplication();
        this.bot.owners = [application.owner.id];

        const database = new Database({
            host: config.database.host,
            database: config.database.database,
            username: config.database.username,
            password: config.database.password,
        });

        this.database = await database.connect();

        schedule.scheduleJob("0 0 * * *", async () => {
            console.log("Sending stats to database");
            const stats: any = await this.ipc.getStats();
            const handle = [
                {
                    type: "guilds",
                    data: await this.database.Data.findOne({
                        type: "guilds",
                    }),
                },
                {
                    type: "users",
                    data: await this.database.Data.findOne({
                        type: "users",
                    }),
                },
                {
                    type: "pings",
                    data: await this.database.Data.findOne({
                        type: "pings",
                    }),
                },
            ];

            handle.forEach((x) => handleData(this.database, x.data, x.type));

            function handleData(database: Database, data: IData, type: string) {
                let amounts: number;
                const shards = [].concat.apply(
                    [],
                    stats.clusters.map((x) => x.shardStats)
                );
                if (type === "guilds") amounts = stats.guilds;
                if (type === "users")
                    amounts = shards.reduce((a, b) => a + b.users, 0);
                if (type === "pings")
                    amounts = shards.reduce((a, b) => a + b.latency, 0);

                if (!data) {
                    new database.Data({
                        type,
                        amounts: [amounts],
                        dates: [Date.now()],
                    }).save();
                } else {
                    // Make this part when adding more data
                    if (data.amounts.length + 1 > 14) data.amounts.shift();
                    if (data.dates.length + 1 > 14) data.dates.shift();
                    data.amounts.push(amounts);
                    data.dates.push(Date.now());
                    data.save();
                }
            }
        });

        // This doesnt work
        // and maybe move this to a better location?
        Object.defineProperty(Member.prototype, "tag", {
            get: function () {
                return `${this.username}#${this.discriminator}`;
            },
        });

        await this.loadCommands();

        await this.loadEvents();

        this.commandHandler = new CommandHandler();
        this.commandHandler.initialize(this, this.modules);
        this.commandHandler.hookEvent();
    }

    /**
     * Checks to see whether or not a command exists in the modules. Returns empty object if not found
     * @param name Name of command to find
     * @returns {undefined | BaseCommand<{ module: CommandModule; }> }
     */
    public findCommand(
        name: string
    ): undefined | (BaseCommand & { module: CommandModule }) {
        const module = this.modules.find((module) => module.findCommand(name));
        if (!module) return undefined;
        const command: BaseCommand = module.commands.find(
            (command) =>
                command.meta.name === name ||
                command.meta.aliases.includes(name)
        );

        return Object.assign(command, { module });
    }

    private async loadCommands() {
        const bar = singleBar("Modules");
        const folders = await readdir(path.join(__dirname, "../commands/"));
        bar.start(folders.length, 0);
        folders.forEach((folder) => {
            try {
                const props = require(path.join(
                    __dirname,
                    `../commands/${folder}`
                ));
                if (props) {
                    const Module = props.default;
                    this.modules.push(new Module());

                    bar.increment(1, {
                        name: props.default.name,
                    });
                }

                return;
            } catch (err) {
                console.error("error", err);
                return;
            }
        });
        bar.stop();
    }

    private async loadEvents() {
        const files = await readdir(path.join(__dirname, "../events/"));
        if (!files) return;
        const filtered = files.filter((x) => x !== "index.js");
        if (filtered.length < 1) return;
        const bar = singleBar("Events");
        bar.start(filtered.length, 0);

        for (const file of filtered) {
            const event = require(path.join(__dirname, `../events/${file}`));

            try {
                const Event: BaseEvent = new event.default();
                const EventData = Event.meta;
                this.events.push(Event);

                this.bot[EventData.runOnce ? "once" : "on"](
                    EventData.event,
                    Event.execute.bind(this, this)
                );
                bar.increment(1, {
                    name: EventData.event,
                });
            } catch (e) {
                continue;
            }
        }

        bar.stop();
    }

    // Need to check how to fix this
    // shutdown(done) {
    //     // Optional function to gracefully shutdown things if you need to.
    //     done(); // Use this function when you are done gracefully shutting down.
    // }
}
