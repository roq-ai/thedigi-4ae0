import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { companyValidationSchema } from 'validationSchema/companies';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getCompanies();
    case 'POST':
      return createCompany();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getCompanies() {
    const data = await prisma.company
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'company'));
    return res.status(200).json(data);
  }

  async function createCompany() {
    await companyValidationSchema.validate(req.body);
    const body = { ...req.body };
    if (body?.analytics?.length > 0) {
      const create_analytics = body.analytics;
      body.analytics = {
        create: create_analytics,
      };
    } else {
      delete body.analytics;
    }
    if (body?.custom_field?.length > 0) {
      const create_custom_field = body.custom_field;
      body.custom_field = {
        create: create_custom_field,
      };
    } else {
      delete body.custom_field;
    }
    if (body?.privacy?.length > 0) {
      const create_privacy = body.privacy;
      body.privacy = {
        create: create_privacy,
      };
    } else {
      delete body.privacy;
    }
    if (body?.social_media?.length > 0) {
      const create_social_media = body.social_media;
      body.social_media = {
        create: create_social_media,
      };
    } else {
      delete body.social_media;
    }
    if (body?.theme?.length > 0) {
      const create_theme = body.theme;
      body.theme = {
        create: create_theme,
      };
    } else {
      delete body.theme;
    }
    const data = await prisma.company.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
