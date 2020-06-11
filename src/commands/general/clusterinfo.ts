import Watchdog from "../../structures/Watchdog";
import BaseCommand from "../../structures/BaseCommand";
import Context from "../../structures/Context";
import DiscordEmbed from "../../structures/DiscordEmbed";

export default class Clusterinfo extends BaseCommand {
    constructor() {
        super({
            name: "clusterinfo",
            description: "Shows all cluster's information",
            usage: "clusterinfo",
            aliases: ["ci", "clusters"],
            requirements: [],
            deleteMessage: false,
        });
    }

    async execute(ctx: Context, base: Watchdog) {
        let info = "";

        const stats: any = await base.ipc.getStats();

        stats.clusters.map((cluster) => {
            const current = cluster.shardStats.find(
                (shard) => shard.id === ctx.guild!.shard.id
            )
                ? "(current)"
                : "";
            info += `| Cluster #${cluster.id + 1} ${current} | G: ${
                cluster.guilds
            } | U: ${cluster.users} |\n`;
        });

        const embed = new DiscordEmbed()
            .setTitle(
                `${ctx.bot.user.username}#${ctx.bot.user.discriminator} | Cluster Information`
            )
            .setDescription(`\`\`\`diff\n${info}\n\`\`\``);

        return ctx.embed(embed.getEmbed());
    }
}
