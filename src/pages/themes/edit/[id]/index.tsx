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
import { getThemeById, updateThemeById } from 'apiSdk/themes';
import { Error } from 'components/error';
import { themeValidationSchema } from 'validationSchema/themes';
import { ThemeInterface } from 'interfaces/theme';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { CompanyInterface } from 'interfaces/company';
import { getCompanies } from 'apiSdk/companies';

function ThemeEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<ThemeInterface>(
    () => (id ? `/themes/${id}` : null),
    () => getThemeById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: ThemeInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateThemeById(id, values);
      mutate(updated);
      resetForm();
      router.push('/themes');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<ThemeInterface>({
    initialValues: data,
    validationSchema: themeValidationSchema,
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
            Edit Theme
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
            <FormControl id="name" mb="4" isInvalid={!!formik.errors?.name}>
              <FormLabel>Name</FormLabel>
              <Input type="text" name="name" value={formik.values?.name} onChange={formik.handleChange} />
              {formik.errors.name && <FormErrorMessage>{formik.errors?.name}</FormErrorMessage>}
            </FormControl>
            <FormControl id="color_scheme" mb="4" isInvalid={!!formik.errors?.color_scheme}>
              <FormLabel>Color Scheme</FormLabel>
              <Input
                type="text"
                name="color_scheme"
                value={formik.values?.color_scheme}
                onChange={formik.handleChange}
              />
              {formik.errors.color_scheme && <FormErrorMessage>{formik.errors?.color_scheme}</FormErrorMessage>}
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
    entity: 'theme',
    operation: AccessOperationEnum.UPDATE,
  }),
)(ThemeEditPage);
