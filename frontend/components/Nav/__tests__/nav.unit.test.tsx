import { render } from '@testing-library/react';
import 'jest-styled-components';
import { ThemeContextProvider } from '../../ThemeProvider/ThemeProvider';
import Nav from '../index';

test('nav renders correctly', () => {
    const { container } = render(
        <ThemeContextProvider>
            <Nav />
        </ThemeContextProvider>
    );
    expect(container.firstChild).toMatchInlineSnapshot(`
        .c0 {
          display: -webkit-box;
          display: -webkit-flex;
          display: -ms-flexbox;
          display: flex;
          -webkit-box-pack: justify;
          -webkit-justify-content: space-between;
          -ms-flex-pack: justify;
          justify-content: space-between;
          margin-bottom: 30px;
        }

        .c0 > div:first-of-type {
          line-height: 1.68em;
        }

        .c0 h1 {
          text-transform: uppercase;
        }

        .c0 h2 {
          font-weight: 300;
        }

        <nav
          class="c0"
          role="navigation"
        >
          <div
            aria-label="site logo"
          >
            <h1
              role="heading"
            >
              Tutorials
            </h1>
            <h2
              role="sub-heading"
            >
               by DevIsle
            </h2>
          </div>
          <div>
            <h2>
              <a
                href="/login"
              >
                Login
              </a>
            </h2>
          </div>
        </nav>
    `);
});
