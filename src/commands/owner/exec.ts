import BaseCommand from "../../structures/BaseCommand";
import Context from "../../structures/Context";
import config from "../../config.json";
import { execSync } from "child_process";
import DiscordEmbed from "../../structures/DiscordEmbed";
import { Message } from "eris";
import { hastebin, redact } from "../../utils";

export default class Exec extends BaseCommand {
    constructor() {
        super({
            name: "exec",
            description: "Run code inside of the bot",
            usage: "exec <code>",
            aliases: ["shell"],
            requirements: [],
            deleteMessage: false,
        });
    }

    async execute(ctx: Context) {
        const message: Message = await ctx.send("Executing code...");
        const code: string = ctx.args.join(" ");
        const embed: DiscordEmbed = new DiscordEmbed().setTitle("Exec");

        try {
            let result: string = execSync(code).toString().trim();

            const res = redact(result);
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
