import Watchdog from "../../structures/Watchdog";
import BaseCommand from "../../structures/BaseCommand";
import Context from "../../structures/Context";

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

    public execute(ctx: Context) {
        // Use git pull with exec then need to build the new build and restart
        return ctx.send("How to make this");
    }
}
