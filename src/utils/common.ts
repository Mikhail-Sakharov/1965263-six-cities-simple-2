import crypto from 'crypto';
import * as jose from 'jose';
import {plainToInstance, ClassConstructor} from 'class-transformer';
import {Offer} from '../types/offer.type.js';

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

export const createErrorObject = (message: string) => ({
  error: message,
});

export const createJWT = async (algoritm: string, jwtSecret: string, payload: object): Promise<string> =>
  new jose.SignJWT({...payload})
    .setProtectedHeader({ alg: algoritm})
    .setIssuedAt()
    .setExpirationTime('2d')
    .sign(crypto.createSecretKey(jwtSecret, 'utf-8'));
