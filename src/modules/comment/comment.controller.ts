import {Request, Response} from 'express';
import {inject, injectable} from 'inversify';
import {Controller} from '../../common/controller/controller.js';
import {Component} from '../../types/component.types.js';
import {LoggerInterface} from '../../common/logger/logger.interface.js';
import {HttpMethod} from '../../types/http-method.enum.js';
import {CommentServiceInterface} from './comment-service.interface.js';
import {fillDTO} from '../../utils/common.js';
import CommentResponse from './response/comment.response.js';
import CreateCommentDto from './dto/create-comment.dto.js';

@injectable()
export default class CommentController extends Controller {
  constructor(
    @inject(Component.LoggerInterface) logger: LoggerInterface,
    @inject(Component.CommentServiceInterface) private readonly commentService: CommentServiceInterface
  ) {
    super(logger);

    this.logger.info('Register routes for CommentController…');

    this.addRoute({path: '/:id', method: HttpMethod.Get, handler: this.index});
    this.addRoute({path: '/:id', method: HttpMethod.Post, handler: this.create});
  }

  public async index(req: Request, res: Response): Promise<void> {
    const comments = await this.commentService.findByOfferId(req.params.id);
    const commentsResponse = fillDTO(CommentResponse, comments);
    this.ok(res, commentsResponse);
  }

  public async create({body, params}: Request<Record<string, unknown>, Record<string, unknown>, CreateCommentDto>, res: Response): Promise<void> {
    const transformedBody = {...body, offerId: params.id} as CreateCommentDto;
    const comment = await this.commentService.create(transformedBody);
    const commentResponse = fillDTO(CommentResponse, comment);
    this.ok(res, commentResponse);
  }
}
