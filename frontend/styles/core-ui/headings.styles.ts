import styled from 'styled-components';

export const StyledH1 = styled.h1`
    text-transform: ${props => props.textTransform || 'none'};
    font-size: ${props => props.fontSize || props.theme.fontSizes['5xl']};
`;
