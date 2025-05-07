import React, { useState, useEffect, useCallback } from "react";
import {
  Flex,
  Grid,
  Text,
  Spinner,
  Icon,
  Fade,
} from "@chakra-ui/react";
import { FaUserFriends } from "react-icons/fa";
import { BASE_URL } from "../App";
import UserCard from "./UserCard";
import { keyframes } from "@emotion/react";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const UserGrid = ({ users, setUsers }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const fetchFriends = useCallback(async () => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      console.warn("No access token found.");
      setHasError(true);
      return;
    }

    setIsLoading(true);
    setHasError(false);

    try {
      const res = await fetch(`${BASE_URL}/friends`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to fetch friends");
      }

      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error("Fetch error:", error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  }, [setUsers]);

  // Trigger fetch when token becomes available
  useEffect(() => {
    fetchFriends();
  }, [fetchFriends]);

  return (
    <>
      <Grid
        templateColumns={{
          base: "1fr",
          md: "repeat(2, 1fr)",
          lg: "repeat(3, 1fr)",
        }}
        gap={6}
        mt={4}
        animation={`${fadeIn} 0.5s ease-in`}
      >
        {users.map((user, idx) => (
          <Fade in={!isLoading} key={user.id} delay={idx * 0.1}>
            <UserCard user={user} setUsers={setUsers} refreshFriends={fetchFriends} />
          </Fade>
        ))}
      </Grid>

      {isLoading && (
        <Flex justifyContent="center" mt={8}>
          <Spinner size="xl" thickness="4px" speed="0.65s" color="teal.500" />
        </Flex>
      )}

      {!isLoading && hasError && (
        <Flex direction="column" align="center" justify="center" mt={10}>
          <Text fontSize="lg" color="red.500">
            Failed to load friends. Please try again.
          </Text>
        </Flex>
      )}

      {!isLoading && !hasError && users.length === 0 && (
        <Flex
          direction="column"
          alignItems="center"
          justifyContent="center"
          mt={10}
        >
          <Icon as={FaUserFriends} boxSize={12} color="gray.400" mb={4} />
          <Text fontSize="2xl" fontWeight="bold">
            No Friends Yet 😢
          </Text>
          <Text color="gray.500">
            Start adding new friends to see them here!
          </Text>
        </Flex>
      )}
    </>
  );
};

export default UserGrid;
