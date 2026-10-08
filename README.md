# Tide Out — From lively scenes to nature

A simple, English-language student prototype with an intention check-in, a vertical video feed and four optional viewing effects.

## Open the prototype

Unzip `tide-out-github.zip` and open `index.html` in a browser. Keep `index.html`, `style.css`, `script.js` and `media/` in the same folder. These files can go directly into a GitHub Pages site without a build step.

The full package includes nine silent video samples and their posters for offline playback. If you copy only the three source files, the page tries online Mixkit samples when local files are missing. That fallback needs an internet connection.

## Try the percentage controls

1. Choose your reason for scrolling, then select **Enter feed**.
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

Effects apply to the video only. Text and controls keep their contrast. Labels use solid dark backgrounds, while selected percentage badges use dark text on a light background. Percentage text is larger and bold.

## Check in before entering

The cover asks **Why do you want to scroll?** Choose one of four reasons:

- **A spare moment** — short gaps in the day.
- **Rest and relaxation** — a little time to unwind.
- **Boredom or habit** — opening the feed without a plan.
- **Before bed or low energy** — winding down or feeling tired.

No reason is preselected. Enter feed becomes available after a choice. The chosen reason appears above the video as a small reminder; it does not automatically turn on any effects. All four reasons use the same video sequence. This check-in stays on the page and is not saved or sent.

## Content moves towards nature

As you use Next or swipe up, the actual video subjects change in this order:

1. **Lively scenes:** a bright city street, then market shoppers.
2. **Everyday moments:** a pottery workshop, friends at a café, then coffee being made.
3. **Nature:** ocean waves, a forest path, the shore, then sunset on the water.

This is an authored progression from visually busy scenes towards quieter nature, not a measured stimulation score or a personalised recommendation system. The shift happens through content, even when all four effects are off.

The final sunset clip does not loop. When it ends, or when you press **Finish**, the feed opens a reflection rather than cycling back to the city. You can finish your session or explicitly replay the final nature clip. Previous lets you revisit an earlier scene; it stops at the first clip. Other clips loop while you choose when to move on.

The friends clip keeps its full landscape framing so both people remain visible. The stock clips illustrate nature, everyday places, community and connection; they are not verified nearby locations or event recommendations. Edit the `clips` array at the top of `script.js` to add or replace videos, keeping the busy-to-nature order.

## Time, pause and reflection

The cover's optional **Break time** setting defaults to five minutes. Choose **30 sec · classroom demo** to demonstrate the time limit quickly. There is no video-count setting.

The remaining-time display counts real playback seconds and stops during pauses, buffering or when the video tab is hidden. Slowing the video does not change how real viewing time is counted.

**Take a break** pauses the feed and opens an optional reflection. **Finish for now** returns to the cover. Continuing restores the effects and uses the remaining time, or explicitly adds one minute if the time limit has been reached.

## Design intent

The regenerative design idea is to encourage a return to everyday life, nature and connection. The opening check-in makes the reason for browsing explicit, the content gradually moves towards nature, and the finite sequence creates a stopping point. Users choose their effects and when to pause or continue.

This is a design hypothesis, not a tested wellbeing intervention. No account, location, intention or reflection data is saved or sent. This is an independent student project, not an official TikTok product. Code was developed with AI assistance; acknowledge that assistance according to the course requirements.

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
