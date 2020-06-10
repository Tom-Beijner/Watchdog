import Watchdog from "../../structures/Watchdog";
import config from "../../config.json";
import BaseCommand from "../../structures/BaseCommand";
import DiscordEmbed from "../../structures/DiscordEmbed";
import Context from "../../structures/Context";
import { readable } from "../../utils/Readable";

export default class Stats extends BaseCommand {
    constructor() {
        super({
            name: "stats",
            description: "Show statistics about the bot",
            usage: "stats",
            aliases: ["metrics"],
            requirements: [],
            deleteMessage: false,
        });
    }

    async execute(ctx: Context, base: Watchdog) {
        const embed = new DiscordEmbed();

        embed.setColor(parseInt(config.bot.color));
        embed.setAuthor(
            "Bot statistics:",
            ctx.bot.user.avatarURL,
            ctx.bot.user.avatarURL
        );

        const stats: any = await base.ipc.getStats();
        const shards = [];

        stats.clusters.forEach((cluster) => {
            cluster.shardStats.forEach((x) => {
                shards.push(x);
            });
        });

        const avgPing =
            shards.reduce((a, b) => a + b.latency, 0) / shards.length;
        const users = shards.reduce((a, b) => a + b.users, 0);

        embed.addField(
            "General",
            `Clusters: ${stats.clusters.length}\nShards: ${
                stats.shardCount
            } (#${ctx.guild!.shard.id + 1})\n` +
                `Guilds: ${stats.guilds}\n` +
                `Channels: ${Object.keys(ctx.bot.channelGuildMap).length}\n` +
                `Users: ${users}\n`,
            true
        );

        // Gets heap of memory used in bytes, so divide by 1024 two times to get MB
        const memHeap = process.memoryUsage().heapUsed;
        const megabytes = (memHeap / 1024 / 1024).toFixed(2);
        // Gets the current cpu usage
        const cpuUsage = (
            process.cpuUsage().user / process.cpuUsage().system
        ).toFixed(2);

        embed.addField(
            "System",
            `Ram Usage: ${megabytes} (Total: ${stats.totalRam.toFixed(
                2
            )})MB\n` +
                `CPU Usage: ${cpuUsage}%\n` +
                `Uptime: ${readable(
                    Date.now() - ctx.bot.startTime
                )}\nLatency: ${avgPing}ms avg.`,
            true
        );

        embed.setFooter("https://github.com/Tom-Beijner/Watchdog");

        await ctx.embed(embed.getEmbed());
    }
}
