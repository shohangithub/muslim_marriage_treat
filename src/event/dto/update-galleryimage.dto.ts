import { IsNotEmpty } from "class-validator";

export class UpdateGalleryImageDto{
    @IsNotEmpty()
    bannerUrl: string;
    @IsNotEmpty()
    id:number;
}