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
import { createAnalytics } from 'apiSdk/analytics';
import { Error } from 'components/error';
import { analyticsValidationSchema } from 'validationSchema/analytics';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { CompanyInterface } from 'interfaces/company';
import { getCompanies } from 'apiSdk/companies';
import { AnalyticsInterface } from 'interfaces/analytics';

function AnalyticsCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: AnalyticsInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createAnalytics(values);
      resetForm();
      router.push('/analytics');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<AnalyticsInterface>({
    initialValues: {
      views: 0,
      clicks: 0,
      company_id: (router.query.company_id as string) ?? null,
    },
    validationSchema: analyticsValidationSchema,
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
            Create Analytics
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="views" mb="4" isInvalid={!!formik.errors?.views}>
            <FormLabel>Views</FormLabel>
            <NumberInput
              name="views"
              value={formik.values?.views}
              onChange={(valueString, valueNumber) =>
                formik.setFieldValue('views', Number.isNaN(valueNumber) ? 0 : valueNumber)
              }
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            {formik.errors.views && <FormErrorMessage>{formik.errors?.views}</FormErrorMessage>}
          </FormControl>
          <FormControl id="clicks" mb="4" isInvalid={!!formik.errors?.clicks}>
            <FormLabel>Clicks</FormLabel>
            <NumberInput
              name="clicks"
              value={formik.values?.clicks}
              onChange={(valueString, valueNumber) =>
                formik.setFieldValue('clicks', Number.isNaN(valueNumber) ? 0 : valueNumber)
              }
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            {formik.errors.clicks && <FormErrorMessage>{formik.errors?.clicks}</FormErrorMessage>}
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
    entity: 'analytics',
    operation: AccessOperationEnum.CREATE,
  }),
)(AnalyticsCreatePage);
