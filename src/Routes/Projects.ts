import express from 'express';
import csv from 'csv-parser';
import {Readable} from 'stream';

import Buffer from 'buffer';
import mongodb from "mongodb";
import mongoose from "mongoose";
import {Field} from "../Models/Field";

export default class Projects {
    /**
     * Fetches all projects for user
     *
     * Format of response.body:
     *
     * {"projects": Array<string>}
     *
     * @param _
     * @param response HTTP Response
     */
    static async get(_, response: express.Response) {
        const collections: Array<mongodb.CollectionInfo> =
            await (<mongoose.Mongoose>global.mongooseClient).connection.db.listCollections().toArray();
        const projects: Array<string> = [];
        for (let i = 0; i < collections.length; i++) {
            if (collections[i].name.includes(".data"))
                projects.push(collections[i].name.replace(".data", ""));
        }
        response.end(JSON.stringify({projects: projects}));
    }

    /**
     * Adds a new project for user
     *
     * Format of request.body:
     *
     * `{"name": string}`
     *
     * Format of request.file:
     *
     *  CSV
     *
     * @param request HTTP Request
     * @param response HTTP Response
     */
    static async post(request: express.Request, response: express.Response) {
        if (!request.file) {
            response.status(400).send({
                status: 'File is not uploaded',
            });
        } else {
            const projectName: string = request.body.name;
            const {headers, rows} = await Projects.parseCsv(request.file!.buffer);

            let dataCollection, fieldsCollection;
            try {
                dataCollection = await (<mongoose.Mongoose>global.mongooseClient).connection.db.createCollection(`${projectName}.data`);
                fieldsCollection = await (<mongoose.Mongoose>global.mongooseClient).connection.db.createCollection(`${projectName}.fields`);
            } catch (e) {
                dataCollection = await (<mongoose.Mongoose>global.mongooseClient).connection.db.collection(`${projectName}.data`);
                fieldsCollection = await (<mongoose.Mongoose>global.mongooseClient).connection.db.collection(`${projectName}.fields`);
            }
            let fields: Array<Field> = [];
            for (let i = 0; i < headers.length; i++) {
                fields.push({
                    fieldSlug: headers[i].toLowerCase(),
                    type: {
                        "typeSlug": "string",
                        "maxLength": 1000
                    },
                    displayName: headers[i],
                });
            }
            await dataCollection.insertMany(rows);
            await fieldsCollection.insertMany(fields);
            response.end();
        }
    }

    private static async parseCsv(buffer: Buffer):
        Promise<{ headers: Array<string>; rows: Array<object> }> {
        let headers: Array<string> = [];
        const rows: Array<object> = [];
        const stream = Readable
            .from(buffer)
            .pipe(csv())
            .on('headers', (h) => headers = h)
            .on('data', (data) => rows.push(data));
        await new Promise<void>((resolve, _) => {
            stream.on('end', () => resolve());
        });
        return {headers: headers, rows: rows};
    }
}
