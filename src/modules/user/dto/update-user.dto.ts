import {IsBoolean, IsEmail, IsString, MaxLength, MinLength} from 'class-validator';

export default class UpdateUserDto {
  @MinLength(1, {message: 'Minimum name length is 1'})
  @MaxLength(15, {message: 'Maximum name length is 15'})
  public name?: string;

  @IsEmail({}, {message: 'email must be a valid address'})
  public email?: string;

  @MaxLength(256, {message: 'Too long for the field "avatarUrl"'})
  public avatarUrl?: string;

  @IsString({message: 'password is required'})
  public password?: string;

  @IsBoolean({message: 'The field "isPro" should be a boolean'})
  public isPro?: boolean;
}
