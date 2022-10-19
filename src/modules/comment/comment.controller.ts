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
import {OfferServiceInterface} from '../offer/offer-service.interface.js'; // Двойные импорты!
import {ValidateDtoMiddleware} from '../../common/middlewares/validate-dto.middleware.js'; // Двойные импорты!
import {DocumentExistsMiddleware} from '../../common/middlewares/document-exists.middleware.js'; // Двойные импорты!
import {PrivateRouteMiddleware} from '../../common/middlewares/private-route.middleware.js';

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
      middlewares: [
        new ValidateObjectIdMiddleware('id'),
        new DocumentExistsMiddleware(this.offerService, 'id')
      ]
    });
    this.addRoute({
      path: '/:id',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('id'),
        new ValidateDtoMiddleware(CreateCommentDto),
        new DocumentExistsMiddleware(this.offerService, 'id')
      ]
    });
  }

  public async index(req: Request, res: Response): Promise<void> {
    const comments = await this.commentService.findByOfferId(req.params.id);
    const commentsResponse = fillDTO(CommentResponse, comments);
    this.ok(res, commentsResponse);
  }

  public async create(
    {body, user, params}: Request<core.ParamsDictionary | ParamsGetOffer, Record<string, unknown>, CreateCommentDto>,
    res: Response
  ): Promise<void> {
    const hostId = user.id;
    const offerId = params.id;
    const transformedBody = {...body, hostId, offerId};
    const comment = await this.commentService.create(transformedBody);
    const commentResponse = fillDTO(CommentResponse, comment);
    this.created(res, commentResponse);
  }
}
