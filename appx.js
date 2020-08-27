const express = require('express');
const bodyParser = require('body-parser');
// const graphqlHttp = require('express-graphql');
const graphQlSchema = require('./graphql/schema/index');
const graphQlResolvers = require('./graphql/resolvers/index');

const dotenv = require("dotenv");
dotenv.config();

const mongoose = require('mongoose');
const mongodb = require('mongodb');
const app = express();
const server = require('http').Server(app);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(
  '/graphql',
  graphqlHttp({
    schema: graphQlSchema,
    rootValue: graphQlResolvers,
    graphiql: true
  })
);

// mongoose.connect(`mongodb+srv://${process.env.ATLAS_A}:${process.env.ATLAS_B}@${process.env.ATLAS_C}/test?retryWrites=true&w=majority`,
mongoose.connect('mongodb://localhost:<my_local_db>',
{useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => {
    console.log(`
      DB connected... Now Serving on Port: ${process.env.PORT}
      `);
    app.listen(process.env.PORT);
  })
  .catch(err => {
    console.log(err);
});

app.use(
  express.static(path.join(__dirname, "./frontend/build"))
);
app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, 'frontend', 'build', 'index.html'));
});
