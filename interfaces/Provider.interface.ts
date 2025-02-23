export default interface ProviderInterface {
  id: string;
  name: string;
  image: string;
  color: string;
  accounts: AccountInterface[];
}

export interface AccountInterface {
  id: string;
  username: string;
  password: string;
  status: string;
}
