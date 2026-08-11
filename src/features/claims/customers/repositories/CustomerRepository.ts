import type { Customer, CustomersQuery, CustomersResponse } from '../types/types';

export interface CustomerRepository {
  getCustomers(query: CustomersQuery): Promise<CustomersResponse>;
  getCustomer(id: string): Promise<Customer>;
}
