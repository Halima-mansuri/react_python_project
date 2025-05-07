import React from "react";
import {
  Card,
  IconButton,
  Avatar,
  useToast,
  Box,
  Text,
  Heading,
  CardHeader,
  Flex,
  CardBody,
  Badge,
  Tooltip,
} from "@chakra-ui/react";
import { BiTrash } from "react-icons/bi";
import { MdEdit } from "react-icons/md";
import EditModel from "./EditModel";
import { BASE_URL } from "../App";

const UserCard = ({ user, setUsers }) => {
  const toast = useToast();

  const handleDeleteUser = async () => {
    try {
      const token = localStorage.getItem("access_token");

      const res = await fetch(BASE_URL + "/friends/" + user.id, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`, // ✅ Include token here
        },
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error);
      }

      setUsers((prevUsers) => prevUsers.filter((u) => u.id !== user.id));

      toast({
        status: "success",
        title: "Friend removed",
        description: `${user.name} has been deleted.`,
        duration: 3000,
        position: "top-right",
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Oops! Something went wrong.",
        description: error.message,
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "top-right",
      });
    }
  };

  return (
    <Card
      p={4}
      boxShadow="lg"
      borderRadius="lg"
      transition="all 0.3s"
      _hover={{ transform: "scale(1.02)", boxShadow: "2xl" }}
      bgGradient="linear(to-bl, gray.100, white)"
    >
      <CardHeader>
        <Flex justify="space-between" align="center">
          {/* Left Side */}
          <Flex align="center" gap={4}>
            <Avatar name={user.name} src={user.imgUrl} size="lg" />
            <Box>
              <Heading size="md" color="blue.700">
                {user.name}
              </Heading>
              <Badge colorScheme="purple" mt={1}>
                {user.role}
              </Badge>
            </Box>
          </Flex>

          {/* Right Side */}
          <Flex gap={2}>
            <Tooltip label="Edit Friend" hasArrow>
              <Box>
                <EditModel user={user} setUsers={setUsers} />
              </Box>
            </Tooltip>

            <Tooltip label="Delete Friend" hasArrow>
              <IconButton
                icon={<BiTrash />}
                colorScheme="red"
                variant="ghost"
                size="sm"
                onClick={handleDeleteUser}
                aria-label="Delete Friend"
              />
            </Tooltip>
          </Flex>
        </Flex>
      </CardHeader>

      <CardBody pt={2}>
        <Text fontSize="sm" color="gray.700">
          {user.description || "No description added."}
        </Text>
      </CardBody>
    </Card>
  );
};

export default UserCard;
