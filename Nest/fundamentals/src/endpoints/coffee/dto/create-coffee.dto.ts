import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCoffeeDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  readonly brand: string;

  @IsOptional()
  @IsString({ each: true })
  readonly flavors: string[];
}
