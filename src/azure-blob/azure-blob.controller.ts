/*
https://docs.nestjs.com/controllers#controllers
*/

import {
  Controller,
  Delete,
  Get,
  Header,
  Param,
  Post,
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AzureBlobService } from './azure-blob.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('azure_blob')
export class AzureBlobController {
  containerName = 'muslimcoupleretreat';
  constructor(private readonly azureBlobService: AzureBlobService) {}

  // upload file
  @Post('upload')
  @UseInterceptors(FileInterceptor('uploadfile'))
  async upload(@UploadedFile() file: Express.Multer.File): Promise<string> {
    console.log(file)
   const res = await this.azureBlobService.upload(file, this.containerName);
    return res;
  }

  // read file
  @Get('read-image')
  @Header('Content-Type', 'image/jpeg')
  async readImage(@Res() res, @Query('filename') filename) {
    const file = await this.azureBlobService.getfile(
      filename,
      this.containerName,
    );
    return file.pipe(res);
  }

  // delete file
  @Delete('/:filename')
  async delete(@Param('filename') filename) {
    await this.azureBlobService.deletefile(filename, this.containerName);
    return 'deleted';
  }

  // download file
  @Get('download-image')
  @Header('Content-Type', 'image/jpeg')
  @Header('Content-Disposition', 'attachment; filename=download.jpeg')
  async downloadImage(@Res() res, @Query('filename') filename) {
    const file = await this.azureBlobService.getfile(
      filename,
      this.containerName,
    );
    return file.pipe(res);
  }
}
