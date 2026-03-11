export default async function handler(req, res) {
    if (req.method === 'GET')
    {
        const mode = req.query['hub.mode'];
        const token = req.query['hub.verify_token'];
        const challenge = req.query['hub.challenge'];
        const verifyToken = process.env.VERIFY_TOKEN;

        console.log(`Verifying: received ${token}, expected ${verifyToken}`);

        if (mode && token)
        {
            if (mode === 'subscribe' && token === verifyToken)
            {
                // TODO: remove console.log
                console.log('WEBHOOK_VERIFIED');
                return res.json({'hub.challenge': challenge})
            }
        }

        return res.status(403).send('Forbidden');
    }

    if (req.method === 'POST')
    {
        const { aspect_type, object_type, object_id, owner_id } = req.body;

        // TODO: remove console.log
        console.log("WEBOOK RECIEVED: ");
        console.log({aspect_type, object_type, object_id, owner_id});

        return res.status(200).send('OK');
    }
}