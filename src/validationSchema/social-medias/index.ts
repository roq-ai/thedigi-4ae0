import * as yup from 'yup';

export const socialMediaValidationSchema = yup.object().shape({
  platform: yup.string().required(),
  link: yup.string().required(),
  company_id: yup.string().nullable(),
});
