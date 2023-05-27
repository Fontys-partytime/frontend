import React, { ReactNode } from 'react';
import { Form } from 'react-router-dom';
import {
    Heading,
    Avatar,
    Box,
    Center,
    Text,
    Stack,
    Button,
    Link,
    Badge,
    useColorModeValue,
} from '@chakra-ui/react';

export default function Parties() {
    return (
        <div id="party">
        <div style={{margin: "2rem"}}>
            <h1 style={{fontWeight: 700, fontSize: 32, marginBottom: "1rem"}}>Your parties</h1>
                <Box
                align={'center'}
                maxW={'320px'}
                w={'full'}
                bg={useColorModeValue('white', 'gray.900')}
                boxShadow={'2xl'}
                rounded={'lg'}
                p={6}>
                <Heading fontSize={'2xl'} fontFamily={'body'}>
                    Party title
                </Heading>
                <Text fontWeight={600} color={'gray.500'} my={1} mb={4}>
                    @userId
                </Text>
                <Text
                    color={useColorModeValue('gray.700', 'gray.400')}>
                    Party description
                </Text>
        
                <Stack align={'center'} justify={'center'} direction={'row'} mt={6}>
                    <Badge
                    px={2}
                    py={1}
                    bg={useColorModeValue('gray.50', 'gray.800')}
                    fontWeight={'400'}>
                    Begins at 19:00
                    </Badge>
                    <Badge
                    px={2}
                    py={1}
                    bg={useColorModeValue('blue.50', 'blue.800')}
                    fontWeight={'400'}>
                    Ends at 02:00
                    </Badge>
                </Stack>
        
                <Stack mt={8} direction={'row'} spacing={4}>
                    <Button
                    flex={1}
                    fontSize={'sm'}
                    rounded={'full'}
                    _focus={{
                        bg: 'gray.200',
                    }}>
                    Share
                    </Button>
                    <Form action="edit">
                        <Button
                        type='submit'
                        flex={1}
                        fontSize={'sm'}
                        rounded={'full'}
                        bg={'blue.400'}
                        color={'white'}
                        _hover={{
                            bg: 'blue.500',
                        }}
                        _focus={{
                            bg: 'blue.500',
                        }}>
                        Edit
                        </Button>
                    </Form>
                    <Form
                        method="post"
                        action="destroy"
                        onSubmit={(event) => {
                        if (
                            !window.confirm(
                            "Please confirm you want to delete this party."
                            )
                        ) {
                            event.preventDefault();
                        }
                        }}
                    >
                        <Button
                        type='submit'
                        flex={1}
                        fontSize={'sm'}
                        rounded={'full'}
                        bg={'red.400'}
                        color={'white'}
                        _hover={{
                            bg: 'red.500',
                        }}
                        _focus={{
                            bg: 'red.500',
                        }}>
                        Delete
                        </Button>
                    </Form>
                </Stack>
                </Box>
            <div>
            </div>
        </div>
        </div>
    );
}