import BaseEvent from "../structures/BaseEvent";
import Watchdog from "../structures/Watchdog";

export default class shardReady extends BaseEvent {
    constructor() {
        super({
            event: "shardReady",
        });
    }

    async execute(bot: Watchdog["bot"], id: number) {
        console.log(`Shard ${id} is ready!`);
    }
}
