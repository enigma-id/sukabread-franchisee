import { useLazyGetIngredientQuery } from "./api";
import { createCrudHook } from "../hooks/createCrudHook";
import type { Ingredient } from "../types";

export const useIngredient = createCrudHook<Ingredient>({
  useLazyGetQuery: useLazyGetIngredientQuery,
  entityName: "ingredient",
});
