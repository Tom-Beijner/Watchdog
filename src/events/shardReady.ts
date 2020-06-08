import BaseEvent from "../structures/BaseEvent";
import { Client } from "eris";

export default class shardReady extends BaseEvent {
    constructor(bot: Client) {
        super(bot, {
            event: "shardReady",
        });
    }

    async execute(id: number) {
        console.log(`Shard ${id} is ready!`);
    }
}
