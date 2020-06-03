import styled from "styled-components";

export const StyledNav = styled.nav`
    display: flex;
    justify-content: space-between;
    margin-bottom: 30px;

    > div:first-of-type {
        line-height: 1.68em;
    }

    h1 {
        text-transform: uppercase;
    }

    h2 {
        font-weight: ${({ theme }) => theme.fontWeights.light};
    }
`;
