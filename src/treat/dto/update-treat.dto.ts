import { PartialType } from '@nestjs/mapped-types';
import { CreateTreatDto } from './create-treat.dto';

export class UpdateTreatDto extends PartialType(CreateTreatDto) {}
