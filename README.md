# gw2-beta-launcher

[![No Maintenance Intended](https://img.shields.io/badge/No%20Maintenance%20Intended-%E2%9C%95-red.svg?style=flat-square)](http://unmaintained.tech/)

> An inofficial launcher for Guild Wars2, simulating the experience of the first beta launcher.

## Disclaimers

- **This is an inofficial, unsupported launcher created for nostalgic reasons.**
- **It is not affiliated with ArenaNet in any way, shape or form.**
- **All content is property of ArenaNet / NCSOFT.**
- **There will be no support if things break at any point.**

## Downloads

See the [releases page](https://github.com/queicherius/gw2-beta-launcher/releases/latest) for the latest Windows (32 bit / 64 bit) and Mac OS X build.

## FAQ

**How?!**<br>
This is just a pretty webpage running as a dektop application using [Electron](http://electron.atom.io/), which runs the official launcher in the background.

**Is this bannable?**<br>
No, it only uses the [official command line arguments](https://wiki.guildwars2.com/wiki/Command_line_arguments)

**Is my password safe when the client remembers it?**<br>
Yes, it's about as safe as remembering it in the official client. It's never sent over the wire. It is saved using AES 256 CTR with a salt that refreshes every time you log in.

**Where are the options stored?**<br>
`%APPDATA%/Guild Wars 2 Unofficial Beta Launcher/config.json` on Windows<br>
`~/Library/Application Support/Guild Wars 2 Unofficial Beta Launcher/config.json` on macOS

**My game freezes and shows a black / white screen!**<br>
This means your account credentials were not correct.

**Can you add _______?**<br>
**Something doesn't work! Can you fix it?**<br>
No. I don't have the time to maintain this project. Feel free to send in pull requests, or use the more powerful [GW2 Launchbuddy](https://github.com/TheCheatsrichter/Gw2_Launchbuddy). This project is mainly for fun / nostalgica, with no support intended.

## Development

```bash
# Clone the repository
git clone https://github.com/queicherius/gw2-beta-launcher

# Install the dependencies
npm install

# Run the electron application
npm start

# Check if the code style is ok
npm test

# Package the release
npm run build
```

> **Note:** When changing the background video, make sure it is as small as possible, e.g. using ffmpeg: `ffmpeg.exe -i background.mp4 -b:v 1000k -r 30 background.mp4`

## License

[Do What the Fuck You Want to Public License](http://www.wtfpl.net/)

© 2015 ArenaNet, LLC. All rights reserved. NCSOFT, the interlocking NC logo, ArenaNet, Guild Wars, Guild Wars Factions, Guild Wars Nightfall, Guild Wars: Eye of the North, Guild Wars 2, Heart of Thorns, and all associated logos and designs are trademarks or registered trademarks of NCSOFT Corporation. All other trademarks are the property of their respective owners.
