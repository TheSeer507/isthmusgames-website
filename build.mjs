// Generates every page of isthmusgames.com into this folder.
// Edit the content below, run `node build.mjs`, then commit and push.
// No dependencies: Netlify publishes the committed files as they are.
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const SITE = 'https://isthmusgames.com';
const STUDIO = 'IsthmusGames';
const PRESS_EMAIL = 'press@isthmusgames.com';
const TRAILER_ID = 'Tr1kBlrHU5Y';

const LINKS = {
  itch: 'https://isthmusgames.itch.io',
  game: 'https://isthmusgames.itch.io/neighborhood-kitchen',
  devlogs: 'https://isthmusgames.itch.io/neighborhood-kitchen/devlog',
  latestDevlog: 'https://isthmusgames.itch.io/neighborhood-kitchen/devlog/1704017/0160-scoops-slices-spooky-seats',
  patreon: 'https://www.patreon.com/isthmusgames',
  youtube: 'https://www.youtube.com/@IsthmusGames',
  x: 'https://x.com/IsthmusGamesHQ',
  reddit: 'https://www.reddit.com/user/IsthmusGamesHQ',
  trailer: `https://youtu.be/${TRAILER_ID}`,
  repo: 'https://github.com/TheSeer507/isthmusgames-website',
};

const NAV = [
  ['Our game', '/neighborhood-kitchen/', 'game'],
  ['News', '/news/', 'news'],
  ['About', '/about/', 'about'],
  ['Press', '/press/', 'press'],
  ['Contact', '/contact/', 'contact'],
];

const ICONS = Object.fromEntries(await Promise.all(['itchdotio', 'patreon', 'youtube', 'x', 'reddit'].map(async (n) => {
  const svg = await fs.readFile(path.join(ROOT, 'assets', 'icons', `${n}.svg`), 'utf8');
  const d = svg.match(/<path d="([^"]+)"/)[1];
  return [n, `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="${d}"/></svg>`];
})));

const ext = (href) => `href="${href}" target="_blank" rel="noopener"`;

const wordmark = '<span class="wordmark"><span>Isthmus</span><span class="games">Games</span></span>';

const header = (active) => `
  <a class="skip" href="#main">Skip to content</a>
  <header class="site-header">
    <div class="wrap header-row">
      <a class="brand" href="/" aria-label="${STUDIO} home">
        <img src="/assets/emblem-island.svg" alt="" width="54" height="32">
        ${wordmark}
      </a>
      <nav aria-label="Main">
        ${NAV.map(([label, href, key]) => `<a href="${href}"${key === active ? ' aria-current="page"' : ''}>${label}</a>`).join('\n        ')}
      </nav>
      <a class="btn btn-small btn-primary" ${ext(LINKS.game)}>Play free</a>
    </div>
  </header>`;

const footer = (trailerNote = false) => `
  <footer class="site-footer">
    <div class="wrap footer-grid">
      <div>
        <div class="brand">
          <img src="/assets/emblem-island.svg" alt="" width="54" height="32">
          ${wordmark}
        </div>
        <p>An independent game studio from Panama.</p>
        <p class="social-row">
          <a ${ext(LINKS.itch)}>${ICONS.itchdotio}itch.io</a>
          <a ${ext(LINKS.patreon)}>${ICONS.patreon}Patreon</a>
          <a ${ext(LINKS.youtube)}>${ICONS.youtube}YouTube</a>
          <a ${ext(LINKS.x)}>${ICONS.x}X</a>
          <a ${ext(LINKS.reddit)}>${ICONS.reddit}Reddit</a>
        </p>
      </div>
      <nav aria-label="Footer">
        <h2>Site</h2>
        <a href="/neighborhood-kitchen/">Neighborhood Kitchen</a>
        <a href="/news/">News</a>
        <a href="/about/">About the studio</a>
      </nav>
      <nav aria-label="Press and contact">
        <h2>Press and contact</h2>
        <a href="/press/">Press kit</a>
        <a href="/contact/">Contact</a>
        <a href="mailto:${PRESS_EMAIL}">${PRESS_EMAIL}</a>
      </nav>
    </div>
    <div class="wrap footer-base">
      <p>© 2026 ${STUDIO} · Made in Panama</p>
      <p class="fineprint">This site uses no cookies, analytics or trackers.${trailerNote ? ' The trailer loads from YouTube only when you click it.' : ''}</p>
    </div>
  </footer>
  <script src="/site.js" defer></script>`;

