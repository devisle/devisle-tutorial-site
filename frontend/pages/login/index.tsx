import FormInput from '../../components/FormInput';
import { StyledLogin } from './login.styles';
import Button from '../../components/Button';
import Link from 'next/link';

/**
 * Login page for PUBLIC users
 */
const Login: React.FC = () => {
    console.log('its me');
    // const theme = useContext<ThemeContext>(ThemeContext);
    return (
        <StyledLogin>
            <h1>Login!</h1>
            <FormInput inputType='text' name='username' placeholder='Enter your username...'></FormInput>
            <FormInput inputType='password' name='password' placeholder='Enter your password...'></FormInput>
            <Button
                onClick={(): any => console.log('TODO')}
                varientColor='success'
                varient='solid'
                size='md'
                ariaLabel='Click to login'
            >
                Login
            </Button>
            Are you an admin? <Link href='/login/admin'>Click here!</Link>
        </StyledLogin>
    );
};
export default Login;
