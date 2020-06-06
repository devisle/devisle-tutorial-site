import FormInput from '../../../components/FormInput';
import { StyledLogin } from '../login.styles';
import Button from '../../../components/Button';
import { StyledH1 } from '../../../styles/core-ui';
import { useState, FormEvent } from 'react';
import { useRouter } from 'next/router';

type Credentials = { username: string; password: string };

/**
 * Login page for PUBLIC users
 */
const AdminLogin: React.FC = (props: any) => {
    const [credentials, setCredentials] = useState<Credentials>({ username: '', password: '' });
    const router = useRouter();

    function handleCredentialChange<T>(e: FormEvent<HTMLInputElement>): T {
        e.persist();
        const target = e.target as HTMLInputElement;
        setCredentials(prevCreds => ({ ...prevCreds, [target.name]: target.value }));
        return;
    }

    const attemptLogin = (): void => {
        fetch('http://127.0.0.1:3000/cms/auth/login', {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({ ...credentials })
        }).then(resp => {
            if (resp.status === 200) {
                // We're storing the JWT client side, ideally we wanna DB this
                // so we not storing ANYONE client side, for now, this is OK
                resp.json().then(data => {
                    const { jwt, successfulLogin, userId, username } = data;
                    if (successfulLogin) {
                        window.localStorage.setItem('userAuthData', JSON.stringify({ jwt, userId, username }));
                        props.setGlobalState(prevState => ({ ...prevState, loggedIn: true }));
                        router.push('/admin/tutorial-manager');
                    }
                });
            } else if (resp.status === 401) {
                console.log('UNAUTHORISED!');
            } else if (resp.status === 503) {
                resp.json().then(data => {
                    console.log(data);
                });
            } else if (resp.status === 400) {
                console.log('bad request i.e., username missing or some shit');
            }
        });
    };

    return (
        <StyledLogin>
            <StyledH1>Admin Login</StyledH1>
            <FormInput
                onChange={handleCredentialChange}
                value={credentials.username}
                inputType='text'
                name='username'
                placeholder='Enter your username...'
            ></FormInput>
            <FormInput
                onChange={handleCredentialChange}
                value={credentials.password}
                inputType='password'
                name='password'
                placeholder='Enter your password...'
            ></FormInput>
            <Button onClick={attemptLogin} varientColor='success' varient='solid' size='md' ariaLabel='Click to login'>
                Login
            </Button>
        </StyledLogin>
    );
};
export default AdminLogin;