const pictureTag = (name, alt, w, h, { lazy = true, sizes = '(max-width: 900px) 100vw, 640px', cls = '' } = {}) => `<picture${cls ? ` class="${cls}"` : ''}>
            <source type="image/webp" srcset="/assets/${name}-720.webp 720w, /assets/${name}-1440.webp 1440w" sizes="${sizes}">
            <img src="/assets/${name}.jpg" alt="${alt}" width="${w}" height="${h}"${lazy ? ' loading="lazy"' : ' fetchpriority="high"'}>
          </picture>`;

function page({ file, title, desc, active, canonical, body, jsonld = [], preload = '', trailer = false }) {
  const ld = jsonld.map((o) => `<script type="application/ld+json">${JSON.stringify(o)}</script>`).join('\n  ');
  return [file, `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta http-equiv="Content-Security-Policy" content="default-src 'self'; img-src 'self' data:; style-src 'self'; font-src 'self'; script-src 'self'; frame-src https://www.youtube-nocookie.com; base-uri 'self'; form-action 'none'; object-src 'none'">
  <title>${title}</title>
  <meta name="description" content="${desc}">
  <meta name="theme-color" content="#16498c">
  <link rel="canonical" href="${SITE}${canonical}">

  <meta property="og:type" content="website">
  <meta property="og:site_name" content="${STUDIO}">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${desc}">
  <meta property="og:url" content="${SITE}${canonical}">
  <meta property="og:image" content="${SITE}/assets/social-card.jpg">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="1200">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:site" content="@IsthmusGamesHQ">

  <link rel="icon" href="/favicon.ico" sizes="48x48">
  <link rel="icon" href="/assets/emblem.svg" type="image/svg+xml">
  <link rel="apple-touch-icon" href="/assets/icon-180.png">
  ${preload}
  <link rel="preload" href="/assets/fonts/fredoka-latin.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="/assets/fonts/nunito-latin.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="stylesheet" href="/fonts.css">
  <link rel="stylesheet" href="/styles.css">
  ${ld}
</head>
<body>${header(active)}

  <main id="main">${body}
  </main>
${footer(trailer)}
</body>
</html>
`];
}

const pageHero = (eyebrow, h1, lede) => `
    <section class="page-hero">
      <div class="wrap">
        <p class="eyebrow">${eyebrow}</p>
        <h1>${h1}</h1>
        <p class="lede">${lede}</p>
      </div>
    </section>`;

const facade = `<button class="facade" type="button" data-yt="${TRAILER_ID}" data-title="Neighborhood Kitchen 0.16 trailer" aria-label="Play the Neighborhood Kitchen trailer">
            <picture>
              <source type="image/webp" srcset="/assets/nk-copper-pot-evening-720.webp 720w, /assets/nk-copper-pot-evening-1440.webp 1440w" sizes="(max-width: 900px) 100vw, 760px">
              <img src="/assets/nk-copper-pot-evening.jpg" alt="" width="1440" height="900" loading="lazy">
            </picture>
            <span class="facade-play" aria-hidden="true"></span>
          </button>
          <p class="fineprint">The trailer loads from YouTube when you press play. <a ${ext(LINKS.trailer)}>Watch it on YouTube</a> instead.</p>`;

const shot = (name, caption, alt, w = 1440, h = 900) => `<a class="shot" href="/assets/${name}.jpg" target="_blank" rel="noopener">
            ${pictureTag(name, alt, w, h, { sizes: '(max-width: 900px) 50vw, 270px' })}
            <span>${caption}</span>
          </a>`;

