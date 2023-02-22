export interface CseUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  borrowedGames?: Array<string>;
}

export interface BddUsers {
  [id: string]: CseUser;
}
