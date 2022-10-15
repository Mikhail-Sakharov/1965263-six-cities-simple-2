import {Expose} from 'class-transformer';

export default class CommentResponse {
  @Expose()
  public commentRating!: number;

  @Expose()
  public commentText!: string;

  @Expose()
  public hostId!: string;

  @Expose()
  public createdAt!: string;
}
