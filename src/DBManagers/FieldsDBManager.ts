import {Mongoose} from 'mongoose';
import mongodb from 'mongodb';
import {Field} from '../Models/Field';

let fields: mongodb.Collection;

export class FieldsDBManager {
  constructor(client: Mongoose, project: string) {
    if (fields) return;
    try {
      fields = client.connection.db.collection<mongodb.Document>(`${project}.fields`);
    } catch (e) {
      console.error(`ERROR: Failed while connecting to ${project}:\n${e}`);
    }
  }

  async add(field: Field): Promise<void> {
    await fields.insertOne(field);
  }

  async get(): Promise<Array<Field>> {
    return await fields.find<mongodb.Document>({}).toArray() as Field[];
  }
}

const fieldsDBManagers: Map<string, FieldsDBManager> = new Map();
export default fieldsDBManagers;
