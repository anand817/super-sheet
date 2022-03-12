import {Mongoose} from 'mongoose';
import mongodb, {ObjectId} from 'mongodb';
import {Field} from '../Models/Field';

let fields: mongodb.Collection;

export class TableDBManager {
  constructor(client: Mongoose, project: string) {
    if (fields) return;
    try {
      fields = client.connection.db.collection<mongodb.Document>(`${project}.data`);
    } catch (e) {
      console.error(`ERROR: Failed while connecting to ${project}:\n${e}`);
    }
  }

  async get(): Promise<Array<Field>> {
    return await fields.find<mongodb.Document>({}).toArray() as Field[];
  }

  async update(id: string, document: any): Promise<void> {
    await fields.updateOne(
        {_id: new ObjectId(id)},
        {$set: document},
    );
  }

  async addField(fieldSlug: string, defaultValue: any): Promise<void> {
    await fields.updateMany({}, {$set: {[fieldSlug]: defaultValue}});
  }
}

const tableDBManagers: Map<string, TableDBManager> = new Map();
export default tableDBManagers;
