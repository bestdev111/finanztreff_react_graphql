import {ApolloClient, InMemoryCache, createHttpLink, ApolloLink, split} from '@apollo/client';
import Keycloak from "keycloak-js";
import {NextLink, Operation} from "@apollo/client/link/core/types";
import {getMainDefinition, relayStylePagination} from "@apollo/client/utilities";
import {WebSocketLink} from "@apollo/client/link/ws";
import {SubscriptionClient} from "subscriptions-transport-ws";

export function creatApolloClient(keycloak: Keycloak.KeycloakInstance) {
  const httpLink = createHttpLink({
    uri: '/graphql',
  });

  const wsLink = new WebSocketLink(
        new SubscriptionClient(
            (window.location.protocol == "https:" ? "wss://" : "ws://")+ window.location.host + "/websocket",
        {  reconnect: false })
  );

  const withToken = new ApolloLink((operation: Operation, forward: NextLink) => {
    if (keycloak.token) {
      operation.setContext({
        // headers: {"JWT-Assert": `Bearer ${keycloak.token}`}
        headers: {"JWT-Assert": keycloak.token}
      });
    }
    return forward(operation);
  });

  const splitLink = split(
      ({ query }) => {
        const definition = getMainDefinition(query);
        return (
            definition.kind === 'OperationDefinition' &&
            definition.operation === 'subscription'
        );
      },
      withToken.concat(wsLink),
      withToken.concat(httpLink),
  );

  return new ApolloClient({
    link: splitLink,
    defaultOptions: {query : {errorPolicy: "ignore"}},
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            searchDerivative: relayStylePagination(["criterion", "sort"]),
            search: relayStylePagination(["criteria"]),
            newsSearch: relayStylePagination(["criteria"]),
            analysisSearch: relayStylePagination(["criteria"]),
            searchShare: relayStylePagination(["criterion", "sort"]),
            searchIndex: relayStylePagination(["criteria"]),
            searchFund: relayStylePagination(["criterion", "sort"]),
            searchEtf: relayStylePagination(["criterion", "sort"]),
            searchBond: relayStylePagination(["criterion", "sort"]),
            searchCrossRate: relayStylePagination(["criteria"]),
          }
        },
        SnapQuote: {
          keyFields: ["instrumentId"],
        },
        User: {
          keyFields: ["username"],
        },
        News: {
          merge: true,
        },
        InstrumentGroup: {
          fields: {
            analysis: relayStylePagination(["criteria"]),
          }
        },
        Instrument: {
          fields: {
            snapQuote: {
              merge: (existing, incoming, cache) => {
                if ((cache.readField("lastChange", existing) || "").toString() > (cache.readField("lastChange", incoming) || "").toString())
                  return existing;
                return incoming;
              }
            }
          }
        }
      }
    })
  });
}
