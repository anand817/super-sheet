import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import mongoose from 'mongoose';

import Fields from './Routes/Fields';
import Upload from './Routes/Upload';
import {atlasUri, port} from "./Config";

const app = express();
const storage: multer.StorageEngine = multer.memoryStorage();
const uploader: multer.Multer = multer({storage: storage});

app.use(cors());
app.use(express.json());
mongoose.connect(atlasUri);

app.get('/fields', Fields.get);
app.post('/fields', Fields.post);
app.post('/upload', uploader.single('csv'), Upload.post);

app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
});
