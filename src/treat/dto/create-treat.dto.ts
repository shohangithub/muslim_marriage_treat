import { IsNotEmpty } from 'class-validator';
import { Room } from 'src/room/entities/room.entity';

export class CreateTreatDto {
  @IsNotEmpty()
  treatName: string;
  description: string;
  vanue: string;
  isActive: boolean;
  Rooms: Room[];
}
