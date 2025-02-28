import { createContext, ReactNode, useContext } from "react";
import { User as SelectUser } from "@shared/schema";

// Mock user for testing UI components
const mockUser: SelectUser = {
  id: 1,
  username: "testuser",
  userType: "professional",
  kycStatus: "pending",
  kycData: null,
  profileData: {
    skills: ["React", "Node.js", "TypeScript"],
    location: "Lisboa",
    preferredWorkType: "remote"
  },
  level: 1,
  points: 0,
  experience: 0,
  createdAt: new Date()
};

type AuthContextType = {
  user: SelectUser | null;
  isLoading: boolean;
  error: Error | null;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  // Return mock data for testing UI
  return (
    <AuthContext.Provider
      value={{
        user: mockUser,
        isLoading: false,
        error: null
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}