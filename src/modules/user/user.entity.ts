import {Host} from '../../types/offer.type.js';
import typegoose, {getModelForClass, defaultClasses} from '@typegoose/typegoose';
import {createSHA256} from '../../utils/common.js';

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

  @prop({minLength: [1, 'Min length for name is 1'], maxLength: [15, 'Max length for name is 15'], required: true})
  public name!: string;

  @prop({unique: true, /* match: [/^([\w-\\.]+@([\w-]+\.)+[\w-]{2,4})?$/, 'Email is incorrect'],  */required: true})
  public email!: string;

  @prop({match: [/^.+(?:.jpg)|.+(?:.png)$/, 'Avatar is invalid']})
  public avatarUrl!: string;

  @prop({/* minLength: [6, 'Min length for password is 6'], maxLength: [12, 'Max length for password is 12'],  */required: true})
  public password!: string;

  @prop()
  public isPro!: boolean;

  public setPassword(password: string, salt: string) {
    this.password = createSHA256(password, salt);
  }

  public getPassword() {
    return this.password;
  }
}

export const UserModel = getModelForClass(UserEntity);
