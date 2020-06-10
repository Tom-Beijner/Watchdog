import BaseEvent from "../structures/BaseEvent";
import { Message } from "eris";
import Watchdog from "../structures/Watchdog";
import Context from "../structures/Context";
import config from "../config.json";
import DiscordEmbed from "../utils/DiscordEmbed";

export default class messageCreate extends BaseEvent {
    constructor() {
        super({
            event: "messageCreate",
        });
    }

    async execute(base: Watchdog, message: Message) {}
}
