export interface TestUser {
  id: string;
  email: string;
  name: string;
}

export interface TestUserWithToken extends TestUser {
  token: string;
}
