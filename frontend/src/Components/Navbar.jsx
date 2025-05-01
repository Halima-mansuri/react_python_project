import React from 'react'
import { Container, Box, Flex, Text, Button, useColorMode} from '@chakra-ui/react';
import { IoMoon } from "react-icons/io5";
import { LuSun } from "react-icons/lu";
import CreateUserModel from './CreateUserModel';

const Navbar = ({setUsers}) => {
  const { colorMode, toggleColorMode } = useColorMode()
  return (
    <Container maxW={"900px"}>
        <Box
        px={4}
        my={4}
        borderRadius={5}
        bg={'gray.400'}
        >
            <Flex h="16"
                alignItems={"center"}
                justifyContent={"space-between"}
            >
                {/* Left side */}
                <Flex 
                alignItems={"center"}
                justifyContent={"center"}
                gap={3}
                display={{base:"none",sm:"flex"}}
                
                >
                    <img src='/react.png' alt='React Logo' width={50} height={50} />
                    <Text fontSize={"40px"}>+</Text>
                    <img src='/python.png' alt='Python Logo' width={50} height={40} />
                    <Text fontSize={"40px"}>=</Text>
                    <img src='/emoji.png' alt='Explode Head' width={45} height={45} />
                </Flex>
                {/* Right side */}
                <Flex gap={3} alignItems={"center"}>
                    <Text fontSize={"lg"} fontWeight={500} display={{base: "none", md: "block"}}>
                        BFF Ship
                    </Text>
                    <Button onClick={toggleColorMode}>
                        {colorMode === "light" ? <IoMoon/> : <LuSun size={20} />}
                    </Button>
                    <CreateUserModel setUsers={setUsers} />
                </Flex>
            </Flex>
        </Box>
    </Container>
  )
}

export default Navbar
