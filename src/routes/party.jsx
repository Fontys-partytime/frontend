import React, { ReactNode, useState, useEffect } from 'react';
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
    Divider,
    ModalOverlay,
    useDisclosure,
    Modal,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    InputLeftElement,
    InputRightElement,
    InputLeftAddon,
    Textarea,
    AlertDialog,
    AlertDialogOverlay,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogCloseButton,
    AlertDialogBody,
    AlertDialogFooter,
    IconButton,
    SimpleGrid,
    useColorModeValue, 
    HStack,
    VStack,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverArrow

} from '@chakra-ui/react';
import { CheckIcon, 
    AddIcon } from '@chakra-ui/icons'

import useAuth from '../hooks/useAuth';
import { GetPartyById, JoinPartyByPartyIdAndUserId } from '../context/actions/parties';
import '../css/datepicker.css'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import toast, { Toaster } from 'react-hot-toast';

import { Link as RouterLink, useParams } from 'react-router-dom';

const Party = () => {
    
    const JoinParty = async () => {
        console.log(auth);
        const response = await JoinPartyByPartyIdAndUserId(party.id, auth?.userid, auth?.user)
        response?.status == 200 
        ? toast('Succesfully joined party!', { duration: 4000, position: 'bottom-center', type: 'success'})  
        : toast('Error joining party.', { duration: 6000, position: 'bottom-center', type: 'error'});
    }

    const { auth } = useAuth();
    const [party, setParty] = useState({});
    const { isOpen, onOpen, onClose } = useDisclosure()
    const cancelRef = React.useRef()
    const { slug } = useParams();

    useEffect(() => {
        (async () => {
            const partyById = await GetPartyById(window.location.pathname.substring(window.location.pathname.lastIndexOf('/') + 1));
            setParty(partyById.data);
        })();
        
        return () => {
            // this now gets called when the component unmounts
        };
    }, [slug]);

    return (
        <>
        <div id="party">
        <Center style={{marginLeft: "2rem"}}>
            {Object.keys(party).length !== 0 ? <Box
                bg="white"
                w={'full'}
                maxW={'350'}
                boxShadow={'1xl'}
                rounded={'lg'}
                p={6}>
                <Text fontWeight={600} color={'gray.500'} mb={1}>
                    { party.userid }
                </Text>
                <Heading  fontSize={'1xl'} fontFamily={'body'} mt={4} mb={2}>
                    { party.title }
                </Heading>
                <Text >
                    { party.description }
                </Text>
                <Divider mt={4} mb={2} />
                <Stack my={4} direction={'row'} justifyContent={'space-between'}>
                    <Text>Starts</Text>
                    <Badge
                    px={2}
                    py={1}
                    bg="lightgray"
                    color="black"
                    alignContent={'right'}
                    fontWeight={'400'}>
                    { new Date(party.starts).toLocaleString() }
                    </Badge>
                </Stack>
                <Stack direction={'row'} my={3} justifyContent={'space-between'}>
                    <Text>Ends</Text>
                    <Badge
                        px={2}
                        py={1}
                        bg="lightgray"
                        color="black"
                        fontWeight={'400'}>
                        { new Date(party.ends).toLocaleString()  }
                    </Badge>
                </Stack>
                <Stack direction={'row'} justifyContent={'space-between'}>
                    <Text>Budget</Text>
                    <Badge
                        px={2}
                        py={1}
                        bg="gray"
                        color="white"
                        fontWeight={'400'}>
                        { `€ ${party.budget}`  }
                    </Badge>
                </Stack>
                <VStack mt={3}>
                    <Button
                        onClick={onOpen}
                        fontSize={'sm'}
                        bg={'blue.400'}
                        color={'white'}
                        _hover={{
                            bg: 'blue.500',
                        }}
                        _focus={{
                            bg: 'blue.500',
                        }}>
                        Join
                    </Button>
                    <Divider pt={3} />
                    <Text pt={3} pl={2}>
                        {party?.joined?.length 
                    ? party.joined?.map((joined, id) => {
                        return <Popover trigger="hover">
                        <PopoverTrigger>
                            <Avatar name={joined.username} />
                        </PopoverTrigger>
                        <PopoverContent py={3}>
                            <PopoverArrow />
                            <Center>{joined.username}</Center>
                        </PopoverContent>
                        </Popover>
                    }) : <b>No other guests yet.</b>}</Text>
                    
                </VStack>
                </Box>
             : <div>Party could not be found.</div>}
            <div>
            </div>
        </Center>
        </div>
        <AlertDialog
            motionPreset='slideInBottom'
            leastDestructiveRef={cancelRef}
            onClose={onClose}
            isOpen={isOpen}
            isCentered
        >
            <AlertDialogOverlay />

            <AlertDialogContent>
            <AlertDialogHeader>Join party?</AlertDialogHeader>
            <AlertDialogCloseButton />
            <AlertDialogBody>
                Are you sure you want to join this party?
            </AlertDialogBody>
            <AlertDialogFooter>
                <Button ref={cancelRef} onClick={onClose}>
                No
                </Button>
                <Button onClick={() => { onClose(); JoinParty() }} bg={'blue.400'} color={'white'} ml={3}>
                Yes
                </Button>
            </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
        <Toaster />
        </>
    );
}

export default Party;