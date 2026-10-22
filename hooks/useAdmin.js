'use client';

import { useCurrentUser } from './useCurrentUser';

export function useIsAdmin() {
    const { user, isLoading } = useCurrentUser();
    const isAdmin = Boolean(user && user.admin === true);
    return { isAdmin, isLoading, user };
}