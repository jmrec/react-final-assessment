import { api } from "../emptyApi";
export const addTagTypes = ["order-controller"] as const;
const injectedRtkApi = api
  .enhanceEndpoints({
    addTagTypes,
  })
  .injectEndpoints({
    endpoints: (build) => ({
      getAll: build.query<GetAllApiResponse, GetAllApiArg>({
        query: () => ({ url: `/orders` }),
        providesTags: ["order-controller"],
      }),
      create: build.mutation<CreateApiResponse, CreateApiArg>({
        query: (queryArg) => ({
          url: `/orders`,
          method: "POST",
          body: queryArg.orderRequest,
        }),
        invalidatesTags: ["order-controller"],
      }),
      markReady: build.mutation<MarkReadyApiResponse, MarkReadyApiArg>({
        query: (queryArg) => ({
          url: `/orders/${queryArg.id}/ready`,
          method: "POST",
        }),
        invalidatesTags: ["order-controller"],
      }),
      markPaid: build.mutation<MarkPaidApiResponse, MarkPaidApiArg>({
        query: (queryArg) => ({
          url: `/orders/${queryArg.id}/pay`,
          method: "POST",
        }),
        invalidatesTags: ["order-controller"],
      }),
      getById1: build.query<GetById1ApiResponse, GetById1ApiArg>({
        query: (queryArg) => ({ url: `/orders/${queryArg.id}` }),
        providesTags: ["order-controller"],
      }),
    }),
    overrideExisting: false,
  });
export { injectedRtkApi as enhancedApi };
export type GetAllApiResponse = /** status 200 OK */ OrderResponse[];
export type GetAllApiArg = void;
export type CreateApiResponse = /** status 200 OK */ OrderResponse;
export type CreateApiArg = {
  orderRequest: OrderRequest;
};
export type MarkReadyApiResponse = /** status 200 OK */ OrderResponse;
export type MarkReadyApiArg = {
  id: number;
};
export type MarkPaidApiResponse = /** status 200 OK */ OrderResponse;
export type MarkPaidApiArg = {
  id: number;
};
export type GetById1ApiResponse = /** status 200 OK */ OrderResponse;
export type GetById1ApiArg = {
  id: number;
};
export type OrderResponse = {
  id?: number;
  itemIds?: number[];
  status?: string;
  total?: number;
};
export type OrderRequest = {
  itemIds: number[];
};
export const {
  useGetAllQuery,
  useCreateMutation,
  useMarkReadyMutation,
  useMarkPaidMutation,
  useGetById1Query,
} = injectedRtkApi;
