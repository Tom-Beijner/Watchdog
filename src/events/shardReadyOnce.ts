import BaseEvent from "../structures/BaseEvent";
import Watchdog from "../structures/Watchdog";

export default class shardReady extends BaseEvent {
    constructor() {
        super({
            event: "shardReady",
            runOnce: true,
        });
    }

    async execute(bot: Watchdog["bot"], id: number) {
        bot.editStatus("online", {
            name: `shard ${id} / ${bot.shards.size}`,
            type: 3,
        });
    }
}
