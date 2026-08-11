import { useQuery } from '@tanstack/react-query';
import { MockClaimRepository } from '../repositories/MockClaimRepository';

const claimRepository = new MockClaimRepository();

export function useClaim(claimId: string | undefined) {
  return useQuery({
    queryKey: ['claims', claimId],
    queryFn: () => claimRepository.getClaim(claimId ?? ''),
    enabled: Boolean(claimId),
  });
}
