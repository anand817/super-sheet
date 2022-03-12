import express from 'express';
import fieldsDBManagers from "../DBManagers/FieldsDBManager";
import {Field} from "../Models/Field";
import tableDBManagers from "../DBManagers/TableDBManager";

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
     * ```{
     *   "field": Field,
     *   "defaultValue": any
     * }
     *
     * @param request HTTP Request
     * @param response HTTP Response
     */
    static async post(request: express.Request, response: express.Response) {
        const field: Field = request.body.field;
        await (fieldsDBManagers[request.params.project]).add(field);
        await (tableDBManagers[request.params.project]).addField(field.fieldSlug, request.body.defaultValue);
        response.end();
    }
}
