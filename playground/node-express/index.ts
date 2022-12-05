import './readEnv';
import clerk, { users } from '@clerk/clerk-sdk-node';
import express, { Express, Request, Response } from 'express';

const test = async () => {
  console.log('getUserList' in users);
  console.log((await users.getUserList()).map(u => u.id));
  console.log('users' in clerk);
  console.log((await clerk.users.getUserList()).map(u => u.id));
};

test();

const app: Express = express();
const port = process.env.PORT;

app.get('/', (req: Request, res: Response) => {
  res.send({ type: 'module ' });
});

// app.listen(port, () => {
//   console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
// });
