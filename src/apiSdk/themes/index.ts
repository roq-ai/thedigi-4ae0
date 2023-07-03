import axios from 'axios';
import queryString from 'query-string';
import { ThemeInterface, ThemeGetQueryInterface } from 'interfaces/theme';
import { GetQueryInterface } from '../../interfaces';

export const getThemes = async (query?: ThemeGetQueryInterface) => {
  const response = await axios.get(`/api/themes${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createTheme = async (theme: ThemeInterface) => {
  const response = await axios.post('/api/themes', theme);
  return response.data;
};

export const updateThemeById = async (id: string, theme: ThemeInterface) => {
  const response = await axios.put(`/api/themes/${id}`, theme);
  return response.data;
};

export const getThemeById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/themes/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteThemeById = async (id: string) => {
  const response = await axios.delete(`/api/themes/${id}`);
  return response.data;
};
