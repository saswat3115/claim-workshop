import type { Customer, CustomerStatus } from '../types/types';

const firstNames = [
  'Ava', 'Noah', 'Mia', 'Liam', 'Sophia', 'Elijah', 'Amelia', 'Lucas', 'Isabella', 'Mason',
  'Charlotte', 'Ethan', 'Harper', 'Logan', 'Evelyn', 'James', 'Abigail', 'Benjamin', 'Emily', 'Henry',
];

const lastNames = [
  'Cooper', 'Nguyen', 'Patel', 'Garcia', 'Brown', 'Singh', 'Kim', 'Martinez', 'Wilson', 'Lopez',
  'Anderson', 'Thomas', 'Moore', 'Jackson', 'Taylor', 'White', 'Harris', 'Martin', 'Lee', 'Clark',
];

const companies = [
  'Apex Health', 'Northstar Claims', 'Vertex Insurance', 'Summit Risk', 'Blue Harbor', 'Prime Assist',
  'Crescent Group', 'Evergreen Co', 'Atlas Solutions', 'Brightline', 'Mercury Ops', 'Pinnacle Care',
  'Silverline', 'Oakridge Services', 'Nimbus Holdings', 'Aurora Labs', 'Harborview', 'Newleaf', 'Redwood', 'Clearway',
];

const countries = [
  'United States', 'Canada', 'United Kingdom', 'Germany', 'France', 'Australia', 'Japan', 'India',
  'Netherlands', 'Spain', 'Italy', 'Brazil', 'Mexico', 'Sweden', 'Norway', 'Denmark', 'Ireland', 'Singapore',
  'New Zealand', 'South Africa',
];

const statuses: CustomerStatus[] = ['Active', 'Inactive', 'Pending'];

function mulberry32(seed: number) {
  return function random() {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pick<T>(items: T[], random: () => number) {
  return items[Math.floor(random() * items.length)] as T;
}

function pad(value: number, length: number) {
  return value.toString().padStart(length, '0');
}

function toIsoDate(random: () => number, startYear = 2021, endYear = 2026) {
  const start = new Date(`${startYear}-01-01T00:00:00.000Z`).getTime();
  const end = new Date(`${endYear}-12-31T23:59:59.000Z`).getTime();
  const timestamp = start + Math.floor(random() * (end - start));
  return new Date(timestamp).toISOString();
}

function shortSlug(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 6);
}

export function generateCustomers(count = 20000): Customer[] {
  const random = mulberry32(42);

  return Array.from({ length: count }, (_, index) => {
    const firstName = pick(firstNames, random);
    const lastName = pick(lastNames, random);
    const company = pick(companies, random);
    const country = pick(countries, random);
    const status = pick(statuses, random);
    const idNumber = index + 1;
    const createdAt = toIsoDate(random, 2021, 2025);
    const updatedAt = toIsoDate(random, 2025, 2026);

    return {
      id: `cust_${pad(idNumber, 6)}`,
      customerName: `${firstName} ${lastName}`,
      company,
      phoneNumber: `(${pad(200 + Math.floor(random() * 700), 3)}) ${pad(Math.floor(random() * 900) + 100, 3)}-${pad(Math.floor(random() * 10000), 4)}`,
      email: `${shortSlug(firstName)}.${shortSlug(lastName)}@mail.com`,
      country,
      status,
      createdAt,
      updatedAt,
    };
  });
}

export const customerMockData = generateCustomers();