const ORG = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: STUDIO,
  url: SITE,
  logo: `${SITE}/assets/icon-512.png`,
  email: PRESS_EMAIL,
  description: 'An independent game studio from Panama.',
  foundingLocation: { '@type': 'Country', name: 'Panama' },
  founder: { '@type': 'Person', name: 'Hasan Patel', image: `${SITE}/assets/founder-hasan-patel-portrait.jpg` },
  sameAs: [LINKS.itch, LINKS.patreon, LINKS.youtube, LINKS.x, LINKS.reddit],
};

const GAME = {
  '@context': 'https://schema.org',
  '@type': 'VideoGame',
  name: 'Neighborhood Kitchen',
  url: `${SITE}/neighborhood-kitchen/`,
  description: 'A free cozy restaurant game. Arrange your café, cook 62 recipes and get to know 13 neighbors, right in your browser.',
  image: `${SITE}/assets/nk-copper-pot-day.jpg`,
  genre: ['Simulation', 'Casual'],
  gamePlatform: 'Web browser',
  applicationCategory: 'Game',
  operatingSystem: 'Any (web browser)',
  playMode: 'SinglePlayer',
  inLanguage: 'en',
  softwareVersion: '0.16.0',
  author: { '@type': 'Organization', name: STUDIO, url: SITE },
  publisher: { '@type': 'Organization', name: STUDIO, url: SITE },
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD', availability: 'https://schema.org/InStock', url: LINKS.game },
  trailer: { '@type': 'VideoObject', name: 'Neighborhood Kitchen 0.16 trailer', embedUrl: `https://www.youtube-nocookie.com/embed/${TRAILER_ID}`, url: LINKS.trailer, thumbnailUrl: `${SITE}/assets/nk-copper-pot-evening.jpg` },
};

const FAQ = [
  ['Is Neighborhood Kitchen free?', 'Yes. It is free to play, with no ads and no in-game purchases. If you enjoy it, a tip on itch.io or a Patreon pledge helps keep the kitchen open.'],
  ['Do I need to download anything?', 'No. The game runs in your browser on itch.io. Click Run game and your first restaurant opens.'],
  ['Does it work on phones?', 'Desktop is recommended. On phones, play upright, because landscape panels can overlap. Safari on iPhone and iPad may forget progress when the page reloads.'],
  ['Where are my saves kept?', 'In your browser. There is no cloud sync, so keep a backup with Menu, then Download save, before refreshing or updating. Private windows and clearing site data can lose saves.'],
  ['Is there multiplayer?', 'No. Neighborhood Kitchen is single-player. Visits to real players and player-to-player trading are not included.'],
  ['Is the game finished?', 'Not yet. It is an in-development playtest, prices and rewards are still being tuned, and new updates land almost every week.'],
];

const FAQ_LD = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
};

const followCards = `
        <div class="cards">
          <a class="card" ${ext(LINKS.game)}>
            <h3>${ICONS.itchdotio}Play on itch.io</h3>
            <p>Open your first restaurant in the browser, then leave a comment to tell us what to add next.</p>
            <span class="card-link">isthmusgames.itch.io</span>
          </a>
          <a class="card" ${ext(LINKS.patreon)}>
            <h3>${ICONS.patreon}Support us on Patreon</h3>
            <p>Get playtest builds early, vote on the next cuisine and get your name in the credits.</p>
            <span class="card-link">patreon.com/isthmusgames</span>
          </a>
          <a class="card" ${ext(LINKS.youtube)}>
            <h3>${ICONS.youtube}Watch on YouTube</h3>
            <p>Trailers and update videos for Neighborhood Kitchen.</p>
            <span class="card-link">@IsthmusGames</span>
          </a>
          <a class="card" ${ext(LINKS.x)}>
            <h3>${ICONS.x}Follow on X</h3>
            <p>Short updates from the studio between devlogs.</p>
            <span class="card-link">@IsthmusGamesHQ</span>
          </a>
          <a class="card" ${ext(LINKS.reddit)}>
            <h3>${ICONS.reddit}Find us on Reddit</h3>
            <p>Development notes and replies to player questions.</p>
            <span class="card-link">u/IsthmusGamesHQ</span>
          </a>
        </div>`;

