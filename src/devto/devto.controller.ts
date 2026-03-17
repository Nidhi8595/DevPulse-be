import { Controller,Get,Query } from '@nestjs/common';
import { DevtoService } from './devto.service';


@Controller('devto')
export class DevtoController {
    constructor(private devtoService: DevtoService) {}

    @Get()
    async getArticles(@Query('tech') tech:string){
        return this.devtoService.getArticles(tech);
    }
}
