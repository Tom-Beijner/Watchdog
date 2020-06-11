import BaseCommand from "../../structures/BaseCommand";
import Context from "../../structures/Context";
import { execSync } from "child_process";
import DiscordEmbed from "../../structures/DiscordEmbed";
import { Message } from "eris";
import Watchdog from "../../structures/Watchdog";
import { hastebin, redact } from "../../utils";
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

        function exec(code: string) {
            return redact(execSync(code).toString().trim());
        }

        try {
            const res = exec("git pull");
            if (res.length >= 40000) {
                embed.addField(
                    "Yeah... but no",
                    "The output was too long to be uploaded to hastebin"
                );
            } else {
                embed.addField(
                    "Output",
                    res.length > 1024
                        ? `The output was too long, but was uploaded to [hastebin](https://hasteb.in/${await hastebin(
                              res
                          )})`
                        : `\`\`\`js\n${res}\`\`\``
                );
            }
            await message.edit({ content: "", embed: embed.getEmbed() });

            if (res !== "Already up to date.") {
                exec("yarn build");
                console.log("Restarting the bot due to an update");
                base.ipc.restartAllClusters();
            }
        } catch (e) {
            const error = redact(e.stack);
            embed.setColor(parseInt(config.bot.color));
            if (error.length >= 40000) {
                embed.addField(
                    "Yeah... but no",
                    "The error was too long to be uploaded to hastebin"
                );
            } else {
                embed.addField(
                    "Error",
                    error.length > 1024
                        ? `The error was too long, but was uploaded to [hastebin](https://hasteb.in/${await hastebin(
                              error
                          )})`
                        : `\`\`\`js\n${error}\`\`\``
                );
            }
            await message.edit({ content: "", embed: embed.getEmbed() });
        }
    }
}