const pages = [];

pages.push(page({
  file: 'index.html',
  title: `${STUDIO} | Indie game studio from Panama`,
  desc: `${STUDIO} is an independent game studio from Panama. Play Neighborhood Kitchen, our cozy restaurant game, free in your browser.`,
  active: '',
  canonical: '/',
  jsonld: [ORG],
  preload: '<link rel="preload" href="/assets/emblem-island.svg" as="image" type="image/svg+xml">',
  body: `
    <section class="hero" id="top">
      <svg class="waves" viewBox="0 0 1200 600" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <g fill="none" stroke="#fff" stroke-linecap="round" opacity=".3">
          <path d="M90 120q30-20 60 0t60 0" stroke-width="10"/>
          <path d="M930 90q26-18 52 0t52 0" stroke-width="9"/>
          <path d="M560 60q18-12 36 0t36 0" stroke-width="6"/>
          <path d="M60 470q24-16 48 0t48 0" stroke-width="8"/>
          <path d="M1010 430q30-20 60 0t60 0" stroke-width="10"/>
          <path d="M700 540q17-12 34 0t34 0" stroke-width="6"/>
        </g>
      </svg>
      <div class="wrap hero-grid">
        <div class="hero-copy">
          <p class="eyebrow">Independent game studio · Panama</p>
          <h1>Cozy games from the land between two oceans.</h1>
          <p class="lede">We are ${STUDIO}, a tiny indie studio in Panama. Our first game, <strong>Neighborhood Kitchen</strong>, is out now and free to play in your browser.</p>
          <div class="actions">
            <a class="btn btn-primary" ${ext(LINKS.game)}>Play Neighborhood Kitchen</a>
            <a class="btn btn-ghost" href="/neighborhood-kitchen/">About the game</a>
          </div>
        </div>
        <div class="hero-art">
          <img src="/assets/emblem-island.svg" alt="${STUDIO} emblem: a green island shaped like a game controller, with a blue star and a red star" width="930" height="540" fetchpriority="high">
        </div>
      </div>
    </section>

    <section class="section" id="game">
      <div class="wrap">
        <div class="section-head">
          <p class="eyebrow">Our game</p>
          <h2>Neighborhood Kitchen</h2>
          <p class="tagline">Your little café. Your next big idea.</p>
        </div>

        <div class="game-grid">
          <div class="game-copy">
            <p>Start with a tiny corner café and make it yours. Arrange the tables, choose your dishes and watch your chibi team cook, serve and clean.</p>
            <ul class="stats">
              <li><strong>62</strong><span>recipes to discover and master</span></li>
              <li><strong>13</strong><span>neighbors to get to know</span></li>
              <li><strong>6</strong><span>neighbor restaurants to visit</span></li>
              <li><strong>Free</strong><span>no ads, no in-game purchases</span></li>
            </ul>
            <div class="actions">
              <a class="btn btn-primary" ${ext(LINKS.game)}>Play free on itch.io</a>
              <a class="btn btn-outline" href="/neighborhood-kitchen/">About the game</a>
            </div>
            <p class="fineprint">Single-player · Runs in your browser, no download · Desktop recommended · In development, with new updates almost every week.</p>
          </div>
          <a class="shot shot-main" href="/assets/nk-copper-pot-day.jpg" target="_blank" rel="noopener">
            ${pictureTag('nk-copper-pot-day', 'A busy lunch rush in a Neighborhood Kitchen restaurant, with guests at every table and three cooks in an open kitchen', 1440, 900, { lazy: true, sizes: '(max-width: 900px) 100vw, 640px' })}
          </a>
        </div>

        <aside class="update">
          <div>
            <p class="eyebrow">Latest update · 0.16.0</p>
            <h3>Scoops, Slices &amp; Spooky Seats</h3>
            <p>An ice cream counter with six desserts, a working pizzeria oven with four new pizzas, ten matching dining sets and a bigger Halloween collection.</p>
          </div>
          <a class="btn btn-outline" href="/news/">Read the news</a>
        </aside>
      </div>
    </section>

    <section class="section section-sand" id="studio">
      <div class="wrap studio-grid">
        <div>
          <p class="eyebrow">The studio</p>
          <h2>Small studio, narrow strip of land, big plans.</h2>
          <p>${STUDIO} is an independent studio from Panama, the isthmus that joins two continents and separates two oceans. Our emblem is that idea in one picture: a little island shaped like a controller.</p>
          <p>We make warm, unhurried games that respect your time, and we build them in the open with the people who play them.</p>
          <p><a href="/about/">More about the studio</a> · Press and business: <a href="mailto:${PRESS_EMAIL}">${PRESS_EMAIL}</a></p>
        </div>
        <ul class="values">
          <li>
            <h3>Free and fair</h3>
            <p>Neighborhood Kitchen is free to play, with no ads and no in-game purchases.</p>
          </li>
          <li>
            <h3>Always cooking</h3>
            <p>The game is in active development and new updates land almost every week.</p>
          </li>
          <li>
            <h3>Shaped by players</h3>
            <p>Comments on itch.io reach us directly, and Patreon supporters vote on what comes next.</p>
          </li>
        </ul>
      </div>
    </section>

    <section class="section" id="follow">
      <div class="wrap">
        <div class="section-head">
          <p class="eyebrow">Follow along</p>
          <h2>Play, follow and support</h2>
        </div>
        ${followCards}
        <p class="contact-line">Press or business? Write to <a href="mailto:${PRESS_EMAIL}">${PRESS_EMAIL}</a> or see the <a href="/press/">press kit</a>.</p>
      </div>
    </section>`,
}));

