import type { CategoryType, CategoryPayloadType } from '@/types/category';
import api from './api';

export const listCategories = async (): Promise<CategoryType[]> => {
  try {
    const { data } = await api.get('/v1/categories');
    return data?.data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const listCategoriesWithClassAndCourse = async (): Promise<CategoryType[]> => {
  try {
    const { data } = await api.get('/v1/categories/with/courses');
    return data?.data;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export const createCategory = async (payload: CategoryPayloadType): Promise<CategoryType> => {
  try {
    const { data } = await api.post('/v1/categories', payload);
    return data?.data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const updateCategory = async (id: number, payload: CategoryPayloadType): Promise<CategoryType> => {
  try {
    const { data } = await api.put(`/v1/categories/${id}`, payload);
    return data?.data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const deleteCategory = async (id: number): Promise<void> => {
  try {
    await api.delete(`/v1/categories/${id}`);
  } catch (error: any) {
    throw new Error(error.message);
  }
};
