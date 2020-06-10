import BaseEvent from "../structures/BaseEvent";
import Watchdog from "../structures/Watchdog";

export default class shardReady extends BaseEvent {
    constructor() {
        super({
            event: "shardReady",
            runOnce: true,
        });
    }

    async execute(base: Watchdog, id: number) {
        base.bot.editStatus("online", {
            name: `shard ${id} / ${base.bot.shards.size}`,
            type: 3,
        });
    }
}
