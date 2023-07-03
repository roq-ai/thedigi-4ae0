import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { customFieldValidationSchema } from 'validationSchema/custom-fields';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.custom_field
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getCustomFieldById();
    case 'PUT':
      return updateCustomFieldById();
    case 'DELETE':
      return deleteCustomFieldById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getCustomFieldById() {
    const data = await prisma.custom_field.findFirst(convertQueryToPrismaUtil(req.query, 'custom_field'));
    return res.status(200).json(data);
  }

  async function updateCustomFieldById() {
    await customFieldValidationSchema.validate(req.body);
    const data = await prisma.custom_field.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteCustomFieldById() {
    const data = await prisma.custom_field.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
