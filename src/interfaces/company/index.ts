import { AnalyticsInterface } from 'interfaces/analytics';
import { CustomFieldInterface } from 'interfaces/custom-field';
import { PrivacyInterface } from 'interfaces/privacy';
import { SocialMediaInterface } from 'interfaces/social-media';
import { ThemeInterface } from 'interfaces/theme';
import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface CompanyInterface {
  id?: string;
  description?: string;
  image?: string;
  name: string;
  created_at?: any;
  updated_at?: any;
  user_id: string;
  tenant_id: string;
  analytics?: AnalyticsInterface[];
  custom_field?: CustomFieldInterface[];
  privacy?: PrivacyInterface[];
  social_media?: SocialMediaInterface[];
  theme?: ThemeInterface[];
  user?: UserInterface;
  _count?: {
    analytics?: number;
    custom_field?: number;
    privacy?: number;
    social_media?: number;
    theme?: number;
  };
}

export interface CompanyGetQueryInterface extends GetQueryInterface {
  id?: string;
  description?: string;
  image?: string;
  name?: string;
  user_id?: string;
  tenant_id?: string;
}
