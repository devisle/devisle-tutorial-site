import styled from "styled-components";

export const Input = styled.input`
    padding: 10px;
    width: 100%;
    background: ${props => props.bg || props.theme.section.body};
    color: ${props => props.text || props.theme.fadedText};
    font-size: ${props => props.theme.fontSizes.lg};
    border: 1px solid ${props => props.bg || props.theme.section.border};
    border-radius: 25px;
    line-height: 25px;

    &:focus {
        outline: none;
    }
`;
