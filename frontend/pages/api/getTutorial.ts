import { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const tutorials = [
        { icon: 'devicon-javascript-plain', categoryName: 'JavaScript' },
        { icon: 'devicon-python-plain', categoryName: 'Python' },
    ];
    res.json(tutorials);
};