pages.push(page({
  file: 'neighborhood-kitchen/index.html',
  title: `Neighborhood Kitchen | Free cozy restaurant game by ${STUDIO}`,
  desc: 'Neighborhood Kitchen is a free cozy restaurant game. Arrange your café, cook 62 recipes and get to know 13 neighbors, right in your browser.',
  active: 'game',
  canonical: '/neighborhood-kitchen/',
  jsonld: [GAME, FAQ_LD],
  preload: '<link rel="preload" as="image" type="image/webp" href="/assets/nk-copper-pot-evening-1440.webp" imagesrcset="/assets/nk-copper-pot-evening-720.webp 720w, /assets/nk-copper-pot-evening-1440.webp 1440w" imagesizes="(max-width: 900px) 100vw, 760px">',
  body: `${pageHero('Our game · In development', 'Neighborhood Kitchen', 'Your little café. Your next big idea. Free to play in your browser, with no ads and no in-game purchases.')}

    <section class="section">
      <div class="wrap narrow">
        <div class="actions actions-top">
          <a class="btn btn-primary" ${ext(LINKS.game)}>Play free on itch.io</a>
          <a class="btn btn-outline" ${ext(LINKS.devlogs)}>All devlogs</a>
        </div>
        ${facade}
      </div>
    </section>

    <section class="section section-sand">
      <div class="wrap">
        <div class="section-head">
          <p class="eyebrow">What you do</p>
          <h2>Build the favorite spot on the block</h2>
        </div>
        <div class="feature-grid">
          <div>
            <h3>Make the café yours</h3>
            <p>Create your owner and server, name your restaurant, then decorate, rotate furniture, change floors and walls, expand the room and pick a jukebox station.</p>
          </div>
          <div>
            <h3>Craft your own menu</h3>
            <p>Discover 62 recipes across starters, mains, drinks, pastries and desserts, and build each one to mastery level 5.</p>
          </div>
          <div>
            <h3>Run any kind of kitchen</h3>
            <p>Cook Italian, Japanese, Mexican, Greek, American Diner and German dishes, with matching dining sets for each.</p>
          </div>
          <div>
            <h3>Keep the kitchen moving</h3>
            <p>Hire cooks, servers and cleaners, upgrade stoves, ovens and counters, and assign cooks to their own stations.</p>
          </div>
          <div>
            <h3>Get to know 13 neighbors</h3>
            <p>Learn their preferences, plan their visits and follow requests for ingredient gifts and keepsakes.</p>
          </div>
          <div>
            <h3>Visit other restaurants</h3>
            <p>From level 5, explore six NPC restaurants as your character and help their owners with daily jobs.</p>
          </div>
          <div>
            <h3>Grow your own ingredients</h3>
            <p>Plant tomatoes, lettuce, potatoes, strawberries, mushrooms, tea, lemons, olives, apples and pumpkins. Crops grow while you are away and never wilt.</p>
          </div>
          <div>
            <h3>Host gatherings</h3>
            <p>Seat parties of six or eight, let happy diners stay for a coffee or dessert, or switch on takeaway when the kitchen can handle it.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="wrap">
        <div class="section-head">
          <p class="eyebrow">Screenshots</p>
          <h2>A look inside</h2>
        </div>
        <div class="shots shots-three">
          ${shot('nk-ice-cream', 'Ice cream corner', 'An ice cream parlor with a checkered floor, pink chairs and cooks scooping sundaes', 1280, 720)}
          ${shot('nk-pumpkin-porch', 'Kitchen garden', 'A restaurant decorated for autumn, with guests in wide hats and a pumpkin patch in the garden')}
          ${shot('nk-halloween', 'Harvest &amp; Haunts', 'A Halloween themed restaurant with dark floors, guests in witch hats and pumpkin decorations', 1280, 720)}
        </div>
      </div>
    </section>

    <section class="section section-sand">
      <div class="wrap prose">
        <div class="section-head">
          <p class="eyebrow">Good to know</p>
          <h2>Before you play</h2>
        </div>
        <dl class="facts">
          <div><dt>Price</dt><dd>Free, with no ads and no in-game purchases</dd></div>
          <div><dt>Platform</dt><dd>Web browser on itch.io. Desktop recommended.</dd></div>
          <div><dt>Players</dt><dd>Single-player</dd></div>
          <div><dt>Status</dt><dd>In development playtest, version 0.16.0</dd></div>
          <div><dt>Language</dt><dd>English</dd></div>
          <div><dt>Engine</dt><dd>Phaser</dd></div>
        </dl>
        <h3>Questions</h3>
        ${FAQ.map(([q, a]) => `<details class="faq">
          <summary>${q}</summary>
          <p>${a}</p>
        </details>`).join('\n        ')}
        <h3>Credits and transparency</h3>
        <p>Characters are adapted from Chibi Characters by Styloo (CC0). Selected furniture and food are adapted from KayKit Restaurant Bits by Kay Lousberg (CC0). Garden crops are by NewLua Studios. Music is by Kevin MacLeod (CC BY 4.0), plus original pieces. The game is built with Phaser. Full credits are on the <a ${ext(LINKS.game)}>itch.io page</a>.</p>
        <p>AI tools assisted development, including code, interface text and art iteration. The game does not generate content with AI while you play.</p>
      </div>
    </section>`,
}));

