import { PartialType } from '@nestjs/mapped-types';
import { CreatePackageDto } from './create-package.dto';
import { IsNumber, Min } from 'class-validator';

export class UpdatePackageDto extends PartialType(CreatePackageDto) {}

export class ManagePackageStockDto {
  @IsNumber()
  @Min(0)
  totalQty: number;

  @IsNumber()
  @Min(0)
  reservedQty: number;
}

export class ConfirmPackageStockDto {
    
  @IsNumber()
  @Min(0)
  reservedQty: number;

  @IsNumber()
  @Min(0)
  confirmedQty: number;

}

export class CancelPackageStockDto {
    
    @IsNumber()
    @Min(0)
    totalQty: number;
    
    @IsNumber()
    @Min(0)
    confirmedQty: number;
  
  }
