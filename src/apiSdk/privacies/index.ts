import axios from 'axios';
import queryString from 'query-string';
import { PrivacyInterface, PrivacyGetQueryInterface } from 'interfaces/privacy';
import { GetQueryInterface } from '../../interfaces';

export const getPrivacies = async (query?: PrivacyGetQueryInterface) => {
  const response = await axios.get(`/api/privacies${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createPrivacy = async (privacy: PrivacyInterface) => {
  const response = await axios.post('/api/privacies', privacy);
  return response.data;
};

export const updatePrivacyById = async (id: string, privacy: PrivacyInterface) => {
  const response = await axios.put(`/api/privacies/${id}`, privacy);
  return response.data;
};

export const getPrivacyById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/privacies/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deletePrivacyById = async (id: string) => {
  const response = await axios.delete(`/api/privacies/${id}`);
  return response.data;
};
