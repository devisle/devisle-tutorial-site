import { useRouter } from 'next/router';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';

/**
 * Example of a Dynamic route
 * folder or a file wrapped like [name] indicates it as a dynamic route.
 * Eg: If the main route is [category] sub route [tutorial] then the route query params for
 * /javascript/variables will be {category: 'javascript', tutorial: 'variables}
 *
 * @author shreyas1307
 */
export default function Tutorial(props): JSX.Element {
    const router = useRouter();
    console.log('props here in component', props);
    return (
        <h2>
            {router.query.category} -{router.query.tutorial}
        </h2>
    );
}

export const getServerSideProps: GetServerSideProps = async (
    ctx: GetServerSidePropsContext
) => {
    console.log(ctx.params, 'ctx.params');
    console.log(ctx.preview, 'ctx.preview');
    console.log(ctx.previewData, 'ctx.previewData');
    console.log(ctx.query, 'ctx.query');
    // console.log(ctx.req, "ctx.req");
    // console.log(ctx.res, "ctx.res");
    return {
        props: {
            query: { ...ctx.params },
        },
    };
};
