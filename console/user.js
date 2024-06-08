import './db.js';
import minimist from 'minimist';
import logger from '../src/config/logger.js';
import { getUserByEmail } from '../src/services/user.service.js';
import { generateAuthTokens } from '../src/services/token.service.js';

var argv = minimist(process.argv.slice(2));

// LOGGER(argv);
// LOGGER("abc", argv);

const method = {
    // node console/user.js -f=getToken -u=admin
    getToken: async () => {
        if (!argv['e'] && !argv['email'] && !argv['_'][1]) {
            logger.error("kindly provide e or email in argument");
            return true;
        } else {
            const user = await getUserByEmail(argv['e'] ?? argv['email'] ?? argv['_'][1]);
            if (user) {
                console.log(user);
                let token = await generateAuthTokens(user)
                logger.info("access token");
                logger.info(token.access.token)
            } else {
                logger.error("user not found")
            }
        }
        process.exit();
    },
};

if (method[argv['f']]) {
    method[argv['f']]();
} else if (method[argv['_'][0]]) {
    method[argv['_'][0]]();
} else {
    logger.error("Given Function Not available")
    process.exit();
}