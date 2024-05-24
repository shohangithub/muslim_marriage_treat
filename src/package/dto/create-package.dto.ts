import { IsEnum, IsNotEmpty, IsNumber, Min } from 'class-validator';
import { Event } from 'src/event/entities/event.entity';
import { PACKAGE_PERSON, PACKAGE_TYPE } from 'src/utills/enum';

export class CreatePackageDto {
  @IsNotEmpty()
  packageName: string;

  @IsNotEmpty()
  @IsEnum(PACKAGE_TYPE)
  packageType: PACKAGE_TYPE;

  @IsNotEmpty()
  @IsEnum(PACKAGE_PERSON)
  packagePerson: PACKAGE_PERSON;

  @IsNotEmpty()
  highlightFeatures!: string;

  @IsNotEmpty()
  roomFeatures!: string;

  @IsNotEmpty()
  houseFeatures!: string;

  @IsNotEmpty()
  houseFeatureNote!: string;

  @IsNotEmpty()
  packageDeal!: string;

  @IsNotEmpty()
  packageDealNote!: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  packagePrice: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  totalQty: number;

  @IsNotEmpty()
  event: Event;
  
}
