import { Message } from "eris";
import Watchdog from "../structures/Watchdog";
import config from "../config.json";
import DiscordEmbed from "../utils/DiscordEmbed";
import CommandModule from "../structures/CommandModule";
import Context from "../structures/Context";

export default class CommandHandler {
    private modules: CommandModule[];
    private base: Watchdog;
    private bot: Watchdog["bot"];

    constructor() {
        this.messageEvent = this.messageEvent.bind(this);
    }

    initialize(base: Watchdog, modules: CommandModule[]) {
        this.base = base;
        this.bot = base.bot;
        this.modules = modules;
    }

    public hookEvent() {
        this.bot.on("messageCreate", this.messageEvent);
    }

    public unhookEvent() {
        this.bot.off("messageCreate", this.messageEvent);
    }

    private async messageEvent(message: Message) {
        if (message.author.bot) return;

        const messageArgs = message.content.split(" ");
        // Check if there are any commands that match this message
        if (await this.checkCommand(message, messageArgs)) {
            // This means a command was ran, so update database accordingly
            // There is no custom command system in place, but eventually adding that somehow is good
        }
    }

    /**
     * Returns true or false depending on whether a command was ran
     * @param {Message} message An erisjs message object
     * @param {Array} args The message as an array of strings
     * @param {Array} modules An array of all the loaded commmand modules
     */
    private async checkCommand(message: Message, args: string[]) {
        if (message.author.bot && !message.member) {
            return;
        }

        if (
            message.content
                ?.toLowerCase()
                .startsWith(config.bot.prefix.toLowerCase())
        ) {
            // Starting at 1 index so that it takes away the prefix
            // This makes it easier to later allow custom prefixes for servers, and just check for those too in the if case above
            args[0] = args[0]
                ?.toLowerCase()
                .substring(config.bot.prefix.length);

            // // Fix a better way to check each module
            // this.modules.forEach(async (module) => {
            //     if (
            //         module.name.toLowerCase() === "owner" &&
            //         !this.bot.owners.includes(message.author.id)
            //     ) {
            //         return;
            //     }
            // });

            try {
                const command = this.base.findCommand(args[0]?.toLowerCase());
                if (command) {
                    if (
                        command.module.name.toLowerCase() === "owner" &&
                        !this.bot.owners.includes(message.author.id)
                    )
                        return;
                    if (
                        !command.checkPermissions(message.member.permission) ||
                        !command.module.checkPermissions(
                            message.member.permission
                        )
                    ) {
                        throw {
                            title: "No permission",
                            message:
                                "You don't have permission to use this command",
                        };
                    }
                    // Move this part near the module
                    // if (
                    //     !module.checkPermissions(message.member.permission)
                    // ) {
                    //     throw {
                    //         title: "No permission",
                    //         message:
                    //             "You don't have permission to use this command",
                    //     };
                    // }

                    if (command.meta.deleteMessage === true)
                        await message.delete();

                    const commandArgs = [...args];
                    commandArgs.shift();
                    const ctx = new Context(this.bot, message, commandArgs);
                    await command.execute(ctx, this.base);

                    return true;
                } else {
                    return false;
                }
            } catch (e) {
                console.error(e.stack);

                const embed = new DiscordEmbed();
                embed.setAuthor(e.title || "Something went wrong!");
                embed.setColor(parseInt("0xe6675e"));
                embed.setDescription(e.message || e);
                embed.setFooter(
                    `If this is a bug, please contact ${
                        this.bot.owners.length > 0
                            ? this.bot.owners
                                  .map((x) => this.bot.users.get(x))
                                  .join(",\n")
                            : "Uh Oh seems like I don't have any developers?!?"
                    }`
                );

                await message.channel.createMessage({
                    embed: embed.getEmbed(),
                });
            }
        } else {
            return false;
        }
    }
}
