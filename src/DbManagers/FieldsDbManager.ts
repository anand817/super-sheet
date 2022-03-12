import {Mongoose} from "mongoose";
import mongodb from "mongodb";
import {Field} from "../Models/Field";

let fields: mongodb.Collection;

class FieldsDbManager {
    // TODO(BURG3R5): Inject DB when navigate to table of a project
    async inject(client: Mongoose, project: string) {
        if (fields) return;
        try {
            fields = await client.connection.db.collection<mongodb.Document>(`${project}.fields`);
        } catch (e) {
            console.error(`ERROR: Failed while connecting to ${project}:\n${e}`);
        }
    }

    async get(): Promise<Array<Field>> {
        return await fields.find<mongodb.Document>({}).toArray() as Field[];
    }
}

export let socFieldsDB = new FieldsDbManager();
