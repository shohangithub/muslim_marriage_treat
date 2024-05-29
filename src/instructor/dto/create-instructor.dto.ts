import { IsNotEmpty } from "class-validator";

export class CreateInstructorDto {
    @IsNotEmpty()
    name: string;
    degree!: string;
    imageUrl!: string;
    isActive: boolean;
    orderNumber!: number
}
