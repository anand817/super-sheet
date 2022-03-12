import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import mongoose from 'mongoose';

import Fields from './Routes/Fields';
import Projects from './Routes/Projects';
import {atlasUri, port} from './Config';
import Table from './Routes/Table';
import Types from './Routes/Types';

const app = express();
const storage: multer.StorageEngine = multer.memoryStorage();
const uploader: multer.Multer = multer({storage: storage});

app.use(cors());
app.use(express.json());
mongoose.connect(atlasUri)
    .catch((err) => {
      console.error(err.stack);
      process.exit(1);
    })
    .then(async (client) => {
      (<mongoose.Mongoose>global.mongooseClient) = client;

      app.get('/types', Types.get);

      app.get('/fields/:project', Fields.get);
      app.post('/fields/:project', Fields.post);

      app.get('/projects', Projects.get);
      app.post('/projects', uploader.single('csv'), Projects.post);

      app.get('/table/:project', Table.get);
      app.post('/table/:project/:id', Table.post);

      app.listen(port, () => {
        console.log(`Listening at http://localhost:${port}`);
      });
    });
