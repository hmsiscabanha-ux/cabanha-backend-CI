import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { PlansService } from './plans.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AdminGuard } from '../../common/guards/admin.guard';

@Controller('admin/plans')
@UseGuards(JwtAuthGuard, AdminGuard)
export class PlansController {
  constructor(private plansService: PlansService) {}

  @Get()
  list() {
    return this.plansService.findAll();
  }

  @Post()
  create(@Body() body: any) {
    return this.plansService.create(body);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.plansService.update(id, body);
  }
}
