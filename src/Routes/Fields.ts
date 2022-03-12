import express from 'express';
import fs from 'fs';

import {Field} from '../Models/Field';
import fieldsDBManagers from "../DbManagers/FieldsDBManager";

export default class Fields {
    /**
     * Fetches all fields
     *
     * @param request HTTP Request
     * @param response HTTP Response
     */
    static async get(request: express.Request, response: express.Response) {
        const result = await fieldsDBManagers[request.params.project].get();
        response.end(JSON.stringify(result));
    }

    /**
     * Add new field to table
     *
     * Format of body:
     *
     * `{"fields": Array<Field>}`
     *
     * @param request HTTP Request
     * @param response HTTP Response
     */
    static post(request: express.Request, response: express.Response) {
        const fields = Fields.readFields();
        const newFields: Array<Field> = request.body.fields;
        for (let i = 0; i < newFields.length; i++) {
            const matchingIndex = fields.findIndex(
                (field, _) =>
                    field.slug == newFields[i].slug,
            );
            if (matchingIndex !== -1) {
                fields[matchingIndex] = newFields[i];
            } else {
                fields.push(newFields[i]);
            }
        }
        Fields.writeFields(fields);
        response.end();
    }

    private static readFields(): Array<Field> {
        const fields = fs.readFileSync('data/fields.json', 'utf-8');
        return JSON.parse(fields).fields;
    }

    private static writeFields(fields: Array<Field>) {
        fs.writeFileSync(
            'data/fields.json',
            JSON.stringify({fields: fields}),
        );
    }
}
