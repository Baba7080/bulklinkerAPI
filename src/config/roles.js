const allRoles = {
  user: ['login', "setUpUser", "getUser","getUserTemplates","saveUserTemplates"],
  admin: ["*"],
  app: ['login', 'register'],
};

export const roles = Object.keys(allRoles);
export const roleRights = new Map(Object.entries(allRoles));
