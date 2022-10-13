import {City, OfferType, Good, Location} from '../../../types/offer.type.js';  // двойные импорты!

export default class UpdateOfferDto {
  public title?: string;
  public description?: string;
  public city?: City;
  public previewImage?: string;
  public images?: [string, string, string, string, string, string];
  public isPremium?: boolean;
  public type?: OfferType;
  public bedrooms?: number;
  public maxAdults?: number;
  public price?: number;
  public goods?: Good[];
  public location?: Location;
}
