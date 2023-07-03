import axios from 'axios';
import queryString from 'query-string';
import { SocialMediaInterface, SocialMediaGetQueryInterface } from 'interfaces/social-media';
import { GetQueryInterface } from '../../interfaces';

export const getSocialMedias = async (query?: SocialMediaGetQueryInterface) => {
  const response = await axios.get(`/api/social-medias${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createSocialMedia = async (socialMedia: SocialMediaInterface) => {
  const response = await axios.post('/api/social-medias', socialMedia);
  return response.data;
};

export const updateSocialMediaById = async (id: string, socialMedia: SocialMediaInterface) => {
  const response = await axios.put(`/api/social-medias/${id}`, socialMedia);
  return response.data;
};

export const getSocialMediaById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/social-medias/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteSocialMediaById = async (id: string) => {
  const response = await axios.delete(`/api/social-medias/${id}`);
  return response.data;
};
