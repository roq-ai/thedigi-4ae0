import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { analyticsValidationSchema } from 'validationSchema/analytics';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.analytics
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getAnalyticsById();
    case 'PUT':
      return updateAnalyticsById();
    case 'DELETE':
      return deleteAnalyticsById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getAnalyticsById() {
    const data = await prisma.analytics.findFirst(convertQueryToPrismaUtil(req.query, 'analytics'));
    return res.status(200).json(data);
  }

  async function updateAnalyticsById() {
    await analyticsValidationSchema.validate(req.body);
    const data = await prisma.analytics.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteAnalyticsById() {
    const data = await prisma.analytics.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
