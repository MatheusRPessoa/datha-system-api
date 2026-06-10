import { ApiProperty } from '@nestjs/swagger';

export abstract class BaseSuccessResponseDto {
    @ApiProperty({ example: true })
    succeeded: boolean;

    @ApiProperty({ required: false })
    message?: string;
}

export class SuccessMessageResponseDto extends BaseSuccessResponseDto {}