import BaseCommand from "../../structures/BaseCommand";
import Context from "../../structures/Context";
import config from "../../config.json";
import { execSync } from "child_process";
import DiscordEmbed from "../../utils/DiscordEmbed";
import { Message } from "eris";

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

        function redact(code: string) {
            const tokens = [
                config.bot.token,
                config.database.host,
                config.database.username,
                config.database.password
                    .replace("*", "\\*")
                    .replace("^", "\\^"),
            ];

            const regex = new RegExp(tokens.join("|"), "gi");
            return code.replace(regex, "|REDACTED|");
        }

        try {
            let result: string = execSync(code).toString().trim();

            const res = redact(result);
            embed.addField("Output", `\`\`\`js\n${res}\`\`\``);
            await message.edit({ content: "", embed: embed.getEmbed() });
        } catch (e) {
            embed.setColor(parseInt(config.bot.color));
            embed.addField("Error", `\`\`\`js\n${e.message}\`\`\``);
            await message.edit({ content: "", embed: embed.getEmbed() });
        }
    }
}
