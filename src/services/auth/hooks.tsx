import { useDispatch } from "react-redux";
import { useFormActions } from "../form/hooks";
import { useLazyGetProfileQuery } from "../profile/api";
import { useLoginMutation } from "./api";
import { signin, session as setSession } from "./slice";
import { useAppSelector } from "@/hooks";
import type { LoginRequest } from "../types";

export const useAuth = () => {
  const dispatch = useDispatch();
  const currentSession = useAppSelector((s) => s.auth.session);

  const { failureWithTimeout } = useFormActions();

  const [signinMutation, signinResult] = useLoginMutation();
  const [getProfile] = useLazyGetProfileQuery();

  /**
   * Muat profil user dari GET /profile/me dan perbarui `user` pada session
   * (access_token & brand tetap). Dipanggil setelah login / saat app boot
   * (user sudah authenticated).
   * Gagal (network/500) → silent, session tersimpan tetap dipakai;
   * 401/403 ditangani baseQuery (auto signout).
   */
  const loadProfile = async () => {
    try {
      const res = await getProfile(undefined).unwrap();
      if (res && currentSession) {
        dispatch(
          setSession({
            ...currentSession,
            user: { ...currentSession.user, ...res },
          }),
        );
      }
    } catch {
      // silent fail
    }
  };

  const doSignin = async (payload: LoginRequest) => {
    try {
      const res = await signinMutation(payload).unwrap();

      if (res?.message === "success") {
        dispatch(signin(res?.data));
        // Muat profile (/profile/me) setelah login — pastikan session lengkap
        // sebelum app pindah ke route protected.
        await loadProfile();
      }
    } catch (err) {
      failureWithTimeout(err);
    }
  };

  return {
    doSignin,
    signinResult,
    loadProfile,
  };
};
