import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    // Example
    switch (req.method) {
        case "GET":
            break;
        case "POST":
            break;
        case "PUT":
            break;
        case "PATCH":
            break;
        case "DELETE":
            break;
        default:
            "Hello";
    }

    const { category, tutorial } = req.body;

    const result = await fetch(
        `https://www.cmsbackend.com/${category}/${tutorial}`
    );

    if (!result) {
        res.status(404).json({ status: 404, message: "Not Found" });
    }
    res.status(200).json(result);
};
