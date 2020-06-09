import Watchdog from "../../structures/Watchdog";
import BaseCommand from "../../structures/BaseCommand";
import DiscordEmbed from "../../utils/DiscordEmbed";
import Context from "../../structures/Context";
import config from "../../config.json";

export default class Help extends BaseCommand {
    constructor() {
        super({
            name: "help",
            description: "Update the bot",
            usage: "help [command]",
        });
    }

    async execute(ctx: Context, base: Watchdog) {
        const embed = new DiscordEmbed();

        if (!ctx.args.length) {
            // Reduce should work, have to do a wacky one
            // console.log(base.modules.reduce((prev, cur) => prev.commands.length + cur.commands.length))
            // TODO: Research the cause of reduce not working as it should
            let commands: BaseCommand[] = [];
            // base.modules.forEach((x) => {
            //     commands.push(x.commands);
            // });
            // // Flatten the array of commands
            // commands = [].concat(...commands);
            base.modules.forEach((x) => {
                x.commands.forEach((y) => {
                    commands.push(y);
                });
            });

            // Make a list of all commands
            // TODO: Make each cat be a field
            let list = "";
            commands.forEach((command) => {
                const meta = command.meta;
                list += `${meta.name} - ${meta.description}\n`;
            });

            embed
                .setTitle("Help Command")
                .setDescription(
                    `There's currently \`${commands.length}\` commands`
                )
                .addField("Commands", list)
                .setFooter(config.bot.prefix + this.meta.usage);

            return ctx.embed(embed.getEmbed());
        } else {
            // Find command function should be moved to the base or near the command handler layer

            const command = base.findCommand(ctx.args[0].toLowerCase());
            if (!command) {
                embed
                    .setTitle("Help Command - Unknown")
                    .setDescription(
                        "It seems like this command doesn't exist..."
                    );
            } else {
                const aliases = command.meta.aliases;
                const reqPermissions = [
                    ...command.meta.requirements,
                    ...command.module.permissions,
                ];

                embed
                    .setTitle(`Help Command - ${command.meta.name}`)
                    .setDescription(command.meta.description)
                    .addField("Usage", command.meta.usage)
                    .addField(
                        "Aliases",
                        aliases.length > 0 ? aliases.join(", ") : "None"
                    )
                    .addField(
                        "Required Permissions",
                        reqPermissions.length > 0
                            ? reqPermissions.join(", ")
                            : "None"
                    );
            }

            return ctx.embed(embed.getEmbed());
        }
    }
}
