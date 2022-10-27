import {Request, Response} from 'express';
import {inject, injectable} from 'inversify';
import * as core from 'express-serve-static-core';
import {
  Controller,
  Component,
  LoggerInterface,
  HttpMethod,
  fillDTO,
  ValidateObjectIdMiddleware,
  ConfigInterface,
  ValidateDtoMiddleware,
  DocumentExistsMiddleware,
  PrivateRouteMiddleware
} from '../index.js';
import {CommentServiceInterface} from './comment-service.interface.js';
import CommentResponse from './response/comment.response.js';
import CreateCommentDto from './dto/create-comment.dto.js';
import {OfferServiceInterface} from '../offer/offer-service.interface.js';

type ParamsGetOffer = {
  id: string;
}

@injectable()
export default class CommentController extends Controller {
  constructor(
    @inject(Component.LoggerInterface) logger: LoggerInterface,
    @inject(Component.ConfigInterface) configService: ConfigInterface,
    @inject(Component.CommentServiceInterface) private readonly commentService: CommentServiceInterface,
    @inject(Component.OfferServiceInterface) private readonly offerService: OfferServiceInterface
  ) {
    super(logger, configService);

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
