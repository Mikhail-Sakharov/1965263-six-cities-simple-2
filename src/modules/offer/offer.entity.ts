import {City, Good, Location} from '../../types/offer.js';
import typegoose, {getModelForClass, defaultClasses, Ref} from '@typegoose/typegoose';
import {UserEntity} from '../user/user.entity.js';

// пометка для себя: магические значения в константы!

const {prop, modelOptions} = typegoose;

export interface OfferEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'offers'
  }
})
export class OfferEntity extends defaultClasses.TimeStamps { // не понимаю, почему нам не нужен конструктор в оффере, а в юзере нужен
  /* constructor(data: Offer) {
    super();

    this.title = data.title;
    this.description = data.description;
    this.date = data.date;
    this.city = data.city;
    this.previewImage = data.previewImage;
    this.images = data.images;
    this.isPremium = data.isPremium;
    this.rating = data.rating;
    this.type = data.type;
    this.bedrooms = data.bedrooms;
    this.maxAdults = data.maxAdults;
    this.price = data.price;
    this.goods = data.goods;
    //this.host = data.host;
    this.commentsCount = data.commentsCount; //рассчитывается автоматически
    this.location = data.location;
  } */

  @prop({trim: true, minLength: [10, 'Min title length: 10'], maxLength: [100, 'Max title length: 100'], required: true})
  public title!: string;

  @prop({trim: true, minLength: [20, 'Min description length : is 20'], maxLength: [1024, 'Max description length: 1024'], required: true})
  public description!: string;

  @prop({required: true}) // дату наследуем из Base? Удалять поле?
  public date!: string;

  @prop({required: true}) // нужен type: функция, которая возвращает конструктор типа?
  public city!: City;

  @prop({required: true})
  public previewImage!: string;

  @prop({required: true}) // нужен type: функция, которая возвращает конструктор типа?
  public images!: [string, string, string, string, string, string];

  @prop({required: true})
  public isPremium!: boolean;

  @prop({required: true, min: [1, 'Min rating: 1'], max: [5, 'Max rating: 5'], match: [/^[1-5].[1-9]$|^[1-5]$/, 'A whole number or with a single decimal added is allowed']})
  public rating!: number;

  @prop({required: true})
  public type!: 'apartment' | 'house' | 'room' | 'hotel';

  @prop({required: true, min: [1, 'Min bedrooms count: 1'], max: [8, 'Max bedrooms count: 8']})
  public bedrooms!: number;

  @prop({required: true, min: [1, 'Min adults count: 1'], max: [10, 'Max adults count: 10']})
  public maxAdults!: number;

  @prop({required: true, min: [100, 'Min price: 100'], max: [100000, 'Max price: 100000']})
  public price!: number;

  @prop({required: true}) // нужен type: функция, которая возвращает конструктор типа?
  public goods!: Good[];

  @prop({ref: UserEntity, required: true})
  public host!: Ref<UserEntity>;

  @prop({default: 0})
  public commentsCount!: number;

  @prop({required: true}) // нужен type: функция, которая возвращает конструктор типа?
  public location!: Location;
}

export const OfferModel = getModelForClass(OfferEntity);
