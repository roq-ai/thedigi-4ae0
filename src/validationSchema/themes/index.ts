import * as yup from 'yup';

export const themeValidationSchema = yup.object().shape({
  name: yup.string().required(),
  color_scheme: yup.string().required(),
  company_id: yup.string().nullable(),
});
