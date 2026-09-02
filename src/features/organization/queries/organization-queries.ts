export const organizationQueries = {
  all: () => ({
    queryKey: ['organization'],
    queryFn: () => Promise.resolve([]),
  })
};
