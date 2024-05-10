import { IsNotEmpty } from "class-validator";

export class CreateRoomDto {

    @IsNotEmpty()
    roomName: string;
    
    @IsNotEmpty()
    packagePrice: number;
  
    @IsNotEmpty()
    totalQty: number;

    bookedQty: number;
    lookedQty: number;
    availableRooms: number;
    isActive: boolean;
}
