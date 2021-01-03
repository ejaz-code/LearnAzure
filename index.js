const Crypto = require('crypto');

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function to process webhooks from Github.');

    const hmac = Crypto.createHmac("sha1", "<Secret code from Function Key>");
    const signature = hmac.update(JSON.stringify(req.body)).digest('hex');
    const shaSignature =  `sha1=${signature}`;
    const gitHubSignature = req.headers['x-hub-signature'];

    if (!shaSignature.localeCompare(gitHubSignature)) {
        context.log('Checking first log');
        if (req.body.repository) {
            context.log('Checking second log');
            context.res = {
                body: "Owner is : " + `${req.body.repository.owner.login}` 
            };
        }
        else {
            context.res = {
                status: 400,
                body: ("Invalid payload for Wiki event")
            }
        }
    }
    else {
        context.res = {
            status: 401,
            body: "Signatures don't match"
        };
    }
};
