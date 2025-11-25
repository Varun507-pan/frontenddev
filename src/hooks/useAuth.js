import { useAuthContext } from "../context/AuthContext";

export default function useAuth() {
  const { user, signIn, signUp, signOut } = useAuthContext();
  return { user, signIn, signUp, signOut };
}
