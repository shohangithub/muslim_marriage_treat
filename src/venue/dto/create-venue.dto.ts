import { IsNotEmpty } from "class-validator";

export class CreateVenueDto {
    @IsNotEmpty()
    venueName: string;
    venueAdress!: string;
    isActive: boolean;
}
 