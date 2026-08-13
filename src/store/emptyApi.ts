import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const rawBaseQuery = fetchBaseQuery({ baseUrl: "http://localhost:8080" });

export const api = createApi({
  baseQuery: async (args, api, extraOptions) => {
    if (
      typeof args === "object" &&
      args !== null &&
      args.url?.startsWith("/agent")
    ) {
      return rawBaseQuery(
        { ...args, responseHandler: "text" },
        api,
        extraOptions,
      );
    }

    return rawBaseQuery(args, api, extraOptions);
  },
  endpoints: () => ({}),
});
