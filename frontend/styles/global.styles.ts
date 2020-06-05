import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');    
    body{
        background: ${({ theme }) => theme.body};
        color: ${({ theme }) => theme.text};
        margin: 0;
        border-top: ${({ theme }) => `8px solid ${theme.border}`};
    }

    h1,
    h2,
    h3,
    h4,
    h5,
    h6{
        margin: 0;
        font-family: ${({ theme }) => theme.fonts.heading};
    } 

    p{
        margin: 0;
        font-family: ${({ theme }) => theme.fonts.body};
    }

    h1{
        font-size: ${({ theme }) => theme.fontSizes['3xl']};
        ${props => {
            props.capitalize ? 'text-capitalize: capitalize;' : '';
        }}
    }

    h2{
        font-size: ${({ theme }) => theme.fontSizes['2xl']};
    }

    h3{
        font-size: ${({ theme }) => theme.fontSizes.xl};
    }

    h4{
        font-size: ${({ theme }) => theme.fontSizes.lg};
    }

    h5{
        font-size: ${({ theme }) => theme.fontSizes.md};
    }

    a{
        text-decoration: none;
        color: ${({ theme }) => theme.text};
        transition: color 300ms;

        &:hover{
            color: ${({ theme }) => theme.link.hovered};
        }
    }

    .container{
        width: 90%;
        margin: auto;
        padding: 20px;
    }
`;
