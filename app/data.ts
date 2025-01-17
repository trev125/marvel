import { matchSorter } from "match-sorter";
// @ts-expect-error - no types, but it's a tiny function
import sortBy from "sort-by";
import invariant from "tiny-invariant";

type Contact = {
  id?: string;
  marvelId?: string;
  first?: string;
  last?: string;
  avatar?: string;
  superName?: string;
  url?: string;
  notes?: string;
  favorite?: boolean;
  test?: string;
};

export type ContactRecord = Contact & {
  id: string;
  createdAt: string;
};

const fakeContacts = {
  records: {} as Record<string, ContactRecord>,

  async getAll(): Promise<ContactRecord[]> {
    return Object.keys(fakeContacts.records)
      .map((key) => fakeContacts.records[key])
      .sort(sortBy("-createdAt", "last"));
  },

  async get(id: string): Promise<ContactRecord | null> {
    return fakeContacts.records[id] || null;
  },

  async create(values: Contact): Promise<ContactRecord> {
    const id = values.id || Math.random().toString(36).substring(2, 9);
    const createdAt = new Date().toISOString();
    const newContact = { id, createdAt, ...values };
    fakeContacts.records[id] = newContact;
    return newContact;
  },

  async set(id: string, values: Contact): Promise<ContactRecord> {
    const contact = await fakeContacts.get(id);
    invariant(contact, `No contact found for ${id}`);
    const updatedContact = { ...contact, ...values };
    fakeContacts.records[id] = updatedContact;
    return updatedContact;
  },

  destroy(id: string): null {
    delete fakeContacts.records[id];
    return null;
  },
};

export async function getContacts(query?: string | null) {
  await new Promise((resolve) => setTimeout(resolve, 500));
  let contacts = await fakeContacts.getAll();
  if (query) {
    contacts = matchSorter(contacts, query, {
      keys: ["first", "last", "superName"],
    });
  }
  return contacts.sort(sortBy("last", "createdAt"));
}

export async function createEmptyContact() {
  const contact = await fakeContacts.create({});
  return contact;
}

export async function getContact(id: string) {
  return fakeContacts.get(id);
}

export async function updateContact(id: string, updates: Contact) {
  const contact = await fakeContacts.get(id);
  if (!contact) {
    throw new Error(`No contact found for ${id}`);
  }
  await fakeContacts.set(id, { ...contact, ...updates });
  return contact;
}

export async function deleteContact(id: string) {
  fakeContacts.destroy(id);
}

[
  {
    marvelId: "1009368",
    first: "Tony",
    last: "Stark",
    avatar:
      "http://i.annihil.us/u/prod/marvel/i/mg/9/c0/527bb7b37ff55/detail.jpg",
    superName: "Iron Man",
    url: "https://www.marvel.com/characters/iron-man-tony-stark",
    notes:
      "Wounded, captured and forced to build a weapon by his enemies, billionaire industrialist Tony Stark instead created an advanced suit of armor to save his life and escape captivity. Now with a new outlook on life, Tony uses his money and intelligence to make the world a safer, better place as Iron Man.",
    favorite: true,
  },
  {
    marvelId: "1009220",
    first: "Steve",
    last: "Rogers",
    avatar:
      "http://i.annihil.us/u/prod/marvel/i/mg/3/50/537ba56d31087/detail.jpg",
    superName: "Captain America",
    url: "https://www.marvel.com/characters/captain-america-steve-rogers",
    notes:
      "Vowing to serve his country any way he could, young Steve Rogers took the super soldier serum to become America's one-man army. Fighting for the red, white and blue for over 60 years, Captain America is the living, breathing symbol of freedom and liberty.",
    favorite: false,
  },
  {
    marvelId: "1009610",
    first: "Peter",
    last: "Parker",
    avatar:
      "http://i.annihil.us/u/prod/marvel/i/mg/3/50/526548a343e4b/detail.jpg",
    superName: "Spider-Man",
    url: "https://www.marvel.com/characters/spider-man-peter-parker",
    notes:
      "Bitten by a radioactive spider, high school student Peter Parker gained the speed, strength and powers of a spider. Adopting the name Spider-Man, Peter hoped to start a career using his new abilities. Taught that with great power comes great responsibility, Spidey has vowed to use his powers to help people.",
    favorite: false,
  },
].forEach((contact) => {
  fakeContacts.create({
    ...contact,
    id: `${contact.superName.toLowerCase().replace(" ", "-")}`,
  });
});
