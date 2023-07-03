import { CompanyInterface } from 'interfaces/company';
import { GetQueryInterface } from 'interfaces';

export interface CustomFieldInterface {
  id?: string;
  field_name: string;
  field_value: string;
  company_id?: string;
  created_at?: any;
  updated_at?: any;

  company?: CompanyInterface;
  _count?: {};
}

export interface CustomFieldGetQueryInterface extends GetQueryInterface {
  id?: string;
  field_name?: string;
  field_value?: string;
  company_id?: string;
}
