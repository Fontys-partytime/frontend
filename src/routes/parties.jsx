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
    useColorModeValue,
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
    Textarea
} from '@chakra-ui/react';
import { CheckIcon } from '@chakra-ui/icons'

import useAuth from '../hooks/useAuth';
import { GetPartiesByUserid, UpdateParty } from '../context/actions/parties';
import '../css/datepicker.css'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const Parties = () => {
    
    const OverlayOne = () => (
        <ModalOverlay
            bg='blackAlpha.300'
            backdropFilter='blur(10px) hue-rotate(90deg)'
        />
    )

    const SaveParty = async () => {
        let partyToUpdate = activeParty;
        console.log(activeParty);
        partyToUpdate.title = title !== null ? title : activeParty?.title;
        partyToUpdate.description = description !== null ? description : activeParty?.description;
        partyToUpdate.starts = startDate !== null ? startDate : activeParty?.starts;
        partyToUpdate.ends = endDate !== null ? endDate : activeParty?.ends; 
        partyToUpdate.budget = budget !== null ? budget : activeParty?.budget;
        partyToUpdate.location = activeParty?.location;
        await UpdateParty(partyToUpdate);
    }

    const [parties, setParties] = useState();
    const [activeParty, setActiveParty] = useState();
    const { auth } = useAuth();
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [overlay, setOverlay] = React.useState(<OverlayOne />)

    // Active party
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [location, setLocation] = useState('');
    const [budget, setBudget] = useState(0);

    useEffect(() => {
        (async () => {
            const parties = await GetPartiesByUserid(auth?.userid);
            setParties(parties);
        })();
        
        return () => {
            // this now gets called when the component unmounts
        };
    }, [auth?.userid]);

    return (
        <>
        <div id="party">
        <div style={{margin: "2rem"}}>
            <h1 style={{fontWeight: 700, fontSize: 32, marginBottom: "1rem"}}>Your parties</h1>
            { parties?.length ? parties.map((party, id) => {
                return <Box
                bg="white"
                maxW={'320px'}
                w={'full'}
                boxShadow={'2xl'}
                rounded={'lg'}
                p={6}>
                <Heading fontSize={'2xl'} fontFamily={'body'}>
                    { party.title }
                </Heading>
                <Text fontWeight={600} color={'gray.500'} my={2} mb={4}>
                    { auth?.user }
                </Text>
                <Divider />
                <Text my={4}>
                    { party.description }
                </Text>
                <Divider />
                <Stack direction={'row'} my={3}>
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
                <Stack direction={'row'} my={3}>
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
        
                <Stack mt={8} direction={'row'} spacing={4} justifyContent={'space-between'}>
                        <Button
                        flex={1}
                        fontSize={'sm'}
                        _focus={{
                            bg: 'gray.200',
                        }}>
                        Share
                        </Button>
                    <Form>
                        <Button
                        onClick={() => {
                            setActiveParty(party);
                            setStartDate(new Date(party?.starts));
                            setEndDate(new Date(party?.ends));
                            setOverlay(<OverlayOne />);
                            onOpen();
                        }}
                        type='submit'
                        flex={1}
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
                    </Form>
                    <Form>
                        <Button
                        type='submit'
                        flex={1}
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
                    </Form>
                </Stack>
                </Box>
            }) : <div>No parties</div>}
            <div>
            </div>
        </div>
        </div>
        <Modal isCentered isOpen={isOpen} onClose={onClose}>
        {overlay}
            <ModalContent>
                <ModalHeader>Party information
                </ModalHeader>
            <ModalCloseButton />
                <ModalBody>
                <InputGroup mb={4}>
                    <InputLeftAddon children='Party title' />
                    <Input defaultValue={activeParty?.title} onChange={((e) => {
                        setTitle(e.target.value);
                    })} type='text' />
                </InputGroup>
                <Textarea
                    defaultValue={activeParty?.description}
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
                    <Input defaultValue={activeParty?.budget} onChange={(e) => {
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
                        }} onClick={SaveParty}>Save</Button>
                <Button 
                        ml={4} onClick={onClose}>Close</Button>
            </ModalFooter>
            </ModalContent>
        </Modal>
        </>
    );
}

export default Parties;