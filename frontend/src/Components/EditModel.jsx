import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Textarea,
  useDisclosure,
  useToast,
  RadioGroup,
  Radio,
} from "@chakra-ui/react";
import { BiEditAlt } from "react-icons/bi";
import { useState } from "react";
import { BASE_URL } from "../App";

function EditModal({ setUsers, user }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLoading, setIsLoading] = useState(false);
  const [inputs, setInputs] = useState({
    name: user.name || "",
    role: user.role || "",
    description: user.description || "",
    gender: user.gender || "",
  });
  const toast = useToast();

  const handleEditUser = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const token = localStorage.getItem("access_token");

      const res = await fetch(BASE_URL + "/friends/" + user.id, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ✅ Include token
        },
        body: JSON.stringify(inputs),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update friend");
      }

      setUsers((prevUsers) =>
        prevUsers.map((u) => (u.id === user.id ? data : u))
      );

      toast({
        status: "success",
        title: "Yayy!🎉",
        description: "Friend Updated Successfully.",
        duration: 2000,
        position: "top-center",
      });

      onClose();
    } catch (error) {
      toast({
        status: "error",
        title: "An error occurred.",
        description: error.message,
        duration: 4000,
        position: "top-center",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <IconButton
        onClick={onOpen}
        variant="ghost"
        colorScheme="blue"
        aria-label="Edit Friend"
        size={"sm"}
        icon={<BiEditAlt size={20} />}
      />

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <form onSubmit={handleEditUser}>
          <ModalContent>
            <ModalHeader>My new BFF 😍</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <Flex alignItems={"center"} gap={4}>
                <FormControl>
                  <FormLabel>Full Name</FormLabel>
                  <Input
                    placeholder="John Doe"
                    value={inputs.name}
                    onChange={(e) =>
                      setInputs((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Role</FormLabel>
                  <Input
                    placeholder="Software Engineer"
                    value={inputs.role}
                    onChange={(e) =>
                      setInputs((prev) => ({
                        ...prev,
                        role: e.target.value,
                      }))
                    }
                  />
                </FormControl>
              </Flex>

              <FormControl mt={4}>
                <FormLabel>Description</FormLabel>
                <Textarea
                  resize={"none"}
                  overflowY={"hidden"}
                  placeholder="He is a software engineer who loves to code and build things."
                  value={inputs.description}
                  onChange={(e) =>
                    setInputs((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                />
              </FormControl>

              <FormControl mt={4}>
                <FormLabel>Gender</FormLabel>
                <RadioGroup
                  value={inputs.gender}
                  onChange={(value) =>
                    setInputs((prev) => ({ ...prev, gender: value }))
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
                colorScheme="blue"
                mr={3}
                type="submit"
                isLoading={isLoading}
              >
                Update
              </Button>
              <Button onClick={onClose}>Cancel</Button>
            </ModalFooter>
          </ModalContent>
        </form>
      </Modal>
    </>
  );
}

export default EditModal;
