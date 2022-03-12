import express from 'express';
import csv from 'csv-parser';
import fs from 'fs';
import {Readable} from 'stream';

import Buffer from 'buffer';

export default class Upload {
    static post(request: express.Request, response: express.Response, _) {
        if (!request.file) {
            response.status(400).send({
                status: 'File is not uploaded',
            });
        } else {
            response.end();
            Upload.parseCsv(request.file!.buffer);
        }
    }

    private static parseCsv(buffer: Buffer): void {
        const users: Array<object> = [];
        Readable
            .from(buffer)
            .pipe(csv())
            .on('data', (data) => users.push(data))
            .on(
                'end',
                () => {
                    const tableData: { data: Array<object> } = {data: users};
                    fs.writeFileSync('./data/table.json', JSON.stringify(tableData), 'utf-8');
                },
            );
    }

}
