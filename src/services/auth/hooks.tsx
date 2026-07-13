import { useDispatch } from "react-redux";
import { useFormActions } from "../form/hooks";
import { useLoginMutation } from "./api";
import { signin } from "./slice";
import type { LoginRequest } from "../types";

export const useAuth = () => {
  const dispatch = useDispatch();

  const { failureWithTimeout } = useFormActions();

  const [signinMutation, signinResult] = useLoginMutation();

  const doSignin = async (payload: LoginRequest) => {
    try {
      const res = await signinMutation(payload).unwrap();

      if (res?.message === "success") {
        dispatch(signin(res?.data));
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
