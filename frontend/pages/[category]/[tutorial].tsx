import { useRouter } from "next/router";

export default function tutorial() {
	const router = useRouter();
	console.log(router.query);
	return (
		<h2>
			{router.query.category} - {router.query.tutorial}
		</h2>
	);
}
