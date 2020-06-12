import config from "../../config.json";
import BaseCommand from "../../structures/BaseCommand";
import DiscordEmbed from "../../structures/DiscordEmbed";
import Context from "../../structures/Context";
import { VERSION } from "eris";

export default class Info extends BaseCommand {
    constructor() {
        super({
            name: "info",
            description: "Show information about the bot",
            usage: "info",
            aliases: [],
            requirements: [],
            deleteMessage: false,
        });
    }

    async execute(ctx: Context) {
        const embed = new DiscordEmbed();

        embed.setColor(parseInt(config.bot.color));
        embed.setAuthor("Bot information:");

        embed.addField(
            "Owners",
            ctx.bot.owners.length > 0
                ? ctx.bot.owners
                      .map((x) => ctx.bot.users.get(x).username)
                      .join(",\n")
                : "Uh Oh seems like I don't have any developers?!?",
            true
        );
        embed.addField(
            "Version",
            `Node.js ${process.version}\nEris v${VERSION}`,
            true
        );

        embed.addField(
            "Shard info",
            `ID: ${ctx.guild.shard.id + 1}\n` +
                `Ping: ${ctx.guild.shard.latency}ms`,
            true
        );

        // Process.uptime returns in seconds, so here i multiply by 1000 to get miliseconds
        // const timeNow = Date.now();
        // const timeAgo = timeNow - (process.uptime() * 1000);
        // const ms = moment(timeNow).diff(moment(timeAgo));
        // const duration = moment.duration(ms);
        // const formattedTime = Math.floor(duration.asHours()) + moment.utc(ms).format(":mm:ss");
        // embed.addField("Uptime", `${formattedTime}`, true);

        embed.setFooter("https://github.com/Tom-Beijner/Watchdog");

        return ctx.embed(embed.getEmbed());
    }
}
