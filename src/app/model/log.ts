import { User } from './user';

export interface Log {
  timestamp: number;
  system: boolean;
  data: User | null;
  error?: string;
}
