import Watchdog from "../../structures/Watchdog";
import BaseCommand from "../../structures/BaseCommand";
import Context from "../../structures/Context";

export default class Info extends BaseCommand {
    constructor() {
        super({
            name: "ping",
            description: "Show the bot's ping",
            usage: "ping",
            aliases: [],
            requirements: [],
            deleteMessage: false,
        });
    }

    public async execute(ctx: Context) {
        const startedAt = Date.now();
        const msg = await ctx.channel.createMessage(
            ":ping_pong: Calculating ping"
        );

        const ws = ctx.bot.shards.reduce((a, b) => a + b.latency, 0);
        return msg.edit(
            `:ping_pong: Pong!\nShard #${
                ctx.guild ? ctx.guild.shard.id + 1 : 0 + 1
            }: \`${ws}ms\` | Message: \`${Date.now() - startedAt}ms\``
        );
    }
}
