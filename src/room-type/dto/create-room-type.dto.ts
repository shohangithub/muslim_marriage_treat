import { IsNotEmpty } from "class-validator";

export class CreateRoomTypeDto {
    @IsNotEmpty()
    typeName: string;
    description: string;
    isActive: boolean;
}
