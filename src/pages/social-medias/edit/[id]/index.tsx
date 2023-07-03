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
import { getSocialMediaById, updateSocialMediaById } from 'apiSdk/social-medias';
import { Error } from 'components/error';
import { socialMediaValidationSchema } from 'validationSchema/social-medias';
import { SocialMediaInterface } from 'interfaces/social-media';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { CompanyInterface } from 'interfaces/company';
import { getCompanies } from 'apiSdk/companies';

function SocialMediaEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<SocialMediaInterface>(
    () => (id ? `/social-medias/${id}` : null),
    () => getSocialMediaById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: SocialMediaInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateSocialMediaById(id, values);
      mutate(updated);
      resetForm();
      router.push('/social-medias');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<SocialMediaInterface>({
    initialValues: data,
    validationSchema: socialMediaValidationSchema,
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
            Edit Social Media
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
            <FormControl id="platform" mb="4" isInvalid={!!formik.errors?.platform}>
              <FormLabel>Platform</FormLabel>
              <Input type="text" name="platform" value={formik.values?.platform} onChange={formik.handleChange} />
              {formik.errors.platform && <FormErrorMessage>{formik.errors?.platform}</FormErrorMessage>}
            </FormControl>
            <FormControl id="link" mb="4" isInvalid={!!formik.errors?.link}>
              <FormLabel>Link</FormLabel>
              <Input type="text" name="link" value={formik.values?.link} onChange={formik.handleChange} />
              {formik.errors.link && <FormErrorMessage>{formik.errors?.link}</FormErrorMessage>}
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
    entity: 'social_media',
    operation: AccessOperationEnum.UPDATE,
  }),
)(SocialMediaEditPage);
