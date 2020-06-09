import mongoose from "mongoose";
import dataschema from "../models/dataschema";

interface Options {
    host: string;
    database: string;
    username: string;
    password: string;
}

export default class Database {
    private options: Options;
    constructor(options: Options) {
        this.options = options;
    }

    public async connect() {
        const uri = `mongodb+srv://${this.options.username}:${this.options.password}@${this.options.host}/${this.options.database}`;
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            socketTimeoutMS: 0,
            keepAlive: true,
            keepAliveInitialDelay: 300000,
            // reconnectTries: 30,
            useCreateIndex: true,
            useUnifiedTopology: true,
        });

        return this;
    }

    public get Data() {
        return dataschema;
    }

    public close() {
        return mongoose.connection.close();
    }
}
