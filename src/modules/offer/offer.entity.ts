import {City, Good, Location, OfferType} from '../../types/offer.type.js'; // Двойные импорты!
import typegoose, {getModelForClass, defaultClasses, Ref} from '@typegoose/typegoose';
import {UserEntity} from '../user/user.entity.js';
import {TitleLength, DescriptionLength, RatingCount, RATING_REG_EXP, BedroomsCount, MaxAdultsCount, Price} from '../../const.js'; // Двойные импорты!

const {prop, modelOptions} = typegoose;

export interface OfferEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'offers'
  }
})
export class OfferEntity extends defaultClasses.TimeStamps {
  @prop({trim: true, minLength: [TitleLength.MIN, `Min title length: ${TitleLength.MIN}`], maxLength: [TitleLength.MAX, `Max title length: ${TitleLength.MAX}`], required: true})
  public title!: string;

  @prop({trim: true, minLength: [DescriptionLength.MIN, `Min description length: ${DescriptionLength.MIN}`], maxLength: [DescriptionLength.MAX, `Max description length: ${DescriptionLength.MAX}`], required: true})
  public description!: string;

  @prop({required: true})
  public date!: string;

  @prop({required: true})
  public city!: City;

  @prop({required: true})
  public previewImage!: string;

  @prop({required: true})
  public images!: [string, string, string, string, string, string];

  @prop({required: true})
  public isPremium!: boolean;

  @prop({required: true, min: [RatingCount.MIN, `Min rating: ${RatingCount.MIN}`], max: [RatingCount.MAX, `Max rating: ${RatingCount.MAX}`], match: [RATING_REG_EXP, 'A whole number or with a single decimal added is allowed']})
  public rating!: number;

  @prop({required: true})
  public type!: OfferType;

  @prop({required: true, min: [BedroomsCount.MIN, `Min bedrooms count: ${BedroomsCount.MIN}`], max: [BedroomsCount.MAX, `Max bedrooms count: ${BedroomsCount.MAX}`]})
  public bedrooms!: number;

  @prop({required: true, min: [MaxAdultsCount.MIN, `Min adults count: ${MaxAdultsCount.MIN}`], max: [MaxAdultsCount.MAX, `Max adults count: ${MaxAdultsCount.MAX}`]})
  public maxAdults!: number;

  @prop({required: true, min: [Price.MIN, `Min price: ${Price.MIN}`], max: [Price.MAX, `Max price: ${Price.MAX}`]})
  public price!: number;

  @prop({required: true})
  public goods!: Good[];

  @prop({ref: UserEntity, required: true})
  public host!: Ref<UserEntity>;

  @prop({default: 0})
  public commentsCount!: number;

  @prop({required: true})
  public location!: Location;
}

export const OfferModel = getModelForClass(OfferEntity);
