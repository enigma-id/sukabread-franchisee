import {
  useLazyGetCatalogQuery,
  useUpdateCatalogMutation,
  useActivateCatalogMutation,
  useDeactivateCatalogMutation,
} from "./api";
import { createCrudHook } from "../hooks/createCrudHook";
import type { CatalogOutlet } from "../types/catalog";

export const useCatalog = createCrudHook<CatalogOutlet>({
  useLazyGetQuery: useLazyGetCatalogQuery,
  useUpdateMutation: useUpdateCatalogMutation,
  entityName: "catalog",
  customOperations: {
    activate: {
      hook: useActivateCatalogMutation,
    },
    deactivate: {
      hook: useDeactivateCatalogMutation,
    },
  },
});
