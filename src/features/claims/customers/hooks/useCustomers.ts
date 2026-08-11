import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { MockCustomerRepository } from '../repositories/MockCustomerRepository';
import type { CustomersQuery } from '../types/types';

const customerRepository = new MockCustomerRepository();

export function useCustomers(query: CustomersQuery) {
  return useQuery({
    queryKey: ['customers', query],
    queryFn: () => customerRepository.getCustomers(query),
    placeholderData: keepPreviousData,
    staleTime: 30_000, // cache for 30 seconds
  });
}
