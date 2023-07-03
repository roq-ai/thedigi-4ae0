import { CompanyInterface } from 'interfaces/company';
import { GetQueryInterface } from 'interfaces';

export interface AnalyticsInterface {
  id?: string;
  views: number;
  clicks: number;
  company_id?: string;
  created_at?: any;
  updated_at?: any;

  company?: CompanyInterface;
  _count?: {};
}

export interface AnalyticsGetQueryInterface extends GetQueryInterface {
  id?: string;
  company_id?: string;
}
