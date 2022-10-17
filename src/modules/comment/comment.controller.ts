import {Request, Response} from 'express';
import {inject, injectable} from 'inversify';
import * as core from 'express-serve-static-core';
import {Controller} from '../../common/controller/controller.js'; // Двойные импорты!
import {Component} from '../../types/component.types.js'; // Двойные импорты!
import {LoggerInterface} from '../../common/logger/logger.interface.js'; // Двойные импорты!
import {HttpMethod} from '../../types/http-method.enum.js'; // Двойные импорты!
import {CommentServiceInterface} from './comment-service.interface.js';
import {fillDTO} from '../../utils/common.js'; // Двойные импорты!
import CommentResponse from './response/comment.response.js';
import CreateCommentDto from './dto/create-comment.dto.js';
import {ValidateObjectIdMiddleware} from '../../common/middlewares/validate-objectid.middleware.js';
import {OfferServiceInterface} from '../offer/offer-service.interface.js';
import {StatusCodes} from 'http-status-codes';
import HttpError from '../../common/errors/http-error.js';
import {ValidateDtoMiddleware} from '../../common/middlewares/validate-dto.middleware.js';

type ParamsGetOffer = {
  id: string;
}

@injectable()
export default class CommentController extends Controller {
  constructor(
    @inject(Component.LoggerInterface) logger: LoggerInterface,
    @inject(Component.CommentServiceInterface) private readonly commentService: CommentServiceInterface,
    @inject(Component.OfferServiceInterface) private readonly offerService: OfferServiceInterface
  ) {
    super(logger);

    this.logger.info('Register routes for CommentController…');

    this.addRoute({
      path: '/:id',
      method: HttpMethod.Get,
      handler: this.index,
      middlewares: [new ValidateObjectIdMiddleware('id')]
    });
    this.addRoute({
      path: '/:id',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [new ValidateObjectIdMiddleware('id'), new ValidateDtoMiddleware(CreateCommentDto)]
    });
  }

  public async index(req: Request, res: Response): Promise<void> {
    if (!await this.offerService.findById(req.params.id)) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with the id ${req.params.id} not found.`,
        'OfferController'
      );
    }

    const comments = await this.commentService.findByOfferId(req.params.id);
    const commentsResponse = fillDTO(CommentResponse, comments);
    this.ok(res, commentsResponse);
  }

  public async create({body, params}: Request<core.ParamsDictionary | ParamsGetOffer, Record<string, unknown>, CreateCommentDto>, res: Response): Promise<void> {
    if (!await this.offerService.findById(params.id)) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with the id ${params.id} not found.`,
        'OfferController'
      );
    }

    const transformedBody = {...body, offerId: params.id};
    const comment = await this.commentService.create(transformedBody);
    const commentResponse = fillDTO(CommentResponse, comment);
    this.ok(res, commentResponse);
  }
}
