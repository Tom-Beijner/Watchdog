import { Events } from "../constants";
import { Client } from "eris";

// Make the event name get a type from the eris types events list
// Maybe also make the execute function follow the listener function properties
interface MetaData {
    event: Events;
    runOnce?: Boolean;
}

export default abstract class BaseEvent {
    public bot: Client;
    public meta: MetaData;

    constructor(bot: Client, meta: MetaData) {
        this.bot = bot;
        this.meta = meta;
    }

    /**
     * @arg {any[]} args Required amount of args depending on the event
     * @returns {Promise<any>} Return a promise of any kind
     */
    public abstract execute(...args: any[]): Promise<any>;
}
