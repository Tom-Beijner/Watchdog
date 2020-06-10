import BaseCommand from "../../structures/BaseCommand";
import Context from "../../structures/Context";
import config from "../../config.json";
import { inspect } from "util";
import DiscordEmbed from "../../structures/DiscordEmbed";
import { Message } from "eris";
import { hastebin, redact } from "../../utils";

export default class Eval extends BaseCommand {
    constructor() {
        super({
            name: "eval",
            description: "Run code inside of the bot",
            usage: "eval [code]",
            aliases: [],
            requirements: [],
            deleteMessage: false,
        });
    }

    async execute(ctx: Context) {
        const message: Message = await ctx.send("Evaluating code...");
        const code: string = ctx.args.join(" ");
        const embed: DiscordEmbed = new DiscordEmbed().setTitle("Eval");

        try {
            let result: Eval | string = await eval(code);
            if (typeof result !== "string") {
                result = inspect(result, {
                    depth: +!inspect(result, { depth: 1 }),
                    showHidden: false,
                });
            }

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