pages.push(page({
  file: 'news/index.html',
  title: `News | ${STUDIO}`,
  desc: `Devlogs and update news from ${STUDIO}, the studio behind Neighborhood Kitchen.`,
  active: 'news',
  canonical: '/news/',
  body: `${pageHero('News', 'Updates from the kitchen', 'Neighborhood Kitchen is updated almost every week. The newest devlog is below.')}

    <section class="section">
      <div class="wrap narrow">
        <article class="news-item">
          <p class="eyebrow">October 12, 2026 · Version 0.16.0</p>
          <h2>Scoops, Slices &amp; Spooky Seats</h2>
          <p>A pizza fresh from the oven, a sundae after supper, and a dining room that feels like yours. This update adds an ice cream counter with six desserts, a working pizzeria oven with four new pizzas, ten matching dining sets and a bigger Halloween collection.</p>
          <a class="btn btn-outline" ${ext(LINKS.latestDevlog)}>Read the full devlog</a>
        </article>
        <p class="contact-line">Older devlogs are on <a ${ext(LINKS.devlogs)}>itch.io</a>.</p>
      </div>
    </section>`,
}));

pages.push(page({
  file: 'about/index.html',
  title: `About | ${STUDIO}`,
  desc: `${STUDIO} is an independent game studio from Panama, making warm, unhurried games in the open.`,
  active: 'about',
  canonical: '/about/',
  body: `${pageHero('About', 'A studio on the isthmus', 'We are a tiny indie studio in Panama, the narrow strip of land that joins two continents and separates two oceans.')}

    <section class="section">
      <div class="wrap prose">
        <figure class="founder">
          <img src="/assets/founder-hasan-patel-portrait.jpg" alt="Hasan Patel, founder of ${STUDIO}" width="800" height="800" loading="lazy">
          <figcaption>
            <h2>Hasan Patel</h2>
            <p class="tagline">Founder and solo developer</p>
            <p>Hasan founded ${STUDIO} in Panama and makes Neighborhood Kitchen on his own: the code, the interface text and the updates that land almost every week.</p>
          </figcaption>
        </figure>
        <h2>Our story</h2>
        <p>${STUDIO} was founded by Hasan Patel in Panama. The name comes from home: an isthmus is a narrow piece of land with water on both sides, connecting two larger places. Our emblem draws that as a little island shaped like a game controller.</p>
        <p>Our first game, <a href="/neighborhood-kitchen/">Neighborhood Kitchen</a>, is a free cozy restaurant game that runs in the browser.</p>
        <h2>How we work</h2>
        <ul>
          <li><strong>Free and fair.</strong> Neighborhood Kitchen is free to play, with no ads and no in-game purchases.</li>
          <li><strong>In the open.</strong> The game is in active development, new updates land almost every week, and every release has a public devlog.</li>
          <li><strong>With players.</strong> Comments on itch.io reach us directly, and Patreon supporters vote on what comes next.</li>
          <li><strong>Honest about tools.</strong> AI tools assisted development, including code, interface text and art iteration. The game does not generate content with AI while you play.</li>
        </ul>
        <h2>Get in touch</h2>
        <p>Write to <a href="mailto:${PRESS_EMAIL}">${PRESS_EMAIL}</a>, or see the <a href="/contact/">contact page</a> for where to find us.</p>
      </div>
    </section>`,
}));

