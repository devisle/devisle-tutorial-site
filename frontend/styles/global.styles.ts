import { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');    
    body{
        background: ${({ theme }) => theme.body};
        color: ${({ theme }) => theme.text};
        font-family: 'Inter', sans-serif;
    }

    h1{

    }

    h2{

    }

    h3{

    }

    h4{

    }

    h5{

    }

    p{
        
    }

    .container{
        width: 90%;
        margin: auto;
    }
`;
