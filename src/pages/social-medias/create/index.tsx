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
} from '@chakra-ui/react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { createSocialMedia } from 'apiSdk/social-medias';
import { Error } from 'components/error';
import { socialMediaValidationSchema } from 'validationSchema/social-medias';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { CompanyInterface } from 'interfaces/company';
import { getCompanies } from 'apiSdk/companies';
import { SocialMediaInterface } from 'interfaces/social-media';

function SocialMediaCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: SocialMediaInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createSocialMedia(values);
      resetForm();
      router.push('/social-medias');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<SocialMediaInterface>({
    initialValues: {
      platform: '',
      link: '',
      company_id: (router.query.company_id as string) ?? null,
    },
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
            Create Social Media
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
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
    operation: AccessOperationEnum.CREATE,
  }),
)(SocialMediaCreatePage);
