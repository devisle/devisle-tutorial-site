import Navigation from '../Nav';
import { ReactNode } from 'react';
/**
 * Binds a page component within itself providing the layout features
 * to maintain consistency in all pages
 *
 * @param {React.ReactNode} children
 * @author rakeshshubhu, ale8k
 */
const Layout: React.FC<{
    children: ReactNode;
    userData: { permissionLevel: number; userId: string; username: string } | string;
}> = ({ children, userData }) => {
    return (
        <>
            <div className='container'>
                <Navigation userData={userData} />
                {children}
            </div>
        </>
    );
};

export default Layout;
