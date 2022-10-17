import {Expose, Type} from 'class-transformer';
import UserResponse from '../../user/response/user.response.js'; // Двойные импорты!

export default class CommentResponse {
  @Expose()
  public commentRating!: number;

  @Expose()
  public commentText!: string;

  @Expose({name: 'hostId'})
  @Type(() => UserResponse)
  public host!: UserResponse;

  @Expose({name: 'createdAt'})
  public date!: string;
}
