# Tide Out — Four effects, at your own pace

A simple, English-language student prototype with an entry cover, a vertical video feed and an Attention Bubble.

## Open the prototype

Unzip `tide-out-github.zip` and open `index.html` in a browser. Keep `index.html`, `style.css`, `script.js` and `media/` in the same folder. These files can go directly into a GitHub Pages site without a build step.

The full package includes nine silent video samples and their posters for offline playback. If you copy only the three source files, the page tries online Mixkit samples when local files are missing. That fallback needs an internet connection.

## Try the percentage controls

1. Choose a video topic, then select **Enter feed**.
2. Each side button starts at **0%**, meaning the effect is off.
3. Switch an effect on. It starts at **10%** strength.
4. Change videos with Next, Previous or a swipe. Active effects progress through **28%, 46%, 64%, 82% and 100%**.
5. Switch one effect off to return it to 0%, or use **Restore** to reset all four.

Percentages represent **effect strength**, not the video's remaining speed, size, colour or brightness. For example, Slow at 100% means the strongest slowdown, not normal playback speed. These numbers are not attention or health scores.

| Button | What changes | At 100% effect strength |
| --- | --- | --- |
| Slow | Playback slows down | 0.65× playback speed |
| Space | The picture shrinks and blank space increases | 70% of the original picture size |
| Colour | Saturation decreases | Black and white |
| Dim | Video brightness decreases | 40% brightness |

Effects apply to the video only. Text, controls and the bubble keep their contrast. Labels use solid dark backgrounds, while selected percentage badges use dark text on a light background. Percentage text is larger and bold.

## Video topics

Topics determine what the feed shows. The four side buttons control how the video is presented.

- **Nature:** forest paths, the shore, ocean waves and sunset.
- **Nearby activities:** coffee, markets and city streets.
- **Community:** a pottery workshop and people at a market.
- **Connection:** friends chatting over coffee.

Choose **All topics** for a mixed feed. The friends clip keeps its full landscape framing so both people remain visible. These are illustrative stock clips, not verified nearby locations or event recommendations.

Possible future video subjects from the group concept:

- **Nature:** a short walk nearby; a park; a quiet outdoor space; a river or garden walk.
- **Nearby activities:** a café; a bookstore; a small market; a gallery; a library.
- **Community:** a community event; a weekend market; a workshop; a free event; a community centre.
- **Connection:** coffee with a friend; calling or messaging someone; a shared class or activity; a walk together.

The current package does not include a separate clip for every proposed subject. Edit the `clips` array at the top of `script.js` to add or replace videos.

## Time, pause and reflection

The cover's optional **Break time** setting defaults to five minutes. Choose **30 sec · classroom demo** to demonstrate the time limit quickly. There is no video-count setting.

The Attention Bubble represents elapsed viewing time. Clicking it shows watched and remaining time. The timer counts real playback seconds and stops during pauses, buffering or when the video tab is hidden. Slowing the video does not change how real viewing time is counted.

**Take a break** pauses the feed and opens an optional reflection. **Finish for now** returns to the cover. Continuing restores the effects and uses the remaining time, or explicitly adds one minute if the time limit has been reached.

## Design intent

The prototype makes continued browsing more noticeable while presenting scenes of nature, everyday activities, community and connection. Users choose their effects and when to pause or continue.

This is a design hypothesis, not a tested wellbeing intervention. The bubble does not measure attention or fatigue. No account, location or reflection data is saved or sent. This is an independent student project, not an official TikTok product. Code was developed with AI assistance; acknowledge that assistance according to the course requirements.

## Video credits

The footage comes from Mixkit. The source pages identify these clips under the Mixkit Stock Video Free License. The feed retains a source link for each clip. The friends, pottery and market source pages were checked on 6 October 2026.

- Forest: https://mixkit.co/free-stock-video/walking-a-path-that-crosses-a-dense-forest-41574/
- Coffee: https://mixkit.co/free-stock-video/coffee-maker-making-coffee-3578/
- Workshop: https://mixkit.co/free-stock-video/two-girls-in-a-pottery-workshop-making-clay-vases-40022/
- Friends: https://mixkit.co/free-stock-video/friends-talking-in-the-cafe-43247/
- Shore: https://mixkit.co/free-stock-video/waves-of-the-sea-arriving-at-a-beach-44482/
- Market: https://mixkit.co/free-stock-video/market-shoppers-992/
- City: https://mixkit.co/free-stock-video/pedestrian-walk-in-tokyo-4231/
- Ocean: https://mixkit.co/free-stock-video/turquoise-ocean-background-with-foaming-waves-2091/
- Sunset: https://mixkit.co/free-stock-video/defocused-view-of-the-sunset-reflection-in-the-sea-34363/
