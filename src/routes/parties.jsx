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
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverArrow,
} from '@chakra-ui/react';
import { CheckIcon, 
    AddIcon } from '@chakra-ui/icons'

import useAuth from '../hooks/useAuth';
import { GetPartiesByUserid, UpdateParty, CreateParty, DeleteParty } from '../context/actions/parties';
import '../css/datepicker.css'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import toast, { Toaster } from 'react-hot-toast';

import { Link as RouterLink } from 'react-router-dom';

const Parties = () => {

    const RemoveParty = async () => {
        const response = await DeleteParty(activeParty);
        response?.status == 200 ? response?.data 
        ? toast('Succesfully deleted party!', { duration: 4000, position: 'bottom-center', type: 'success'}) && setParties(parties.filter(party => party.id !== activeParty.id)) // Remove party from array if deletion is succesful
        : toast("Party could not be deleted. This might be because you are trying to delete a party that doesn't exist anymore.", { duration: 10000, position: 'bottom-center', type: 'error'})  
        : toast('Server error deleting party.', { duration: 6000, position: 'bottom-center', type: 'error'});
        
    }

    const { auth } = useAuth();
    const [parties, setParties] = useState();
    const [activeParty, setActiveParty] = useState();
    const [openEditModal, setOpen] = useState(false);

    const { isOpen, onOpen, onClose } = useDisclosure()
    const cancelRef = React.useRef()

    useEffect(() => {
        (async () => {
            const parties = await GetPartiesByUserid(auth?.userid);
            setParties(parties.data);
        })();
        
        return () => {
            // this now gets called when the component unmounts
        };
    }, [auth?.userid]);

    return (
        <>
        <div id="party">
        <div style={{marginLeft: "2rem"}}>
            <Stack direction={'row'} mt={5} mb={4} spacing={3} alignItems={'center'}>
                <Heading fontWeight={700} fontSize={28}>Your parties</Heading>
                <AddModal />
            </Stack>
            <Divider />
            <SimpleGrid mt={4} columns={[1,2,4]} spacing={4}>
            { parties?.length ? parties.map((party, id) => {
                return <Box
                key={id}
                bg="white"
                w={'full'}
                boxShadow={'1xl'}
                rounded={'lg'}
                p={6}>
                <Text fontWeight={600} color={'gray.500'} mb={1}>
                    { `@${auth?.user}` }
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
                
                <Divider pt={3} />
                <HStack mt={3} pb={3}>
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
                    }) : <b>No guests yet.</b>}
                    
                </HStack>
        
                <Divider pt={3} />
                <Stack mt={4} direction={'row'} spacing={4} justifyContent={'space-between'}>
                <Link flex={1}
                        fontSize={'sm'}
                        bg={'white.400'}
                        color={'#555'}
                        border={'1px'}
                        borderColor={'lightgray'}
                        rounded={'md'}
                        display={'flex'}
                        fontWeight={600}
                        justifyContent={'center'}
                        alignItems={'center'}
                        _hover={{
                            bg: 'white.500',
                        }}
                        _focus={{
                            bg: 'white.500',
                        }} as={RouterLink} to={`/parties/share/${party.id}`} style={{ textDecoration: 'none' }} >Share</Link>
                        <EditModal party={party} />
                        <Button
                        onClick={() => {onOpen(); setActiveParty(party)}}
                        type='submit'
                        fontSize={'sm'}
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
                </Stack>
                </Box>
            }) : <div>No parties</div>}
            </ SimpleGrid>
            <div>
            </div>
        </div>
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
            <AlertDialogHeader>Delete party?</AlertDialogHeader>
            <AlertDialogCloseButton />
            <AlertDialogBody>
                Are you sure you want to delete this party?
            </AlertDialogBody>
            <AlertDialogFooter>
                <Button ref={cancelRef} onClick={onClose}>
                No
                </Button>
                <Button onClick={() => { onClose(); RemoveParty() }} bg={'red.400'} color={'white'} ml={3}>
                Yes
                </Button>
            </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
        <Toaster />
        </>
    );
}

