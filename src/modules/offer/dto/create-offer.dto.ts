import {City, Good, Host, Location, OfferType} from '../../../types/offer.type.js';

export default class CreateOfferDto {
  public title!: string;
  public description!: string;
  public date!: string;
  public city!: City;
  public previewImage!: string;
  public images!: [string, string, string, string, string, string];
  public isPremium!: boolean;
  public rating!: number;
  public type!: OfferType;
  public bedrooms!: number;
  public maxAdults!: number;
  public price!: number;
  public goods!: Good[];
  public host!: Host;
  public commentsCount!: number;
  public location!: Location;
}
