/**
 * NodeJS GLOBAL type extension
 * This is used for adding Jest globals, 
 * so that our *.unit/int.test.ts can pickup on the globals
 * 
 * We're simply unable to otherwise...
 * @author ale8k
 */
declare module NodeJS {
    interface Global {
        /**
         * Specifically specified URI to test on
         */
         __SPECIFIC__MONGO_URI__: string;
         /**
          * Specific specified DB name to test on
          */
         __SPECIFIC__MONGO_DB_NAME__: string;
    }
}