import { IsNotEmpty } from "class-validator";

export class AddPackageGalleryDto{
    @IsNotEmpty()
    bannerUrl: string;
    @IsNotEmpty()
    eventId:number;
}