import axios from 'axios';
import queryString from 'query-string';
import { CustomFieldInterface, CustomFieldGetQueryInterface } from 'interfaces/custom-field';
import { GetQueryInterface } from '../../interfaces';

export const getCustomFields = async (query?: CustomFieldGetQueryInterface) => {
  const response = await axios.get(`/api/custom-fields${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createCustomField = async (customField: CustomFieldInterface) => {
  const response = await axios.post('/api/custom-fields', customField);
  return response.data;
};

export const updateCustomFieldById = async (id: string, customField: CustomFieldInterface) => {
  const response = await axios.put(`/api/custom-fields/${id}`, customField);
  return response.data;
};

export const getCustomFieldById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/custom-fields/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteCustomFieldById = async (id: string) => {
  const response = await axios.delete(`/api/custom-fields/${id}`);
  return response.data;
};
