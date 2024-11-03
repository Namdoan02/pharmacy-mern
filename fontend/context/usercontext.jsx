import { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // State to track errors

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true); // Ensure loading is set to true at the start
      try {
        // Get token from local storage (or wherever you're storing it)
        const token = localStorage.getItem("token");

        const response = await fetch("http://localhost:5000/api/auth/profile", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Include the token in the headers
          },
          credentials: "include",
        });

        if (!response.ok) {
          const errorData = await response.json(); // Get error response
          throw new Error(errorData.message || "Failed to fetch profile");
        }

        const data = await response.json();
        console.log(data);

        if (data.success) {
          setUser(data.profile);
        } else {
          setError(data.message); // Set error if success is false
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        setError(error.message); // Update error state
      } finally {
        setLoading(false); // Always set loading to false at the end
      }
    };

    fetchProfile();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, loading, error }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContextProvider };
