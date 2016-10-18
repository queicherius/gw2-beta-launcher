# gw2-beta-launcher

> An inofficial launcher for Guild Wars2, simulating the experience of the first beta launcher

## Development

```bash
# Clone the repository
git clone ...

# Install the dependencies
npm install

# Run the electron application
npm start

# Check if the code style is ok
npm test

# Package the release
npm run build
```

### Note on video compression

```bash
ffmpeg.exe -i background.mp4 -b:v 1000k -r 30 background.mp4
```

## License

MIT
