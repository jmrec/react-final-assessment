import type { ConfigFile } from "@rtk-query/codegen-openapi";

const config: ConfigFile = {
  schemaFile: "http://localhost:8080/v3/api-docs",
  apiFile: "./src/store/emptyApi.ts",
  outputFiles: {
    "./src/store/gen/menu.ts": {
      filterEndpoints: (endpointName, operationDefinition) =>
        /menu/i.test(endpointName) ||
        operationDefinition.path.includes("/menu"),
    },
    "./src/store/gen/orders.ts": {
      filterEndpoints: (endpointName, operationDefinition) =>
        /orders/i.test(endpointName) ||
        operationDefinition.path.includes("/orders"),
    },
    "./src/store/gen/agent.ts": {
      filterEndpoints: (endpointName, operationDefinition) =>
        /agent/i.test(endpointName) ||
        operationDefinition.path.includes("/agent"),
    },
  },
  hooks: true,
  tag: true,
};

export default config;
