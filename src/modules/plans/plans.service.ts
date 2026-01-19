import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PlansService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.plan.findMany();
  }

  findActive() {
    return this.prisma.plan.findMany({
      where: { active: true },
    });
  }

  create(data: {
    name: string;
    priceCents: number;
    animalLimit: number;
    pagarmePlanId: string;
  }) {
    return this.prisma.plan.create({ data });
  }

  update(
    id: string,
    data: Partial<{
      name: string;
      priceCents: number;
      animalLimit: number;
      active: boolean;
    }>,
  ) {
    return this.prisma.plan.update({
      where: { id },
      data,
    });
  }
}
