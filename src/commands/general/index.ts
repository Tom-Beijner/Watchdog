import CommandModule from "../../structures/CommandModule";
import Watchdog from "../../structures/Watchdog";

export default class InfoModule extends CommandModule {
    constructor() {
        super("General", [], __dirname);
    }
}
