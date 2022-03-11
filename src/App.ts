import express from 'express';
import cors from 'cors';
import multer from 'multer';

import Home from './Routes/Home';
import Fields from './Routes/Fields';
import CsvService from './Services/CsvService';

const app = express();
const port = 8000;
const storagePath: string = './assets/temp/';
const storage: multer.StorageEngine = multer.memoryStorage();
const uploader: multer.Multer = multer({
  storage: storage
});

app.use(cors());
app.use(express.json());

app.get('/', Home.get);
app.get('/fields', Fields.get);
app.post('/fields', Fields.post);

app.post('/upload', uploader.single('csv'), CsvService.upload);

app.listen(port, () => {
  return console.log(`Listening at http://localhost:${port}`);
});
