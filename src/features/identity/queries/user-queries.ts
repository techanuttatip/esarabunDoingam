import { userApi } from "../services/user-api";

export const userQueries = {
  all: () => ({
    queryKey: ['users'],
    queryFn: () => userApi.getUsers(),
  })
};

export const roleQueries = {
  all: () => ({
    queryKey: ['roles'],
    queryFn: () => userApi.getRoles(),
  })
};
