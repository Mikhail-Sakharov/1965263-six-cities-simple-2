import {Type} from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsNumber,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateNested
} from 'class-validator';

enum Good {
  Breakfast = 'Breakfast',
  AirConditioning = 'Air conditioning',
  LaptopFriendlyWorkspace = 'Laptop friendly workspace',
  BabySeat = 'Baby seat',
  Washer = 'Washer',
  Towels = 'Towels',
  Fridge = 'Fridge',
}

enum OfferType {
  Apartment = 'apartment',
  House = 'house',
  Room = 'room',
  Hotel = 'hotel'
}

enum CityName {
  Paris = 'Paris',
  Cologne = 'Cologne',
  Brussels = 'Brussels',
  Amsterdam = 'Amsterdam',
  Hamburg = 'Hamburg',
  Dusseldorf = 'Dusseldorf'
}

class Location {
  @IsNumber()
  public latitude!: number;

  @IsNumber()
  public longitude!: number;
}

class City {
  @IsEnum(CityName, {message: 'The field "name" should be one of the six cities'})
  public name!: CityName;

  @ValidateNested({message: 'This is not a "Location" type object!'})
  public location!: Location;
}

export default class CreateOfferDto {
  @MinLength(10, {message: 'Minimum title length is 10'})
  @MaxLength(100, {message: 'Maximum title length is 100'})
  public title!: string;

  @MinLength(20, {message: 'Minimum description length is 20'})
  @MaxLength(1024, {message: 'Maximum description length is 1024'})
  public description!: string;

  @ValidateNested({each: true})
  @Type(() => City)
  public city!: City;

  @IsBoolean({message: 'The field "isPremium" should be a boolean'})
  public isPremium!: boolean;

  @IsEnum(OfferType, {message: 'This is not an "OfferType" value!'})
  public type!: OfferType;

  @IsInt({message: 'Bedrooms should be an integer'})
  @Min(1, {message: 'Min bedrooms count is 1'})
  @Max(8, {message: 'Max bedrooms count is 8'})
  public bedrooms!: number;

  @IsInt({message: 'Adults count should be an integer'})
  @Min(1, {message: 'Min adults count is 1'})
  @Max(10, {message: 'Max adults count is 10'})
  public maxAdults!: number;

  @IsInt({message: 'Price should be an integer'})
  @Min(100, {message: 'Minimum price is 100'})
  @Max(100000, {message: 'Maximum price is 100000'})
  public price!: number;

  @IsArray({message: 'The field "goods" should be an array'})
  @IsEnum(Good, {each: true})
  public goods!: Good[];

  public hostId!: string;

  @ValidateNested({each: true})
  @Type(() => Location)
  public location!: Location;
}
