import { connect } from 'mongoose';
import dotenv from 'dotenv'
import logger from '../src/config/logger.js';
dotenv.config()
/********Database *******************/

main().catch(err => logger.error(err));

async function main() {
    await connect(process.env.MONGODB_URL, {
        user: process.env.MONGODB_USER,
        pass: process.env.MONGODB_PASS,
        dbName: process.env.MONGODB_DBNAME
    });
    /**
    * Connection ready state
    *
    * - 0 = disconnected
    * - 1 = connected
    * - 2 = connecting
    * - 3 = disconnecting
    * - 99 = uninitialized
    */
    const mongoStatus = {
        0: "disconnected",
        1: "connected",
        2: "connecting",
        3: "disconnecting",
        99: "uninitialized",
        999: "Unknow"
    };
    // LOGGER("MongoStatus: " + mongoStatus[connection.readyState ?? 999]);
}