import { GalleryGrid } from '../../styles/core-ui';

interface ICategory {
    src: string;
    title: string;
    alt?: string;
}

const categoryPath = (file: string): string => `/assets/categories/${file}`;

const categories: ICategory[] = [
    { title: 'javascript', alt: 'javascript icon', src: 'js.jpg' },
    { title: 'python', src: 'python.png' },
    { title: 'javascript', alt: 'javascript icon', src: 'js.jpg' },
    { title: 'python', src: 'python.png' },
    { title: 'javascript', alt: 'javascript icon', src: 'js.jpg' },
    { title: 'python', src: 'python.png' },
    { title: 'javascript', alt: 'javascript icon', src: 'js.jpg' },
    { title: 'python', src: 'python.png' }
];

const CategoriesGrid: React.FC = () => {
    return (
        <GalleryGrid align='center' rowGap='30px' columnGap='10px'>
            {categories.map((category: ICategory) => (
                <img
                    src={categoryPath(category.src)}
                    alt={category.alt || category.title}
                    title={category.title}
                    key={category.title}
                    style={{
                        width: '100%'
                    }}
                />
            ))}
        </GalleryGrid>
    );
};

export default CategoriesGrid;
