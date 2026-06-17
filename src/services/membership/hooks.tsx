import {
  useLazyGetMembershipLogsQuery,
  useLazyGetMembershipQuery,
  useLazyShowMembershipQuery,
} from "./api";
import { createCrudHook } from "../hooks/createCrudHook";

export const useMembership = createCrudHook({
  entityName: "membership",
  useLazyGetQuery: useLazyGetMembershipQuery,
  useLazyShowQuery: useLazyShowMembershipQuery,
  additionalQueries: {
    getLog: useLazyGetMembershipLogsQuery,
  },
});
