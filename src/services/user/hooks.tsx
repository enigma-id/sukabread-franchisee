import {
  useLazyGetUserQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useActivateUserMutation,
  useDeactivateUserMutation,
  useLazyShowUserQuery,
  useRemoveUserMutation,
} from "./api";
import { createCrudHook } from "../hooks/createCrudHook";

export const useUser = createCrudHook({
  useLazyGetQuery: useLazyGetUserQuery,
  useLazyShowQuery: useLazyShowUserQuery,
  useCreateMutation: useCreateUserMutation,
  useUpdateMutation: useUpdateUserMutation,
  useRemoveMutation: useRemoveUserMutation,
  entityName: "user",
  customOperations: {
    activate: {
      hook: useActivateUserMutation,
    },
    deactivate: {
      hook: useDeactivateUserMutation,
    },
  },
});
