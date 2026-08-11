export type CustomerStatus = 'Active' | 'Inactive' | 'Pending';

export type Customer = {
  id: string;
  customerName: string;
  company: string;
  phoneNumber: string;
  email: string;
  country: string;
  status: CustomerStatus;
  createdAt: string;
  updatedAt: string;
};

export type CustomerSortField =
  | 'customerName'
  | 'company'
  | 'country'
  | 'status'
  | 'createdAt'
  | 'updatedAt';

export type CustomersQuery = {
  search: string;
  filters: {
    status?: CustomerStatus[];
    country?: string[];
  };
  sort: {
    field: CustomerSortField;
    direction: 'asc' | 'desc';
  };
  page: number;
  pageSize: number;
};

export type CustomersResponse = {
  data: Customer[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};
