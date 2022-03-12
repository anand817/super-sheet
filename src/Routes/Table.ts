import express from 'express';
import fieldsDBManagers, {FieldsDBManager} from "../DbManagers/FieldsDBManager";
import tableDBManagers, {TableDBManager} from "../DbManagers/TableDBManager";

export default class Table {
    /**
     * Fetches table data
     *
     * @param request HTTP Request
     * @param response HTTP Response
     */
    static async get(request: express.Request, response: express.Response) {
        fieldsDBManagers[request.params.project] = new FieldsDBManager(
            global.mongooseClient,
            request.params.project
        );
        tableDBManagers[request.params.project] = new TableDBManager(
            global.mongooseClient,
            request.params.project
        );
        const result = await tableDBManagers[request.params.project].get();
        response.end(JSON.stringify(result));
    }

    /**
     * Updates one row in the table
     *
     * @param request HTTP Request
     * @param response HTTP Response
     */
    static async post(request: express.Request, response: express.Response) {
        await tableDBManagers[request.params.project].update(request.params.id, request.body);
        response.end();
    }
}
