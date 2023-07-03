import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { socialMediaValidationSchema } from 'validationSchema/social-medias';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.social_media
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getSocialMediaById();
    case 'PUT':
      return updateSocialMediaById();
    case 'DELETE':
      return deleteSocialMediaById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getSocialMediaById() {
    const data = await prisma.social_media.findFirst(convertQueryToPrismaUtil(req.query, 'social_media'));
    return res.status(200).json(data);
  }

  async function updateSocialMediaById() {
    await socialMediaValidationSchema.validate(req.body);
    const data = await prisma.social_media.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteSocialMediaById() {
    const data = await prisma.social_media.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
