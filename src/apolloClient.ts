// Remove the apollo-boost import and change to this:
import ApolloClient from "apollo-client";
// Setup the network "links"
import { WebSocketLink } from "apollo-link-ws";
import { HttpLink } from "apollo-link-http";
import { split } from "apollo-link";
import { getMainDefinition } from "apollo-utilities";
import { InMemoryCache } from "apollo-cache-inmemory";

const httpUrl = `${process.env.REACT_APP_GQL_ENDPOINT}/v1/graphql`;

const httpLink = new HttpLink({
  uri: httpUrl, // use https for secure endpoint
  headers: {
    "x-hasura-admin-secret": process.env.REACT_APP_HASURA_ADMIN_SECRET,
  },
});

// Create a WebSocket link:
const wsLink = new WebSocketLink({
  uri: `ws://beloved-hippo-25.hasura.app/v1/graphql`, // use wss for a secure endpoint
  options: {
    reconnect: true,
    connectionParams: {
      headers: {
        "x-hasura-admin-secret": process.env.REACT_APP_HASURA_ADMIN_SECRET,
      },
    },
  },
});

const link = split(
  // split based on operation type
  ({ query }) => {
    const { kind, operation }: any = getMainDefinition(query);
    return kind === "OperationDefinition" && operation === "subscription";
  },
  wsLink,
  httpLink
);

const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});

export { client };
