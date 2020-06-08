import styled, { css } from 'styled-components';
import { ITheme } from '../../components/ThemeProvider/Theme';
import { ITypography } from '../../components/ThemeProvider/Typography';

/** Type for app theme */
type AppTheme = ITheme & ITypography;

/**
 * Heading styled component interface
 *
 * @property {string} textTransform text transform property
 * @property {string} fontSize font size
 * @property {string} wt font weight
 * @property {AppTheme} theme theme & typography of global theme
 */
interface IHeading {
    textTransform?: string;
    fontSize?: string;
    wt?: string;
    theme: AppTheme;
}

export const StyledH1 = styled.h1`
    ${({ textTransform, fontSize, theme }: IHeading): string => css`
        text-transform: ${textTransform || 'none'};
        font-size: ${fontSize || theme.fontSizes['5xl']};
    `}
`;

export const StyledSectionHeading = styled.h2`
    ${({ textTransform, fontSize, wt, theme }: IHeading): string => css`
        text-transform: ${textTransform || 'capitalize'};
        font-size: ${fontSize || theme.fontSizes['3xl']};
        font-weight: ${wt || 'normal'};
        margin: 2.85rem 0;
    `}
`;
