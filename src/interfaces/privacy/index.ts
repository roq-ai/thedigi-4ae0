import { CompanyInterface } from 'interfaces/company';
import { GetQueryInterface } from 'interfaces';

export interface PrivacyInterface {
  id?: string;
  settings: string;
  company_id?: string;
  created_at?: any;
  updated_at?: any;

  company?: CompanyInterface;
  _count?: {};
}

export interface PrivacyGetQueryInterface extends GetQueryInterface {
  id?: string;
  settings?: string;
  company_id?: string;
}
