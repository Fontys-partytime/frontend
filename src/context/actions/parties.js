import axiosPrivate from '../../api/axios';
import useAuth from '../../hooks/useAuth';

export const GetPartiesByUserid = async (userid) => {
    const response = await axiosPrivate.get(`/parties/user/${userid}`);
    console.log(response.data);
    return response.data;
}

export const UpdateParty = async (party) => {
    console.log(party);
    const response = await axiosPrivate.put(`/parties/${party.id}`, party);
    console.log(response.data);
    return response.data;
}