import typegoose, {getModelForClass, defaultClasses, Ref} from '@typegoose/typegoose';
import {OfferEntity} from '../offer/offer.entity.js';
import {UserEntity} from '../user/user.entity.js';
import {CommentLength, Rating} from './comment.constant.js';

const {prop, modelOptions} = typegoose;

export interface CommentEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'comments'
  }
})
export class CommentEntity extends defaultClasses.TimeStamps {
  @prop({trim: true, minLength: [CommentLength.MIN, `Min comment length: ${CommentLength.MIN}`], maxLength: [CommentLength.MAX, `Max comment length: ${CommentLength.MAX}`], required: true})
  public commentText!: string;

  @prop({min: [Rating.MIN, `Min rating: ${Rating.MIN}`], max: [Rating.MAX, `Max rating: ${Rating.MAX}`], required: true})
  public commentRating!: number;

  @prop({ref: UserEntity, required: true})
  public hostId!: Ref<UserEntity>;

  @prop({ref: OfferEntity, required: true})
  public offerId!: Ref<OfferEntity>;
}

export const CommentModel = getModelForClass(CommentEntity);
