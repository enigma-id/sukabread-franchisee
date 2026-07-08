import { useDispatch } from "react-redux";
import { useFormActions } from "../form/hooks";
import { useLoginMutation } from "./api";
import { signin } from "./slice";
import type { LoginResponseData } from "../types";

export const useAuth = () => {
  const dispatch = useDispatch();

  const { failureWithTimeout } = useFormActions();

  const [signinMutation, signinResult] = useLoginMutation();

  const doSignin = async (payload: { phone: string; password: string }) => {
    try {
      const res = await signinMutation(payload).unwrap();

      if (res?.message === "success") {
        const data = res?.data as LoginResponseData;
        dispatch(
          signin({
            access_token: data.token,
            user: data.user,
            outlet: data.outlet,
          }),
        );
      }
    } catch (err) {
      failureWithTimeout(err);
    }
  };

  return {
    doSignin,
    signinResult,
  };
};
