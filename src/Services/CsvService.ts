import csv from 'csv-parser';
import express from 'express';
import fs from 'fs';
import { Readable } from 'stream';

import DataModel from '../types/DataModel';
import UserModel from '../types/UserModel';

export default class CsvService{
    static upload (req: express.Request, res: express.Response): void {
        if (!req.file) {
            res.status(400).send({
                status: 'File is not uploaded'
            });
        }
        else {
            res.status(200).send({
                status: 'Success'
            });
            CsvService.parseCsv(req.file!.buffer);
        }
    }

    static parseCsv (buffer: Buffer): void {
        var users: Array<UserModel> = [];
        Readable.from(buffer).pipe(csv()).on('data', (data) => users.push(data)).on('end', () => {
            const tableData: DataModel = { data: users };
            fs.writeFileSync('./Data/Table.json', JSON.stringify(tableData), 'utf-8');
        });
    }
}