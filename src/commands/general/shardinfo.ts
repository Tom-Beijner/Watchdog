import Watchdog from "../../structures/Watchdog";
import BaseCommand from "../../structures/BaseCommand";
import Context from "../../structures/Context";
import DiscordEmbed from "../../utils/DiscordEmbed";
import { Stats } from "eris-fleet";

export default class Shardinfo extends BaseCommand {
    constructor() {
        super({
            name: "shardinfo",
            description: "Shows all shard's information",
            usage: "shardinfo",
            aliases: ["si", "shards"],
            requirements: [],
            deleteMessage: false,
        });
    }

    public async execute(ctx: Context, base: Watchdog) {
        let info = "";

        const stats: any = await base.ipc.getStats();
        const shards = [];

        stats.clusters.forEach((cluster) => {
            cluster.shardStats.forEach((x) => {
                console.log(x);
                shards.push(x);
            });
        });

        shards.map((shard) => {
            const current = ctx.guild!.shard.id === shard.id ? "(current)" : "";
            info += `${
                shard.status === "disconnected"
                    ? "-"
                    : shard.status === "connecting" ||
                      shard.status === "handshaking"
                    ? "*"
                    : "+"
            } | Shard #${shard.id + 1} ${current} | G: ${shard.guilds} | U: ${
                shard.users
            } | L: ${shard.latency}ms |\n`;
        });

        const embed = new DiscordEmbed()
            .setTitle(
                `${ctx.bot.user.username}#${ctx.bot.user.discriminator} | Shard Information`
            )
            .setDescription(`\`\`\`diff\n${info}\n\`\`\``);

        return ctx.embed(embed.getEmbed());
    }
}
