import React, { useState } from "react";
import {
  Button,
  FormControl,
  FormLabel,
  ModalBody,
  ModalHeader,
  ModalContent,
  ModalCloseButton,
  ModalOverlay,
  Flex,
  useDisclosure,
  Modal,
  Input,
  Textarea,
  RadioGroup,
  Radio,
  ModalFooter,
  useToast,
  IconButton,
} from "@chakra-ui/react";
import { BiAddToQueue } from "react-icons/bi";
import { BASE_URL } from "../App";

const CreateUserModel = ({ setUsers }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLoading, setIsLoading] = useState(false);
  const [inputs, setInputs] = useState({
    name: "",
    role: "",
    description: "",
    gender: "",
  });

  const toast = useToast();

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = localStorage.getItem("access_token");

      const res = await fetch(BASE_URL + "/friends", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ✅ Include token here
        },
        body: JSON.stringify(inputs),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create friend");
      }

      toast({
        status: "success",
        title: "Friend Added 🎉",
        description: "New friend created successfully.",
        duration: 3000,
        position: "top-right",
        isClosable: true,
      });

      onClose();
      setUsers((prevUsers) => [...prevUsers, data]);

      setInputs({
        name: "",
        role: "",
        description: "",
        gender: "",
      });
    } catch (error) {
      toast({
        status: "error",
        title: "Error",
        description: error.message,
        duration: 4000,
        position: "top-right",
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <IconButton
        icon={<BiAddToQueue size={20} />}
        colorScheme="teal"
        onClick={onOpen}
        aria-label="Add Friend"
      />
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <form onSubmit={handleCreateUser}>
          <ModalContent>
            <ModalHeader>Add New Connection 🤝</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <Flex gap={4} flexWrap="wrap">
                <FormControl isRequired flex="1">
                  <FormLabel>Full Name</FormLabel>
                  <Input
                    placeholder="Jane Doe"
                    value={inputs.name}
                    onChange={(e) =>
                      setInputs({ ...inputs, name: e.target.value })
                    }
                  />
                </FormControl>

                <FormControl isRequired flex="1">
                  <FormLabel>Role</FormLabel>
                  <Input
                    placeholder="UI/UX Designer"
                    value={inputs.role}
                    onChange={(e) =>
                      setInputs({ ...inputs, role: e.target.value })
                    }
                  />
                </FormControl>
              </Flex>

              <FormControl mt={4}>
                <FormLabel>Description</FormLabel>
                <Textarea
                  resize="none"
                  placeholder="Tell something interesting about your friend..."
                  value={inputs.description}
                  onChange={(e) =>
                    setInputs({ ...inputs, description: e.target.value })
                  }
                />
              </FormControl>

              <FormControl mt={4}>
                <FormLabel>Gender</FormLabel>
                <RadioGroup
                  value={inputs.gender}
                  onChange={(value) =>
                    setInputs({ ...inputs, gender: value })
                  }
                >
                  <Flex gap={5}>
                    <Radio value="male">Male</Radio>
                    <Radio value="female">Female</Radio>
                    <Radio value="other">Other</Radio>
                  </Flex>
                </RadioGroup>
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button
                colorScheme="teal"
                type="submit"
                isLoading={isLoading}
                mr={3}
              >
                Add Friend
              </Button>
              <Button onClick={onClose}>Cancel</Button>
            </ModalFooter>
          </ModalContent>
        </form>
      </Modal>
    </>
  );
};

export default CreateUserModel;
