# isthmusgames.com

The website of IsthmusGames, an independent game studio from Panama.

It is a plain static site with no dependencies. Netlify publishes the files in this folder as they are, so a `git push` to `main` updates the live site.

## Editing

All the text lives in `build.mjs`. Change it there, then regenerate the pages:

```
node build.mjs
```

That rewrites the HTML pages, `sitemap.xml` and `robots.txt`. Commit the result and push.

- `styles.css` and `site.js` are edited directly.
- `assets/` holds the logos, screenshots, fonts and the social card.
- To post news, add an entry to the news page in `build.mjs` and rebuild.

## Pages

- `/` home
- `/neighborhood-kitchen/` game page
- `/news/` update news
- `/about/` studio story
- `/press/` press kit
- `/contact/` contact
