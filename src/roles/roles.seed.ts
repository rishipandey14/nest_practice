export const RolesSeed = [
  {
    id: 1,
    name: 'admin',
    description: 'System administrator',
    permission_ids: [
      1, // user:create
      2, // user:view
      3, // user:update
      4, // user:delete

      5, // role:create
      6, // role:view
      7, // role:update
      8, // role:delete
    ],
    isSystemRole: true,
  },

  {
    id: 2,
    name: 'user',
    description: 'Normal application user',
    permission_ids: [
      2, // user:view
    ],
    isSystemRole: true,
  },
];
