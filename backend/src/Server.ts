import App from './App';
import * as log from 'loglevel';
import chalk from 'chalk';

/**
 * Entry point
 *
 * @class
 * @author ale8k
 */
class Server {
    constructor(logLevel: log.LogLevelDesc) {
        log.setDefaultLevel(logLevel);
        new App({ path: '.env' }).setupServer().then(app => {
            const l = log.noConflict();
            l.info(chalk.dim.cyan('Spinning up server...'));
            app.listen(process.env.PORT, () =>
                l.info(chalk.greenBright.bold(`Server running on PORT:${chalk.yellow(process.env.PORT)}`))
            );
        });
    }
}

new Server('trace');
