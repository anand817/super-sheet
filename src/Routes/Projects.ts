import express from 'express';
import csv from 'csv-parser';
import {Readable} from 'stream';

import Buffer from 'buffer';
import mongodb from "mongodb";
import mongoose from "mongoose";

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
            const tableData = await Projects.parseCsv(request.file!.buffer);
            // TODO(BURG3R5): Store raw data temporarily
            response.end();
        }
    }

    private static async parseCsv(buffer: Buffer): Promise<{ data: Array<object> }> {
        const users: Array<object> = [];
        const stream = Readable
            .from(buffer)
            .pipe(csv())
            .on('data', (data) => users.push(data));
        await new Promise<void>((resolve, _) => {
            stream.on('end', () => resolve());
        });
        return {data: users};
    }
}
