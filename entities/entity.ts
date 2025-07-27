import { Type } from "class-transformer";
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";

export class ListClass {
  @IsOptional()
  @IsString()
  className?: string;
}

export class DEF {
  @IsNumber()
  id: number;

  @IsString()
  name: string;

  @IsString()
  address: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => ListClass)
  listClass?: ListClass;
}

export class ABC {
  @IsNumber()
  id: number;

  @IsString()
  name: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DEF)
  listFriends?: DEF[];
}
