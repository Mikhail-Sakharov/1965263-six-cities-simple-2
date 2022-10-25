import {Request, Response} from 'express';
import {inject, injectable} from 'inversify';
import * as core from 'express-serve-static-core';
import {StatusCodes} from 'http-status-codes';
import {Controller} from '../../common/controller/controller.js'; // Двойные импорты!
import {Component} from '../../types/component.types.js'; // Двойные импорты!
import {LoggerInterface} from '../../common/logger/logger.interface.js'; // Двойные импорты!
import {HttpMethod} from '../../types/http-method.enum.js'; // Двойные импорты!
import {OfferServiceInterface} from './offer-service.interface.js';
import OfferResponse from './response/offer.response.js';
import {fillDTO} from '../../utils/common.js'; // Двойные импорты!
import CreateOfferDto from './dto/create-offer.dto.js';
import UpdateOfferDto from './dto/update-offer.dto.js';
import {ValidateObjectIdMiddleware} from '../../common/middlewares/validate-objectid.middleware.js'; // Двойные импорты!
import {ValidateDtoMiddleware} from '../../common/middlewares/validate-dto.middleware.js'; // Двойные импорты!
import {DocumentExistsMiddleware} from '../../common/middlewares/document-exists.middleware.js'; // Двойные импорты!
import {PrivateRouteMiddleware} from '../../common/middlewares/private-route.middleware.js';
import {CommentServiceInterface} from '../comment/comment-service.interface.js';
import HttpError from '../../common/errors/http-error.js'; // Двойные импорты!
import {ConfigInterface} from '../../common/config/config.interface.js';

type GetOfferParams = {
  id: string;
}

@injectable()
export default class OfferController extends Controller {
  constructor(
    @inject(Component.LoggerInterface) logger: LoggerInterface,
    @inject(Component.ConfigInterface) configService: ConfigInterface,
    @inject(Component.OfferServiceInterface) private readonly offerService: OfferServiceInterface,
    @inject(Component.CommentServiceInterface) private readonly commentService: CommentServiceInterface
  ) {
    super(logger, configService);

    this.logger.info('Register routes for OfferController…');

    this.addRoute({path: '/', method: HttpMethod.Get, handler: this.index});
    this.addRoute({
      path: '/:id',
      method: HttpMethod.Get,
      handler: this.show,
      middlewares: [
        new ValidateObjectIdMiddleware('id'),
        new DocumentExistsMiddleware(this.offerService, 'id')
      ]
    });
    this.addRoute({
      path: '/create',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateDtoMiddleware(CreateOfferDto)
      ]
    });
    this.addRoute({
      path: '/:id/update',
      method: HttpMethod.Patch,
      handler: this.update,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('id'),
        new ValidateDtoMiddleware(UpdateOfferDto),
        new DocumentExistsMiddleware(this.offerService, 'id')
      ]
    });
    this.addRoute({
      path: '/:id/delete',
      method: HttpMethod.Delete,
      handler: this.delete,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('id'),
        new DocumentExistsMiddleware(this.offerService, 'id')
      ]
    });
  }

  public async index(req: Request, res: Response): Promise<void> {
    const offersCount = Number(req.query.offersCount);
    const offers = await this.offerService.find(offersCount);
    const offersResponse = fillDTO(OfferResponse, offers);
    this.ok(res, offersResponse);
  }

  public async show(
    {params}: Request<core.ParamsDictionary | GetOfferParams>,
    res: Response
  ) {
    const {id} = params;
    const offer = await this.offerService.findById(id);
    const offerResponse = fillDTO(OfferResponse, offer);
    this.ok(res, offerResponse);
  }

  public async create(
    {body, user}: Request<Record<string, unknown>, Record<string, unknown>, CreateOfferDto>,
    res: Response
  ): Promise<void> {
    const hostId = user.id;
    const offer = await this.offerService.create({...body, hostId});
    const offerResponse = fillDTO(OfferResponse, offer);
    this.created(res, offerResponse);
  }

  public async update(
    {body, params, user}: Request<core.ParamsDictionary | GetOfferParams, Record<string, unknown>, UpdateOfferDto>,
    res: Response
  ): Promise<void> {
    const offer = await this.offerService.findById(params.id);
    const offerCreatorEmail = fillDTO(OfferResponse, offer).host.email;

    if (user.email !== offerCreatorEmail) {
      throw new HttpError(
        StatusCodes.FORBIDDEN,
        'Forbidden',
        'OfferController: update'
      );
    }

    const updatedOffer = await this.offerService.findByIdAndUpdate(params.id, body);
    const offerResponse = fillDTO(OfferResponse, updatedOffer);
    this.ok(res, offerResponse);
  }

  public async delete(
    {params, user}: Request<core.ParamsDictionary | GetOfferParams>,
    res: Response
  ): Promise<void> {
    const offer = await this.offerService.findById(params.id);
    const offerCreatorEmail = fillDTO(OfferResponse, offer).host.email;

    if (user.email !== offerCreatorEmail) {
      throw new HttpError(
        StatusCodes.FORBIDDEN,
        'Forbidden',
        'OfferController: delete'
      );
    }

    const deletedOffer = await this.offerService.findByIdAndDelete(params.id);
    await this.commentService.deleteByOfferId(params.id);
    this.noContent(res, deletedOffer);
  }
}
