import { IsNotEmpty } from "class-validator";
import { Event } from "src/event/entities/event.entity";

export class CreatePackageDto {

    @IsNotEmpty()
    packageName: string;
    
    @IsNotEmpty()
    packagePrice: number;
  
    @IsNotEmpty()
    totalQty: number;

    @IsNotEmpty()
    event: Event;

    bookedQty: number;
    lookedQty: number;
    availablePackages: number;
    isActive: boolean;
}
