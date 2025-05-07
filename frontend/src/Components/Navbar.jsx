import React from 'react';
import {
  Container,
  Box,
  Flex,
  Text,
  Button,
  useColorMode,
  Icon,
  useBreakpointValue,
} from '@chakra-ui/react';
import { IoMoon } from 'react-icons/io5';
import { LuSun } from 'react-icons/lu';
import { FaUserFriends } from 'react-icons/fa';
import CreateUserModel from './CreateUserModel';

const Navbar = ({ setUsers }) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const fontSize = useBreakpointValue({ base: 'xl', sm: '2xl', md: '3xl' });

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    window.location.reload(); // Or navigate to login route if using React Router
  };

  return (
    <Container maxW={'900px'}>
      <Box px={4} my={4} borderRadius={10} bg={'teal.400'} boxShadow="md">
        <Flex h="16" alignItems={'center'} justifyContent={'space-between'}>
          {/* Brand */}
          <Flex alignItems={'center'} gap={3}>
            <Icon as={FaUserFriends} w={8} h={8} color="white" />
            <Text
              fontSize={fontSize}
              fontWeight="bold"
              color="white"
              letterSpacing={1}
            >
              BFF Hub
            </Text>
          </Flex>

          {/* Right Side: Theme Toggle + Add Friend + Logout */}
          <Flex gap={3} alignItems={'center'}>
            <Text
              fontSize={'md'}
              fontWeight={500}
              color="white"
              display={{ base: 'none', md: 'block' }}
            >
              Build Friendships 💛
            </Text>
            <Button onClick={toggleColorMode} colorScheme="whiteAlpha">
              {colorMode === 'light' ? <IoMoon /> : <LuSun size={20} />}
            </Button>
            <CreateUserModel setUsers={setUsers} />
            <Button colorScheme="red" variant="outline" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </Flex>
        </Flex>
      </Box>
    </Container>
  );
};

export default Navbar;
