import Link from 'next/link';
import { StyledNav } from './nav.styles';

const Nav: React.FC<{ userData: { permissionLevel: number; userId: string; username: string } | string }> = ({
    userData
}) => {
    const renderNavTabs = () => {
        if (userData === 'Unauthorised') {
            return (
                <Link href='/login'>
                    <a>Login</a>
                </Link>
            );
        } else {
            const { permissionLevel, userId, username } = (userData as unknown) as {
                permissionLevel: number;
                userId: string;
                username: string;
            };
            const navTabs = [];

            switch (true) {
                case permissionLevel >= 1:
                    navTabs.push(
                        <Link key={1} href='/admin/tutorial-manager'>
                            <a style={{ marginRight: '1vw' }}>Tutorial Manager</a>
                        </Link>
                    );
                case permissionLevel >= 0:
                    navTabs.push(
                        <Link key={0} href='/profile'>
                            <a>Profile</a>
                        </Link>
                    );
                    break;
            }
            return navTabs;
        }
    };

    return (
        <StyledNav role='navigation'>
            <div aria-label='site logo'>
                <h1 role='heading'>Tutorials</h1>
                <h2 role='sub-heading'>&nbsp;by DevIsle</h2>
            </div>
            <div>
                <h2>{renderNavTabs()}</h2>
            </div>
        </StyledNav>
    );
};
export default Nav;
