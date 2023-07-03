import * as yup from 'yup';

export const customFieldValidationSchema = yup.object().shape({
  field_name: yup.string().required(),
  field_value: yup.string().required(),
  company_id: yup.string().nullable(),
});
