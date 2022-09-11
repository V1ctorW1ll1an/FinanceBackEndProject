export interface ICreateUserInputDTO {
  name: string;
  email: string;
  password: string;
  salt?: string;
}

export interface ICreateUserOutputDTO {
  id: string;
  name: string;
  email: string;
}
