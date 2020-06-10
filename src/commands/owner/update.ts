import BaseCommand from "../../structures/BaseCommand";
import Context from "../../structures/Context";
import { execSync } from "child_process";
import DiscordEmbed from "../../utils/DiscordEmbed";
import { Message } from "eris";
import Watchdog from "../../structures/Watchdog";
import Redact from "../../utils/Redact";
import config from "../../config.json";

export default class Update extends BaseCommand {
    constructor() {
        super({
            name: "update",
            description: "Update the bot",
            usage: "update",
            aliases: [],
            requirements: [],
            deleteMessage: false,
        });
    }

    async execute(ctx: Context, base: Watchdog) {
        const message: Message = await ctx.send("Executing code...");
        const code: string = "git pull";
        const embed: DiscordEmbed = new DiscordEmbed().setTitle("Exec");

        try {
            const res = Redact(execSync(code).toString().trim());
            embed.addField("Output", `\`\`\`js\n${res}\`\`\``);
            await message.edit({ content: "", embed: embed.getEmbed() });

            if (res !== "Already up to date.") {
                console.log("Restarting the bot due to an update");
                base.ipc.restartAllClusters();
            }
        } catch (e) {
            embed.setColor(parseInt(config.bot.color));
            embed.addField("Error", `\`\`\`js\n${e.message}\`\`\``);
            await message.edit({ content: "", embed: embed.getEmbed() });
        }
    }
}
