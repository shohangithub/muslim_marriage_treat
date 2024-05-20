import { Module } from '@nestjs/common';
import { AzureBlobService } from './azure-blob.service';
import { AzureBlobController } from './azure-blob.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot(),],
  controllers: [AzureBlobController],
  providers: [AzureBlobService],
})
export class AzureBlobModule {}
