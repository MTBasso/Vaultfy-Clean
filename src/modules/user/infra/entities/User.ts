export interface IUserDTO {
  username: string;
  email: string;
  password: string;
}

class User {
  id?: string;
  username!: string;
  email!: string;
  password!: string;
  secret?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export { User };
