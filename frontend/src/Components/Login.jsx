import React, { useState } from "react";
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Stack,
  Box,
  Heading,
  useToast,
} from "@chakra-ui/react";
import { BASE_URL } from "../App";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      toast({
        title: "Error",
        description: "Both fields are required.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        localStorage.setItem("access_token", data.access_token); // Store JWT

        toast({
          title: "Success",
          description: "Login successful!",
          status: "success",
          duration: 2000,
          isClosable: true,
        });

        // Delay navigation slightly to ensure token is stored
        setTimeout(() => {
          window.location.href = "/"; // full reload with auth token
        }, 200); // 200ms delay
      } else {
        toast({
          title: "Login Failed",
          description: data.error || "Invalid credentials.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      setLoading(false);
      toast({
        title: "Network Error",
        description: "Unable to connect. Please try again later.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box maxW="md" mx="auto" mt={10} p={6} borderWidth={1} borderRadius="lg">
      <Heading as="h2" size="xl" mb={6} textAlign="center">
        Login
      </Heading>
      <form onSubmit={handleLogin}>
        <Stack spacing={4}>
          <FormControl isRequired>
            <FormLabel>Username</FormLabel>
            <Input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </FormControl>
          <Button
            type="submit"
            colorScheme="blue"
            width="full"
            isLoading={loading}
          >
            Login
          </Button>
        </Stack>
      </form>
    </Box>
  );
};

export default Login;
