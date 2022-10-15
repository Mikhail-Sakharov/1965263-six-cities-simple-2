import 'reflect-metadata';
import {inject, injectable} from 'inversify';
import {LoggerInterface} from '../common/logger/logger.interface.js';
import {ConfigInterface} from '../common/config/config.interface.js';
import {Component} from '../types/component.types.js';
import {getURI} from '../utils/db.js';
import {DatabaseInterface} from '../common/database-client/database.interface.js';
import express, {Express} from 'express';
import {ControllerInterface} from '../common/controller/controller.interface.js';
import {ExceptionFilterInterface} from '../common/errors/exception-filter.interface.js';

// импорты для тестов
//import { UserServiceInterface } from '../modules/user/user-service.interface.js';
//import { OfferServiceInterface } from '../modules/offer/offer-service.interface.js';
//import { CommentServiceInterface } from '../modules/comment/comment-service.interface.js';
//import CreateCommentDto from '../modules/comment/dto/create-comment.dto.js';
//import UpdateOfferDto from '../modules/offer/dto/update-offer.dto.js';


@injectable()
export default class Application {
  private expressApp: Express;

  constructor(
    @inject(Component.LoggerInterface) private logger: LoggerInterface,
    @inject(Component.ConfigInterface) private config: ConfigInterface,
    @inject(Component.DatabaseInterface) private databaseClient: DatabaseInterface,
    @inject(Component.CommentController) private commentController: ControllerInterface,
    @inject(Component.OfferController) private offerController: ControllerInterface,
    @inject(Component.UserController) private userController: ControllerInterface,
    @inject(Component.ExceptionFilterInterface) private exceptionFilter: ExceptionFilterInterface,
    //@inject(Component.UserServiceInterface) private userService: UserServiceInterface,
    //@inject(Component.OfferServiceInterface) private offerService: OfferServiceInterface,
    //@inject(Component.CommentServiceInterface) private commentService: CommentServiceInterface
  ) {
    this.expressApp = express();
  }

  public initRoutes() {
    this.expressApp.use('/comments', this.commentController.router);
    this.expressApp.use('/offers', this.offerController.router);
    this.expressApp.use('/users', this.userController.router);
  }

  public initMiddleware() {
    this.expressApp.use(express.json());
  }

  public initExceptionFilters() {
    this.expressApp.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
  }

  public async init() {
    this.logger.info('Application initialization…');
    this.logger.info(`Get value from env $PORT: ${this.config.get('PORT')}`);

    const uri = getURI(
      this.config.get('DB_USER'),
      this.config.get('DB_PASSWORD'),
      this.config.get('DB_HOST'),
      this.config.get('DB_PORT'),
      this.config.get('DB_NAME'),
    );

    await this.databaseClient.connect(uri);

    this.initMiddleware();
    this.initRoutes();
    this.initExceptionFilters();
    this.expressApp.listen(this.config.get('PORT'));
    this.logger.info(`Express server started on http://localhost:${this.config.get('PORT')}`);

    // тестирование работы сервисов

    //=======================================================OFFERS====================================================================

    // поиск по id
    //const offer = await this.offerService.findById('634017bb711b20efa888a078');
    //console.log(offer);

    // получение всех офферов из БД
    //const offer = await this.offerService.find();
    //console.log(offer);

    // обновление оффера
    /* const exampleOffer = {
      title: 'Hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh',
      description: 'Aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
      previewImage: 'https://8.react.pages.academy/static/hotel/11.jpg',
      isPremium: false
    } as UpdateOfferDto;
    const offer = await this.offerService.findByIdAndUpdate('63483e58f5ba6ca3253dedc6', exampleOffer);
    console.log(offer); */

    // удаление оффера
    //const offer = await this.offerService.findByIdAndDelete('634017bb711b20efa888a075');
    //console.log(offer);

    // инкремент поля commentsCount
    //const offer = await this.offerService.incCommentsCount('634017bb711b20efa888a0e4');
    //console.log(offer);

    //=======================================================COMMENTS==================================================================

    // получение комментариев определённого оффера
    //const comments = await this.commentService.findByOfferId('634017bb711b20efa888a072');
    //console.log(comments);

    // добавление комментария
    /* const exampleComment = {
      commentText: 'This comment is for changing rating value',
      commentRating: 2,
      hostId: '634017ba711b20efa888a055',
      offerId: '634017bb711b20efa888a078'
    } as CreateCommentDto;
    const comment = await this.commentService.create(exampleComment);
    console.log(comment); */

    //=======================================================USERS====================================================================

    // создание юзера
    /* const exampleUser = {
      name: 'Mikhail',
      email: 'qwe@qweasd.com',
      avatarUrl: './img/qwe.png',
      password: '123456',
      isPro: true
    };
    const user = await this.userService.create(exampleUser, 'i74fhwf6t7643gf');
    console.log(user); */
  }
}
