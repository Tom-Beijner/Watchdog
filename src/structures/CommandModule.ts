import fs from "fs";
import path from "path";
import { Client, Permission } from "eris";
import BaseCommand from "./BaseCommand";
import { singleBar } from "../utils/CliProgress";

/**
 * Class definition for Command Modules
 *
 * @class CommandModule
 * @prop {string} name The module that the particular command belongs to
 * @prop {Command[]} commands Array of all the commands within the command group
 * @prop {string[]} permissions Array of all the different permissions needed
 */
export default class CommandModule {
    public name: string;
    public commands: BaseCommand[] = [];
    public permissions: string[];

    /**
     * @param name The module that the particular command belongs to
     * @param permissions Array of all the commands within the command module
     * @param commandPath Array of all the different permissions needed
     */
    constructor(name: string, permissions: string[], commandPath: string) {
        this.name = name;
        this.permissions = permissions;

        fs.readdir(path.join(commandPath, "./"), (folderErr, files) => {
            if (!files) return;
            const filtered = files.filter((x) => x !== "index.js");
            if (filtered.length < 1) return;
            const bar = singleBar("Commands");
            bar.start(filtered.length, 0);

            for (const file of filtered) {
                const command = require(path.join(commandPath, `/${file}`));
                try {
                    const Command = command.default;
                    this.commands.push(new Command());
                    bar.increment(1, {
                        name: command.default.name,
                    });
                } catch (e) {
                    continue;
                }
            }

            bar.stop();
        });
    }

    /**
     * Checks whether or not the passed through permissions are allowed to run a command from a module
     * @param permissions eris.js permissions object
     * @returns {boolean}
     */
    public checkPermissions(permissions: Permission): boolean {
        for (const perm of this.permissions) {
            if (!permissions.has(perm)) {
                return false;
            }
        }
        return true;
    }

    /**
     * Checks to see whether or not a command exists in a module. Returns undefined if not found
     * @param name Name of command to find
     * @returns {undefined | BaseCommand}
     */
    public findCommand(name: string): undefined | BaseCommand {
        return this.commands.find(
            (command) =>
                command.meta.name === name ||
                command.meta.aliases.includes(name)
        );
    }
}
