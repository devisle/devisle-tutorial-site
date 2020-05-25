import App from "./App";

/**
 * Entry points
 *
 * @class
 * @author ale8k
 */
class Server {
    constructor() {
        new App({ path: ".env"}).setupServer().then(app => {
            console.log("Spinning up server...");
            app.listen(process.env.PORT, () => console.log(`Server running on ${process.env.PORT}`));
        });
    }
}

new Server();
