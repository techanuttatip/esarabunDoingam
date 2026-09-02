export const auditQueries = {
  all: () => ({
    queryKey: ['audit'],
    queryFn: () => Promise.resolve([]),
  })
};
