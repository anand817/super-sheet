import express from 'express';
import BooleanType from "../Models/Types/Boolean";
import IntType from "../Models/Types/Int";
import StringType from "../Models/Types/String";

export default class Types {
    /**
     * Returns all supported types
     *
     * @param _
     * @param response HTTP Response
     */
    static get(_, response: express.Response) {
        response.end(JSON.stringify({
            "types": [
                BooleanType,
                IntType,
                StringType,
            ]
        }));
    }
}