pages.push(page({
  file: 'press/index.html',
  title: `Press kit | ${STUDIO}`,
  desc: `Fact sheet, description, screenshots, logos and contact for ${STUDIO} and Neighborhood Kitchen.`,
  active: 'press',
  canonical: '/press/',
  body: `${pageHero('Press kit', 'Press', `Everything you need to write about ${STUDIO} and Neighborhood Kitchen. Contact: <a href="mailto:${PRESS_EMAIL}">${PRESS_EMAIL}</a>`)}

    <section class="section">
      <div class="wrap prose">
        <h2>Fact sheet</h2>
        <dl class="facts">
          <div><dt>Developer</dt><dd>${STUDIO}, based in Panama</dd></div>
          <div><dt>Founder</dt><dd>Hasan Patel</dd></div>
          <div><dt>Game</dt><dd>Neighborhood Kitchen</dd></div>
          <div><dt>Latest version</dt><dd>0.16.0, released October 12, 2026</dd></div>
          <div><dt>Status</dt><dd>In development playtest</dd></div>
          <div><dt>Platform</dt><dd>Web browser on itch.io. Desktop recommended.</dd></div>
          <div><dt>Price</dt><dd>Free, with no ads and no in-game purchases</dd></div>
          <div><dt>Players</dt><dd>Single-player</dd></div>
          <div><dt>Website</dt><dd><a href="${SITE}">isthmusgames.com</a></dd></div>
          <div><dt>Press contact</dt><dd><a href="mailto:${PRESS_EMAIL}">${PRESS_EMAIL}</a></dd></div>
        </dl>
        <h2>Description</h2>
        <p><strong>Short:</strong> Neighborhood Kitchen is a free cozy restaurant game by ${STUDIO}, an independent studio from Panama. Arrange your café, cook 62 recipes and get to know 13 neighbors, right in your browser.</p>
        <p><strong>Long:</strong> Start with a tiny corner café and make it yours. Arrange the tables, choose your dishes and watch your chibi team cook, serve and clean. Run an Italian trattoria, a Japanese kitchen, a Greek taverna or an all-day diner, grow ingredients in the kitchen garden, and turn first-time guests into neighborhood regulars. The game is free to play with no ads and no in-game purchases, and new updates land almost every week.</p>
        <h2>Trailer</h2>
        <p><a ${ext(LINKS.trailer)}>Neighborhood Kitchen 0.16 trailer on YouTube</a></p>
      </div>
    </section>

    <section class="section section-sand">
      <div class="wrap">
        <div class="section-head">
          <p class="eyebrow">Downloads</p>
          <h2>Logos and screenshots</h2>
        </div>
        <p><a class="btn btn-primary" href="/assets/isthmusgames-press-kit.zip" download>Download everything (ZIP)</a></p>
        <ul class="downloads">
          <li><a href="/assets/emblem.svg" download>Emblem (SVG)</a></li>
          <li><a href="/assets/emblem-island.svg" download>Emblem, no background (SVG)</a></li>
          <li><a href="/assets/icon-512.png" download>Emblem (PNG, 512 px)</a></li>
          <li><a href="/assets/logo-with-name-1024.png" download>Logo with name (PNG, 1024 px)</a></li>
          <li><a href="/assets/nk-copper-pot-day.jpg" download>Screenshot: day service</a></li>
          <li><a href="/assets/nk-copper-pot-evening.jpg" download>Screenshot: evening service</a></li>
          <li><a href="/assets/nk-ice-cream.jpg" download>Screenshot: ice cream corner</a></li>
          <li><a href="/assets/nk-pumpkin-porch.jpg" download>Screenshot: kitchen garden</a></li>
          <li><a href="/assets/nk-halloween.jpg" download>Screenshot: Harvest &amp; Haunts</a></li>
        </ul>
      </div>
    </section>`,
}));

