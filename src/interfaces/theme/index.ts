import { CompanyInterface } from 'interfaces/company';
import { GetQueryInterface } from 'interfaces';

export interface ThemeInterface {
  id?: string;
  name: string;
  color_scheme: string;
  company_id?: string;
  created_at?: any;
  updated_at?: any;

  company?: CompanyInterface;
  _count?: {};
}

export interface ThemeGetQueryInterface extends GetQueryInterface {
  id?: string;
  name?: string;
  color_scheme?: string;
  company_id?: string;
}
