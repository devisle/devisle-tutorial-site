import 'jest-styled-components';
import { render } from '../../../test/test-utils';
import GalleryGrid from '../index';

test('renders', () => {
    const { container } = render(<GalleryGrid />);
    expect(container).toMatchSnapshot();
});
