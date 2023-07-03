import * as yup from 'yup';

export const analyticsValidationSchema = yup.object().shape({
  views: yup.number().integer().required(),
  clicks: yup.number().integer().required(),
  company_id: yup.string().nullable(),
});
