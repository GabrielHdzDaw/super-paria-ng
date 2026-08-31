export interface User {
  id: number;
  name: string;
  email: string;
  img: string;
  role: 'USER' | 'ADMIN';
}
