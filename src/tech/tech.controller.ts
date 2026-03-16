import { Controller, Get, Query } from '@nestjs/common';
import { TechService } from './tech.service';

@Controller('tech')
export class TechController {

  constructor(private techService: TechService) {}

  @Get('suggest')
  async suggest(@Query('q') q:string) {

    if(!q) return [];

    return this.techService.searchTech(q);

  }

}