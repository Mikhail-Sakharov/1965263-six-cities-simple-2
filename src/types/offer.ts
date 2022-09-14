export type Location = {
  latitude: number;
  longitude: number;
};

export type City = {
  name: string;
  location: Location;
};

type Host = {
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
    images: string[];
    isPremium: boolean;
    rating: number;
    type: string;
    bedrooms: number;
    maxAdults: number;
    price: number;
    goods: string[];
    host: Host;
    commentsCount: number;
    location: Location;
  };
