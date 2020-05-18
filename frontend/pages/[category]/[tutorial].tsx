import { useRouter } from "next/router";

/**
 * Example of a Dynamic route
 * folder or a file wrapped like [name] indicates it as a dynamic route.
 * Eg: If the main route is [category] sub route [tutorial] then the route query params for
 * /javascript/variables will be {category: 'javascript', tutorial: 'variables}
 * @author shreyas1307
 */

export default function tutorial() {
	const router = useRouter();
	console.log(router.query);
	return (
		<h2>
			{router.query.category} - {router.query.tutorial}
		</h2>
	);
}
