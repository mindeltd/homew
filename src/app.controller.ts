import { Controller, Get, Query, Res, UsePipes, ValidationPipe } from '@nestjs/common';
import { Response } from 'express';
import { AppService } from './app.service';
import { join } from 'path';
import { QueryDataDto } from './dtos/query-data.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getForm(@Res() res: Response) {
    res.sendFile(join(__dirname, '..', 'public', 'index.html'));
  }

  @Get('query')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async queryData(@Query() query: QueryDataDto): Promise<any> {
    const result = await this.appService.queryData(query.ticker.toUpperCase(), query.column.toLocaleLowerCase(), query.table.toLocaleLowerCase());
    return { result };
  }
}
