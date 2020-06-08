import { Document, model, Schema } from "mongoose";

export interface IData extends Document {
    type: string;
    amounts: number[];
    dates: number[];
}

export const dataschema = new Schema({
    type: {
        type: String,
        required: true,
    },
    amounts: {
        type: Array,
        required: true,
    },
    dates: {
        type: Array,
        required: true,
    },
});

export default model<IData>("Data", dataschema);
