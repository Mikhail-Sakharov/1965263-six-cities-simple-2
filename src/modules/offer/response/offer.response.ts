import {Expose, Type} from 'class-transformer';
import {City, Good, Location, OfferType} from '../../../types/offer.type.js';
import UserResponse from '../../user/response/user.response.js';

export default class OfferResponse {
  @Expose()
  public id!: string;

  @Expose()
  public title!: string;

  @Expose()
  public description!: string;

  @Expose()
  public createdAt!: string;

  @Expose()
  public city!: City;

  @Expose()
  public previewImage!: string;

  @Expose()
  public images!: [string, string, string, string, string, string];

  @Expose()
  public isPremium!: boolean;

  @Expose()
  public rating!: number;

  @Expose()
  public type!: OfferType;

  @Expose()
  public bedrooms!: number;

  @Expose()
  public maxAdults!: number;

  @Expose()
  public price!: number;

  @Expose()
  public goods!: Good[];

  @Expose()
  @Type(() => UserResponse)
  public hostId!: UserResponse;

  @Expose()
  public commentsCount!: number;

  @Expose()
  public location!: Location;
}
