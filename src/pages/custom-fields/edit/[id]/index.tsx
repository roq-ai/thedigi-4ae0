import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
  Center,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useFormik, FormikHelpers } from 'formik';
import { getCustomFieldById, updateCustomFieldById } from 'apiSdk/custom-fields';
import { Error } from 'components/error';
import { customFieldValidationSchema } from 'validationSchema/custom-fields';
import { CustomFieldInterface } from 'interfaces/custom-field';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { CompanyInterface } from 'interfaces/company';
import { getCompanies } from 'apiSdk/companies';

function CustomFieldEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<CustomFieldInterface>(
    () => (id ? `/custom-fields/${id}` : null),
    () => getCustomFieldById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: CustomFieldInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateCustomFieldById(id, values);
      mutate(updated);
      resetForm();
      router.push('/custom-fields');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<CustomFieldInterface>({
    initialValues: data,
    validationSchema: customFieldValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Edit Custom Field
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        {formError && (
          <Box mb={4}>
            <Error error={formError} />
          </Box>
        )}
        {isLoading || (!formik.values && !error) ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
          <form onSubmit={formik.handleSubmit}>
            <FormControl id="field_name" mb="4" isInvalid={!!formik.errors?.field_name}>
              <FormLabel>Field Name</FormLabel>
              <Input type="text" name="field_name" value={formik.values?.field_name} onChange={formik.handleChange} />
              {formik.errors.field_name && <FormErrorMessage>{formik.errors?.field_name}</FormErrorMessage>}
            </FormControl>
            <FormControl id="field_value" mb="4" isInvalid={!!formik.errors?.field_value}>
              <FormLabel>Field Value</FormLabel>
              <Input type="text" name="field_value" value={formik.values?.field_value} onChange={formik.handleChange} />
              {formik.errors.field_value && <FormErrorMessage>{formik.errors?.field_value}</FormErrorMessage>}
            </FormControl>
            <AsyncSelect<CompanyInterface>
              formik={formik}
              name={'company_id'}
              label={'Select Company'}
              placeholder={'Select Company'}
              fetcher={getCompanies}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record?.name}
                </option>
              )}
            />
            <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
              Submit
            </Button>
          </form>
        )}
      </Box>
    </AppLayout>
  );
}

export default compose(
  requireNextAuth({
    redirectTo: '/',
  }),
  withAuthorization({
    service: AccessServiceEnum.PROJECT,
    entity: 'custom_field',
    operation: AccessOperationEnum.UPDATE,
  }),
)(CustomFieldEditPage);
