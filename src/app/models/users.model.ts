export interface CseUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface BddUsers {
  [id: string]: CseUser;
}