const AddModal = ({}) => {
        const OverlayOne = () => (
            <ModalOverlay
                bg='blackAlpha.300'
                backdropFilter='blur(10px)'
            />
        )
    
        const AddParty = async () => {
    
            let partyToCreate = {
                userid: "",
                title: "",
                description: "",
                starts: "",
                ends: "",
                budget: ""
            }
    
            partyToCreate.userid = auth?.userid;
            partyToCreate.title = title;
            partyToCreate.description = description;
            partyToCreate.starts = startDate;
            partyToCreate.ends = endDate; 
            partyToCreate.budget = budget !== null ? budget : 0;
    
            const response = await CreateParty(partyToCreate);

            response?.status == 200 
            ? toast('Succesfully created party!', { duration: 4000, position: 'bottom-center', type: 'success'})  
            : toast('Error creating party.', { duration: 6000, position: 'bottom-center', type: 'error'});
        }
    
        const { auth } = useAuth();
        const [overlay, setOverlay] = React.useState(<OverlayOne />)
    
        // Active party
        const [title, setTitle] = useState('');
        const [description, setDescription] = useState('');
        const [startDate, setStartDate] = useState(new Date());
        const [endDate, setEndDate] = useState(new Date());
        const [location, setLocation] = useState('');
        const [budget, setBudget] = useState(0);
    
        const { isOpen: isAddOpen, onOpen: onAddOpen, onClose: onAddClose } = useDisclosure()
    
        useEffect(() => {
            // Only when modal is opened
            if(onAddOpen)
            {
                setOverlay(<OverlayOne />);
            }
    
        }, [])
    
        return (
        <>
        
        <Button
            onClick={onAddOpen} 
            bg={'blue.400'}
            color={'white'}
            aria-label='Add party'
            size='md'
            _hover={{
                bg: 'blue.500',
            }}
            _focus={{
                bg: 'blue.500',
            }}>+</Button>
        <Modal isCentered isOpen={isAddOpen} onClose={onAddClose}>
            {overlay}
                <ModalContent>
                    <ModalHeader>Party information
                    </ModalHeader>
                    <ModalBody>
                    <InputGroup mb={4}>
                        <InputLeftAddon children='Party title' />
                        <Input placeholder='e.g. New years party at Tommie' onChange={((e) => {
                            setTitle(e.target.value);
                        })} type='text' />
                    </InputGroup>
                    <Textarea
                        onChange={((e) => {
                            setDescription(e.target.value);
                        })}
                        placeholder='e.g. bring your best christmas clothing!'
                        size='sm'
                    />
                    <Divider my={4} />
                    <FormControl>
                        <FormLabel>Partys starts at</FormLabel>
                        <DatePicker
                            showIcon
                            selected={startDate}
                            onChange={(date) => setStartDate(date)}
                            showTimeSelect
                            timeFormat="HH:mm"
                            timeIntervals={15}
                            timeCaption="time"
                            dateFormat="MMMM d, yyyy h:mm aa"
                        />
                    </FormControl>
                    <FormControl my={4}>
                        <FormLabel>Ends at</FormLabel>
                        <DatePicker
                            showIcon
                            selected={endDate}
                            onChange={(date) => setEndDate(date)}
                            showTimeSelect
                            timeFormat="HH:mm"
                            timeIntervals={15}
                            timeCaption="time"
                            dateFormat="MMMM d, yyyy h:mm aa"
                        />
                    </FormControl>
                    <Divider mb={4} />
                    <InputGroup>
                    
                        <InputLeftAddon children='Budget €' />
                        <Input onChange={(e) => {
                            setBudget(parseInt(e.target.value));
                         }} placeholder='Enter party budget' />
                        <InputRightElement>
                            <CheckIcon color='green.500' />
                        </InputRightElement>
                    </InputGroup>
                </ModalBody>
                <ModalFooter>
                    <Button flex={1}
                            fontSize={'sm'}
                            bg={'blue.400'}
                            color={'white'}
                            _hover={{
                                bg: 'blue.500',
                            }}
                            _focus={{
                                bg: 'blue.500',
                            }} onClick={() => {onAddClose(); AddParty()}}>Create</Button>
                    <Button 
                            ml={4} onClick={onAddClose}>Close</Button>
                </ModalFooter>
                </ModalContent>
            </Modal>
            </>);
}

