import { EmbedOptions, Message, TextChannel, User } from "eris";
import Watchdog from "./Watchdog";

export interface DMOptions {
    user: User;
    content: string;
    embed?: EmbedOptions;
}

export default class CommandContext {
    public bot: Watchdog["bot"];
    public message: Message;
    public args: string[];

    constructor(bot: Watchdog["bot"], message: Message, args: string[]) {
        this.bot = bot;
        this.message = message;
        this.args = args;
    }

    send(content: string) {
        return this.message.channel.createMessage(content);
    }

    embed(content: EmbedOptions) {
        return this.message.channel.createMessage({ embed: content });
    }

    code(lang: string, content: string) {
        const cb = "```";
        return this.send(`${cb}${lang}\n${content}${cb}`);
    }

    get guild() {
        return this.message.channel instanceof TextChannel
            ? (this.message.channel as TextChannel).guild
            : undefined;
    }

    get channel() {
        return this.message.channel;
    }

    get member() {
        return this.guild
            ? this.guild.members.get(this.message.author.id)
            : undefined;
    }

    get me() {
        return this.guild!.members.get(this.bot.user.id)!;
    }

    async dm(options: DMOptions) {
        const channel = await options.user.getDMChannel();
        return channel.createMessage({
            content: options.content,
            embed: options.embed,
        });
    }
}
