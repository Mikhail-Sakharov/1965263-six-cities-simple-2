import 'reflect-metadata';
import {inject, injectable} from 'inversify';
import {LoggerInterface} from '../common/logger/logger.interface.js';
import {ConfigInterface} from '../common/config/config.interface.js';
import {Component} from '../types/component.types.js';
import {getURI} from '../utils/db.js';
import {DatabaseInterface} from '../common/database-client/database.interface.js';

// импорты для тестов
//import { UserServiceInterface } from '../modules/user/user-service.interface.js';
//import { OfferServiceInterface } from '../modules/offer/offer-service.interface.js';
//import { CommentServiceInterface } from '../modules/comment/comment-service.interface.js';
//import CreateCommentDto from '../modules/comment/dto/create-comment.dto.js';
//import UpdateOfferDto from '../modules/offer/dto/update-offer.dto.js';


@injectable()
export default class Application {

  constructor(
    @inject(Component.LoggerInterface) private logger: LoggerInterface,
    @inject(Component.ConfigInterface) private config: ConfigInterface,
    @inject(Component.DatabaseInterface) private databaseClient: DatabaseInterface,
    //@inject(Component.UserServiceInterface) private userService: UserServiceInterface,
    //@inject(Component.OfferServiceInterface) private offerService: OfferServiceInterface,
    //@inject(Component.CommentServiceInterface) private commentService: CommentServiceInterface
  ) {}

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

    // тестирование работы сервисов

    //=======================================================OFFERS====================================================================

    // поиск по id
    //const offer = await this.offerService.findById('634017bb711b20efa888a075');
    //console.log(offer);

    // получение всех офферов из БД
    //const offer = await this.offerService.find();
    //console.log(offer);

    // обновление оффера
    /* const exampleOffer = {
      title: 'Hello world!',
      description: 'Relax',
      date: '2022-09-28T14:22:49.323Z',
      city: {
        name: 'Cologne',
        location: {
          latitude: 50.938361,
          longitude: 6.959974
        }
      },
      previewImage: 'https://8.react.pages.academy/static/hotel/11.jpg',
      images: [
        'https://8.react.pages.academy/static/hotel/6.jpg',
        'https://8.react.pages.academy/static/hotel/15.jpg',
        'https://8.react.pages.academy/static/hotel/6.jpg',
        'https://8.react.pages.academy/static/hotel/15.jpg',
        'https://8.react.pages.academy/static/hotel/9.jpg',
        'https://8.react.pages.academy/static/hotel/7.jpg'
      ],
      isPremium: true,
      rating: 4,
      type: 'apartment',
      bedrooms: 2,
      maxAdults: 8,
      price: 1551,
      goods: [ 'Washer', 'Breakfast', 'Fridge', 'Towels', 'Dishwasher' ],
      location: { latitude: 60.78583676534535, longitude: 16.239914550134912 }
    } as UpdateOfferDto;
    const offer = await this.offerService.findByIdAndUpdate('634017bb711b20efa888a075', exampleOffer);
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
      commentText: 'This is the 8th comment of the offer! Congrats!',
      commentRating: 5,
      hostId: '634017ba711b20efa888a055',
      offerId: '634017bb711b20efa888a072'
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
