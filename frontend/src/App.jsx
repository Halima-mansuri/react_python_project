import {
  Container,
  Stack,
  Text,
  Box,
  Divider,
  useColorModeValue,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";

import Navbar from "./Components/Navbar";
import UserGrid from "./Components/UserGrid";
import Register from "./Components/Register";
import Login from "./Components/Login";

// export const BASE_URL =
//   import.meta.env.MODE === "development"
//     ? "http://127.0.0.1:5000/api"
//     : "https://react-python-project-tzr1.onrender.com/api";

export const BASE_URL = "http://127.0.0.1:5000/api";

function App() {
  const [users, setUsers] = useState([]);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const bg = useColorModeValue("gray.50", "gray.800");

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      setIsAuthenticated(true);
    }
    setIsAuthReady(true); // flag that app finished checking
  }, []);

  return (
    <Router>
      <Stack minH="100vh" bg={bg}>
        <Navbar setUsers={setUsers} />

        <Container maxW="1200px" mt={8}>
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <Box textAlign="center" mb={10}>
                    <Text
                      fontSize={{ base: "3xl", md: "4xl" }}
                      fontWeight="extrabold"
                      letterSpacing="wider"
                      textTransform="uppercase"
                      bgGradient="linear(to-r, teal.400, blue.500)"
                      bgClip="text"
                    >
                      The Bond Board 🧑‍🤝‍🧑💞
                    </Text>
                    <Text fontSize="lg" color="gray.500">
                      All your friends in one place. Add more & build your BFF network!
                    </Text>
                  </Box>

                  <Divider mb={6} />

                  {/* Only render if auth check is done */}
                  {isAuthReady ? (
                    isAuthenticated ? (
                      <UserGrid users={users} setUsers={setUsers} />
                    ) : (
                      <Box textAlign="center">
                        <Text>Please log in to view your friends.</Text>
                      </Box>
                    )
                  ) : (
                    <Box textAlign="center">
                      <Text>Checking login status...</Text>
                    </Box>
                  )}
                </>
              }
            />

            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </Container>
      </Stack>
    </Router>
  );
}

export default App;
