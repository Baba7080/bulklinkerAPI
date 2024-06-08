import '../bootstrap.js';
import { setUser } from '../src/api/core/components/user.helper.js';
import { getTokenByUsername } from '../src/applications/TokenManager.js';

import '../src/services/db.js';

import minimist from 'minimist';

var argv = minimist(process.argv.slice(2));

LOGGER('initialising the setup upgrade');


const method = {
  // node console/user.js -f=getToken -u=admin
  upgrade: async () => {
    console.error("in Development.");
    process.exit();
  },
  init: async () => {
    const user_init = [
      {
        username: 'admin',
        password: 'password123',
        email: 'anshumansingh@cedcommerce.com',
        role: 'admin',
        is_email_verified: true,
        is_active: true
      },
      {
        username: 'app',
        password: 'password123',
        email: 'danish@cedcommerce.com',
        role: 'app',
        is_email_verified: true,
        is_active: true
      }
    ];
    LOGGER("Creating User");
    await setUser({ body: user_init[0] });
    await setUser({ body: user_init[1] });
    // user_init.map((user) => {
    //   setUser({ body: user })
    // })

    LOGGER("User Created Successfully");
    const validationToken = await getTokenByUsername('app');
    LOGGER(validationToken);

    // process.exit();
  },
};


if (method[argv['f']]) {
  method[argv['f']]();
} else if (method[argv['_'][0]]) {
  method[argv['_'][0]]();
} else {
  LOGGER("Given Function Not available")
  process.exit();
}

// start from SRC folder
// fs.readdirSync(rootFolder).forEach(file => {
//   // check if folder has routes folder
//   if (fs.existsSync(rootFolder + file + '/routes')) {
//     const newRoutePath = rootFolder + file + '/routes';
//     // loop through all files in routes folder and pick only route files which contains .route.js
//     fs.readdirSync(newRoutePath).forEach(async (routefile) => {
//       if (routefile.indexOf('.route.js') > -1) {
//         /**  import route file and add it to express router */
//         await import(newRoutePath + '/' + routefile).then(async (route) => {
//           // LOGGER('/' + routefile.replace('.route.js', ''))
//           retrivedRoutes(route, file, routefile);
//           log("Total Route Fetched Are :" + allRoutes.length);
//           log(await acl_resource.findOne());
//           // log(await acl_resource.insertMany(allRoutes));
//         });
//       }
//     }
//     );
//   }
// });

// const retrivedRoutes = (route, file, routefile) => {
//   if (route.default.stack.length > 0) {
//     route.default.stack.forEach(function (r) {
//       if (r.route && r.route.path) {
//         const reqType = Object.keys(r.route.methods)[0]?.toUpperCase() ?? "NONE";
//         allRoutes.push({
//           method: reqType,
//           module: file,
//           controller: routefile.replace('.route.js', ''),
//           action: r.route.path.replace('/', '')
//         });
//       }
//     })
//   }
// };

// defaultRoutes.forEach((route) => {
//   //router.use(route.path, route.route);
// });

// export default router;