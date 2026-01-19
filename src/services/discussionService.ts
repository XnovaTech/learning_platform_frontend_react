import type { DiscussionPayloadType, DiscussionType } from "@/types/discussion";
import api from "./api";

export const getDiscussionsByClass = async (classId: number): Promise<DiscussionType[]> => {
    try {
        const { data } = await api.get(`/v1/discussions/class/${classId}`);
        return data?.data;
    } catch (error: any) {
        throw new Error(error.response.data.message || error.message);
    }
};

export const createDiscussion = async (payload: DiscussionPayloadType): Promise<DiscussionType> => {
    try {
        const { data } = await api.post('/v1/discussions', payload);
        return data?.data;
    } catch (error: any) {
        throw new Error(error.response.data.message || error.message);
    }
};