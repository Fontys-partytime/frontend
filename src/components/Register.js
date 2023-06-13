import { useRef, useState, useEffect } from 'react';
import useAuth from '../hooks/useAuth';
import { useNavigate, useLocation, Form } from 'react-router-dom';
import {
    Flex,
    Box,
    FormControl,
    FormLabel,
    Input,
    Checkbox,
    Stack,
    HStack,
    Link,
    Button,
    Heading,
    Text,
    useColorModeValue,
    useToast 
  } from '@chakra-ui/react';

import axios from '../api/axios';
const LOGIN_URL = '/account/create'; // Fixed2?


const Login = () => {
    const { setAuth } = useAuth();

    const navigate = useNavigate();
    const location = useLocation();
    
    const toast = useToast()
    const from = location.state?.from?.pathname || "/login";

    const userRef = useRef();
    const errRef = useRef();

    const [user, setUser] = useState('');
    const [pwd, setPwd] = useState('');
    const [email, setEmail] = useState('');
    const [errMsg, setErrMsg] = useState('');

    useEffect(() => {
        userRef.current.focus();
    }, [])

    useEffect(() => {
        setErrMsg('');
    }, [user, pwd])

    const ToastExample = (title, description, type) => {
        toast({
            title: title,
            description: description,
            status: type,
            duration: 6000,
            isClosable: true,
        });
    }

    const navigateToLoginPage = () => {
        navigate(from, { replace: true });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(LOGIN_URL,
                JSON.stringify({ "Username": user, "Password": pwd, "Email": email }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );
            navigate(from, { replace: true });
        } catch (err) {
            if (!err?.response) {
                ToastExample("Server error", err.toString(), "error");
            } else if (err.response?.status === 400) {
                ToastExample("Validation error", "You didn't specificy the right data.", "warning");
            } else if (err.response?.status === 401) {
                ToastExample("Account error", "Authentication error.", "error");
            } else {
                setErrMsg('Registration Failed');
                ToastExample("Registration error", "The Registration failed for some unexpected reason.", "error");
            }
        }
    }

    return (
        <Flex
            minH={'100vh'}
            align={'center'}
            justify={'center'}
            bg={useColorModeValue('gray.50', 'gray.800')}>
            <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
            <Stack align={'center'}>
                <Heading fontSize={'4xl'}>Register for Partytime 🎉</Heading>
            </Stack>
            <Box
                rounded={'lg'}
                bg={useColorModeValue('white', 'gray.700')}
                boxShadow={'lg'}
                p={8}>
                <Form onSubmit={handleSubmit}>
                <Stack spacing={4}>
                    <FormControl id="username">
                        <FormLabel>Username</FormLabel>
                        <Input autoComplete="off" value={user} ref={userRef} onChange={(e) => setUser(e.target.value)} type="text" required/>
                    </FormControl>
                    
                    <FormControl id="email">
                        <FormLabel>Email</FormLabel>
                        <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
                    </FormControl>
                    <FormControl id="password">
                        <FormLabel>Password</FormLabel>
                        <Input value={pwd} onChange={(e) => setPwd(e.target.value)} type="password" required />
                    </FormControl>
                <HStack  spacing={10}>
                    {/* <Stack
                    direction={{ base: 'column', sm: 'row' }}
                    align={'start'}
                    justify={'space-between'}>
                    <Checkbox>Remember me</Checkbox>
                    <Link color={'blue.400'}>Forgot password?</Link>
                    </Stack> */}
                    <Button
                    w={'100%'}
                    type='submit'
                    bg={'blue.400'}
                    color={'white'}
                    _hover={{
                        bg: 'blue.500',
                    }}>
                    Create
                    </Button>
                    <Button
                    onClick={navigateToLoginPage}
                    w={'100%'}
                    type='button'
                    bg={'gray.400'}
                    color={'white'}
                    _hover={{
                        bg: 'gray.500',
                    }}
                    >Back to login</Button>
                </HStack>
                </Stack>
                </Form>
            </Box>
            </Stack>
        </Flex>
        );
}

export default Login
