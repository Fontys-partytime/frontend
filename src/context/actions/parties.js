import axiosPrivate from '../../api/axios';
import useAuth from '../../hooks/useAuth';

export const GetPartyById = async (partyid) => {
    const response = await axiosPrivate.get(`/parties/${partyid}`);
    console.log(response.data);
    return response;
}

export const GetPartiesByUserid = async (userid) => {
    const response = await axiosPrivate.get(`/parties/user/${userid}`);
    console.log(response.data);
    return response;
}

export const UpdateParty = async (party) => {
    console.log(party);
    const response = await axiosPrivate.put(`/parties/${party.id}`, party);
    console.log(response.data);
    return response;
}

export const CreateParty = async (party) => {
    console.log(party);
    const response = await axiosPrivate.post(`/parties`, party);
    console.log(response.data);
    return response;
}

export const DeleteParty = async (party) => {
    const response = await axiosPrivate.delete(`/parties/${party.id}`);
    console.log(response.data);
    return response;
}

export const JoinPartyByPartyIdAndUserId = async (partyId, userId, username) => {
    const response = await axiosPrivate.post(`/joined`, {
        partyid: partyId,
        userid: userId,
        username: username
    });
    console.log(response.data);
    return response;
}