import styled from 'styled-components';
import { ITheme } from '../../context/ThemeProvider/Theme';

interface IGrid extends ITheme {
    columns: number;
    align?: string;
    rowGap?: string;
    columnGap?: string;
    marginTop?: string;
}

export const Grid = styled.section`
    display: grid;
    ${({ columns, align, rowGap, columnGap, marginTop }: IGrid): string => css`
        grid-template-columns: repeat(${columns}, 1fr);
        align-items: ${align || 'none'};
        grid-row-gap: ${rowGap ? rowGap : '0'};
        grid-column-gap: ${columnGap ? columnGap : '0'};
        margin-top: ${marginTop || '0'};
    `}
`;

export const GalleryGrid = styled(Grid)`
    ${({ width }): string => css`
        grid-template-columns: repeat(auto-fill, minmax(${width || 200}px, 1fr));
    `}
`;
