//import {City, Good, Location, OfferType} from '../../../types/offer.type.js'; // Двойные импорты!
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsEnum,
  //IsInstance,
  IsInt,
  IsMongoId,
  IsNumber,
  //IsObject,
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

  //@IsObject({message: 'This is not a "City" type object!'}) // не реагирует на невалидные данные
  //@IsInstance(City) // возвращает ошибку даже при валидных данных
  public city!: City;

  @MaxLength(256, {message: 'Too long for the field "previewImage"'})
  public previewImage!: string;

  @IsArray({message: 'The field "images" should be an array'}) // как провалидироваь кортеж: тип элементов?
  @ArrayMinSize(6)
  @ArrayMaxSize(6)
  public images!: [string, string, string, string, string, string];

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
  //@IsEnum(Good, {message: 'This is not a "Good" type value!'}) // возвращает ошибку даже при валидных данных, не реагирует на невалидные значения внутри массива
  public goods!: Good[];

  @IsMongoId({message: 'The "hostId" field should be a valid MongoDB id'})
  public hostId!: string;

  @ValidateNested({message: 'This is not a "Location" type object!'}) // не реагирует на невалидные данные
  public location!: Location;
}
