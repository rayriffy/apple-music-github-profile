# Apple Music GitHub Profile

![cover](./img/cover.jpg)

Show your recently played song on Apple Music directly to your GitHub profile.

## Connect

Click `Connect with Apple Music` button below to sign in with Apple ID

[<img alt="connect" src="./img/connect.png" height="42">](https://apple-music-github-profile.rayriffy.com/api/auth/login)

## Themes

| Themes | Preview |
| - | - |
| Light | <img alt="light theme" src="./img/light.svg" height="350" /> |
| Dark | <img alt="dark theme" src="./img/dark.svg" height="350" /> |

## Development

You're going to have Apple Developer membership in order to gain access to Apple Music API. You're going to create following...

1. **App ID**: with _"Sign In with Apple"_ capability enabled
2. **Service ID**: with _"Sign In with Apple"_ enabled and configured
3. **Media ID**: with _"MusicKit"_ enabled
4. **Key**: with _"Sign in with Apple"_ and _"Media Services"_ enabled and configured

After key downloaded, copy `.env.exmaple` into `.env` and change variable values appropriately.

- `APPLE_KEY_ID`: ID of the downloaded key
- `APPLE_PRIVATE_KEY`: Private key content of the downloaded key
- `APPLE_TEAM_ID`: Team ID of your Apple Developer membership
- `IRON_SECRET`: Random salt nessesary for encrypting authentication token
- `DATABASE_URL`: (Optional) Connection URLs of Postgres database. Optional if you're developing locally with provided `docker-compose.yml`

Then, get yourself [Docker] and spining up database server with following command.

```
# Create and start database
docker-compose up -d postgres

# Stop and remove database when finished
docker-compose down
```

And now you're able to start development server.

> **Be aware!!!** Apple Services might not played well with HTTP protocol but it's very unlikely.

```
pnpm dev
```

## Known Limitations

1. Unable to show recently played song that brought directly from iTunes Store (API Limit)

## FAQ

#### Why do I have to sign in with Apple ID first?

Unlike Spotfy API where you can identify user by uid, Apple Music API does not provide any possible way to identify users which will make impossible for one deployment to be used by many people.

#### Can I use this card anywhere else?

Yes

#### I want more card styles

You can make your own theme card, and send a pull request to this repository. Please refer to [contribution guidelines]()

#### My card is broken

It possible that connected Apple Music session is already expired. You can reconnect your card by complete linking process once again.

## Credit

This project is heavily inspired by [spotify-github-profile](https://github.com/kittinan/spotify-github-profile) from [Kittinan](https://github.com/kittinan)
