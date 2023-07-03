import axios from 'axios';
import queryString from 'query-string';
import { AnalyticsInterface, AnalyticsGetQueryInterface } from 'interfaces/analytics';
import { GetQueryInterface } from '../../interfaces';

export const getAnalytics = async (query?: AnalyticsGetQueryInterface) => {
  const response = await axios.get(`/api/analytics${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createAnalytics = async (analytics: AnalyticsInterface) => {
  const response = await axios.post('/api/analytics', analytics);
  return response.data;
};

export const updateAnalyticsById = async (id: string, analytics: AnalyticsInterface) => {
  const response = await axios.put(`/api/analytics/${id}`, analytics);
  return response.data;
};

export const getAnalyticsById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/analytics/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteAnalyticsById = async (id: string) => {
  const response = await axios.delete(`/api/analytics/${id}`);
  return response.data;
};
