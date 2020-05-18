// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiRequest, NextApiResponse } from "next";

// Declaring the t ype of data received in Response

/**
 * @author shreyas1307
 */

type Data = {
	name: string;
};

export default (req: NextApiRequest, res: NextApiResponse<Data>) => {
	res.status(200).json({ name: "John Doe" });
};
