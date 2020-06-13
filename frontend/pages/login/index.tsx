import FormInput from '../../components/FormInput';
import { StyledLogin } from './login.styles';
import Button from '../../components/Button';
import { StyledH1 } from '../../styles/core-ui';
import { useState, FormEvent } from 'react';
import { useRouter } from 'next/router';
import AuthService from '../../services/AuthService';

type Credentials = { username: string; password: string };

/**
 * Login page
 */
const Login: React.FC = () => {
    const [credentials, setCredentials] = useState<Credentials>({ username: '', password: '' });
    const router = useRouter();

    function handleCredentialChange<T>(e: FormEvent<HTMLInputElement>): T {
        e.persist();
        const target = e.target as HTMLInputElement;
        setCredentials(prevCreds => ({ ...prevCreds, [target.name]: target.value }));
        return;
    }

    const attemptLogin = (): void => {
        AuthService.login(credentials).then(response => {
            if (response === 'successful login') {
                router.push('/');
            } else {
                console.log('fuck unauthorised man');
            }
        });
    };

    return (
        <StyledLogin>
            <StyledH1>Login:</StyledH1>
            <FormInput
                onChange={handleCredentialChange}
                value={credentials.username}
                inputType='text'
                name='username'
                placeholder='Enter your username...'
            />
            <FormInput
                onChange={handleCredentialChange}
                value={credentials.password}
                inputType='password'
                name='password'
                placeholder='Enter your password...'
            />
            <Button onClick={attemptLogin} varientColor='success' varient='solid' size='md' ariaLabel='Click to login'>
                Login
            </Button>
        </StyledLogin>
    );
};

export default Login;
