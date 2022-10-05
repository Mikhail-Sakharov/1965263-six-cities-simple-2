import dayjs from 'dayjs';
import {WeekDays, RatingValuesRange, BedroomsRange, maxAdultsRange, Price, PasswordDigitsRange, CommentsRange} from '../../const.js';
import {MockData} from '../../types/mock-data.type.js';
import {City} from '../../types/offer.js';
import {getRandomItems, getRandomItem, generateRandomValue} from '../../utils/random.js';
import {OfferGeneratorInterface} from './offer-generator.interface.js';

export default class OfferGenerator implements OfferGeneratorInterface {
  constructor(private readonly mockData: MockData) {}

  public generate(): string {
    const title = getRandomItem<string>(this.mockData.titles);
    const description = getRandomItem<string>(this.mockData.descriptions);
    const date =  dayjs().subtract(generateRandomValue(WeekDays.FIRST, WeekDays.LAST), 'day').toISOString();

    const cityData = getRandomItem<City>(this.mockData.cities);
    const city = [Object.values(cityData)].map(([name, location]) => `${name};${Object.values(location).join(',')}`);
    const previewImage = getRandomItem<string>(this.mockData.images);
    const images = getRandomItems<string>(this.mockData.images).join(';');
    const isPremium = Boolean(generateRandomValue(0, 1)).toString();
    const rating = generateRandomValue(RatingValuesRange.MIN, RatingValuesRange.MAX).toString();
    const type = getRandomItem<string>(this.mockData.types);
    const bedrooms = generateRandomValue(BedroomsRange.MIN, BedroomsRange.MAX).toString();
    const maxAdults = generateRandomValue(maxAdultsRange.MIN, maxAdultsRange.MAX).toString();
    const price = generateRandomValue(Price.MIN, Price.MAX).toString();
    const goods = getRandomItems<string>(this.mockData.goods).join(';');

    const hostName = getRandomItem<string>(this.mockData.names);
    const hostEmail = getRandomItem<string>(this.mockData.emails);
    const avatarUrl = getRandomItem<string>(this.mockData.avatars);
    const password = `${getRandomItem<string>(this.mockData.names)}${generateRandomValue(PasswordDigitsRange.MIN, PasswordDigitsRange.MAX)}`;
    const isPro = Boolean(generateRandomValue(0, 1)).toString();
    const host = `${hostName};${hostEmail};${avatarUrl};${password};${isPro}`;

    const commentsCount = generateRandomValue(CommentsRange.MIN, CommentsRange.MAX).toString();

    const locationData = cityData.location;
    locationData.latitude += Math.random();
    locationData.longitude += Math.random();
    const location = Object.values(locationData).join(';');

    return [
      title,
      description,
      date,
      city,
      previewImage,
      images,
      isPremium,
      rating,
      type,
      bedrooms,
      maxAdults,
      price,
      goods,
      host,
      commentsCount,
      location
    ].join('\t');
  }
}


