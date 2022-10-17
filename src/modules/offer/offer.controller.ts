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
import HttpError from '../../common/errors/http-error.js'; // Двойные импорты!
import {ValidateObjectIdMiddleware} from '../../common/middlewares/validate-objectid.middleware.js';
import {ValidateDtoMiddleware} from '../../common/middlewares/validate-dto.middleware.js';

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
      middlewares: [new ValidateObjectIdMiddleware('id')]
    });
    this.addRoute({
      path: '/create',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [new ValidateDtoMiddleware(CreateOfferDto)]
    });
    this.addRoute({
      path: '/:id/update',
      method: HttpMethod.Patch,
      handler: this.update,
      middlewares: [new ValidateObjectIdMiddleware('id'), new ValidateDtoMiddleware(UpdateOfferDto)]
    });
    this.addRoute({
      path: '/:id/delete',
      method: HttpMethod.Delete,
      handler: this.delete,
      middlewares: [new ValidateObjectIdMiddleware('id')]
    });
  }

  public async index(_req: Request, res: Response): Promise<void> {
    const offers = await this.offerService.find();
    const offersResponse = fillDTO(OfferResponse, offers);
    this.ok(res, offersResponse);
  }

  public async show({params}: Request<core.ParamsDictionary | ParamsGetOffer>, res: Response) {
    const {id} = params;
    const offer = await this.offerService.findById(id);

    if (!offer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with the id ${id} not found.`,
        'OfferController'
      );
    }

    const offerResponse = fillDTO(OfferResponse, offer);
    this.ok(res, offerResponse);
  }

  // при создании нужно привязывать к юзеру: проверка существования юзера по id - при авторизации?
  public async create({body}: Request<Record<string, unknown>, Record<string, unknown>, CreateOfferDto>, res: Response): Promise<void> {
    const offer = await this.offerService.create(body);
    const offerResponse = fillDTO(OfferResponse, offer);
    this.created(res, offerResponse);
  }

  public async update({body, params}: Request<core.ParamsDictionary | ParamsGetOffer, Record<string, unknown>, UpdateOfferDto>, res: Response): Promise<void> {
    const id = String(params.id);
    const offer = await this.offerService.findByIdAndUpdate(id, body);

    if (!offer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with the id ${params.id} not found.`,
        'OfferController'
      );
    }

    const offerResponse = fillDTO(OfferResponse, offer);
    this.ok(res, offerResponse);
  }

  public async delete({params}: Request<core.ParamsDictionary | ParamsGetOffer>, res: Response): Promise<void> {
    const offer = await this.offerService.findByIdAndDelete(params.id);

    if (!offer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with the id ${params.id} not found.`,
        'OfferController'
      );
    }

    this.noContent(res, offer);
  }
}
