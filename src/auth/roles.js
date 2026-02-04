
export const ROLES = {
  sales: 'sales',
  manager: 'manager',
  admin: 'admin',
}

export const ROLE_LABELS = {
  [ROLES.admin]: 'ADMINISTRATOR',
  [ROLES.sales]: 'Account Manager',
  [ROLES.manager]: 'Manager Business Service',
}

export const ALL_ROLES = Object.values(ROLES)
