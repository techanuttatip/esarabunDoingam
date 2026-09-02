export const dashboardQueries = {
  summary: () => ({
    queryKey: ['dashboard', 'summary'],
    queryFn: async () => {
      // API call placeholder for Phase 2
      return {
        totalDocs: 1248,
        pendingDocs: 42,
        overdueDocs: 3,
        completedThisMonth: 312
      };
    }
  })
};
