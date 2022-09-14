import {Offer} from '../types/offer.js';

export const createOffer = (row: string) => {
  const tokens = row.replace('\n', '').split('\t');
  const [title, description, date, city, previewImage, images, isPremium, rating, type, bedrooms, maxAdults, price, goods, host, commentsCount, location] = tokens;
  return {
    title,
    description,
    date,
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
    rating: Number(rating),
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
    commentsCount: Number(commentsCount),
    location: [location.split(';')].map(([latitude, longitude]) => ({
      latitude: Number(latitude),
      longitude: Number(longitude)
    }))[0]
  } as Offer;
};

export const getErrorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : '';
