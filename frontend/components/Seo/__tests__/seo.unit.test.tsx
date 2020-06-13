import { render, waitFor } from '@testing-library/react';
import Seo from '../index';

jest.mock('../../../constants/Seo', () => {
    return {
        TITLE: 'Dev js tutorials'
    };
});

describe('SEO Component', () => {
    it('renders default title without any title props', async () => {
        render(<Seo />);
        await waitFor(() => expect(document.title).toBe('Dev js tutorials'));
    });

    it('renders title with the given title prop', async () => {
        render(<Seo title='React is better than angular' />);
        await waitFor(() => expect(document.title).toBe('React is better than angular'));
    });
});
