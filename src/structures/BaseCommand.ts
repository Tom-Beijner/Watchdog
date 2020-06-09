import Watchdog from "./Watchdog";
import { Permission } from "eris";
import { Context } from "vm";

// https://github.com/Tromodolo/Kurisu

interface MetaData {
    name: string;
    description: string;
    usage: string;
    aliases?: string[];
    requirements?: string[];
    deleteMessage?: boolean;
}

/**
 * Class definition for a command object
 *
 * @class Command
 * @prop {CommandMetadata} meta Command Metadata
 * @prop {function} run Command function that runs when the command gets triggered
 */
export default abstract class BaseCommand {
    public meta: MetaData = {
        name: "",
        description: "",
        usage: "",
        aliases: [],
        requirements: [],
        deleteMessage: false,
    };

    constructor(meta: MetaData) {
        this.meta = { ...this.meta, ...meta };
    }

    /**
     * @arg {Message} message The message sent
     * @arg {string[]} args Array of all the args sent with the command
     * @returns {Promise<any>} Return a promise of any kind
     */
    public abstract execute(ctx: Context, base?: Watchdog): Promise<any>;

    public checkPermissions(permissions: Permission): boolean {
        for (const perm of this.meta.requirements) {
            if (!permissions.has(perm)) {
                return false;
            }
        }
        return true;
    }
}
