const { ApolloServer } = require("apollo-server");

// connect to the database
const mongoose = require("mongoose");

const resolvers = require("./graphql/resolvers");
const typeDefs = require("./graphql/typeDefs");
// const Post = require("./models/Posts");
const { MONGODB } = require("./config");

// const pubsub = new PubSub();

const server = new ApolloServer({
  typeDefs: typeDefs,
  resolvers: resolvers,
  context: ({ req }) => ({ req }),
});

mongoose
  .connect(MONGODB, { useNewUrlParser: true })
  .then(() => {
    console.log("DB Connected !!!");
    return server.listen({ port: 5000 });
  })
  .then((res) => {
    console.log(`Server Running at PORT ${res.url}`);
  });
