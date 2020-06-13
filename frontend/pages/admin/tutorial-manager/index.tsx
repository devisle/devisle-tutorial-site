import Router from 'next/router';
import AuthService from '../../../services/AuthService';
import { NextPageContext } from 'next';
import { useEffect } from 'react';

/**
 * Gets auth props
 */
export const getServerSideProps = async (ctx: NextPageContext): Promise<object> => {
    const cookies = ctx.req.headers.cookie;
    let auth;
    if (cookies) {
        auth = await AuthService.confirm(cookies);
    } else {
        auth = 'Unauthorised';
    }
    return {
        props: {
            userData: auth
        }
    };
};

/**
 * Tutorial manager page
 *  - Lists all tutorials created by this Admin users
 *  - Layout is TODO
 *
 * @author ale8k
 */
const TutorialManager: React.FC<{
    userData: UserDataOrString;
}> = ({ userData }) => {
    useEffect(() => {
        checkAuth();
    }, [userData]);

    const checkAuth = () => {
        if (userData === 'Unauthorised') {
            Router.push('/');
        }
    };

    return <div className='TutorialManager'>tut manager</div>;
};

export default TutorialManager;
