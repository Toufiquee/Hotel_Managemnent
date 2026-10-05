import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const adminGuard: CanActivateFn = () => {
  const router = inject(Router);
  const storedUser = localStorage.getItem('user');

  if (!storedUser) {
    return router.createUrlTree(['/login']);
  }

  try {
    const user = JSON.parse(storedUser);
    const role = user?.role ?? user?.Role ?? '';

    return role.toString().toLowerCase() === 'admin'
      ? true
      : router.createUrlTree(['/landing']);
  } catch {
    return router.createUrlTree(['/landing']);
  }
};
