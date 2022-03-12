import express from 'express';
import BooleanType from '../Models/Types/Boolean';
import IntType from '../Models/Types/Int';
import StringType from '../Models/Types/String';
import CheckboxType from '../Models/Types/Checkbox';
import RadioType from "../Models/Types/Radio";

export default class Types {
    /**
     * Returns all supported types
     *
     * @param _
     * @param response HTTP Response
     */
    static get(_, response: express.Response) {
        response.end(JSON.stringify({
            'types': [
                BooleanType,
                CheckboxType,
                IntType,
                RadioType,
                StringType,
            ],
        }));
    }
}
