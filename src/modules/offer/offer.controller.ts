import {Request, Response} from 'express';
import {inject, injectable} from 'inversify';
import * as core from 'express-serve-static-core';
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

type ParamsGetOffer = {
  id: string;
}

@injectable()
export default class OfferController extends Controller {
  constructor(
    @inject(Component.LoggerInterface) logger: LoggerInterface,
    @inject(Component.OfferServiceInterface) private readonly offerService: OfferServiceInterface
  ) {
    super(logger);

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
    {params}: Request<core.ParamsDictionary | ParamsGetOffer>,
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
    {body, params}: Request<core.ParamsDictionary | ParamsGetOffer, Record<string, unknown>, UpdateOfferDto>,
    res: Response
  ): Promise<void> {
    const id = String(params.id);
    const offer = await this.offerService.findByIdAndUpdate(id, body);
    const offerResponse = fillDTO(OfferResponse, offer);
    this.ok(res, offerResponse);
  }

  public async delete( // при удалении оффера удалить комментарии
    {params}: Request<core.ParamsDictionary | ParamsGetOffer>,
    res: Response
  ): Promise<void> {
    const offer = await this.offerService.findByIdAndDelete(params.id);
    this.noContent(res, offer);
  }
}
