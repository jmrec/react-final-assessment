import { api } from "../emptyApi";
export const addTagTypes = ["agent-controller"] as const;
const injectedRtkApi = api
  .enhanceEndpoints({
    addTagTypes,
  })
  .injectEndpoints({
    endpoints: (build) => ({
      ask: build.mutation<AskApiResponse, AskApiArg>({
        query: (queryArg) => ({
          url: `/agent`,
          method: "POST",
          body: queryArg.body,
        }),
        invalidatesTags: ["agent-controller"],
      }),
    }),
    overrideExisting: false,
  });
export { injectedRtkApi as enhancedApi };
export type AskApiResponse = /** status 200 OK */ string;
export type AskApiArg = {
  body: string;
};
export const { useAskMutation } = injectedRtkApi;
