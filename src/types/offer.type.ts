type Paris = {
  name: 'Paris',
  location: {
    latitude: 48.85661,
    longitude: 2.351499
  }
};

type Cologne = {
  name: 'Cologne',
  location: {
    latitude: 50.938361,
    longitude: 6.959974
  }
};

type Brussels = {
  name: 'Brussels',
  location: {
    latitude: 50.846557,
    longitude: 4.351697
  }
};

type Amsterdam = {
  name: 'Amsterdam',
  location: {
    latitude: 52.370216,
    longitude: 4.895168
  }
};

type Hamburg = {
  name: 'Hamburg',
  location: {
    latitude: 53.550341,
    longitude: 10.000654
  }
};

type Dusseldorf = {
  name: 'Dusseldorf',
  location: {
    latitude: 51.225402,
    longitude: 6.776314
  }
};

export type Good = 'Breakfast' | 'Air conditioning' | 'Laptop friendly workspace' | 'Baby seat' | 'Washer' | 'Towels' | 'Fridge';

export type OfferType = 'apartment' | 'house' | 'room' | 'hotel';

export type Location = {
  latitude: number;
  longitude: number;
};

export type City = Paris | Cologne | Brussels | Amsterdam | Hamburg | Dusseldorf;

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
  city: City;
  previewImage: string;
  images: [string, string, string, string, string, string];
  isPremium: boolean;
  type: OfferType;
  bedrooms: number;
  maxAdults: number;
  price: number;
  goods: Good[];
  host: Host;
  location: Location;
};
