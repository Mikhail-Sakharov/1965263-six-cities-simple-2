import {
  BedroomsRange,
  maxAdultsRange,
  Price,
  PasswordDigitsRange,
  MockData,
  City,
  getRandomItems,
  getRandomItem,
  generateRandomValue
} from '../index.js';
import {OfferGeneratorInterface} from './offer-generator.interface.js';

export default class OfferGenerator implements OfferGeneratorInterface {
  constructor(private readonly mockData: MockData) {}

  public generate(): string {
    const title = getRandomItem<string>(this.mockData.titles);
    const description = getRandomItem<string>(this.mockData.descriptions);

    const cityData = getRandomItem<City>(this.mockData.cities);
    const city = [Object.values(cityData)].map(([name, location]) => `${name};${Object.values(location).join(',')}`);
    const previewImage = getRandomItem<string>(this.mockData.images);
    const images = getRandomItems<string>(this.mockData.images).join(';');
    const isPremium = Boolean(generateRandomValue(0, 1)).toString();
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

    const locationData = cityData.location;
    locationData.latitude += Math.random();
    locationData.longitude += Math.random();
    const location = Object.values(locationData).join(';');

    return [
      title,
      description,
      city,
      previewImage,
      images,
      isPremium,
      type,
      bedrooms,
      maxAdults,
      price,
      goods,
      host,
      location
    ].join('\t');
  }
}


