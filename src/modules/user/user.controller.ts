import {Request, Response} from 'express';
import {inject, injectable} from 'inversify';
import {StatusCodes} from 'http-status-codes';
import * as core from 'express-serve-static-core';
import CreateUserDto from './dto/create-user.dto.js';
import {UserServiceInterface} from './user-service.interface.js';
import UserResponse from './response/user.response.js';
import LoginUserDto from './dto/login-user.dto.js';
import {JWT_ALGORITHM} from './user.constant.js';
import LoggedUserResponse from './response/logged-user.response.js';
import {
  Controller,
  Component,
  LoggerInterface,
  ConfigInterface,
  HttpMethod,
  createJWT,
  fillDTO,
  ValidateDtoMiddleware,
  ValidateObjectIdMiddleware,
  UploadFileMiddleware,
  PrivateRouteMiddleware,
  HttpError
} from '../index.js';

type GetUserParams = {
  id: string;
}

@injectable()
export default class UserController extends Controller {
  constructor(
    @inject(Component.LoggerInterface) logger: LoggerInterface,
    @inject(Component.ConfigInterface) configService: ConfigInterface,
    @inject(Component.UserServiceInterface) private readonly userService: UserServiceInterface
  ) {
    super(logger, configService);

    this.logger.info('Register routes for UserController…');

    this.addRoute({
      path: '/register',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [new ValidateDtoMiddleware(CreateUserDto)]
    });
    this.addRoute({
      path: '/login',
      method: HttpMethod.Post,
      handler: this.login,
      middlewares: [new ValidateDtoMiddleware(LoginUserDto)]
    });
    this.addRoute({
      path: '/:id/avatar',
      method: HttpMethod.Post,
      handler: this.uploadAvatar,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('id'),
        new UploadFileMiddleware(this.configService.get('UPLOAD_DIRECTORY'), 'avatar')
      ]
    });
    this.addRoute({
      path: '/login',
      method: HttpMethod.Get,
      handler: this.checkAuthenticate
    });
  }

  public async create(
    {body, user}: Request<Record<string, unknown>, Record<string, unknown>, CreateUserDto>,
    res: Response
  ): Promise<void> {
    if (user) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        'Only unauthorized users can be registered',
        'UserController'
      );
    }

    const existsUser = await this.userService.findByEmail(body.email);

    if (existsUser) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        `User with the email ${body.email} already exists.`,
        'UserController'
      );
    }

    const result = await this.userService.create(body, this.configService.get('SALT'));
    this.created(
      res,
      fillDTO(UserResponse, result)
    );
  }

  public async login(
    {body}: Request<Record<string, unknown>, Record<string, unknown>, LoginUserDto>,
    res: Response,
  ): Promise<void> {
    const user = await this.userService.verifyUser(body, this.configService.get('SALT'));

    if (!user) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Unauthorized',
        'UserController'
      );
    }

    const token = await createJWT(
      JWT_ALGORITHM,
      this.configService.get('JWT_SECRET'),
      {email: user.email, id: user.id}
    );

    this.ok(res, {
      ...fillDTO(LoggedUserResponse, user),
      token
    });
  }

  public async uploadAvatar(
    {params, user, file}: Request<core.ParamsDictionary | GetUserParams>,
    res: Response
  ) {
    const existingUser = await this.userService.findById(params.id);
    const existingUserEmail = fillDTO(UserResponse, existingUser).email;

    if (user.email !== existingUserEmail) {
      throw new HttpError(
        StatusCodes.FORBIDDEN,
        'Forbidden',
        'UserController: uploadAvatar'
      );
    }

    const updatedUser = await this.userService.updateById(params.id, {avatarUrl: file?.filename});
    this.created(res, fillDTO(UserResponse, updatedUser));
  }

  public async checkAuthenticate(req: Request, res: Response) {
    if (!req.user) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Unauthorized',
        'UserController'
      );
    }

    const user = await this.userService.findByEmail(req.user.email);

    this.ok(res, fillDTO(LoggedUserResponse, user));
  }
}