const EditModal = ({party}) => {
    
    const OverlayOne = () => (
        <ModalOverlay
            bg='blackAlpha.300'
            backdropFilter='blur(10px)'
        />
    )

    const DefaultValuesForParty = () => {
        setTitle(party?.title);
        setDescription(party?.description);

        console.log(party?.starts);
        setStartDate(new Date(party?.starts));
        setEndDate(new Date(party?.ends));
        setBudget(party?.budget);
        setLocation(party?.location);
    }

    const SaveParty = async () => {
        let partyToUpdate = party;

        partyToUpdate.title = title;
        partyToUpdate.description = description;
        partyToUpdate.starts = startDate;
        partyToUpdate.ends = endDate; 
        partyToUpdate.budget = budget !== null ? budget : 0;
        partyToUpdate.location = party?.location;

        const response = await UpdateParty(partyToUpdate);
        response?.status == 200 
        ? toast('Succesfully updated party!', { duration: 4000, position: 'bottom-center', type: 'success'})  
        : toast('Error updating party.', { duration: 6000, position: 'bottom-center', type: 'error'});

    }

    const [overlay, setOverlay] = React.useState(<OverlayOne />)

    // Active party
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [location, setLocation] = useState('');
    const [budget, setBudget] = useState(0);

    const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure()

    useEffect(() => {
        // Only when modal is opened
        if(onEditOpen)
        {
            DefaultValuesForParty();
            setOverlay(<OverlayOne />);
        }

    }, [])

    return (
    <>
    <Button
    onClick={onEditOpen} 
    type='submit'
    fontSize={'sm'}
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
    <Modal isCentered isOpen={isEditOpen} onClose={onEditClose}>
        {overlay}
            <ModalContent>
                <ModalHeader>Party information
                </ModalHeader>
                <ModalBody>
                <InputGroup mb={4}>
                    <InputLeftAddon children='Party title' />
                    <Input defaultValue={party?.title} onChange={((e) => {
                        setTitle(e.target.value);
                    })} type='text' />
                </InputGroup>
                <Textarea
                    defaultValue={party?.description}
                    onChange={((e) => {
                        setDescription(e.target.value);
                    })}
                    placeholder='Enter a description'
                    size='sm'
                />
                <Divider my={4} />
                <FormControl>
                    <FormLabel>Partys starts at</FormLabel>
                    <DatePicker
                        showIcon
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        showTimeSelect
                        timeFormat="HH:mm"
                        timeIntervals={15}
                        timeCaption="time"
                        dateFormat="MMMM d, yyyy h:mm aa"
                    />
                </FormControl>
                <FormControl my={4}>
                    <FormLabel>Ends at</FormLabel>
                    <DatePicker
                        showIcon
                        selected={endDate}
                        onChange={(date) => setEndDate(date)}
                        showTimeSelect
                        timeFormat="HH:mm"
                        timeIntervals={15}
                        timeCaption="time"
                        dateFormat="MMMM d, yyyy h:mm aa"
                    />
                </FormControl>
                <Divider mb={4} />
                <InputGroup>
                    <InputLeftAddon children='Party budget €' />
                    <Input defaultValue={party?.budget} onChange={(e) => {
                        setBudget(parseInt(e.target.value));
                     }} placeholder='Enter budget' />
                    <InputRightElement>
                        <CheckIcon color='green.500' />
                    </InputRightElement>
                </InputGroup>
            </ModalBody>
            <ModalFooter>
                <Button flex={1}
                        fontSize={'sm'}
                        bg={'blue.400'}
                        color={'white'}
                        _hover={{
                            bg: 'blue.500',
                        }}
                        _focus={{
                            bg: 'blue.500',
                        }} onClick={() => {onEditClose(); SaveParty()}}>Save</Button>
                <Button 
                        ml={4} onClick={onEditClose}>Close</Button>
            </ModalFooter>
            </ModalContent>
        </Modal>
        </>);
}

export default Parties;