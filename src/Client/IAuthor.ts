export interface IAuthor {
  isBot: boolean;
  id: string;
  tag: string;
  isAdmin: boolean;
  roles: { name: string }[];
}
