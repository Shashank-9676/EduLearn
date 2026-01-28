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

  // Check if token is valid on mount
  useEffect(() => {
     const checkAuth = async () => {
         if (userDetails) {
             try {
                 const response = await fetch(`${import.meta.env.VITE_API_URL}/api/profile`, {
                     credentials: 'include'
                 });
                 if (!response.ok) {
                     // Token expired or invalid
                     setUserDetails(null);
                     localStorage.removeItem("userDetails");
                 }
             } catch (error) {
                 console.error("Auth check failed:", error);
                 // Optionally clear auth on connection error if stringent, but maybe safer to rely on status code
                 // For now, only clear if we get a response indicating failure
                 // setUserDetails(null); 
             }
         }
     };
     checkAuth();
  }, []); // Run once on mount
  return (
    <AuthContext.Provider value={{ userDetails, setUserDetails }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
