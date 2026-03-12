import getAthleteStats from "../athlete";
import getAccessToken from "../auth";

export default async function handler(req, res) {
    if (req.method === 'GET')
    {
        const mode = req.query['hub.mode'];
        const token = req.query['hub.verify_token'];
        const challenge = req.query['hub.challenge'];
        const verifyToken = process.env.VERIFY_TOKEN;

        if (mode && token)
        {
            if (mode === 'subscribe' && token === verifyToken)
            {
                return res.json({'hub.challenge': challenge})
            }
        }

        return res.status(403).send('Forbidden');
    }

    if (req.method === 'POST')
    {
        const token = await getAccessToken();

        const { aspect_type, object_type, object_id, owner_id } = req.body;

        const stats = await getAthleteStats(owner_id, token);

        console.log(aspect_type, object_type, object_id, owner_id);
        console.log('ATHLETE STATS:', stats);

        return res.status(200).send('OK');
    }
}