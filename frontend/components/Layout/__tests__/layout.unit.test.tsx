import { render, screen } from 'test-utils';
import Layout from '../';

test('renders children properly', () => {
    render(
        <Layout>
            <h1>Rakesh is a god</h1>
        </Layout>
    );
    expect(screen.getByRole('heading', { name: /rakesh is a god/i })).toBeTruthy();
});
