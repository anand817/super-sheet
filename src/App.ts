import express from 'express';
import cors from 'cors';

import Home from './Routes/Home';

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

app.get('/', Home.get);

app.listen(port, () => {
  return console.log(`Listening at http://localhost:${port}`);
});
