/**
 * Authorization Roles
 */
const authRoles = {
  admin: ['ADMIN'],
  staff: ['ADMIN', 'MANAGER','RH'],
  user: ['ADMIN', 'MANAGER','RH','EMPLOYEE'],
  onlyGuest: [],
};

export default authRoles;
