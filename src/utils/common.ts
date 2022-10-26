import crypto from 'crypto';
import * as jose from 'jose';
import {plainToInstance, ClassConstructor} from 'class-transformer';
import {ValidationError} from 'class-validator';
import {Offer} from '../types/offer.type.js';
import {ValidationErrorField} from '../types/validation-error-field.type.js';
import {ServiceError} from '../types/service-error.enum.js';
import {DEFAULT_STATIC_IMAGES} from '../app/application.constant.js';
import {UnknownObject} from '../types/unknown-object.type.js';

export const createOffer = (row: string) => {
  const tokens = row.replace('\n', '').split('\t');
  const [title, description, city, previewImage, images, isPremium, type, bedrooms, maxAdults, price, goods, host, location] = tokens;
  return {
    title,
    description,
    city: {
      name: city.split(';')[0],
      location: {
        latitude: Number(city.split(';')[1].split(',')[0]),
        longitude: Number(city.split(';')[1].split(',')[1])
      }
    },
    previewImage,
    images: images.split(';').map((url) => url),
    isPremium: Boolean(isPremium),
    type,
    bedrooms: Number(bedrooms),
    maxAdults: Number(maxAdults),
    price: Number(price),
    goods: goods.split(';'),
    host: [host.split(';')].map(([name, email, avatarUrl, password, isPro]) => ({
      name,
      email,
      avatarUrl,
      password,
      isPro: Boolean(isPro)
    }))[0],
    location: [location.split(';')].map(([latitude, longitude]) => ({
      latitude: Number(latitude),
      longitude: Number(longitude)
    }))[0]
  } as Offer;
};

export const getErrorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : '';

export const createSHA256 = (line: string, salt: string): string => {
  const shaHasher = crypto.createHmac('sha256', salt);
  return shaHasher.update(line).digest('hex');
};

export const fillDTO = <T, V>(someDto: ClassConstructor<T>, plainObject: V) =>
  plainToInstance(someDto, plainObject, {excludeExtraneousValues: true});

export const createErrorObject = (serviceError: ServiceError, message: string, details: ValidationErrorField[] = []) => ({
  errorType: serviceError,
  message,
  details: [...details]
});

export const createJWT = async (algoritm: string, jwtSecret: string, payload: object): Promise<string> =>
  new jose.SignJWT({...payload})
    .setProtectedHeader({ alg: algoritm})
    .setIssuedAt()
    .setExpirationTime('2d')
    .sign(crypto.createSecretKey(jwtSecret, 'utf-8'));

export const transformErrors = (errors: ValidationError[]): ValidationErrorField[] =>
  errors.map(({property, value, constraints}) => ({
    property,
    value,
    messages: constraints ? Object.values(constraints) : []
  }));

export const getFullServerPath = (host: string, port: number) => `http://${host}:${port}`;

const isObject = (value: unknown) => typeof value === 'object' && value !== null;

export const transformProperty = (
  property: string,
  someObject: UnknownObject,
  transformFn: (object: UnknownObject) => void
) => {
  Object.keys(someObject)
    .forEach((key) => {
      if (key === property) {
        transformFn(someObject);
      } else if (isObject(someObject[key])) {
        transformProperty(property, someObject[key] as UnknownObject, transformFn);
      }
    });
};

export const transformObject = (properties: string[], staticPath: string, uploadPath: string, data:UnknownObject) => {
  properties
    .forEach((property) => transformProperty(property, data, (target: UnknownObject) => {
      if (Array.isArray(target[property])) {
        const transformedValue = (target[property] as string[]).map((path) => path === '' ? '' : `${staticPath}/${path}`);
        target[property] = transformedValue;
      } else {
        const rootPath = DEFAULT_STATIC_IMAGES.includes(target[property] as string) ? staticPath : uploadPath;
        target[property] = target[property] === '' ? '' : `${rootPath}/${target[property]}`;
      }
    }));
};
