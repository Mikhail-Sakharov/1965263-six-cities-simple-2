//import {CityEnum} from './city.js';

export type Good = 'Breakfast' | 'Air conditioning' | 'Laptop friendly workspace' | 'Baby seat' | 'Washer' | 'Towels' | 'Fridge';

export type Location = {
  latitude: number;
  longitude: number;
};

export type City = {
  name: 'Paris' | 'Cologne' | 'Brussels' | 'Amsterdam' | 'Hamburg' | 'Dusseldorf';
  location: Location;
};

//export type City = typeof CityEnum[keyof typeof CityEnum];

export type Host = {
  name: string;
  email: string;
  avatarUrl: string;
  password: string;
  isPro: boolean;
};

export type Offer = {
  title: string;
  description: string;
  date: string;
  city: City;
  previewImage: string;
  images: [string, string, string, string, string, string];
  isPremium: boolean;
  rating: number;
  type: 'apartment' | 'house' | 'room' | 'hotel';
  bedrooms: number;
  maxAdults: number;
  price: number;
  goods: Good[];
  host: Host;
  commentsCount: number;
  location: Location;
};
