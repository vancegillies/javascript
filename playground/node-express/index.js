const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const { users } = require('@clerk/clerk-sdk-node');
const clerk = require('@clerk/clerk-sdk-node').default;

const test = async () => {
  console.log('getUserList' in users);
  console.log((await users.getUserList()).map(u => u.id));
  console.log('users' in clerk);
  console.log((await clerk.users.getUserList()).map(u => u.id));
};

test();

const app = express();
const port = process.env.PORT;

app.get('/', (req, res) => {
  res.json({ test: 'yes' });
});

// app.listen(port, () => {
//   console.log(`[server]: Server is running at https://localhost:${port}`);
// });
