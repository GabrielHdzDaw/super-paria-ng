export interface UserLogin {
  email: string;
  password: string;
}

export interface UserRegister {
  name: string;
  email: string;
  password: string;
  img: string;
}

export interface AccessToken {
  accessToken: string;
}
