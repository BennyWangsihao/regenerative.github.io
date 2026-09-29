# Tide Out — 可直接运行的学生原型

这版使用 Shrink、Quiet、Colour、Pause 四个按钮，Colour 替换了留白功能。
视频上方保留可点击的 Attention Bubble；初始设置只有观看时长，没有视频数量。

## 打开

解压后打开 `index.html`。请把 `index.html`、`style.css`、`script.js` 和 `media` 文件夹放在同一目录。
可以把这些文件原样放进 GitHub Pages 静态站点；不需要框架、安装或构建步骤。
如果只复制三个源码文件，程序会尝试使用在线视频，因而需要网络。
整包内有六段静音样片；视频会循环使用。

## 快速体验

1. 按 Start break。
2. 开启 Shrink、Quiet、Colour，连续按 Next 五次，或在视频上向上滑动。
3. 视频会缩至原尺寸的 70%，示例点赞与评论会淡出，视频会变成黑白。
4. 开启 Pause 后，等待当前视频自然结束，即可看到休息与反思界面。
5. Restore 可随时关闭全部模式。Take a break 可立即停止并反思。

前三个模式从 10% 开始，每次切换视频增加 18%，五次切换后达到 100%。
百分比只是人为设计的视觉强度，不代表注意力或疲劳分数。
Pause 是独立开关，没有强度等级；开启时当前视频不再循环，播放结束后暂停。
达到所选时间也会停止本轮。暂停、缓冲及切换标签页时不消耗观看时间。
在自然停顿或主动休息后继续，会恢复画面并使用剩余时间；在时间到后继续，会明确增加一分钟。

## 再生观点

关注觉察、停顿、恢复和自主选择，而不仅是限制观看。
Bubble 用已用时间提醒用户；模式只改变画面大小、非必要信息和色彩，保持正常画质与速度。
点赞数和评论是虚构的界面样例；反思结果不保存或发送。
本原型没有验证 wellbeing 效果。是否有帮助、是否令人烦躁，需要真实用户测试。
独立学生原型，并非 TikTok 官方产品。源码由 AI 协助生成。

## 视频来源

样片来自 Mixkit，已核对为 Mixkit Stock Video Free License。每条视频底部有来源链接。

- https://mixkit.co/free-stock-video/turquoise-ocean-background-with-foaming-waves-2091/
- https://mixkit.co/free-stock-video/coffee-maker-making-coffee-3578/
- https://mixkit.co/free-stock-video/waves-of-the-sea-arriving-at-a-beach-44482/
- https://mixkit.co/free-stock-video/pedestrian-walk-in-tokyo-4231/
- https://mixkit.co/free-stock-video/walking-a-path-that-crosses-a-dense-forest-41574/
- https://mixkit.co/free-stock-video/defocused-view-of-the-sunset-reflection-in-the-sea-34363/
