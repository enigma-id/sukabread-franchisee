import {
  useLazyGetStockQuery,
} from "./api";
import { createCrudHook } from "../hooks/createCrudHook";

export const useStock = createCrudHook({
  useLazyGetQuery: useLazyGetStockQuery,
  entityName: "stock",
});
