import { useDispatch } from "react-redux";
import { useFormActions } from "../form/hooks";
import {
  useLoginMutation,
  useLazyGetMeQuery,
  useUpdateMeMutation,
} from "./api";
import { signin } from "./slice";
import { logger } from "@/utils/logger";

export const useAuth = () => {
  const dispatch = useDispatch();

  const { failureWithTimeout } = useFormActions();

  const [signinMutation, signinResult] = useLoginMutation();
  const [updateMeMutation, updateMeResult] = useUpdateMeMutation();
  const [triggerGetMe, getMeResult] = useLazyGetMeQuery();

  const doSignin = async (payload: { username: string; password: string }) => {
    try {
      const res = await signinMutation(payload).unwrap();

      console.log(res, "signin response");
      if (res?.status === "success") {
        dispatch(signin(res?.data));
        // doGetMe();
      }
    } catch (err) {
      failureWithTimeout(err);
    }
  };

  const doGetMe = async (params?: Record<string, unknown>) => {
    try {
      const res = await triggerGetMe(params).unwrap();
      if (res?.success) {
        // dispatch(setUser(res.data));
        // console.log(res, "respon me");
      }
    } catch (err) {
      logger.error("Failed to get profile", err);
      throw err;
    }
  };

  const doUpdateMe = async (payload: Record<string, unknown>) => {
    try {
      await updateMeMutation(payload).unwrap();
    } catch (err) {
      failureWithTimeout(err);
    }
  };

  return {
    doSignin,
    signinResult,
    doGetMe,
    getMeResult,
    doUpdateMe,
    updateMeResult,
  };
};
