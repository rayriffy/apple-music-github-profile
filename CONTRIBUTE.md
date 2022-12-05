# Contributing

Any contribution is welcome to this repository, there're various ways to contribute into the project.

## Creating new card theme

Cards are being rendered as `image/svg+xml` image. All templates are stored at [`src/templates`](./src/templates) directory, and being rendered as a final result by ESM. API will send this metadata object that necessary for you to create a reactive card.

```js
{
  title: '私をAKIBAにつれてって (feat. 鏡音リン)', // song title
  artist: 'Wonderful★opportunity!', // artist
  coverImageData: 'data:image/jpeg;base64,...', // base64 encoded of artwork
  timestamp: {
    percentage: '33.33', // percetage to seek scroller already elapsed
    elapsed: '1:38', // time stamp of duration already listened to
    remaining: '3:16' // time stamp of remaining time
  }
}
```

Create new theme at `src/pages` called `<themeName>.ejs` by replacing `<themeName>` with your desired file name, and providing metadata into [`themes.ts`](./src/core/constants/themes.ts). Then, you implementing a valid SVG image and sending a pull request to this repository for a review. See [`light.ejs`](./src/templates/light.ejs) for an examples.
