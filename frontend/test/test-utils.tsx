import { render as rtlRender, RenderResult, RenderOptions } from '@testing-library/react';
import { ThemeContextProvider } from '../context/ThemeProvider/ThemeProvider';

const themeWrapper: React.FC = ({ children }) => <ThemeContextProvider>{children}</ThemeContextProvider>;

const render = (ui: React.ReactElement, options?: RenderOptions): RenderResult => {
    return rtlRender(ui, { wrapper: themeWrapper, ...options });
};

export * from '@testing-library/react';
export { render };
