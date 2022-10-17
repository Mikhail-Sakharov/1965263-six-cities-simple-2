import {MiddlewareInterface} from '../../types/middleware.interface.js'; // Двойные импорты!
import {NextFunction, Request, Response} from 'express';
import {DocumentExistsInterface} from '../../types/document-exists.interface.js'; // Двойные импорты!
import HttpError from '../errors/http-error.js';
import {StatusCodes} from 'http-status-codes';

export class DocumentExistsMiddleware implements MiddlewareInterface {
  constructor(
    private readonly service: DocumentExistsInterface,
    private readonly paramName: string
  ) {}

  public async execute({params}: Request, _res: Response, next: NextFunction): Promise<void> {
    const documentId = params[this.paramName];
    if (!await this.service.exists(documentId)) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with the id ${documentId} not found.`,
        'DocumentExistsMiddleware'
      );
    }

    next();
  }
}
