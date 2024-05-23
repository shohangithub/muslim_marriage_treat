import { IsNotEmpty } from "class-validator";

export class AddGalleryToEventDto{
    @IsNotEmpty()
    bannerUrl: string;
    @IsNotEmpty()
    eventId:number;
}