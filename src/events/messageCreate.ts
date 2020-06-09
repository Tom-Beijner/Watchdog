import BaseEvent from "../structures/BaseEvent";
import { Message } from "eris";
import Watchdog from "../structures/Watchdog";

export default class messageCreate extends BaseEvent {
    constructor() {
        super({
            event: "messageCreate",
        });
    }

    async execute(bot: Watchdog["bot"], message: Message) {}
}
