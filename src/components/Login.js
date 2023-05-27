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
    Link,
    Button,
    Heading,
    Text,
    useColorModeValue,
    useToast 
  } from '@chakra-ui/react';

import axios from '../api/axios';
const LOGIN_URL = '/account';


const Login = () => {
    const { setAuth } = useAuth();

    const navigate = useNavigate();
    const location = useLocation();
    
    const toast = useToast()
    const from = location.state?.from?.pathname || "/";

    const userRef = useRef();
    const errRef = useRef();

    const [user, setUser] = useState('');
    const [pwd, setPwd] = useState('');
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

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(LOGIN_URL,
                JSON.stringify({ "Username": user, "Password": pwd }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );
            console.log(JSON.stringify(response?.data));
            //console.log(JSON.stringify(response));
            const accessToken = response?.data?.jwtToken;
            const role = response?.data?.role;
            const email = response?.data?.email;

            setAuth({ email, user, pwd, role, accessToken });
            setUser('');
            setPwd('');
            navigate(from, { replace: true });
        } catch (err) {
            if (!err?.response) {
                ToastExample("Server error", "No connection to the server.", "error");
            } else if (err.response?.status === 400) {
                ToastExample("Validation error", "Missing Username or Password", "warning");
            } else if (err.response?.status === 401) {
                ToastExample("Account error", "Account and password combination could not be found", "error");
            } else {
                setErrMsg('Login Failed');
                ToastExample("Login error", "The login failed for some unexpected reason.", "error");
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
                <Heading fontSize={'4xl'}>Sign in to Partytime 🥳</Heading>
            </Stack>
            <Box
                rounded={'lg'}
                bg={useColorModeValue('white', 'gray.700')}
                boxShadow={'lg'}
                p={8}>
                <Form onSubmit={handleSubmit}>
                <Stack spacing={4}>
                    <FormControl id="email">
                        <FormLabel>Username</FormLabel>
                        <Input autoComplete="off" value={user} ref={userRef} onChange={(e) => setUser(e.target.value)} type="text" required/>
                    </FormControl>
                    <FormControl id="password">
                        <FormLabel>Password</FormLabel>
                        <Input value={pwd} onChange={(e) => setPwd(e.target.value)} type="password" required />
                    </FormControl>
                <Stack spacing={10}>
                    {/* <Stack
                    direction={{ base: 'column', sm: 'row' }}
                    align={'start'}
                    justify={'space-between'}>
                    <Checkbox>Remember me</Checkbox>
                    <Link color={'blue.400'}>Forgot password?</Link>
                    </Stack> */}
                    <Button
                    type='submit'
                    bg={'blue.400'}
                    color={'white'}
                    _hover={{
                        bg: 'blue.500',
                    }}>
                    Sign in
                    </Button>
                </Stack>
                </Stack>
                </Form>
            </Box>
            </Stack>
        </Flex>
        );
}

export default Login
