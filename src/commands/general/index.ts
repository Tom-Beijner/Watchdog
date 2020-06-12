import CommandModule from "../../structures/CommandModule";

export default class InfoModule extends CommandModule {
    constructor() {
        super("General", [], __dirname);
    }
}
