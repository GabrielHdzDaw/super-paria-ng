import { User } from 'src/app/shared/interfaces/user.interface';

export interface Score {
  id: number;
  user: User;
  score: number;
}