pages.push(page({
  file: 'contact/index.html',
  title: `Contact | ${STUDIO}`,
  desc: `Contact ${STUDIO}: press and business email, and where to follow the studio.`,
  active: 'contact',
  canonical: '/contact/',
  body: `${pageHero('Contact', 'Get in touch', 'Press, business or just hello: we read everything.')}

    <section class="section">
      <div class="wrap prose">
        <h2>Email</h2>
        <p>Press and business: <a href="mailto:${PRESS_EMAIL}">${PRESS_EMAIL}</a></p>
        <h2>Player feedback and bugs</h2>
        <p>Leave a comment on the <a ${ext(LINKS.game)}>Neighborhood Kitchen page on itch.io</a>. For bugs, include your browser, device, game version and what happened.</p>
        <h2>Find us</h2>
        ${followCards}
      </div>
    </section>`,
}));

pages.push(page({
  file: '404.html',
  title: `Page not found | ${STUDIO}`,
  desc: 'That page does not exist.',
  active: '',
  canonical: '/',
  body: `${pageHero('404', 'Lost at sea', 'That page does not exist. Head back to the <a href="/">home page</a>.')}`,
}));

for (const [file, html] of pages) {
  const dest = path.join(ROOT, file);
  await fs.mkdir(path.dirname(dest), { recursive: true });
  await fs.writeFile(dest, html);
  console.log('wrote', file);
}

const today = new Date().toISOString().slice(0, 10);
const urls = pages.filter(([f]) => f !== '404.html').map(([f]) => `${SITE}/${f.replace(/index\.html$/, '')}`);
await fs.writeFile(path.join(ROOT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${u}</loc><lastmod>${today}</lastmod></url>`).join('\n')}
</urlset>
`);
await fs.writeFile(path.join(ROOT, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`);
console.log('wrote sitemap.xml, robots.txt');
