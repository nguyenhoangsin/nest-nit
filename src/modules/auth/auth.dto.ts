import { IsString, IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => String(value))
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
