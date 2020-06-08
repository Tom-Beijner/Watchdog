import BaseEvent from "../structures/BaseEvent";
import { Client, Message } from "eris";

export default class messageCreate extends BaseEvent {
    constructor(bot: Client) {
        super(bot, {
            event: "messageCreate",
        });
    }

    async execute(message: Message) {}
}
