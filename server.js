const express = require('express');
const twilio = require('twilio');
const VoiceResponse = twilio.twiml.VoiceResponse;
const path = require('path');
const bodyParser = require('body-parser');

const app = express();

// Your Twilio Credentials
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const apiKey = process.env.TWILIO_API_KEY;
const apiSecret = process.env.TWILIO_API_SECRET;
const twimlAppSid = process.env.TWILIO_TWIML_APP_SID;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBEr;

// Serve static files from the 'public' directory
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

app.get('/token', (req, res) => {
  try {
    console.log('Token request received');
    const AccessToken = twilio.jwt.AccessToken;
    const VoiceGrant = AccessToken.VoiceGrant;

    // Create an access token
    const accessToken = new AccessToken(
      accountSid,
      apiKey,
      apiSecret,
      { identity: 'user_' + Math.random().toString(36).substring(7), ttl: 3600 }
    );

    console.log('Access token created');

    // Create a voice grant and add it to the token
    const voiceGrant = new VoiceGrant({
      outgoingApplicationSid: twimlAppSid,
      incomingAllow: true,
    });
    accessToken.addGrant(voiceGrant);

    console.log('Voice grant added to token');

    // Generate the token
    const token = accessToken.toJwt();

    console.log('Token generated successfully');
    console.log('Token: ', token);
    console.log('Token payload: ', JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString()));
    res.json({ token: token });
  } catch (error) {
    console.error('Error generating token: ', error);
    res.status(500).json({ error: 'Failed to generate token', details: error.message });
  }
});

app.post('/voice', (req, res) => {
  const voiceRespons = new twilio.twiml.VoiceResponse();

  console.log(`## Making a call to ${req.body.To} ##`);
  console.log(req.body);
  console.log("************************************");

  const dial = voiceResponse.dial({
    callerId: '+12223334444'
  });
  dial.number('+12223334444');

  res.contentType("text/xml");
  res.send(voiceResponse.toString());
});

// Serve the index.html file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});