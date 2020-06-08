import BaseEvent from "../structures/BaseEvent";
import { Client } from "eris";

export default class shardReady extends BaseEvent {
    constructor(bot: Client) {
        super(bot, {
            event: "shardReady",
            runOnce: true,
        });
    }

    async execute(id: number) {
        this.bot.editStatus("online", {
            name: `shard ${id} / ${this.bot.shards.size}`,
            type: 3,
        });
    }
}
