import { IsNotEmpty } from "class-validator";

export class PaginationQuery{
    @IsNotEmpty()
    pageSize: number;
    @IsNotEmpty()
    pageIndex: number;
    orderBy?: string;
    isAscending?: string;
    openText?: string;
}