export const Price = {
  MIN: 100,
  MAX: 100000
};

export const WeekDays = {
  FIRST: 1,
  LAST: 7
};

export const CommentsRange = {
  MIN: 1,
  MAX: 10
};

export const PasswordDigitsRange = {
  MIN: 1,
  MAX: 9999
};

export const BedroomsRange = {
  MIN: 1,
  MAX: 3
};

export const maxAdultsRange = {
  MIN: 1,
  MAX: 9
};

export const RatingValuesRange = {
  MIN: 1,
  MAX: 5
};

export const TitleLength = {
  MIN: 10,
  MAX: 100
};

export const DescriptionLength = {
  MIN: 20,
  MAX: 1024
};

export const RatingCount = {
  MIN: 1,
  MAX: 5
};

export const RATING_REG_EXP = /^[1-5].[1-9]$|^[1-5]$/;

export const BedroomsCount = {
  MIN: 1,
  MAX: 8
};

export const MaxAdultsCount = {
  MIN: 1,
  MAX: 10
};

export const UserNameLength = {
  MIN: 1,
  MAX: 15
};

export const EMAIL_REG_EXP = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,5}$/;

export const AVATAR_URL_REG_EXP = /^.+(?:.jpg)|.+(?:.png)$/;
