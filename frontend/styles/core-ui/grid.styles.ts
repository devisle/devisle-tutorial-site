import styled from "styled-components";
import { ITheme } from "../../components/ThemeProvider/Theme";

interface IGrid extends ITheme {
    columns: number;
    align?: string;
}

export const Grid = styled.section`
    display: grid;
    grid-template-columns: ${(props: IGrid) => `repeat(${props.columns}, 1fr)`};
    align-items: ${(props: IGrid) => props.align};
    grid-row-gap: ${props => (props.rowGap ? props.rowGap : 0)};
    margin-top: ${props => props.marginTop || 0};
`;
