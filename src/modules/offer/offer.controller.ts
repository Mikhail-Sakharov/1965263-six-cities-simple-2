import {Request, Response} from 'express';
import {inject, injectable} from 'inversify';
import {Controller} from '../../common/controller/controller.js';
import {Component} from '../../types/component.types.js';
import {LoggerInterface} from '../../common/logger/logger.interface.js';
import {HttpMethod} from '../../types/http-method.enum.js';
import {OfferServiceInterface} from './offer-service.interface.js';
//import OfferResponse from './response/offer.response.js';
//import {fillDTO} from '../../utils/common.js';
//import CommentResponse from './response/comment.response.js';

@injectable()
export default class OfferController extends Controller {
  constructor(
    @inject(Component.LoggerInterface) logger: LoggerInterface,
    @inject(Component.OfferServiceInterface) private readonly offerService: OfferServiceInterface
  ) {
    super(logger);

    this.logger.info('Register routes for OfferController…');

    this.addRoute({path: '/', method: HttpMethod.Get, handler: this.index});
    //this.addRoute({path: '/create', method: HttpMethod.Post, handler: this.create});
    //this.addRoute({path: '/:id/update', method: HttpMethod.Post, handler: this.update});
    //this.addRoute({path: '/:id/delete', method: HttpMethod.Post, handler: this.delete});
  }

  public async index(_req: Request, res: Response): Promise<void> {
    const offers = await this.offerService.find();
    //const offersResponse = fillDTO(OfferResponse, offers);
    this.ok(res, offers);
  }

  /* public async create({body, params}: Request, res: Response): Promise<void> {
    const comment = await this.commentService.create({...body, offerId: params.id});
    const commentResponse = fillDTO(CommentResponse, comment);
    this.ok(res, commentResponse);
  } */

  /* public async update({body, params}: Request, res: Response): Promise<void> {
    const comment = await this.commentService.create({...body, offerId: params.id});
    const commentResponse = fillDTO(CommentResponse, comment);
    this.ok(res, commentResponse);
  } */

  /* public async delete({body, params}: Request, res: Response): Promise<void> {
    const comment = await this.commentService.create({...body, offerId: params.id});
    const commentResponse = fillDTO(CommentResponse, comment);
    this.ok(res, commentResponse);
  } */
}
