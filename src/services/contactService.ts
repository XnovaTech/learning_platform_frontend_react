import type { ContactType, ContactPayloadType, GroupContactType } from "@/types/contact";
import api from './api';

export const getContactByStudent = async (studentId: number): Promise<ContactType[]> => {
    try {
        const { data } = await api.get(`/v1/contacts/student/${studentId}`);
        return data?.data;
    } catch (error: any) {
        throw new Error(error.response.data.message || error.message);
    }
}

export const getAllContacts = async (search?: string): Promise<GroupContactType[]> => {
    try {
        const { data } = await api.get('/v1/contacts', { params: { search } });
        return data?.data;
    } catch (error: any) {
        throw new Error(error.response.data.message || error.message);
    }
}

export const createContact = async (payload: ContactPayloadType): Promise<ContactType> => {
    try {
        const { data } = await api.post('/v1/contacts', payload);
        return data?.data;
    } catch (error: any) {
        throw new Error(error.response.data.message || error.message);
    }
}

export const updateContact = async (id: number, payload: ContactPayloadType): Promise<ContactType> => {
    try {
        const { data } = await api.put(`/v1/contacts/${id}`, payload);
        return data?.data;
    } catch (error: any) {
        throw new Error(error.response.data.message || error.message);
    }
}