import typegoose, {getModelForClass, defaultClasses} from '@typegoose/typegoose';
import {Host, createSHA256, UserNameLength, EMAIL_REG_EXP, AVATAR_URL_REG_EXP} from '../index.js';

const {prop, modelOptions} = typegoose;

export interface UserEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'users'
  }
})
export class UserEntity extends defaultClasses.TimeStamps implements Host {
  constructor(data: Host) {
    super();

    this.name = data.name;
    this.email = data.email;
    this.avatarUrl = data.avatarUrl;
    this.password = data.password;
    this.isPro = data.isPro;
  }

  @prop({minLength: [UserNameLength.MIN, `Min length for name is ${UserNameLength.MIN}`], maxLength: [UserNameLength.MAX, `Max length for name is ${UserNameLength.MAX}`], required: true})
  public name!: string;

  @prop({unique: true, match: [EMAIL_REG_EXP, 'Email is incorrect'], required: true})
  public email!: string;

  @prop({match: [AVATAR_URL_REG_EXP, 'Avatar is invalid']})
  public avatarUrl!: string;

  @prop({required: true})
  public password!: string;

  @prop()
  public isPro!: boolean;

  public setPassword(password: string, salt: string) {
    this.password = createSHA256(password, salt);
  }

  public getPassword() {
    return this.password;
  }

  public verifyPassword(password: string, salt: string) {
    const hashPassword = createSHA256(password, salt);
    return hashPassword === this.password;
  }
}

export const UserModel = getModelForClass(UserEntity);
