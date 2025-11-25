import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("currentUser")) || null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (user) localStorage.setItem("currentUser", JSON.stringify(user));
    else localStorage.removeItem("currentUser");
  }, [user]);

  // Allowed users
  const allowedUsers = [
    { role: "admin", email: "admin@gmail.com", password: "admin123" },
    { role: "employee", email: "employee@gmail.com", password: "emp123" }
  ];

  const signIn = ({ email, password }) => {
    const matched = allowedUsers.find(
      (u) => u.email === email && u.password === password
    );

    if (!matched) throw new Error("Invalid credentials");

    // Save only safe data
    setUser({
      email: matched.email,
      role: matched.role
    });

    return matched;
  };

  const signOut = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthContext = () => useContext(AuthContext);
export default function useAuth() {
  return useAuthContext();
}
