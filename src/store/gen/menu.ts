import { api } from "../emptyApi";
export const addTagTypes = ["menu-controller"] as const;
const injectedRtkApi = api
  .enhanceEndpoints({
    addTagTypes,
  })
  .injectEndpoints({
    endpoints: (build) => ({
      getById: build.query<GetByIdApiResponse, GetByIdApiArg>({
        query: (queryArg) => ({ url: `/menu/${queryArg.id}` }),
        providesTags: ["menu-controller"],
      }),
      update: build.mutation<UpdateApiResponse, UpdateApiArg>({
        query: (queryArg) => ({
          url: `/menu/${queryArg.id}`,
          method: "PUT",
          body: queryArg.menuItemRequest,
        }),
        invalidatesTags: ["menu-controller"],
      }),
      deleteMenuById: build.mutation<
        DeleteMenuByIdApiResponse,
        DeleteMenuByIdApiArg
      >({
        query: (queryArg) => ({
          url: `/menu/${queryArg.id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["menu-controller"],
      }),
      getAll1: build.query<GetAll1ApiResponse, GetAll1ApiArg>({
        query: () => ({ url: `/menu` }),
        providesTags: ["menu-controller"],
      }),
      create1: build.mutation<Create1ApiResponse, Create1ApiArg>({
        query: (queryArg) => ({
          url: `/menu`,
          method: "POST",
          body: queryArg.menuItemRequest,
        }),
        invalidatesTags: ["menu-controller"],
      }),
      getByCategory: build.query<GetByCategoryApiResponse, GetByCategoryApiArg>(
        {
          query: (queryArg) => ({ url: `/menu/category/${queryArg.category}` }),
          providesTags: ["menu-controller"],
        },
      ),
      getAvailable: build.query<GetAvailableApiResponse, GetAvailableApiArg>({
        query: () => ({ url: `/menu/available` }),
        providesTags: ["menu-controller"],
      }),
    }),
    overrideExisting: false,
  });
export { injectedRtkApi as enhancedApi };
export type GetByIdApiResponse = /** status 200 OK */ MenuItemResponse;
export type GetByIdApiArg = {
  id: number;
};
export type UpdateApiResponse = /** status 200 OK */ MenuItemResponse;
export type UpdateApiArg = {
  id: number;
  menuItemRequest: MenuItemRequest;
};
export type DeleteMenuByIdApiResponse = unknown;
export type DeleteMenuByIdApiArg = {
  id: number;
};
export type GetAll1ApiResponse = /** status 200 OK */ MenuItemResponse[];
export type GetAll1ApiArg = void;
export type Create1ApiResponse = /** status 200 OK */ MenuItemResponse;
export type Create1ApiArg = {
  menuItemRequest: MenuItemRequest;
};
export type GetByCategoryApiResponse = /** status 200 OK */ MenuItemResponse[];
export type GetByCategoryApiArg = {
  category: string;
};
export type GetAvailableApiResponse = /** status 200 OK */ MenuItemResponse[];
export type GetAvailableApiArg = void;
export type MenuItemResponse = {
  id?: number;
  name?: string;
  category?: string;
  price?: number;
  available?: boolean;
};
export type MenuItemRequest = {
  name: string;
  category: string;
  price: number;
  available?: boolean;
};
export const {
  useGetByIdQuery,
  useUpdateMutation,
  useDeleteMenuByIdMutation,
  useGetAll1Query,
  useCreate1Mutation,
  useGetByCategoryQuery,
  useGetAvailableQuery,
} = injectedRtkApi;
