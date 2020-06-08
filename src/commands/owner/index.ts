import CommandModule from "../../structures/CommandModule";
import Watchdog from "../../structures/Watchdog";

export default class OwnerModule extends CommandModule {
    constructor() {
        super("Owner", [], __dirname);
    }
}
