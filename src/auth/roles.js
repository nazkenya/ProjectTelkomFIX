// Declare known roles in one place.
// Add your new role here, e.g., 'manager' or 'bud' — keep it consistent across config.
export const ROLES = {
  sales: 'sales',
  manager: 'manager',
  admin: 'admin',
}

export const ROLE_LABELS = {
  [ROLES.admin]: 'Top-Level Manager',
  [ROLES.sales]: 'Account Manager',
  [ROLES.manager]: 'Manager Business Service',
}

export const ALL_ROLES = Object.values(ROLES)
