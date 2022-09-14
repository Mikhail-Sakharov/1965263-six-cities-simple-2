import {readFileSync} from 'fs';
import {Offer} from '../../types/offer.js';
import {FileReaderInterface} from './file-reader.interface.js';

export default class TSVFileReader implements FileReaderInterface {
  private rawData = '';

  constructor(public filename: string) { }

  public read(): void {
    this.rawData = readFileSync(this.filename, { encoding: 'utf8' });
  }

  public toArray(): Offer[] {
    if (!this.rawData) {
      return [];
    }

    return this.rawData
      .split('\n')
      .filter((row) => row.trim() !== '')
      .map((line) => line.split('\t'))
      .map(([title, description, date, city, previewImage, images, isPremium, rating, type, bedrooms, maxAdults, price, goods, host, commentsCount, location]) => ({
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
      }));
  }
}
