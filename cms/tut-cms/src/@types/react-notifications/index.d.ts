/**
 * Dildo didn't make typedec for react-notifications, so this is quick one
 * @author ale8k
 */
declare module "react-notifications" {
    /**
     * Wraps an event emitter which emits events to the render container, {@link NotificationContainer NotificationContainer}
     */
    export class NotificationManager {
        /**
         * Emits a info event to the {@link NotificationContainer NotificationContainer}
         * @param {string} messageBody the message to place into the body of the info notification
         */
        static info(messageBody: string): void;
        /**
         * Emits a success event to the {@link NotificationContainer NotificationContainer}
         * @param {string} messageBody the message to place into the body of the success notification
         * @param {string} messageTitle the title of this success notification
         */
        static success(messageBody: string, messageTitle: string): void;
        /**
         * Emits a warning event to the {@link NotificationContainer NotificationContainer}
         * @param {string} messageBody the message to place into the body of the warning notification
         * @param {string} messageTitle the title of this warning notification
         * @param {number} closeTime the amount of milliseconds to close this notification appearance
         */
        static warning(messageBody: string, messageTitle: string, closeTime: number): void;
        /**
         * Emits a error event to the {@link NotificationContainer NotificationContainer}
         * @param {string} messageBody the message to place into the body of the error notification
         * @param {string} messageTitle the title of this error notification
         * @param {number} closeTime the amount of milliseconds to close this notification appearance
         * @param {function} callback a callback function to run after {closeTime} milliseconds
         */
        static error(messageBody: string, messageTitle: string, closeTime: number, callback?: Function): void;

    }
    /**
     * Render point for the notifications emitted from {@link NotificationManager NotificationManager}
     */
    export class NotificationContainer extends React.Component<any, any> {}
}