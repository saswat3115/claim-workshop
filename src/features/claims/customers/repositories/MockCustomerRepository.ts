import { customerMockData } from '../mocks/customer.mock';
import type { Customer, CustomerSortField, CustomersQuery, CustomersResponse } from '../types/types';
import type { CustomerRepository } from './CustomerRepository';

function normalize(value: string) {
  return value.toLowerCase().trim();
}

function compareValues(a: Customer, b: Customer, field: CustomerSortField) {
  const left = a[field];
  const right = b[field];

  if (left === right) {
    return 0;
  }

  return left > right ? 1 : -1;
}

function delayed<T>(value: T, delayMs = 1000) {
  return new Promise<T>((resolve) => {
    window.setTimeout(() => resolve(value), delayMs);
  });
}

export class MockCustomerRepository implements CustomerRepository {
  async getCustomers(query: CustomersQuery): Promise<CustomersResponse> {
    let rows = [...customerMockData];
    console.log('MockCustomerRepository.getCustomers');

    const searchTerm = normalize(query.search);
    if (searchTerm) {
      rows = rows.filter((customer) => {
        return [customer.customerName, customer.company, customer.phoneNumber, customer.email].some((value) =>
          normalize(value).includes(searchTerm)
        );
      });
    }

    if (query.filters.status?.length) {
      rows = rows.filter((customer) => query.filters.status?.includes(customer.status));
    }

    if (query.filters.country?.length) {
      rows = rows.filter((customer) => query.filters.country?.includes(customer.country));
    }

    rows.sort((a, b) => {
      const result = compareValues(a, b, query.sort.field);
      return query.sort.direction === 'asc' ? result : -result;
    });

    const total = rows.length;
    const totalPages = Math.max(1, Math.ceil(total / query.pageSize));
    const page = Math.min(Math.max(1, query.page), totalPages);
    const start = (page - 1) * query.pageSize;
    const data = rows.slice(start, start + query.pageSize);

    return delayed({ data, page, pageSize: query.pageSize, total, totalPages });
  }

  async getCustomer(id: string): Promise<Customer> {
    const customer = customerMockData.find((record) => record.id === id);
    if (!customer) {
      throw new Error('Customer not found');
    }

    return delayed(customer);
  }
}
