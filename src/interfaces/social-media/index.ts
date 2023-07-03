import { CompanyInterface } from 'interfaces/company';
import { GetQueryInterface } from 'interfaces';

export interface SocialMediaInterface {
  id?: string;
  platform: string;
  link: string;
  company_id?: string;
  created_at?: any;
  updated_at?: any;

  company?: CompanyInterface;
  _count?: {};
}

export interface SocialMediaGetQueryInterface extends GetQueryInterface {
  id?: string;
  platform?: string;
  link?: string;
  company_id?: string;
}
