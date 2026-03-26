import { Controller ,Get, Query} from '@nestjs/common';
import { NpmService } from './npm.service';

@Controller('npm')
export class NpmController {
   constructor(private npmService:NpmService){}

   @Get()
   async getPackageInfo(@Query('tech') tech:string){
      return this.getPackageInfo(tech);
   }
}
