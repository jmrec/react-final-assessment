import { api } from "../emptyApi";
const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    ask: build.mutation<AskApiResponse, AskApiArg>({
      query: (queryArg) => ({
        url: `/agent`,
        method: "POST",
        body: queryArg.body,
      }),
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
