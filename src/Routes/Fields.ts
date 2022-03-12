import express from 'express';
import fieldsDBManagers from "../DBManagers/FieldsDBManager";

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
     * "fieldSlug": string,
     * displayName: string,
     * type: {
     *  "typeSlug": string,
     *  ...customizations
     *  }
     * }
     *
     * @param request HTTP Request
     * @param response HTTP Response
     */
    static async post(request: express.Request, response: express.Response) {
        await fieldsDBManagers[request.params.project].add(request.body);
        response.end();
    }
}
