const express = require('express');
const app = express();
const port = 8080;
const cors = require('cors');
const contentsRoutes = require('./src/routes/contents.routes');
const collectionsRoutes = require('./src/routes/collections.routes');

app.use(express.json());
app.use(cors());

app.use('/contents', contentsRoutes);
app.use('/collections', collectionsRoutes);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});