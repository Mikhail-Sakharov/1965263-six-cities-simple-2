import {types, DocumentType} from '@typegoose/typegoose';
import {injectable, inject} from 'inversify';
import {LoggerInterface} from '../../common/logger/logger.interface.js';
import {Component} from '../../types/component.types.js';
import {SortType} from '../../types/sort-type.enum.js';
import {OfferServiceInterface} from '../offer/offer-service.interface.js';
import {CommentServiceInterface} from './comment-service.interface.js';
import {COMMENTS_COUNT_LIMIT} from './comment.constant.js';
import {CommentEntity} from './comment.entity.js';
import CreateCommentDto from './dto/create-comment.dto.js';

@injectable()
export default class CommentService implements CommentServiceInterface {
  constructor(
    @inject(Component.LoggerInterface) private  readonly logger: LoggerInterface,
    @inject(Component.CommentModel) private readonly commentModel: types.ModelType<CommentEntity>,
    @inject(Component.OfferServiceInterface) private readonly offerModel: OfferServiceInterface
  ) {}

  public async create(dto: CreateCommentDto): Promise<DocumentType<CommentEntity>> {
    const result = await this.commentModel.create(dto);
    this.offerModel.incCommentsCount(dto.offerId);
    this.logger.info('New comment created');

    return result;
  }

  public async findByOfferId(offerId: string): Promise<DocumentType<CommentEntity>[]> {
    return this.commentModel
      .find({offerId}, {}, {COMMENTS_COUNT_LIMIT})
      .sort({createdAt: SortType.Down})
      .exec();
  }
}
