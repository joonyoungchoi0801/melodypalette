const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  // Here you would normally check the user's credentials with the database
  res.send({ message: 'Login successful' });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
