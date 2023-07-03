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
import { getPrivacyById, updatePrivacyById } from 'apiSdk/privacies';
import { Error } from 'components/error';
import { privacyValidationSchema } from 'validationSchema/privacies';
import { PrivacyInterface } from 'interfaces/privacy';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { CompanyInterface } from 'interfaces/company';
import { getCompanies } from 'apiSdk/companies';

function PrivacyEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<PrivacyInterface>(
    () => (id ? `/privacies/${id}` : null),
    () => getPrivacyById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: PrivacyInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updatePrivacyById(id, values);
      mutate(updated);
      resetForm();
      router.push('/privacies');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<PrivacyInterface>({
    initialValues: data,
    validationSchema: privacyValidationSchema,
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
            Edit Privacy
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
            <FormControl id="settings" mb="4" isInvalid={!!formik.errors?.settings}>
              <FormLabel>Settings</FormLabel>
              <Input type="text" name="settings" value={formik.values?.settings} onChange={formik.handleChange} />
              {formik.errors.settings && <FormErrorMessage>{formik.errors?.settings}</FormErrorMessage>}
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
    entity: 'privacy',
    operation: AccessOperationEnum.UPDATE,
  }),
)(PrivacyEditPage);
