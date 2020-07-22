import { useContext } from 'react';
import { ThemeContext } from 'styled-components';
import { IThemeContext } from '../context/ThemeProvider/ThemeProvider';
import FormInput from '../components/FormInput';
import Button from '../components/Button';
import { Layout, Seo } from '../components';
import { HelperText, StyledH1, Grid, StyledSectionHeading } from '../styles/core-ui';
import CategoriesGrid from '../components/CategoriesGrid';
import AuthService from '../services/AuthService';
import { NextPageContext } from 'next';

/**
 * Get tutorials
 *
 * @todo typescript types
 * @returns tutorials
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
 * Index Page - renders on '/' route
 *
 * @author shreyas1307, rakeshshubhu
 */
export default function index(props: object): JSX.Element {
    const theme: typeof ThemeContext = useContext(ThemeContext);
    return (
        <Layout userData={props.userData}>
            <Seo />
            <Grid columns={2} align='center'>
                <div>
                    <StyledH1 textTransform='capitalize'>Find the best courses and become a master</StyledH1>
                    <HelperText faded fontSize={theme.fontSizes.lg}>
                        All resources are 100% free. All courses are contributed by the open source community or
                        platform Dev Isle. You can join us on discord.
                    </HelperText>
                    <Grid columns={1} rowGap='20px' marginTop='20px'>
                        <FormInput type='text' name='search_courses' placeholder='Search...' />
                        <Button onClick={() => {}} varientColor='success' varient='solid' size='md' ariaLabel='Join us'>
                            Join Us
                        </Button>
                    </Grid>
                </div>
                <div>
                    <img src='/assets/index-banner.svg' alt='girl reading book' width='100%' />
                </div>
            </Grid>
            <StyledSectionHeading>Categories</StyledSectionHeading>
            <CategoriesGrid />
        </Layout>
    );
};

