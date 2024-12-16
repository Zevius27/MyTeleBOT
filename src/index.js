import { Handler } from '../Controller/index.js';
import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.get('*', async (req, res) => {
  console.log(req.body);
  console.log('GET');
  res.send(await Handler(req));
});

app.post('*', async (req, res) => {
  console.log(req.body);
  console.log('POST');
  res.send(await Handler(req));
});

app.listen(port, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log(`Server is running on port ${port}`);
  }
});

export { app };
