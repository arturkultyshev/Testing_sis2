import { randomUUID } from 'node:crypto';

export interface Address {
  street: string;
  house_number: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
}

export interface User {
  first_name: string;
  last_name: string;
  dob: string;
  phone: string;
  email: string;
  password: string;
  address: Address;
}

export function createUser(): User {
  return {
    first_name: 'SIS',
    last_name: 'Student',
    dob: '1998-03-15',
    phone: '0612345678',
    email: `sis2.${randomUUID()}@example.com`,
    password: 'Sis2!Practice2026',
    address: {
      street: 'Abay Avenue',
      house_number: '10',
      city: 'Almaty',
      state: 'Almaty',
      country: 'KZ',
      postal_code: '050000',
    },
  };
}

export const invalidPassword = 'Wrong!Password2026';
export const malformedEmail = 'not-an-email';

export const billingAddress: Address = {
  street: 'Dam', house_number: '1', city: 'Amsterdam', state: 'Noord-Holland',
  country: 'NL', postal_code: '1012JS',
};
