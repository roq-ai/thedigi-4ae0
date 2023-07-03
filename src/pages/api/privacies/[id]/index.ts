import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { privacyValidationSchema } from 'validationSchema/privacies';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.privacy
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getPrivacyById();
    case 'PUT':
      return updatePrivacyById();
    case 'DELETE':
      return deletePrivacyById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getPrivacyById() {
    const data = await prisma.privacy.findFirst(convertQueryToPrismaUtil(req.query, 'privacy'));
    return res.status(200).json(data);
  }

  async function updatePrivacyById() {
    await privacyValidationSchema.validate(req.body);
    const data = await prisma.privacy.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deletePrivacyById() {
    const data = await prisma.privacy.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
