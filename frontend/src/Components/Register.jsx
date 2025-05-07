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

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!username || !email || !password) {
      toast({
        title: "Error",
        description: "All fields are required.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        toast({
          title: "Success",
          description: "Registration successful. Please log in.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        navigate("/login");
      } else {
        toast({
          title: "Error",
          description: data.error || "Something went wrong!",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      setLoading(false);
      toast({
        title: "Error",
        description: "Network error. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box maxW="md" mx="auto" mt={10} p={6} borderWidth={1} borderRadius="lg">
      <Heading as="h2" size="xl" mb={6} textAlign="center">
        Register
      </Heading>
      <form onSubmit={handleRegister}>
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
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
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
            Register
          </Button>
        </Stack>
      </form>
    </Box>
  );
};

export default Register;
