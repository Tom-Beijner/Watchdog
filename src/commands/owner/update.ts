import BaseCommand from "../../structures/BaseCommand";
import Context from "../../structures/Context";
import { execSync } from "child_process";
import DiscordEmbed from "../../structures/DiscordEmbed";
import { Message } from "eris";
import Watchdog from "../../structures/Watchdog";
import { redact } from "../../utils";
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
        const embed: DiscordEmbed = new DiscordEmbed().setTitle("Exec");

        function exec(code) {
            return redact(execSync(code).toString().trim());
        }

        try {
            const res = exec("git pull");
            embed.addField("Output", `\`\`\`js\n${res}\`\`\``);
            await message.edit({ content: "", embed: embed.getEmbed() });

            if (res !== "Already up to date.") {
                exec("yarn build");
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
