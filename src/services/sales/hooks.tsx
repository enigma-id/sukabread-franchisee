import { createCrudHook } from "../hooks/createCrudHook";
import {
  useLazyGetSessionQuery,
  useLazyShowSessionQuery,
  useLazyShowOrderQuery,
} from "./api";

export const useSession = createCrudHook({
  useLazyGetQuery: useLazyGetSessionQuery,
  useLazyShowQuery: useLazyShowSessionQuery,
  entityName: "session",
});

export const useOrder = createCrudHook({
  useLazyShowQuery: useLazyShowOrderQuery,
  entityName: "order",
});
