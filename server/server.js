const express = require('express');
const request = require('request');
const querystring = require('querystring');
const cors = require('cors');

const app = express();
app.use(cors());

const client_id = '1825b9d9bd2244c5a9a94eb1287c5940'; // Spotify Client ID
const client_secret = '719221aad08c48c9975df7698cc6f225'; // Spotify Client Secret
const redirect_uri = 'http://localhost:3000/callback'; // Your Redirect URI

app.get('/login', (req, res) => {
  const scopes = 'user-read-private user-read-email';
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scopes,
      redirect_uri: redirect_uri
    }));
});

//로그인 후 호출되는 콜백 엔드포인트
app.get('/callback', (req, res) => {
  const code = req.query.code || null;
  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      code: code,
      redirect_uri: redirect_uri,
      grant_type: 'authorization_code'
    },
    headers: {
      'Authorization': 'Basic ' + (Buffer.from(client_id + ':' + client_secret).toString('base64'))
    },
    json: true
  };

  request.post(authOptions, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      const access_token = body.access_token,
        refresh_token = body.refresh_token;

      res.redirect('http://localhost:3000?' +
        querystring.stringify({
          access_token: access_token,
          refresh_token: refresh_token
        }));
    } else {
      res.redirect('/#' +
        querystring.stringify({
          error: 'invalid_token'
        }));
    }
  });
});

app.listen(3000, () => {
  console.log('Listening on 3000');
});
