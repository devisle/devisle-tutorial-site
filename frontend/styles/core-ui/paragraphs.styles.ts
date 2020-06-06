import styled from 'styled-components';

export const HelperText = styled.p`
    font-size: ${props => props.fontSize || props.theme.fontSizes.sm};
    color: ${props => (props.faded ? props.theme.fadedText : props.theme.body)};
`;
