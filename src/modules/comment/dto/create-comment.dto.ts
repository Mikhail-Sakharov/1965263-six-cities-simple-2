import {IsInt, Max, Min, IsString, Length} from 'class-validator';

export default class CreateCommentDto {
  @IsString({message: 'text is required'})
  @Length(5, 1024, {message: 'Min length is 5, max is 1024'})
  public commentText!: string;

  @IsInt({message: 'The value of "commentRating" should be an integer'})
  @Min(1, {message: 'Min rating is 1'})
  @Max(5, {message: 'Max rating is 5'})
  public commentRating!: number;

  public hostId!: string;

  public offerId!: string;
}
