import { IsNotEmpty } from "class-validator";
import { RoomType } from "src/room-type/entities/room-type.entity";
import { Treat } from "src/treat/entities/treat.entity";

export class CreateRoomDto {

    @IsNotEmpty()
    roomName: string;
    
    @IsNotEmpty()
    packagePrice: number;
  
    @IsNotEmpty()
    totalQty: number;

    @IsNotEmpty()
    treat: Treat;

    @IsNotEmpty()
    roomType: RoomType;

    bookedQty: number;
    lookedQty: number;
    availableRooms: number;
    isActive: boolean;
}
