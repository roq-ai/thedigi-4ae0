import AppLayout from 'layout/app-layout';
import NextLink from 'next/link';
import React, { useState } from 'react';
import {
  Text,
  Box,
  Spinner,
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Button,
  Link,
  IconButton,
  Flex,
  Center,
  Stack,
} from '@chakra-ui/react';
import { UserSelect } from 'components/user-select';
import { FiTrash, FiEdit2, FiEdit3 } from 'react-icons/fi';
import { getCompanyById } from 'apiSdk/companies';
import { Error } from 'components/error';
import { CompanyInterface } from 'interfaces/company';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { compose } from 'lib/compose';
import {
  AccessOperationEnum,
  AccessServiceEnum,
  requireNextAuth,
  useAuthorizationApi,
  withAuthorization,
} from '@roq/nextjs';
import { deleteAnalyticsById } from 'apiSdk/analytics';
import { deleteCustomFieldById } from 'apiSdk/custom-fields';
import { deletePrivacyById } from 'apiSdk/privacies';
import { deleteSocialMediaById } from 'apiSdk/social-medias';
import { deleteThemeById } from 'apiSdk/themes';

function CompanyViewPage() {
  const { hasAccess } = useAuthorizationApi();
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<CompanyInterface>(
    () => (id ? `/companies/${id}` : null),
    () =>
      getCompanyById(id, {
        relations: ['user', 'analytics', 'custom_field', 'privacy', 'social_media', 'theme'],
      }),
  );

  const analyticsHandleDelete = async (id: string) => {
    setDeleteError(null);
    try {
      await deleteAnalyticsById(id);
      await mutate();
    } catch (error) {
      setDeleteError(error);
    }
  };

  const custom_fieldHandleDelete = async (id: string) => {
    setDeleteError(null);
    try {
      await deleteCustomFieldById(id);
      await mutate();
    } catch (error) {
      setDeleteError(error);
    }
  };

  const privacyHandleDelete = async (id: string) => {
    setDeleteError(null);
    try {
      await deletePrivacyById(id);
      await mutate();
    } catch (error) {
      setDeleteError(error);
    }
  };

  const social_mediaHandleDelete = async (id: string) => {
    setDeleteError(null);
    try {
      await deleteSocialMediaById(id);
      await mutate();
    } catch (error) {
      setDeleteError(error);
    }
  };

  const themeHandleDelete = async (id: string) => {
    setDeleteError(null);
    try {
      await deleteThemeById(id);
      await mutate();
    } catch (error) {
      setDeleteError(error);
    }
  };

  const [deleteError, setDeleteError] = useState(null);
  const [createError, setCreateError] = useState(null);

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Flex justifyContent="space-between" mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Company Detail View
          </Text>
          {hasAccess('company', AccessOperationEnum.UPDATE, AccessServiceEnum.PROJECT) && (
            <NextLink href={`/companies/edit/${data?.id}`} passHref legacyBehavior>
              <Button
                onClick={(e) => e.stopPropagation()}
                mr={2}
                as="a"
                variant="outline"
                colorScheme="blue"
                leftIcon={<FiEdit2 />}
              >
                Edit
              </Button>
            </NextLink>
          )}
        </Flex>
        {error && (
          <Box mb={4}>
            {' '}
            <Error error={error} />{' '}
          </Box>
        )}
        {isLoading ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
          <>
            <Stack direction="column" spacing={2} mb={4}>
              <Flex alignItems="center">
                <Text fontSize="lg" fontWeight="bold" as="span">
                  Description:
                </Text>
                <Text fontSize="md" as="span" ml={3}>
                  {data?.description}
                </Text>
              </Flex>
              <Flex alignItems="center">
                <Text fontSize="lg" fontWeight="bold" as="span">
                  Image:
                </Text>
                <Text fontSize="md" as="span" ml={3}>
                  {data?.image}
                </Text>
              </Flex>
              <Flex alignItems="center">
                <Text fontSize="lg" fontWeight="bold" as="span">
                  Name:
                </Text>
                <Text fontSize="md" as="span" ml={3}>
                  {data?.name}
                </Text>
              </Flex>
              <Flex alignItems="center">
                <Text fontSize="lg" fontWeight="bold" as="span">
                  Created At:
                </Text>
                <Text fontSize="md" as="span" ml={3}>
                  {data?.created_at as unknown as string}
                </Text>
              </Flex>
              <Flex alignItems="center">
                <Text fontSize="lg" fontWeight="bold" as="span">
                  Updated At:
                </Text>
                <Text fontSize="md" as="span" ml={3}>
                  {data?.updated_at as unknown as string}
                </Text>
              </Flex>
            </Stack>
            <Box>
              {hasAccess('user', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                <Flex alignItems="center" mb={4}>
                  <Text fontSize="lg" fontWeight="bold" as="span">
                    User:
                  </Text>
                  <Text fontSize="md" as="span" ml={3}>
                    <Link as={NextLink} href={`/users/view/${data?.user?.id}`}>
                      {data?.user?.email}
                    </Link>
                  </Text>
                </Flex>
              )}
              {hasAccess('analytics', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                <Stack spacing={2} mb={8}>
                  <Flex justifyContent="space-between">
                    <Text fontSize="lg" fontWeight="bold">
                      Analytics
                    </Text>
                    <NextLink passHref href={`/analytics/create?company_id=${data?.id}`}>
                      <Button colorScheme="blue" mr="4" as="a">
                        Create
                      </Button>
                    </NextLink>
                  </Flex>
                  <TableContainer mb={4}>
                    <Table variant="simple">
                      <Thead>
                        <Tr>
                          <Th>views</Th>
                          <Th>clicks</Th>
                          <Th>Actions</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {data?.analytics?.map((record) => (
                          <Tr
                            cursor="pointer"
                            onClick={() => router.push(`/analytics/view/${record.id}`)}
                            key={record.id}
                          >
                            <Td>{record.views}</Td>
                            <Td>{record.clicks}</Td>
                            <Td>
                              {hasAccess('analytics', AccessOperationEnum.UPDATE, AccessServiceEnum.PROJECT) && (
                                <NextLink
                                  onClick={(e) => e.stopPropagation()}
                                  passHref
                                  href={`/analytics/edit/${record.id}`}
                                >
                                  <Button mr={2} as="a" variant="outline" colorScheme="blue" leftIcon={<FiEdit2 />}>
                                    Edit
                                  </Button>
                                </NextLink>
                              )}
                              {hasAccess('analytics', AccessOperationEnum.DELETE, AccessServiceEnum.PROJECT) && (
                                <IconButton
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    analyticsHandleDelete(record.id);
                                  }}
                                  colorScheme="red"
                                  variant="outline"
                                  aria-label="edit"
                                  icon={<FiTrash />}
                                />
                              )}
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </TableContainer>
                </Stack>
              )}

              {hasAccess('custom_field', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                <Stack spacing={2} mb={8}>
                  <Flex justifyContent="space-between">
                    <Text fontSize="lg" fontWeight="bold">
                      Custom Fields
                    </Text>
                    <NextLink passHref href={`/custom-fields/create?company_id=${data?.id}`}>
                      <Button colorScheme="blue" mr="4" as="a">
                        Create
                      </Button>
                    </NextLink>
                  </Flex>
                  <TableContainer mb={4}>
                    <Table variant="simple">
                      <Thead>
                        <Tr>
                          <Th>field_name</Th>
                          <Th>field_value</Th>
                          <Th>Actions</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {data?.custom_field?.map((record) => (
                          <Tr
                            cursor="pointer"
                            onClick={() => router.push(`/custom-fields/view/${record.id}`)}
                            key={record.id}
                          >
                            <Td>{record.field_name}</Td>
                            <Td>{record.field_value}</Td>
                            <Td>
                              {hasAccess('custom_field', AccessOperationEnum.UPDATE, AccessServiceEnum.PROJECT) && (
                                <NextLink
                                  onClick={(e) => e.stopPropagation()}
                                  passHref
                                  href={`/custom-fields/edit/${record.id}`}
                                >
                                  <Button mr={2} as="a" variant="outline" colorScheme="blue" leftIcon={<FiEdit2 />}>
                                    Edit
                                  </Button>
                                </NextLink>
                              )}
                              {hasAccess('custom_field', AccessOperationEnum.DELETE, AccessServiceEnum.PROJECT) && (
                                <IconButton
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    custom_fieldHandleDelete(record.id);
                                  }}
                                  colorScheme="red"
                                  variant="outline"
                                  aria-label="edit"
                                  icon={<FiTrash />}
                                />
                              )}
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </TableContainer>
                </Stack>
              )}

              {hasAccess('privacy', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                <Stack spacing={2} mb={8}>
                  <Flex justifyContent="space-between">
                    <Text fontSize="lg" fontWeight="bold">
                      Privacies
                    </Text>
                    <NextLink passHref href={`/privacies/create?company_id=${data?.id}`}>
                      <Button colorScheme="blue" mr="4" as="a">
                        Create
                      </Button>
                    </NextLink>
                  </Flex>
                  <TableContainer mb={4}>
                    <Table variant="simple">
                      <Thead>
                        <Tr>
                          <Th>settings</Th>
                          <Th>Actions</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {data?.privacy?.map((record) => (
                          <Tr
                            cursor="pointer"
                            onClick={() => router.push(`/privacies/view/${record.id}`)}
                            key={record.id}
                          >
                            <Td>{record.settings}</Td>
                            <Td>
                              {hasAccess('privacy', AccessOperationEnum.UPDATE, AccessServiceEnum.PROJECT) && (
                                <NextLink
                                  onClick={(e) => e.stopPropagation()}
                                  passHref
                                  href={`/privacies/edit/${record.id}`}
                                >
                                  <Button mr={2} as="a" variant="outline" colorScheme="blue" leftIcon={<FiEdit2 />}>
                                    Edit
                                  </Button>
                                </NextLink>
                              )}
                              {hasAccess('privacy', AccessOperationEnum.DELETE, AccessServiceEnum.PROJECT) && (
                                <IconButton
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    privacyHandleDelete(record.id);
                                  }}
                                  colorScheme="red"
                                  variant="outline"
                                  aria-label="edit"
                                  icon={<FiTrash />}
                                />
                              )}
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </TableContainer>
                </Stack>
              )}

              {hasAccess('social_media', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                <Stack spacing={2} mb={8}>
                  <Flex justifyContent="space-between">
                    <Text fontSize="lg" fontWeight="bold">
                      Social Medias
                    </Text>
                    <NextLink passHref href={`/social-medias/create?company_id=${data?.id}`}>
                      <Button colorScheme="blue" mr="4" as="a">
                        Create
                      </Button>
                    </NextLink>
                  </Flex>
                  <TableContainer mb={4}>
                    <Table variant="simple">
                      <Thead>
                        <Tr>
                          <Th>platform</Th>
                          <Th>link</Th>
                          <Th>Actions</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {data?.social_media?.map((record) => (
                          <Tr
                            cursor="pointer"
                            onClick={() => router.push(`/social-medias/view/${record.id}`)}
                            key={record.id}
                          >
                            <Td>{record.platform}</Td>
                            <Td>{record.link}</Td>
                            <Td>
                              {hasAccess('social_media', AccessOperationEnum.UPDATE, AccessServiceEnum.PROJECT) && (
                                <NextLink
                                  onClick={(e) => e.stopPropagation()}
                                  passHref
                                  href={`/social-medias/edit/${record.id}`}
                                >
                                  <Button mr={2} as="a" variant="outline" colorScheme="blue" leftIcon={<FiEdit2 />}>
                                    Edit
                                  </Button>
                                </NextLink>
                              )}
                              {hasAccess('social_media', AccessOperationEnum.DELETE, AccessServiceEnum.PROJECT) && (
                                <IconButton
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    social_mediaHandleDelete(record.id);
                                  }}
                                  colorScheme="red"
                                  variant="outline"
                                  aria-label="edit"
                                  icon={<FiTrash />}
                                />
                              )}
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </TableContainer>
                </Stack>
              )}

              {hasAccess('theme', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                <Stack spacing={2} mb={8}>
                  <Flex justifyContent="space-between">
                    <Text fontSize="lg" fontWeight="bold">
                      Themes
                    </Text>
                    <NextLink passHref href={`/themes/create?company_id=${data?.id}`}>
                      <Button colorScheme="blue" mr="4" as="a">
                        Create
                      </Button>
                    </NextLink>
                  </Flex>
                  <TableContainer mb={4}>
                    <Table variant="simple">
                      <Thead>
                        <Tr>
                          <Th>name</Th>
                          <Th>color_scheme</Th>
                          <Th>Actions</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {data?.theme?.map((record) => (
                          <Tr cursor="pointer" onClick={() => router.push(`/themes/view/${record.id}`)} key={record.id}>
                            <Td>{record.name}</Td>
                            <Td>{record.color_scheme}</Td>
                            <Td>
                              {hasAccess('theme', AccessOperationEnum.UPDATE, AccessServiceEnum.PROJECT) && (
                                <NextLink
                                  onClick={(e) => e.stopPropagation()}
                                  passHref
                                  href={`/themes/edit/${record.id}`}
                                >
                                  <Button mr={2} as="a" variant="outline" colorScheme="blue" leftIcon={<FiEdit2 />}>
                                    Edit
                                  </Button>
                                </NextLink>
                              )}
                              {hasAccess('theme', AccessOperationEnum.DELETE, AccessServiceEnum.PROJECT) && (
                                <IconButton
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    themeHandleDelete(record.id);
                                  }}
                                  colorScheme="red"
                                  variant="outline"
                                  aria-label="edit"
                                  icon={<FiTrash />}
                                />
                              )}
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </TableContainer>
                </Stack>
              )}
            </Box>
            <Box></Box>
          </>
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
    entity: 'company',
    operation: AccessOperationEnum.READ,
  }),
)(CompanyViewPage);
