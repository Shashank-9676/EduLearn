import { createContext, useContext, useState ,useEffect} from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const storedUser = localStorage.getItem("userDetails");
  const initialUser = storedUser ? JSON.parse(storedUser) : null;

  const [userDetails, setUserDetails] = useState(initialUser);

  // Whenever userDetails changes, update localStorage
  useEffect(() => {
    if (userDetails) {
      localStorage.setItem("userDetails", JSON.stringify(userDetails));
    } else {
      localStorage.removeItem("userDetails"); // clear if null
    }
  }, [userDetails]);
  return (
    <AuthContext.Provider value={{ userDetails, setUserDetails }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
