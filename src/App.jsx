import { useState, useEffect, useRef, useCallback } from "react";

// ═══════════════════════════════════════════════════════════════
//  HELPERS
// ═══════════════════════════════════════════════════════════════
function rnd(a, b) { return Math.floor(Math.random() * (b - a + 1)) + a; }
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
let _uid = 0;
function uid(p = "id") { return `${p}_${Date.now()}_${++_uid}`; }

const NP = ["萌絵","千穗","小早川","桃香","明日香","美咲","结衣","诗织","奈奈","七海","柚子","桜子","日和","爱理","美月","真白","琴音","凛々子","妃奈","胡桃","一花","千夏","星奈","琉璃","早苗"];
const NS = ["酱","ちゃん","丸","味小饼","子","千代","奈","音","咲","绪","碳","paisen","学妹","前排","碳_","ovo"];
const NN = ["_","~","vv","xx","0w0","owo","hnn","mizuki","yuki","",""];
function randUser() { return pick(NP) + pick(NS) + pick(NN); }

// ═══════════════════════════════════════════════════════════════
//  YUYU PHOTO GALLERY（预设相册图片库）
// ═══════════════════════════════════════════════════════════════
const YUYU_GALLERY = [
  { id: "g1",  src: "https://s41.ax1x.com/2026/05/29/pmFMZZR.jpg",  label: "小悠①" },
  { id: "g2",  src: "https://s41.ax1x.com/2026/05/29/pmFMUFP.png",  label: "小悠②" },
  { id: "g3",  src: "https://s41.ax1x.com/2026/05/29/pmFMdW8.jpg",  label: "小悠③" },
  { id: "g4",  src: "https://s41.ax1x.com/2026/05/29/pmFMBQg.jpg",  label: "小悠④" },
  { id: "g5",  src: "https://s41.ax1x.com/2026/05/29/pmFMDyQ.png",  label: "小悠⑤" },
  { id: "g6",  src: "https://s41.ax1x.com/2026/05/29/pmFMyes.jpg",  label: "小悠⑥" },
  { id: "g7",  src: "https://s41.ax1x.com/2026/05/29/pmFM4lF.jpg",  label: "小悠⑦" },
  { id: "g8",  src: "https://s41.ax1x.com/2026/05/29/pmFMjSO.jpg",  label: "小悠⑧" },
  { id: "g9",  src: "https://s41.ax1x.com/2026/05/29/pmFQ8pT.jpg",  label: "小悠⑨" },
  { id: "g10", src: "https://s41.ax1x.com/2026/05/29/pmFQG1U.jpg",  label: "小悠⑩" },
  { id: "g11", src: "https://s41.ax1x.com/2026/05/29/pmFQYX4.jpg",  label: "小悠⑪" },
  { id: "g12", src: "https://s41.ax1x.com/2026/05/29/pmFQUB9.jpg",  label: "小悠⑫" },
  { id: "g13", src: "https://s41.ax1x.com/2026/05/29/pmFQa7R.jpg",  label: "小悠⑬" },
  { id: "g14", src: "https://s41.ax1x.com/2026/05/29/pmFQs1O.jpg",  label: "小悠⑭" },
  { id: "g15", src: "https://s41.ax1x.com/2026/05/29/pmFQRHA.jpg",  label: "小悠⑮" },
];

// ═══════════════════════════════════════════════════════════════
//  ACTIONS（主页各应用消耗的行动点、粉丝/偷懒值变化）
// ═══════════════════════════════════════════════════════════════
const ACTIONS = {
  post:      { cost: 1, fanMin: 1, fanMax: 5,  lazy: -1, screen: "post",      requiresPublish: true },
  twitter:   { cost: 1, fanMin: 1, fanMax: 4,  lazy: -1, screen: "twitter",   requiresPublish: true },
  instagram: { cost: 1, fanMin: 1, fanMax: 5,  lazy: -1, screen: "instagram", requiresPublish: true },
  live:      { cost: 1, fanMin: 3, fanMax: 9,  lazy: -1, screen: "live",      requiresPublish: true },
  music:     { cost: 1, fanMin: 1, fanMax: 5,  lazy: -1, screen: "music",     requiresPublish: true },
  game:      { cost: 1, fanMin: -4, fanMax: 1, lazy: 2,  screen: null,        requiresPublish: false },
  sleep:     { cost: 1, fanMin: -12, fanMax: -3, lazy: 3, screen: null,       requiresPublish: false },
  outside:   { cost: 1, fanMin: -2, fanMax: 3, lazy: 1,  screen: null,        requiresPublish: false },
  signing:   { cost: 3, fanMin: 0,  fanMax: 0, lazy: -2, screen: "signing",   requiresPublish: false },
};

// ═══════════════════════════════════════════════════════════════
//  THEME CONFIG
// ═══════════════════════════════════════════════════════════════
const THEMES = {
  purple: {
    bg: "#120818", bgGradient: "linear-gradient(180deg,#1e0a28 0%,#0d0520 100%)",
    bgCard: "rgba(255,210,235,0.06)", pink: "#ffb7d5", pinkDeep: "#e879a8",
    lav: "#d8b4fe", text: "#ffe4f0", muted: "rgba(255,220,240,0.45)",
    dim: "rgba(255,220,240,0.25)", border: "rgba(255,183,213,0.18)", borderB: "rgba(255,183,213,0.45)",
  },
  pink: {
    bg: "#fff0f5", bgGradient: "linear-gradient(180deg,#fff5f8 0%,#ffe4ec 100%)",
    bgCard: "rgba(255,255,255,0.85)", pink: "#ff85a2", pinkDeep: "#e05375",
    lav: "#ba7fff", text: "#4a2835", muted: "rgba(120,60,80,0.65)",
    dim: "rgba(120,60,80,0.4)", border: "rgba(255,133,162,0.25)", borderB: "rgba(255,133,162,0.5)",
  }
};

// ═══════════════════════════════════════════════════════════════
//  FAN TYPE & COMMENT DATA
// ═══════════════════════════════════════════════════════════════
const FT = {
  career: { label: "同好", color: "#60a5fa", e: "📊" },
  mama:   { label: "应援", color: "#f472b6", e: "🫶" },
  dream:  { label: "私藏", color: "#c084fc", e: "💭" },
  cp:     { label: "羁绊", color: "#fb923c", e: "💞" },
  new_fan:{ label: "初见", color: "#a3e635", e: "🌱" },
  senior: { label: "守护", color: "#fbbf24", e: "⭐" },
  hater:  { label: "路过", color: "#6b7280", e: "🖤" },
  fighter:{ label: "挚友", color: "#f87171", e: "⚔️" },
  casual: { label: "漫步", color: "#94a3b8", e: "👀" },
};

const CPOOL = {
  career: ["诶嘿嘿，今天的音源榜又上升了呢！大家超努力的说！✨","真的太好听啦QAQ！单曲循环根本停不下来呜呜呜…","超绝可爱的悠酱！今天的打歌舞台也是满分表现哦！🌸","已经把应援海报贴在房间最显眼的地方了，每天起床都能看到酱~","这次新单曲的限定盘大家都入手了吗？我已经预订了三张呢！(๑•̀ㅂ•́)و✧","为了给悠酱应援，今天也打起精神做数据了，冲鸭！","音源空降实时一位！悠酱值得！！","melon日榜又进前十了，开心到转圈圈～","打投组的姐妹们都辛苦了！小悠肯定会看到我们的努力！","今天也在SNS上带话题刷屏，悠酱的粉色海洋由我们守护💖","同好群今天差点服务器炸掉，都在讨论小悠的新造型！","限定特典已到货！拆包视频已录好，下周投稿！","数据组连夜肝了三个榜，悠酱下周必须进前五！","应援棒的新色号出来了！大家都订上了吗，速度！","实体专辑开封直播今晚九点，欢迎来一起开心！","新一期的杂志扫图已出，超清！壁纸已设好！","悠酱的舞台cut整理好了，分享给还没看的姐妹们～"],
  mama:   ["哇啊啊悠酱今天也太辛苦了吧，要好好吃饭哦，心疼死我了🥺","刚刚看直播觉得悠酱好像瘦了一点点，不可以节食哦，多吃点肉肉！","笨蛋宝贝快去睡觉啦！不可以熬夜到这么晚的，摸摸头~","今天的粉色双马尾造型完全击中了我的心，呜呜呜怎么这么乖呀","冷空气要来啦，小悠一定要穿得暖呼呼的才可以哦！","不管发生什么，我们都会一直一直陪在小悠边边的哟，安心啦~","宝贝今天笑了好多，我的心都化了🥹","新发色太适合你了！像樱花精灵一样～","直播里偷偷打哈欠，一定累了，早点下播休息吧！","手写信收到了哦，字迹好可爱，会珍藏一辈子的！","宝贝脸色有点苍白，喝热水！吃维生素！别逞强！","今天做了小悠喜欢吃的布丁，照片发过来看看嘛~","巡演那么累，下来了一定要好好休息，不许强撑！","看到你眼眶红了，是不是被感动哭了？我也哭了哦","今天表演完台步走得好稳，练习的努力都看到了！","每次看你上台都会替你紧张，加油宝！","生日会应援礼物已经寄出，记得收哦，里面有惊喜！"],
  dream:  ["昨晚梦到和悠酱一起去海边喝草莓圣代了，嘿嘿，简直不想醒过来嘛…","糟糕，被悠酱刚才那个wink正中红心了……（倒地不起","今天也是沉溺在悠酱美颜里的一天，呜呜，怎么会有这么完美的女孩子","偷偷换上了和悠酱同款的发卡，这样四舍五入就是情侣啦，不许反驳！www","啊啊啊啊啊想变成悠酱口袋里的小布丁，天天黏在一起！","救命，这个笑容太犯规了啦！心跳一瞬间漏了半拍……(*/ω＼*)","悠酱的每张自拍都是我手机壁纸，已经存了2000张了…","今天也在脑补和悠酱一起做便当的场景，甜度超标","如果有一天能在街上偶遇悠酱，我可能会直接晕倒","认真工作的悠酱也好迷人，眼神里的光芒让我移不开眼💫","悠酱侧脸刚才不小心看到了，发了整整五分钟的呆，不行了","如果可以的话，想把悠酱装进口袋里随身带着，可以吗","上班途中脑子里全是悠酱今天的新图，差点坐过站","拥有悠酱是人类史上最大的财富，这是我认真研究后的结论","悠酱的新香水同款我已经下单了，以后每天都能闻到一样的味道（满足","看到悠酱的眼睛就像在看银河，我决定永远不移开视线了","悠酱在台上发光的样子，是我撑过每一天的理由"],
  casual: ["路过打卡~这个女孩子的妆容好精致呀，像洋娃娃一样","算法居然把我带到这里来了，歌挺好听的，先关注一个啦","朋友一直在提这个名字，过来看一眼，确实很有灵气呢","感觉挺有特点的风格，期待之后的表现哟~","虽然不是粉丝，但这首新歌的旋律确实上脑","路人粉，觉得悠酱的笑容特别有感染力","看到热搜过来的，这种蕾系风格还蛮新鲜的","业务能力不错，关注看看～","朋友圈有人分享了这首歌，听了一遍之后停不下来了","不太了解偶像圈，但这个女孩子表演完了有种说不出的余韵","随手刷到的，停了三秒，然后停了三十分钟","不粉不黑，就是今天确实被圈到了，算了，关注吧"],
  new_fan: ["那个……请问这是什么宝藏美少女啊？刚被推流过来直接入坑了QAQ","初次见面！请问了解悠酱应该先看哪一个舞台呀？","被朋友安利过来的，粉色头发的悠酱完全就是从漫画里走出来的吧！","上周才听的小悠的歌，今天已经把所有物料都补完啦，好喜欢！","下周的见面会我也抽到票了！第一次见真人，现在手都在抖诶嘿嘿……","刚入坑三天，已经把专辑和周边都下好了，钱包君再见👋","悠酱的声音真的有魔力，一听就停不下来","前辈们好热情，谢谢带我了解更多小悠的闪光点！","今天刚学会打投，以后每天都会来签到的！","悠酱好，我是新来的小透明，请多多指教✨","老实说第一次看到悠酱的照片我以为是P图，真人比照片还好看啊","新粉不知道规矩，默默跟在大家后面学，感觉粉丝团好温暖","刚刷到的推，听了第一句就重复了三十遍，怎么可以这么好听","被拉进来的！据说这里的粉丝特别好，感觉是真的耶"],
  senior: ["不知不觉都陪小悠走过两个春秋了呢，看着你闪闪发光的样子真的太幸福了","初盘的CD还好好收在盒子里，小悠真的越来越厉害了呢，泪目…","无论过去多久，最初被小悠歌声感动的瞬间都记得一清二楚哦。加油！","从只有几十个粉丝到现在，小悠一直没变，还是那个最温柔的宝物。 ✨","还记得第一次在街边舞台看到你的样子，现在已经是巨蛋偶像了，好骄傲","饭龄三年，经历过低谷也见证过辉煌，今后也会一直在","小悠的成长就是我最棒的青春回忆","翻出初期的应援棒，上面的字迹都模糊了，但爱意永远清晰","第一次见面会排了五个小时的队，到现在还记得你对我说的那句谢谢","那年生日会小悠哭着说不会放弃，我也跟着哭了，那个画面永远忘不掉","老粉看着新人涌入，心里既开心又有点奇妙，但终归是好事","从那张手绘海报到现在的巨型应援墙，小悠真的走了好远的路","当年那个紧张到声音发抖的小悠，现在已经是台上最耀眼的那个了"],
  hater:  [
    "这种水平也敢叫偶像？真的笑死，普通练习生都比她强",
    "长得还行但唱跳都是弱智水平，粉丝眼睛瞎吗一直夸",
    "营业感超重，笑容全是假的，接了钱才出来的吧",
    "真不懂这种玩意儿为啥有粉丝，颜值也就这样，唱功一言难尽",
    "又在营业捞钱了？粉丝就是钱包，你们清醒一下好吗",
    "舞台事故那么多，公司是怎么敢让她出道的，太敷衍了",
    "这妆容好丑，衣品也是灾难，整个人审美就是土味网红",
    "粉丝集体脑残粉，被割韭菜了还一直鼓掌，可悲",
    "就凭这个想出圈？行业这么卷，她这点东西不够看的",
    "虚伪透了，台上笑嘻嘻台下不知道什么嘴脸，别被骗了",
    "唱歌跑调还敢卖专辑，粉丝的钱不是钱吗",
    "综艺感为零，全程尬笑，让人替她尴尬",
    "这种流量真的是买的吧，没有一点真实感",
  ],
  fighter:["@上面 不想看就滚，没人拦你，嘴这么臭是没人教过你说话吗","@上面 你一个路人在这里发这么多，谁给你的勇气？闲的","@上面 嫉妒就嫉妒，说得好像你能做得更好一样，可笑","@上面 发这种评论的时候不觉得自己很丢人吗，键盘侠","@上面 我们悠酱随便一个舞台都比你全部人生高光，别比了","@上面 没见识就少说话，这种热度你的本命做梦都达不到","@上面 喷完悠酱去照照镜子，你自己是什么水准心里没数吗","@上面 这么闲来喷偶像，你自己人生是有多空洞","@上面 有本事实名来说，躲在账号后面算什么东西","@上面 我们家粉丝就是多，爱看不看，反正数据不会说谎"],
  casual: ["路过打卡~这个女孩子的妆容好精致呀，像洋娃娃一样","算法居然把我带到这里来了，歌挺好听的，先关注一个啦","朋友一直在提这个名字，过来看一眼，确实很有灵气呢","感觉挺有特点的风格，期待之后的表现哟~","虽然不是粉丝，但这首新歌的旋律确实上脑","路人粉，觉得悠酱的笑容特别有感染力","看到热搜过来的，这种蕾系风格还蛮新鲜的","业务能力不错，关注看看～","朋友圈有人分享了这首歌，听了一遍之后停不下来了","不太了解偶像圈，但这个女孩子表演完了有种说不出的余韵","随手刷到的，停了三秒，然后停了三十分钟","不粉不黑，就是今天确实被圈到了，算了，关注吧"],
};

function genComments(n = 25) {
  const normalTypes = ["career","career","mama","mama","dream","dream","new_fan","senior","senior","casual","casual"];
  const out = [];
  let i = 0;
  while (out.length < n) {
    // 每隔约6条插入一组 hater+fighter 回复对
    if (i > 0 && i % 6 === 0 && out.length + 2 <= n) {
      const haterComment = { id: uid("c"), u: randUser(), t: pick(CPOOL.hater), type: "hater", likes: rnd(20, 300), time: "刚刚" };
      const fighterReply  = { id: uid("c"), u: randUser(), t: pick(CPOOL.fighter), type: "fighter", replyTo: haterComment.id, likes: rnd(800, 5000), time: "刚刚" };
      out.push(haterComment, fighterReply);
    } else {
      const type = pick(normalTypes);
      out.push({ id: uid("c"), u: randUser(), t: pick(CPOOL[type]), type, likes: rnd(100, 2200), time: "刚刚" });
    }
    i++;
  }
  return out;
}

const LIVE_CHAT = ["冲冲冲！！！！","小悠酱出来啦！","等好久了呜呜呜QAQ","今天终于开播了！万岁！","送花送花🌸","今天好好看啊救命(*/ω＼*)","我的心脏快受不了了","哇哇哇哇哇超绝可爱","妈妈来了！宝贝多休息！","打call打call！","❤️❤️❤️❤️","好可爱啊啊啊www","贴贴小悠酱！","梦女上线（偷笑）","来了来了！前排！","宝贝今天状态好好","已截图已存档！！","数据组在线！","好想去签售会啊","今天也在坑底（）","新粉第一次看好激动诶","从开播等到现在终于等到了","呜呜老粉泪目了","支持支持！","弹幕刷起来！！","本命直播不能错过！","宝贝今天声音好好听","这段跳得太好了吧","啊啊啊啊啊啊啊~~"];
const LIVE_GIFTS = ["送了天使翅膀🪽","送了星河礼物盒✨","送了粉色泡泡🫧","送了爱心气球🎈","送了玫瑰花束🌹","送了宇宙星星⭐","送了粉钻皇冠👑"];

const TW_POSTS_BASE = [
  { u: "队友_晴晴☁️", handle: "@rouqing_idol", t: "今天排练室空调坏了大家都在流汗😭但是某人（小悠）还在认真对镜子hhh 太拼了啦" },
  { u: "天使音乐事务所", handle: "@angel_music_jp", t: "📢官方通知：清寺小悠新单曲《✞天使降临✞》将于下周五正式发布！敬请期待💒" },
  { u: "队友_小鸢🌙", handle: "@minami_tsubame", t: "悠悠今天在公司食堂偷偷买了两份布丁结果被我发现了哈哈哈 她说「不许说出去」（已经说了哦www）" },
];

// ── 新闻池（每天随机抽1-2条加入新闻列表）──────────────────────
const NEWS_POOL = [
  // 正面/中性（11条）
  { src: "娱乐头条",  title: "清寺小悠新单曲预售成绩亮眼，首日突破12万张",           hot: true  },
  { src: "时尚速报",  title: "小悠最新杂志封面大片曝光，粉毛造型获赞无数",             hot: false },
  { src: "直播快讯",  title: "清寺小悠直播间人气爆棚，礼物榜持续第一",               hot: false },
  { src: "娱乐周刊",  title: "小悠与队友甜蜜互动，CP粉大呼磕到",                    hot: false },
  { src: "音乐情报站",title: "新生代蕾系偶像代表，小悠人气稳居前列",               hot: false },
  { src: "粉丝应援",  title: "小悠生日应援规模惊人，粉色海洋刷屏全网",               hot: true  },
  { src: "娱乐速递",  title: "清寺小悠手写信曝光，字迹可爱获粉丝狂赞",               hot: false },
  { src: "音乐周刊",  title: "小悠新歌练习室版流出，唱功进步明显",                   hot: false },
  { src: "综艺快报",  title: "小悠参加综艺表现亮眼，综艺感获好评",                   hot: false },
  { src: "娱乐快报",  title: "清寺小悠疑似在涩谷被粉丝偶遇，本人超有礼貌",           hot: false },
  { src: "数据分析",  title: "小悠数据组连夜打投，本月音源榜表现稳定",               hot: false },
  // 黑稿/负面（4条）
  { src: "八卦速报",  title: "清寺小悠疑似耍大牌，粉丝等候数小时却态度冷淡",         hot: true  },
  { src: "娱乐吐槽",  title: "小悠新造型被批土味，审美倒退遭部分网友群嘲",           hot: false },
  { src: "直播趣闻",  title: "行程过于密集？清寺小悠直播中多次走神",                 hot: false },
  { src: "娱乐速报",  title: "小悠掉粉严重，公司疑似资源倾斜新人",                   hot: true  },
  // 争议（5条）
  { src: "粉丝社区",  title: "小悠账号活跃度下降，粉丝呼吁多更新动态",               hot: false },
  { src: "娱乐头条",  title: "清寺小悠疑似谈恋爱？神秘男声流出引热议",               hot: true  },
  { src: "粉丝爆料",  title: "有粉丝爆料见面会小悠签名敷衍，字迹潦草",               hot: false },
  { src: "音乐批评",  title: "小悠新歌唱功遭质疑，直播翻车片段被截取传播",           hot: false },
  { src: "娱乐快讯",  title: "清寺小悠生病仍坚持工作，粉丝心疼却也担心",             hot: false },
];

// 初始3条新闻（开局可读）
const INITIAL_NEWS = [
  { src: "娱乐头条", title: "天使音乐新人清寺小悠获本月最受期待偶像提名", time: "1小时前", hot: true,  read: false, isInitial: true },
  { src: "音乐周刊", title: "新生代偶像崛起：蕾系风格席卷年轻市场",     time: "3小时前", hot: false, read: false, isInitial: true },
  { src: "娱乐速报", title: "偶像清寺小悠账号连续三个月低活跃度，掉粉超100万！", time: "5小时前", hot: true, read: false, isInitial: true },
];

const INITIAL_IG_GRID = [
  { id: uid("ig"), e: "🌸", bg: "linear-gradient(135deg,#ffd6e7,#ffb3c6)", likes: rnd(85000,150000) },
  { id: uid("ig"), e: "✞", bg: "linear-gradient(135deg,#2d1b33,#4a1942)", likes: rnd(62000,96000) },
  { id: uid("ig"), e: "🎀", bg: "linear-gradient(135deg,#ffe4f0,#ffc2d9)", likes: rnd(120000,240000) },
  { id: uid("ig"), e: "🌙", bg: "linear-gradient(135deg,#1a0a2e,#2d1b4e)", likes: rnd(58000,120000) },
  { id: uid("ig"), e: "💒", bg: "linear-gradient(135deg,#fff0f7,#ffd6f0)", likes: rnd(150000,280000) },
  { id: uid("ig"), e: "🦋", bg: "linear-gradient(135deg,#e8d5ff,#c9b3ff)", likes: rnd(81000,160000) },
];

function makeInitialPosts() {
  return [
    { id: uid("post"), content: "✞ 今天的排练结束啦～ 新舞蹈真的好难但是超级可爱！大家期待我的舞台吗？💒 #清寺小悠 #天使偶像", tag: "排练", image: null, time: "30分钟前", likes: 142150, shares: 15280, comments: genComments(62) },
    { id: uid("post"), content: "✞ 收到了粉丝们送的草莓大福！甜甜的超好吃，谢谢大家的爱～ 我会继续加油的！🍓💒 #日常 #感谢", tag: "美食", image: null, time: "2小时前", likes: 287230, shares: 28204, comments: genComments(95) },
    { id: uid("post"), content: "✞ 今晚直播穿的新衣服！像小恶魔一样的蕾系风格，大家喜欢吗？🎀 #直播 #蕾系", tag: "直播", image: null, time: "5小时前", likes: 324530, shares: 45310, comments: genComments(148) },
  ];
}

// 初始私信由 generateDailyDms(1) 在运行时生成，不再使用静态数组

const ROLE_META = {
  mama:      { label: "应援", color: "#f472b6", e: "🫶" },
  career:    { label: "同好", color: "#60a5fa", e: "📊" },
  dream:     { label: "私藏", color: "#c084fc", e: "💭" },
  colleague: { label: "队友", color: "#34d399", e: "🤝" },
  staff:     { label: "工作人员", color: "#38bdf8", e: "📋" },
  casual:    { label: "漫步", color: "#94a3b8", e: "👀" },
  manager:   { label: "经理", color: "#fbbf24", e: "💼" },
  heaven:    { label: "天堂人事", color: "#e879a8", e: "☁️" },
  hater:     { label: "陌生人", color: "#6b7280", e: "🖤" },
};

// ── 事件库（19条随机 + 1条固定Day10）─────────────────────────
// 每周目开始随机抽取9条分配给Day1-9，Day10固定
const EVENT_POOL = [
  { id: "e01", sender: "经理",    role: "manager", intro: "今天有小型粉丝见面会，你状态看起来不是特别好。", question: "你打算怎么回复经理？", options: [
    { text: "我会尽量打起精神，多和粉丝聊聊天",          lazyDelta: -1, fanDelta: rnd(8,12),  reply: "收到！我会好好表现的！",           replyB: "粉丝们今天很开心，签名合影排了很长队。" },
    { text: "就正常签名，不想说太多话",                    lazyDelta:  0, fanDelta: rnd(2,5),   reply: "好，我去就是了。",                 replyB: "见面会平稳结束，粉丝觉得有点平淡。" },
    { text: "今天真的很累，就快速签完吧",                  lazyDelta:  2, fanDelta: rnd(-9,-5), reply: "……好（心不在焉）",               replyB: "粉丝觉得你状态很差，有点失望地离开了。" },
  ]},
  { id: "e02", sender: "经理",    role: "manager", intro: "明天早上七点有个元气少女风格的饮料广告要拍。", question: "你怎么回复？", options: [
    { text: "好的，我晚上早点睡，准时过去",                lazyDelta: -1, fanDelta: rnd(9,13),  reply: "好的经理！我会早起的！",           replyB: "广告反响不错，经理满意。" },
    { text: "我会去的，但可能没什么精神",                  lazyDelta:  1, fanDelta: rnd(-2,4),  reply: "行吧……我试试。",               replyB: "广告效果差强人意，品牌方不太满意。" },
    { text: "太早了……我能不能不接",                       lazyDelta:  2, fanDelta: rnd(-12,-7),reply: "……太早了（没去）",               replyB: "广告被临时换人，经理很生气。" },
  ]},
  { id: "e03", sender: "经理",    role: "manager", intro: "你昨晚直播播着播着睡着了，现在粉丝都在传。", question: "你打算怎么处理？", options: [
    { text: "我发动态道歉，再补一场直播",                  lazyDelta: -1, fanDelta: rnd(6,10),  reply: "对不起，我重新开播道歉！",         replyB: "粉丝心疼，理解你，好感度上升。" },
    { text: "先不管它，就当没发生",                        lazyDelta:  1, fanDelta: rnd(-4,2),  reply: "（没有回应）",                   replyB: "舆论发酵了一天，经理警告了你。" },
    { text: "我真的太累了，直接说出来好了",                lazyDelta:  2, fanDelta: rnd(-14,-8),reply: "我真的很累，对不起大家。",         replyB: "部分粉丝理解，但黑粉趁机攻击，情况很乱。" },
  ]},
  { id: "e04", sender: "经理",    role: "manager", intro: "今天公司新人出道，热搜被她占了很多。", question: "你要怎么做？", options: [
    { text: "我发条动态祝贺她一下",                        lazyDelta: -1, fanDelta: rnd(8,12),  reply: "好～我马上发！欢迎新人！",         replyB: "粉丝称赞你前辈风范，联动涨粉一波。" },
    { text: "我就发自己的日常，不用管",                    lazyDelta:  0, fanDelta: rnd(-3,3),  reply: "（发了一条日常）",               replyB: "没什么特别反应，日子照过。" },
    { text: "我现在没心情管这些",                          lazyDelta:  1, fanDelta: rnd(-10,-6),reply: "（什么也没发）",                 replyB: "粉丝觉得你冷漠，失望地议论纷纷。" },
  ]},
  { id: "e05", sender: "经理",    role: "manager", intro: "有黑粉说你态度冷漠，评论区有点吵。", question: "你想怎么回应？", options: [
    { text: "我发长文解释一下",                            lazyDelta: -1, fanDelta: rnd(5,9),   reply: "我来写一条说明。",               replyB: "舆论慢慢平息，粉丝力挺你。" },
    { text: "让工作人员去处理就好",                        lazyDelta:  0, fanDelta: rnd(-2,4),  reply: "交给公关组处理吧。",             replyB: "处理还算妥当，影响不大。" },
    { text: "他们爱说就说吧，我不理",                      lazyDelta:  1, fanDelta: rnd(6,10),  reply: "随他们吧。",                     replyB: "黑粉继续闹，但死忠粉更加团结了。" },
  ]},
  { id: "e06", sender: "经理",    role: "manager", intro: "新曲录制一直不顺利，你今天一直唱不好。", question: "你现在怎么想？", options: [
    { text: "我再坚持录一会儿试试",                        lazyDelta: -1, fanDelta: rnd(6,10),  reply: "再来一次，我可以的！",           replyB: "最后录出了满意的版本，经理鼓励你。" },
    { text: "今天状态不好，先休息吧",                      lazyDelta:  1, fanDelta: rnd(-3,3),  reply: "我明天状态好了再录。",           replyB: "进度稍微落后，但经理表示理解。" },
    { text: "我不想录了，想换一首歌",                      lazyDelta:  2, fanDelta: rnd(-11,-6),reply: "我不想录这首了。",               replyB: "经理皱眉，制作进度被耽误了。" },
  ]},
  { id: "e07", sender: "粉丝（私信）", role: "mama", intro: "我们准备了很大的生日应援，你知道吗？", question: "你怎么回复？", options: [
    { text: "真的吗？我好感动，我录个视频谢谢你们",        lazyDelta: -1, fanDelta: rnd(10,15), reply: "哇！谢谢大家……我真的好感动！",   replyB: "应援视频传开了，粉丝纷纷表示被暖到。" },
    { text: "谢谢你们，我看到了",                          lazyDelta:  0, fanDelta: rnd(3,6),   reply: "谢谢～我看到了！",               replyB: "粉丝高兴，但觉得有点平淡。" },
    { text: "哦……谢谢",                                   lazyDelta:  1, fanDelta: rnd(-6,-2), reply: "哦，谢谢。",                     replyB: "粉丝有点失落，感觉你不太在意。" },
  ]},
  { id: "e08", sender: "队友",    role: "colleague", intro: "周末想约你一起去游乐园放松一下，你去吗？", question: "你怎么回复？", options: [
    { text: "好呀！我也想出去玩玩",                        lazyDelta: -1, fanDelta: rnd(4,8),   reply: "好！我期待！",                   replyB: "队友感情升温，下次排练状态都好了很多。" },
    { text: "我还是练舞吧，下次再说",                      lazyDelta:  0, fanDelta: rnd(-1,3),  reply: "这次算了，下次吧。",             replyB: "队友有点失望，但理解你。" },
    { text: "我想在家睡觉，不想出门",                      lazyDelta:  2, fanDelta: rnd(4,8),   reply: "不去了，累死了。",               replyB: "你睡了一整天，精神好了，但粉丝说你最近太懒。" },
  ]},
  { id: "e09", sender: "经理",    role: "manager", intro: "明天有重要杂志封面拍摄，要穿很复杂的衣服。", question: "你怎么回复？", options: [
    { text: "好的，我会提前准备造型",                      lazyDelta: -1, fanDelta: rnd(7,11),  reply: "好的，我提前做好准备！",         replyB: "封面效果很好，杂志方给了高度评价。" },
    { text: "我知道了，正常去拍就行",                      lazyDelta:  0, fanDelta: rnd(1,5),   reply: "知道了。",                       replyB: "拍摄顺利完成，成品还不错。" },
    { text: "今天有点不想拍，能不能早点结束",              lazyDelta:  2, fanDelta: rnd(-10,-5),reply: "能快点结束吗……",               replyB: "摄影师不满，成片质量差了一些。" },
  ]},
  { id: "e10", sender: "粉丝（私信）", role: "mama", intro: "我今天在见面会上送了你一个手工礼物，你看到了吗？", question: "你打算怎么回复？", options: [
    { text: "看到了！好可爱，我很喜欢",                    lazyDelta: -1, fanDelta: rnd(9,13),  reply: "看到啦！真的好可爱，谢谢你！",   replyB: "粉丝开心极了，把你的回复截图到处发。" },
    { text: "嗯嗯，谢谢你",                                lazyDelta:  0, fanDelta: rnd(2,5),   reply: "谢谢～",                         replyB: "粉丝高兴，觉得还好。" },
    { text: "哦……我没太注意",                             lazyDelta:  1, fanDelta: rnd(-7,-3), reply: "……我忘了（没收到礼物）",         replyB: "粉丝很难过，在帖子里说小悠不在意她们。" },
  ]},
  { id: "e11", sender: "粉丝（私信）", role: "dream", intro: "前辈……我最近过得不太好，鼓起勇气给你发这条消息……（后面是一大段真诚的倾诉）", question: "你打算怎么回复？", options: [
    { text: "我认真看完，给她回了一条很长的消息",          lazyDelta: -1, fanDelta: rnd(8,12),  reply: "我看到你了。你不是一个人在撑。", replyB: "粉丝哭了，说你是她最重要的支柱。" },
    { text: "简单回复了谢谢，加油哦",                      lazyDelta:  0, fanDelta: rnd(3,6),   reply: "加油哦！你可以的！",             replyB: "粉丝表示谢谢，觉得你还是很温柔的。" },
    { text: "太晚了，我没回就睡了",                        lazyDelta:  1, fanDelta: rnd(-7,-3), reply: "（没有回应）",                   replyB: "粉丝第二天鼓起勇气发来消息：没关系。你心里有点不是滋味。" },
  ]},
  { id: "e12", sender: "经理",    role: "manager", intro: "今晚要加班录新曲的副歌，你能来吗？", question: "你怎么回复？", options: [
    { text: "好的，我现在就过去",                          lazyDelta: -1, fanDelta: rnd(6,10),  reply: "好，马上去！",                   replyB: "录音顺利完成，经理很满意。" },
    { text: "我今天有点累，能不能明天再录",                lazyDelta:  1, fanDelta: rnd(-4,2),  reply: "明天可以吗……",                 replyB: "经理同意了，但进度稍落后。" },
    { text: "今天真的不想去了",                            lazyDelta:  2, fanDelta: rnd(-12,-7),reply: "今天不行了，太累了。",           replyB: "经理失望，录音又推迟了。" },
  ]},
  { id: "e13", sender: "经理",    role: "manager", intro: "这个月数据不太理想，掉粉有点多。", question: "你现在怎么想？", options: [
    { text: "我会更努力一点的",                            lazyDelta: -1, fanDelta: rnd(5,9),   reply: "我明白，会加油的！",             replyB: "经理点点头，说期待你的表现。" },
    { text: "还好吧……我先看看再说",                       lazyDelta:  0, fanDelta: rnd(-2,4),  reply: "我先看看情况吧。",               replyB: "经理表示担忧，但没多说什么。" },
    { text: "我已经很累了，不想管这些",                    lazyDelta:  2, fanDelta: rnd(5,9),   reply: "随便吧，我也很累了。",           replyB: "经理叹气。但奇怪的是，「累了摆烂」的帖子传开了，反而涨了粉。" },
  ]},
  { id: "e14", sender: "粉丝（私信）", role: "career", intro: "你最近新发的那张自拍，好多人说妆容太浓了。", question: "你打算怎么回复？", options: [
    { text: "我觉得这个妆挺好看的呀",                      lazyDelta: -1, fanDelta: rnd(6,10),  reply: "我觉得这个妆很好看！蕾系嘛～", replyB: "支持者大声叫好，路人也觉得你有个性。" },
    { text: "随便他们说吧",                                lazyDelta:  0, fanDelta: rnd(4,7),   reply: "随他们吧，哈哈。",               replyB: "粉丝觉得你很洒脱，好感度小涨。" },
    { text: "我也有点后悔画这么浓",                        lazyDelta:  1, fanDelta: rnd(5,8),   reply: "下次换个淡妆试试吧……",         replyB: "粉丝觉得你很诚实可爱，理解你。" },
  ]},
  { id: "e15", sender: "经理",    role: "manager", intro: "突然要你明天参加一个大型直播活动。", question: "你怎么回复？", options: [
    { text: "好的，我会准备的",                            lazyDelta: -1, fanDelta: rnd(7,11),  reply: "没问题，我来！",                 replyB: "直播效果很好，涨了不少粉。" },
    { text: "可以，但我需要时间准备",                      lazyDelta:  0, fanDelta: rnd(2,5),   reply: "好，给我点时间。",               replyB: "稍微推迟了，但最终表现还不错。" },
    { text: "太突然了……我不想去",                         lazyDelta:  2, fanDelta: rnd(-10,-5),reply: "太突然了，能不去吗……",         replyB: "经理不高兴，最终换人出场了。" },
  ]},
  { id: "e16", sender: "经理",    role: "manager", intro: "你今天看起来有点没精神，是不是想家了？", question: "你怎么回复？", options: [
    { text: "嗯……是有点想家",                             lazyDelta: -1, fanDelta: rnd(5,8),   reply: "嗯……是有点想家。",             replyB: "经理温和地拍了拍你肩膀。粉丝看到花絮截图，都说被戳中了。" },
    { text: "还好，就是有点累",                            lazyDelta:  0, fanDelta: rnd(-1,3),  reply: "还好，只是有点累。",             replyB: "经理说好好休息。" },
    { text: "我不想说这些",                                lazyDelta:  1, fanDelta: rnd(3,7),   reply: "不想说。（沉默）",               replyB: "经理没再追问。粉丝说「神秘感」让你更有魅力了。" },
  ]},
  { id: "e17", sender: "新人练习生（私信）", role: "colleague", intro: "前辈，能不能抽空指导我一下跳舞？", question: "你怎么回复？", options: [
    { text: "好的，我教你",                                lazyDelta: -1, fanDelta: rnd(6,10),  reply: "好呀，我们约个时间吧！",         replyB: "练习生很感激，粉丝圈也盛传你的前辈风范。" },
    { text: "我现在有点忙，下次吧",                        lazyDelta:  0, fanDelta: rnd(1,4),   reply: "下次吧，最近比较忙。",           replyB: "练习生说好，继续自己练习去了。" },
    { text: "我不太想教别人",                              lazyDelta:  1, fanDelta: rnd(-6,-2), reply: "抱歉，我不太适合教人。",         replyB: "练习生有点失落，在日记里写了「好难过」。" },
  ]},
  { id: "e18", sender: "经理",    role: "manager", intro: "新一批限量周边要签名，你要签吗？", question: "你怎么回复？", options: [
    { text: "我会认真签完",                                lazyDelta: -1, fanDelta: rnd(5,9),   reply: "好，我来！",                     replyB: "签名周边很快被抢光，粉丝晒图满满。" },
    { text: "随便签几个吧",                                lazyDelta:  0, fanDelta: rnd(0,3),   reply: "行，签几个就是了。",             replyB: "周边卖完了，但签名质量参差不齐。" },
    { text: "今天不想签",                                  lazyDelta:  1, fanDelta: rnd(-5,-1), reply: "今天不想签了。",                 replyB: "周边延迟发货，粉丝等了很久。" },
  ]},
  { id: "e19", sender: "经理",    role: "manager", intro: "你最近创作一直没什么灵感，是不是太累了？", question: "你怎么回复？", options: [
    { text: "我想出去走走散散心",                          lazyDelta: -1, fanDelta: rnd(4,8),   reply: "我想出去逛逛找找灵感。",         replyB: "你拍了很多外景照，被粉丝当作生活日记晒出来，反响很好。" },
    { text: "我继续坐在练习室里熬",                        lazyDelta:  1, fanDelta: rnd(-3,3),  reply: "我再坚持一下。",                 replyB: "熬了很久还是没灵感，但你写出了一句歌词，经理说「就这个！」" },
    { text: "今天不想练了",                                lazyDelta:  2, fanDelta: rnd(5,9),   reply: "今天放弃了。",                   replyB: "你直接回家睡觉，睡前刷到自己旧视频，突然有灵感了。粉丝说你「躺平天才」。" },
  ]},
];

// Day10固定事件
const DAY10_EVENT = { id: "e20", sender: "经理", role: "manager", intro: "今天是第十天了，结果马上就要出来了。", question: "你今天打算怎么度过最后一天？", options: [
  { text: "我会认真对待最后一天",                          lazyDelta: -1, fanDelta: rnd(6,10),  reply: "嗯，最后一天，我要拼！",         replyB: "督查员留言：「已记录：最终日表现良好。」" },
  { text: "就和平常一样过吧",                              lazyDelta:  0, fanDelta: rnd(-2,4),  reply: "平常心对待吧。",                 replyB: "督查员：「淡定从容？或许是另一种成熟。」" },
  { text: "我已经无所谓了，随便怎样",                      lazyDelta:  2, fanDelta: rnd(-12,-7),reply: "……随便吧。（扣手机）",           replyB: "经理失望。粉丝担忧。督查员：「已记录。」" },
]};

// 生成随机事件顺序（抽取19条中的9条分配给Day1-9）
function generateEventOrder() {
  const pool = [...EVENT_POOL];
  // Fisher-Yates shuffle
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  // 取前9条，Day10固定
  const order = {};
  for (let d = 1; d <= 9; d++) order[d] = pool[d-1];
  order[10] = DAY10_EVENT;
  return order;
}

const ENDING_IMGS = {
  hidden: "data:image/jpeg;base64,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",
  good:   "data:image/jpeg;base64,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uuoy8R1VGWb+48APYd9rhg4aeXAtBCnURMulLOz+6xDNNr/VDX/33o0rT5GJeHaI1ZIcO2iXBrc/q7bStPx3SruindOr+aUn8hdSHIO0O9bvdSUm98ejXo7NpqjjW611dUZ5tZWMgb8I2NV0RN06lMGyewvx6TV6gq8f215qj+Dwtmh2V6Kt8wmj05Qyyjk+qaahw8DIXK1Im09V+WOClgpYxFTwxwxjk2NoaB5BZMeKIoVMJgdiIgYREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREH//2Q==",
  lazy:   "data:image/jpeg;base64,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1y1BRddTUQ0kRmqZo4IhzfK8MaPaeCqNZtb0nDUOpKCumvdY07vo1np31b8+bBuj2lGExt8LkoCo41Nru9j+4+jYbTE4nFRfqsNcB17GLLveQo+8rVV5AOodd1sbD86lscDaOPy7Q7zz7wpW6fzVsu17tdhp/SLtcaO3w/XqZmxj4niqsdrFlrnGLTtDeNSyjh/c2jcYs+Mr91g95Xstmy/R9qn9JjsdPVVXP0muc6qlz13pC74K0hoa0MaA1o5NHAD2Ij6YpZrdo95H7VtNj05Efp187qycfmR4YD5uKn9jurufHUur79dWn51NTyChpz4bsWHEebldMIoOu+mDseidNabcX2ix0FJKTkzNiBlPm92XH3rOEk8yT5omERbb5QinCYRCEU4RBClCncghERAREQEREBERAREQEUZ6KQM80E56JgoFKCMYUoiAFKhEEplQiCcqMoiBlERAREwgImEwgImEwg7UREBERAREQEREBERAREQay2owfImrtKaqaSInTOs1We7s5uMZPk8fFZ1enaZp46o0LeLbGP2w6nM1OQMls0frsI8ctA9qr+kr4zUumbbd2cDVQNe8fVfjDh/KBUV6/wADk3jcfwydScU8h/JKwazVYcUsvksKqvSxePZ04fsuakAz/gmkz/LK24tR7MAJ9qer5gD+BoqKHPnvErbiu+f+Z/jZCxmo9R2zSlonu12qWwU0I583Pd3MaO9x7gsk9241zsE4BOAMkr571btEsVRdY7pcqiW61zDu0VshYSKXP5J4b57yePQKuWWvW2XHx9demsguO0a7M1FquJ1HaqUl9vtEhw2Nv8LN3Fx6fZz8kmqL3rW4vsWz+l9IezAnukgxBTjwJGPI+4HmvZadm+sdpskdXqyR+n7DvB7bbFwnmH5WeXfxdx6NW6rBp21aXtsdts9FFR0sfEMjHM95cebj4lZzj6r1cn+jfPkxw7RU9neyO1aGcbjUSOut9mBM1wnGS0nmIwfmjx5n4K+oi2cuWVyu61rt3uBj01brQxzt66XCONzR9KNmXuHwatRU1vrILhHXXA09NGyQyvkdMPW4EBvhjK2htrsV6u9Zbq6iIpaC00NXVz1r2h7WOw3DA3PznAc+QGVrKksYqZG1VfPLcpg3LTOBuR5+qwcArzwv2mMWGORksbZI3texwyHNOQfauSwHoNbSPey2VEdL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3ZRmNwJ7w73KzLhPBFVQvgniZNDIC18cjQ5rge4g8CEOqXzFS0yxmptT3XVMpEsFLI+12vvayNhxNI3uy+QFufqxhXBdNFRUtupYqSip4aamhbuRwwsDWMHQAcAu5EW7EREQIiICIiAiIgIi4GUA4xlBxREQEREBQpRBHcilEBEwpQRhSpwiBhERARFKBhSoymUEooyiCUREBERAREQEAU4RAREQEREBERAREQEUEgcyut031Qg7Tw5rrdKBy4riGvfxPxXNsTR4lBw9eTyXJsQHPiuxRyQEREBERAUYUogjCYUoghQpUoOKlSiCMJhSiCOKKUQEREBERAREwgIFKICYREEbregUdm36oXJEHDsm9E7FviuaIOvsR1Kjsfyl2og6exd1CdnIOR+K7kQdOJR1TelHcfcu5EHT2jxzHwTtndAu5EHV2/5KkTDoVz3Qe4KNxv1Qgjtm+Kdq3qp7JvRR2TfFBPaN6qd9v1guHYjqVwEe8eB4dUHYXb53WnA7yuQAaMBdfYnqFHZO8EEoiICImEBEwpQRhThMKUEYUoiAiIgIiICIiAiIgKVClAUoiAiKcIIwpREBERAREQEREBFxdI1vMrrMjncGj3IO1zg3mV1ulJ4NCNiJ4uK7GtDeQQdQjc7i44XY1jW8guSICIiAiIghMqUQQilRzQEREBERAREQEREBERAREQETClBCYUogIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICITjiV18ZT0b+lAyZDgcG/pXYAAMBAMcAiAiIg691TgIiAVCIgnCYREBERAREQEREBERAREQEREE4UoiAmERBKIiAiIgIiICIiDi9+4OS6jI53gERBzbEOZK5gADAGERBKIiAiIgIiICIiAiIgIiICIiAo70RBOFBREBSiIGFAREEoiICIiAiIgIiII71KIgIiICIiAiIgIiICIiAiIgIiICIiDr/Gu6NHcuzkiICIiAiIg/9k=",
  effort: "data:image/jpeg;base64,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1y1BRddTUQ0kRmqZo4IhzfK8MaPaeCqNZtb0nDUOpKCumvdY07vo1np31b8+bBuj2lGExt8LkoCo41Nru9j+4+jYbTE4nFRfqsNcB17GLLveQo+8rVV5AOodd1sbD86lscDaOPy7Q7zz7wpW6fzVsu17tdhp/SLtcaO3w/XqZmxj4niqsdrFlrnGLTtDeNSyjh/c2jcYs+Mr91g95Xstmy/R9qn9JjsdPVVXP0muc6qlz13pC74K0hoa0MaA1o5NHAD2Ij6YpZrdo95H7VtNj05Efp187qycfmR4YD5uKn9jurufHUur79dWn51NTyChpz4bsWHEebldMIoOu+mDseidNabcX2ix0FJKTkzNiBlPm92XH3rOEk8yT5omERbb5QinCYRCEU4RBClCncghERAREQEREBERAREQEUZ6KQM80E56JgoFKCMYUoiAFKhEEplQiCcqMoiBlERAREwgImEwgImEwg7UREBERAREQEREBERAREQay2owfImrtKaqaSInTOs1We7s5uMZPk8fFZ1enaZp46o0LeLbGP2w6nM1OQMls0frsI8ctA9qr+kr4zUumbbd2cDVQNe8fVfjDh/KBUV6/wADk3jcfwydScU8h/JKwazVYcUsvksKqvSxePZ04fsuakAz/gmkz/LK24tR7MAJ9qer5gD+BoqKHPnvErbiu+f+Z/jZCxmo9R2zSlonu12qWwU0I583Pd3MaO9x7gsk9241zsE4BOAMkr571btEsVRdY7pcqiW61zDu0VshYSKXP5J4b57yePQKuWWvW2XHx9demsguO0a7M1FquJ1HaqUl9vtEhw2Nv8LN3Fx6fZz8kmqL3rW4vsWz+l9IezAnukgxBTjwJGPI+4HmvZadm+sdpskdXqyR+n7DvB7bbFwnmH5WeXfxdx6NW6rBp21aXtsdts9FFR0sfEMjHM95cebj4lZzj6r1cn+jfPkxw7RU9neyO1aGcbjUSOut9mBM1wnGS0nmIwfmjx5n4K+oi2cuWVyu61rt3uBj01brQxzt66XCONzR9KNmXuHwatRU1vrILhHXXA09NGyQyvkdMPW4EBvhjK2htrsV6u9Zbq6iIpaC00NXVz1r2h7WOw3DA3PznAc+QGVrKksYqZG1VfPLcpg3LTOBuR5+qwcArzwv2mMWGORksbZI3texwyHNOQfauSwHoNbSPey2VEdL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3ZRmNwJ7w73KzLhPBFVQvgniZNDIC18cjQ5rge4g8CEOqXzFS0yxmptT3XVMpEsFLI+12vvayNhxNI3uy+QFufqxhXBdNFRUtupYqSip4aamhbuRwwsDWMHQAcAu5EW7EREQIiICIiAiIgIi4GUA4xlBxREQEREBQpRBHcilEBEwpQRhSpwiBhERARFKBhSoymUEooyiCUREBERAREQEAU4RAREQEREBERAREQEUEgcyut031Qg7Tw5rrdKBy4riGvfxPxXNsTR4lBw9eTyXJsQHPiuxRyQEREBERAUYUogjCYUoghQpUoOKlSiCMJhSiCOKKUQEREBERAREwgIFKICYREEbregUdm36oXJEHDsm9E7FviuaIOvsR1Kjsfyl2og6exd1CdnIOR+K7kQdOJR1TelHcfcu5EHT2jxzHwTtndAu5EHV2/5KkTDoVz3Qe4KNxv1Qgjtm+Kdq3qp7JvRR2TfFBPaN6qd9v1guHYjqVwEe8eB4dUHYXb53WnA7yuQAaMBdfYnqFHZO8EEoiICImEBEwpQRhThMKUEYUoiAiIgIiICIiAiIgKVClAUoiAiKcIIwpREBERAREQEREBFxdI1vMrrMjncGj3IO1zg3mV1ulJ4NCNiJ4uK7GtDeQQdQjc7i44XY1jW8guSICIiAiIghMqUQQilRzQEREBERAREQEREBERAREQETClBCYUogIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICITjiV18ZT0b+lAyZDgcG/pXYAAMBAMcAiAiIg691TgIiAVCIgnCYREBERAREQEREBERAREQEREE4UoiAmERBKIiAiIgIiICIiDi9+4OS6jI53gERBzbEOZK5gADAGERBKIiAiIgIiICIiAiIgIiICIiAo70RBOFBREBSiIGFAREEoiICIiAiIgIiII71KIgIiICIiAiIgIiICIiAiIgIiICIiDr/Gu6NHcuzkiICIiAiIg/9k=",
  fired:  "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBAUEBAYFBQUGBgYHCQ4JCQgICRINDQoOFRIWFhUSFBQXGiEcFxgfGRQUHScdHyIjJSUlFhwpLCgkKyEkJST/2wBDAQYGBgkICREJCREkGBQYJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCT/wAARCAHmArwDASIAAhEBAxEB/8QAHAABAAICAwEAAAAAAAAAAAAAAAEGBQcCAwQI/8QAYRAAAQMDAQUEBQUJCggKCQUAAQACAwQFEQYHEiExURNBYXEUIoGRoRUyQlLBCBYjM2KCsdHSFyQ0Q1NykqKjsiU1VmNkhLPhGCY2REZlc5OUwidFVFV0haTw8Td1g5Xi/8QAGgEBAAMBAQEAAAAAAAAAAAAAAAECAwQFBv/EADERAQEAAgEEAQMDAQcFAQAAAAABAhEDEiExQQQiMlETYfAFFCMzQoGR8UNxobHRUv/aAAwDAQACEQMRAD8A+pEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAHMeYVP2SH/iDQD6s1W33VMoVwHMeYVN2SHGio485MdfXs91VKi0+2rkiIioiIgIiICIiAiIgIiICIiAiIgIiICIiCi7Xv8AElqP/WsP9yQLUml3F1BUg91dUj+1K21tg4WC2Hpdaf8AQ8LUelT+860YPC4VI/rq0Xv2swiIkZ0QohUiEREKIiICIiAiIg+gERFRIiIgIiICIiAiIgIiICIiAihzg0FziAAMknkFSdQbZNHWCpNELi66XAcBRWyM1EpPT1fVB8yiZjb4XdMrWJ1ttK1Dw0/oSK1QnIFTfancd4Hsm8f0rortObRZ2Ol1BtPt9kgJzuUFIyMNHg+Qgqtyxntf9K+62r7Ci0gLDYp6lsM23e6y1HAFrLtC3JzngAcexZWDTGt7dSfKujNo79RxMzikue5PFPu82CVp4H3d3FOvFN4v3baRVvZ9rGPXWl6a8CnNLMXPhqKcnPZTMOHtz3jPLwKsiszs1dURERAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiIA5jzVL2SEDS9UwEfg7vcW8/9Kk/WroOY81SNkp/wHdmAYDL7cmjPP8AhDj9qlafbV3REUKiIiAiIgIiICIiAiIgIiICIiAiIgIiIKJth/5O289LrTfpctRaV/EXIHuuVR/eC2/tgbnTFIeHq3OlPl65WoNMcBdm8OFzn5fmq0X/AMjMopKhGYhRFIhERCiIiAiIgIiIPoBERUSIiICIiAiIgIiICIqjq7aNQ6crI7NQUs971DOMw2ujwXgfWkdyjZ4n3ImS3tFqqKmCkgfUVM0cEMY3nySODWtHUk8Atd1u1qpvlRJQbPrDNqKZh3XXCQmGgiPfmQ438dB71XtS0VHTxxXnbDf4p9479JpyhLvR2nuG4PWmd4n1VkaSXaDrenZTWS3w6B08AGxzTRA1r2fkRDDY+Hl5qu7ftbTjk714tQ6eibTis2ua/HYuG8LTRSmlpufLdb68nuXZp/UkgpxS7LdmxipTwFyr4xR07h9bJ/CP96tWnNj+l7BVm4z08t6urjvPr7o/t5S7vIB4N9gV3AAwOnJOnfnuXkniNdDQmuNQAu1Nrqahifzo9PwiBoHQyuy8r20GxfQ9JIJqizC61HMz3SZ9U8nr65I+CvCpmrdqVo03VC1UUU99v0nCO128dpJnq8jIjHnx8FaTXhSZZ5dozFXb9L6ZttRXT0Fot1FTsL5ZfR42MY0dcD4d61Ppi/UujLdqvXsVt+TLTeJ447HaWsLHVcjQQ2QR9xkJzw7gfDPbqYvD6W97Up21U7n71q0fbcyNfJ9HfA/Gu6k+qPHkrTpHRV1vN7i1nrdsYr424ttoYcw2th7+jpccz3e7Fb9Xb00kmM3WW2U6XqtJ6KpKO4cLjUPkrawZyGzSu3iPZwHmCreiKzC3d3RERECIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgDmFSNlQLaLUbO5morgAcYz+EB+1XdUnZhwGrGZ+bqSt+O4ftRafbV2RERUREQEREBERAREQEREBERAREQEREBERBR9sP/JSA9LlR/7ULUGmie0vLfq3Ob4hpW39sZxo5rj3XGi/2zVqDTvCrvo4f4zk4fmMVo0/yMyVCkqEZCIikQiIhRERAREQEREH0AiIqJEREBERAREQERYbWd9dpjSd3vTGb76GkknY3q4N4fHCJk32VjWesLtcLz95eiyw3hzQ6uuD270VriPeesh+i1VS2uNjrarSOzOmbc7+5wN51HXHfZA88y93HffzwwcB4nKsmjtMV9n2XVDrdKJdSXejkrpax5w6arlYXNJJ6ZAHTCw2h9d6c2f6YorHVad1La6yJo9KY+1SyOmn+m/faCH5PI55YCpLMq6JNTWPdbNI7LLRpurdd66Wa+X+XjNc6/135/zYPBg6AcfFXRa+O1qeuGLFoXVtyceTpKQUsZ/OkP2KHVW1W/ndgo9P6VgJ4unkdXVAHUNbhnvKtcpPNZ3DK3eS/wAsscEbpZXsjjaMue8gNA8SVRrtti0/T1brbYIqzVF0HD0W0R9q1p/Kl+Y0e0qqajseiLPIJ9o+uK3UNUHZFFUVGI97o2mh/QV77bqXUl3pI6HZzoeGy2wjDbhdohTQgcsshb6zvMqOrfiLTjk712XCj1rqOilr9ZagpdFWFoJko7fMO3LeklQ7g3h3NWN05W9rSvtOx/T0VNRvdio1JcI3CJx7y3e9eZ3nw8FZbfsip6ythumtbxWaqr4yHsjqcMo4XfkQD1ffnyV/iijgjbHExkcbButa0ABo6ADknTv7i8knaKjo3ZrbdLVT7vVVE951BOP3xdaw70hzzDByjb4Du4ZVvc4NaXOIDQMknkFSdTbRpKa5y2DS9vF5vMWBUOc/cpaHP8tIPpfkN4+Src2i6vUbxPrO+Vd5d/7FC409EzwEbTl3m4nKsvx/G5OXvV0uO07RVpmMNZqqzxSjgWektcW+e7nCzVpvdsv1KKu03Ckr6cnHa00rZG56ZHIqm0FhtNqgEFBa6GliH0IoGtH6FgNQ2d2lXyav0vTtpbjRtMtVTQDdiuMA4vje0cC7GS12MghNx0Z/0+zHcvdt5F5bVcqa82ykuVG/fpquFk8TurXAEfAr1I80REQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREA8iqPsyw2s1qwfR1JUnHTMcZ+1Xg8iqNs2y29a6jwRjUD3cfGCIqV8fFXlERQoIiICIiAiIgIiICIiAiIgIiICIiAiIgpG2P8A5DynpW0Z/t2LT2n/APGOoR0uJ/2bVuLbH/yBqznGKqkP/wBRGtO2D/G2oh/p4P8AZtVo0n2X+fhmioXJQUZIREUgVClQUBERAREQEREH0AiIqJEREBERAREQF5rlb6W7W+pt9bE2alqonQyxu5OY4YIXpRBrCh07tH0HTNt1gqrTqazw+rTQXJ7oKqBncztBlrgOQyvSdU7UyAxuzmha7gC83pm558s4WxkVbhje9jT9S+41r2m2O7EsFNpKxRnPrvkkqpG+Q5Ep+5Tf74D99u0C810T+LqS3NbRwnw9XJIWykUzGTxD9S+lX01sy0jpIiS1WOlZUZyamVvazE9d9+T7sK0IilS23vRY7UVPc6uyVlPZqmKkuEse5DPIMiIk4LvMDJHjhZFERFCtWzGrsdujpLdqSWn3TvFvoUT2PcfnOdn13OJ4lxdkryV9bdtKPb98sNO+gc4MF2ow4RMJOAJmHJiyfpZLepC2Quuop4auCSnqImSwytLJI3jLXtIwQR3ghHVx/L5Mbu3apg5GQumsdGykndNjshG8vzy3d05+Cwem2yWK7XXSE8j5G2tzJaGR5y59HJkxgnvLCHMz0aF5dodZUT2+m0xbXH5U1DL6DDujJjiP42U+DWZ96jXd7E5ZcOv0s+xcSDZbpvtA4H0TLQ7nu7zt3+rhXVYOtudi2fabgNdVxUNtoYWU8W+eJDWgNa0c3OOOQVUl1rq3UkfaaftdLZqJ34uquzXOmkHUQtxug/lFS8PHiy5cr0xsdeK5Xu12dm/crlR0TcE5qJmx92e8rWlRpjUV4P8AhrXd7lYQQ6GgDKOM+HqjPxXXSbLNIUzxLJaGV0/MzV0jp3k+JcSm46sf6fnfurP123PZ9RSGMagjqng4xSQyTfFowsfJ90JpFnzaPUMree822vA+JCylLbaKhYGUlHTU7RyEUTWge4L05PU+9RuNp/T8fdYaH7oTQT3hlRXV1EeWamhkYB8CrZZtdaX1AxrrXf7bVbxwGsqGh2f5pwfgsRPTQVLd2eCKZvSRgcPiqvetlmkL4S+ezQQTYwJqX8C4f0eHvCncRl/T5/lrbnJFo+LQ+sNLkP0hritbGwcKK5/hoj4Z44HsWQp9r2r9NOEes9GSy07cB1fZz2jfMsPL3hHJyfD5Mf3bgRVLSu1bR+sS2K13mEVJOPRqj8FLnoGu5+zKtqOayztRERECIiAiIgIiICIiAiIgIiICIiAiIgHkVRtnxDdU6+jDQMXpjsjvzTRK8nkqNoQFmt9oEfD/ABnTvwPGlZ+pF8fFXlERFBERAREQEREBERAREQEREBERAREQEREFK2ycNntwPSelP/1Ea05ZD/hzUbelZGffE39S3LthGdnd08H05/t41puzjGotSD/SYj/ZBWnhpPsv8/DNKFKIycUUlQkBERSIRThQgIiICIiD6AREVEiIiAiIgIiICIiAiIgIiICIvPcLjR2qkkrK+qhpaaMbz5ZnhrWjzKD0J3Z6LVNw20VOoZ32/Z3Z33aVpw+5VYMVJD48cFx8OHtWNboO86iIn1vqq4XNxO96FRyGnpWeGG4Lvgjq4viZ59/DcbaunfIY21ELnjm0SAkezK7eXNaqptm2kKRoENgo2kfTO8Xf0icr3VFiqmRx/JF/vFqlh/FFk5miaOjopMhw+PQhNxtl/T8p4rG7S7pHpvaPY7jDS1NdU1trqaQ0lGwyTTFsjHRgNHLiXDePAcei6LdXTaPrXXK8UIuuvrvEfRrVTPyKClz6rHP5Rszxe/6RzjOF6tJx6krdWT6i1fT0bKq20brdb/RRhlSHvLnzEbxLeDWjd8SvXp7TrrVPXXOvqRXXi5SdrV1e7uggfNjYDndjaOAHtKWxpx8HJljOPLtI8dv0lU111ZqHVlaLveG8YYw3FLQ/kwsPePrniVZ0RVt29DDCYzWIiIoXEREBERATkiIK1qDZzpfU2X19qhE55VEH4KQHrlvP25WEp7ZtC2eky6bvJ1HbGD/FlzcTIGjujf18iPIrYCK0tZZ8OGc1Y8mh9r9j1fOLZUtks18ad19trPVeT+QTje8uB8Fe1q3V+hbRrKmDa2IxVcfGGth9WaIjlg948D8FjNLbSbtoO4w6Y2hTdrTSHdob7x3JB9WU9eXHmO/I4qfLy/kfDuHfHw3Kihrg9oc0ggjIIOQQpRwiIiAiIgIiICIiAiIgIiICIiAqPow42h7QGcf4XRO5cONMP1K8Kj6Sw3abrxgPP5OkI84CPsUrY+L/AD2vCIihUREQEREBERAREQEREBERAREQEREBERBTNsX/AOm95PRsJ/to1py1kffPqNg5iWA/2a3JtiGdmt88ImH3SsWm7aT99moh3E0x/sypnhpPsv8APwzKKSFClmKFKgohCIikEKIghERAREQfQCIiokREQEREBERAREQEREBEWptqGubhdrmdAaPka641DS241rT6tBEeYyOT8c+mcDieBfDC53pj0ax2uVbrtLpjQlvbeLwwYnqiQaajPL1jyJHnjPDieCrtLsuqr9Wtumvr1Pf6wcRTBxbTReAAxn2ABWvSmlbbo+0x222xbrBgySH58z+9zj9ncswouX4ezw/Fxwnfy6qWkp6GnZTUsEUEEYwyOJoa1o8AF2oiq6hEREiIiAiIgIiICIiAiIgIiICIsnR2OWpi7SR/Yg/NBGSfFSz5OTHjm8qxi8F8sdv1HbZbbc6dtRTSji08CD3Oae4jqsnUQOpp3wvwXMOMjvXWi8sym1B0rqu57JbxT6Z1RVPq9M1J7O3XR4/gvHhHIen6OY4Zxu1rmvaHNIc0jIIOQQqBfrFQ6ktU9ruMPa007cEd7T3Oae4jqsBsv1PW6PvI2d6mn3+BdZq1x4VEWT+CJ+sO7yI6ZtO7yfl/G6frxbfRER54iIgIiICIiAiIgIiICIiAqPpcY2qa5HWnth/s3hXhUXT+G7XtXDdwXW23Oz1/GhSvj4q9IiKFBERAREQEREBERAREQEREBERAREQEREFP2ujOzbUHhS59zmrTFtP/ABuv4xzZTO5/kuW6Nrgzs01H4UTj8QtLW4/8b70OtPSu+DlM8NJ9t/n4ZxQVKFGaERFKHFFJUICIikCoUoUEIiIPoBERUSIiICIiAiIgIiICIsZqTUNBpWx1l5uUhZS0ke+/HFzu4NA7yTgDzQk2qe1faFNpOjprRZWNqdR3Y9lRQ8+zBODI7pjPDPf4ArE6F0ZT6NtRi3zU3CpPa1lW/i6aQ8Tx57oOce096wmzy01t+uVZtA1BEBcrof3pERwpqbk0NHdkY9nmVsBRb6e38XgnHju+RERVdgiIgIiICIiAiIgxP312QX86fNxibcwAfR3ZBORkAEjBOOOAc4WWXzztVLv3QboQ5zHMFO5jmkhzSImkOB7iD3ra2zPWn33WQsq3t+VKLEdS0cN8fRlA6OHuIKtce22WPJu6q4IiKrURSAXEAAknkAvdT2WrnwXNETer+fuUqZ8mOE3ldPAu2npZqp+7DGXnvPcPMrO09gpouMrnTHoeA9yyLI2RNDWNa1o7gMBNOHl/qGM7YTbHUFkjpyJJyJJBxA+i39a91VUx0kRkldgDu7yegXkrb1T0uWMIllH0WngPMrAVVXNWSb8rsnuA5DyU+GPHwcnPl18nhxqJjUTvlcMF5zjoutEVXrSSTUFXNc6Qh1fZ+wbIaevp3dtRVTeDoZRxBz0OAD7+5WNFJZLNV1bLNczawsssF0jFPfbXJ6LcIOR3wPxgHR3H2grO6l1bZtI0Taq71jYBIdyKJrS+Wd/1Y2D1nHyC1TrMVuh9Q0+urJ2MXagUV17VhfH2TiAyZzQQTuHHIjkPFbK0xoW32mrN7q6mS93udvr3SqwXbp+jE0erEzo1vtJV3hfI4Zx59/DCMrNpGrvwtvpaHSFuccskuEfpNc9vUxAhkfkSSudRpnaXbWGpt2uKK7St9b0S5WxkUcngHxnLfitgom2PX+IpGlNosd3uTtPX6gksOpI25dQTu3mzgfTgk5SN8uIVyWA11oeh1vahTzOfS19M7tqGvh4S0kw5PaemQMjv88FY7Zvq2sv9FWWq+MZBqKyy+i3CJvJ5x6kzfyXjj558ELJZuLgiIoUEREBERAREQFRLO7G2TUjN0jes9A7IHA4fLzPtV7VEoRuba7vz9fT9I73TyBSvj4q9oiKFBERAREQEREBERAREQEREBERAREQEREFT2rt3tm2pBjP7wlPwWk7d/wAr7v40dKf7y3htRbvbOdSj/q6c+5uVo+iP/HK4jHO30xz+c5TGmP23+fhnCilQUZoKKVBQFBUopQ4oiICFEUiEUqMIl9AIiKgIiICIiAuE88VNC+aeVkUTBvOe9wa1o6kngFzWs9cRt19r616EcTJaaKL5VvMbeAkGcQwuPQniR0wi2OO6y9Zto2eUMvZTattpd/mnOkHvaCFkLRtK0bfsC3antM73cmekNY8/muwVk6HR+nLZEIqKxWunYBjEdKxv2LxXXZvo69/4w0xaJzy3jSsDveACp7J+j92ciljmjEkT2SMIyHMcHAjzC0vr2ok2l7Q2aRZIfkGw7tRcg0/j5z82PxABx7XdAsprrZ7onZ7piu1La4a6x1dFHvQSW+tkY58pOGM3SS0guxkEHhlebZbp+eyaYZU17nSXO6PNdVvf84vfxAPs+JKeO7s+HwzLLq9Rb2MbGxrGNDWtGA0DAA6BSuuWdkIBecZ5Lmx4e0OacgrN7CVR5tqFHBr8aWkpw2DeFO6sL+VQRkMx04gZ6lXd8jYmOkeQGMBc4nuA4lfKNZVvu1XV3Auc2SsqJKkOHNpc8uafMcPcr4zbLkzuOtPq9FhNF306l0tbbq/HazwjtQO6Rvqv/rArNqrSXc2IiKEiIiAiLthppqg4hie/yHD3oi2Sbr522ss3NoNx5etDTu/s8fYsRpTUsukb/TXdm86Jn4OpjB/GQn5w8xwcPEKybbKGah2gytmaGmShp3jBzwy8fYqL8VtPDj6t3cfW9HRz17GyU7C+N4DmycmkHkcrK0+nRwNRLn8ln61r/wC591s27aZfp+unHpdmAbGXu4yUx+YeP1eLD5N6rZNRfaWHIYXTO/J5e9Z6058+fnzyuOEeunoqelGIYmt8e8+1cp6mGmbvSyNYPE81X6m+1U2RHiFv5PE+9Y9znPcXOcXOPeTkpsw+Dnld8lZ2o1DE3IgjdIeruA/WsZVXSqq8h8m6w/RZwC8iKNu3j+Nx4eI8zn9nL4ZXpXjq+EgPULvp378Q6jgodLtRERAiIg8t1ttPebbVW6rYHwVUToZB4EYXHYvqk3jTLrJWv/wtYH/J9U0ni4MyGSeTmj3tK9i1pUU9z0ttMumoLFDJU1DKeKsqKBnD02mdlkrG/ltc1r2+OR3q2Lj+Zw9ePby2xtHu9y09p0Xu3FxbbqmGorI2t3jJSh2JgBjuYS781WOkq4K6lhq6aVs0EzGyRyNOQ9pGQR4EFeCyXu1awsUVxt80dZQVcZ5jmDwc1wPIjiCCtN6Qver7Fqe/7PtJzWOupbVO40bLpNI19PA7B3Wlo9drC7BB4jyPCzyJjua9xuHTOoW6hpqt/YdhNRVk9FNHvbwD43YyD3gjdd7VSdpULtF6ltW0WkY4U8Rbb701g+fSPcA2Qjqx2OPQq2aG0vPpWzPgra30+41dRJW1tSG7rZJ5Dlxa3uaMAAdAsvdLZS3m21NuroWzUtVE6GWN3JzXDBCIlky7eHNj2yMa9jg5rgCHA8CDyK5LX2yi51dAy5aGvEzpLjp2QRRSv51NG7jDJ44HqnyC2CoVymroRERAiZUIJRRlMoJVFgaWbbaw73CTTkJ3fKpcPtV5yqOTjbcAXfO0zy8qr/ei2PteMplERVKjkmUQSihMoJRQpygIiICIiAiIgIiICIiAiIgrO03js71N/wDtlR/cK0ZROzrKr4/OtdMf6zlvbaQM7PdSj/qyp/2ZWiKNuNZPJGN6zwO8/WUxpj9t/n4Z9FJUIzQikhQiEIpUKRGEUog4opIUICIikb/REVEiIiAiIg8V6u9JYLRWXWvf2dLRwunld+S0Z4ePcqbsgtdRFZrhrK9tENz1HMa+bf4dhTgfgo8nkAzj7V4tozn621dZdntNITS5F0vWOQpmOG5Gf57u7yWZ2s18lLpWKw0BEVXfqmK0QBnDdbIcSEeAjD1LWTtJ+Vxoa2C5UUFbSv7SnqI2yxvwRvNIyDg9Qu9ddPBHS08cELQyKJoYxo7gBgD3LFUmrLXXWOrvkUzvk6lM4fO5uGuERIe5vVuWnB78KGevw1htRqhrnaNZtExvcbfa8XK58PVJ4bjD7D/X8FtSSw0r6cCAlr8Za/OQf9y1Dsopqi4Ut11fXx7tXqGrfUgEcWQgkMb5c/cFsugvDrcCJSXQDiR3t8v1Jb6er+hyY8cvHe8/8sBdWyRVj4pW7hj4YP6fJd1pqI6u2wVERJjlbvtJGMgngV3bTo4rhZqOChlxX3eojt9NIz6r8l7j4NjD3Z7sL0ttE9tp4qf0ctjiYGN3BloAGAq6dPD8nHkxkvaq3tBuJtWib3VA4c2kexv8543B8XL5sYwRsawcmgD3Lem26qMGihTg4NVWwREdQCXn+6tGrTDwjlv1Ny7Cbh21huVucSTSVm+0HubI0O/vBy2YtKbCqlzNTXSkGcT0TJMDvLJMfoet6RW6rn+ZTvx1IwPiqZTuvhnJj9VeZFlYdPTvwZZWRjoPWK98FipIuLw6U/lHh7lGmWfzeLH3tXooZJ3bsUbnn8kZWRgsFTJgyubEOnMrPhscLMANYwdOAC8c96o4MgSdoejBn48lOnLfmcvJ24sXGnslJBguaZXdX8vcvd6kbfotaPYAsFPqGZ+RDG2MdXcSsdPVTVJzNK5/gTw9ybJ8Tm5LvkrTH3RXYv17RTQu3+0tjQ5wORlsr/1rWC2jt5pN2ssVaB85k9OT/RePtWrlpPDeYdH0/hkdN6gm0tfaS8whzhA7E0bf42E/Pb7uI8QF9N01TDWU0VTTyCSGZjZI3jk5pGQfcV8prd+xO9mv0vJa5HF0trmMTcnJ7J3rM9g9ZvsVc424stXTYSIizdAiIg8tcODD5hcaJ/rub1GV2V34kHo5eSmfuzsPjhSn0yaIihAiIgLA1bOw1xaqho4zUVTA4+DXMcPtWeVS1jdfkTUWl6uQj0aWqkpJcj5vaNAa7Pg7A9qmK5+HnvYu2g9RUN20i2Ei+Vwpq631MhbTTTOadyQY/FvcWlu8OBJGQvT+5bf6ewtv1PNSw66huNRdmyRPJikMh9amceGWFgDcnvC9ev7ZPddI3GKkyKynYKumI5tmiIkbjxy3HtWwNOXmLUVgt14gx2ddTR1AAOcbzQSPYchWleX8ydGUuPtjtC69t+tqGQxMko7nSHs663TjdmpZO9pB5jPJ3Irz6a19Hc9T3jSt1jiobzQzuMMIfkVVKcGOVhPM7p9YdxHRdWrdmVq1RcYrzDVV1mvcI3W3K2ydnK5v1X9zx5qvnYdT1b6q4XTU94uF+cIvQ7u/dZNRGMktLA3APEnOeY4KezjnQyG0+jm07X27aJb2PfLZ8w3GJnOooHn1/MsPrjyKvcE8dTBHPBI2SKVoex7TkOaRkEeYWvTrTUGnaWW2a+01VV9JuOjfd7TB29PPGRgmSIevGSM5GCOi79jN0pqvS9RbqGs9PoLRWSUdHWAOxNT8Hx8SBxa1+4ehYiMsb0/9l+4omUUMxERAREQFR5yG7bKPnl+nJh7qlp+1XhUWu9XbXaDw9bT9WPdPGi+HtekREUEREBERAREQMoiIGVKhEEooypQEREBERAREQYHX7O00JqNnW2VP+yctBUDt7VVOfrWKnP8AWX0DrYb2jL+0d9tqR/ZOXz3bTnUtvcBwdYIcn84KY0x+2rKoUojNxQoiCEKIiEIiIlCYUopQ4opUIlv9ERVBERAXmudxprRbqm41sgipqWJ00rz9FrRkr0rW+2GolvZsegqSQtl1FVhtUWn1o6OP15D4ZwB7wi2M3dO7Y1bamtobjre5x7lw1LOalrXDjDSjhCweG7x9oXPUTjdNtGlbe7Jittvq7mW44b7sRNPsy5X+lpoaKmipoGCOGFgjYwcmtAwB7lojafq+82fazDcdKMgq5YKKKzVck8ZNPBNNIXMY5/Jrslh9mDzUxphvLK6X3aFqirrK6DQmmZyL7cmZqKiPj8m0vDfmd0cQcNHPJB6KsbbKyl0xoW07P7E4RT3N0NDFCHAubTtIBJ7+JwM9+Ss1Q01l2I6UrL5qCvNfea53aVlW7jLXTniI2fkju6DJOFp+l9O1TtG0per2JXV92kfcXMOezgp2E9jEwdwG6XHrvDqjbg4+rKa8Ru63UENrt9NQU7QyGmibEwDuDRhcblJuwhn1ivWsXc3704b3NaqPbxivsu00e0GzQtPaw22jqK0xOPAPkIiafA7u/wC8ra8F+pJQO0Loj+UMj3haZsZ9L1tqOpIyKdtLRNPk0vcPe4LYanbn5fi8fL3vlQ/ul66Ka26dghkY8Pq5ZDun6sWB/eWiltvb1GTT2KTuE07fexv6lqRaY+GGPHOP6YvWw6u9B2n2wFwa2qgqKYk/zN8fFi+pJLjSQ/PqI/IHJ+C+NNK1foGrLHVE4EdfECfBx3D8HL6exjh0Vclf7Ljy5dVqwy6hpmfi2SSHywF4ptQVL+EbGRDrzKxaKm2+Hw+LH1t2TVE1Qcyyvf5ngutEUOmSTtBEREqBttt/pWjBWBuXUFVFPno0ksd/eC0avqa7WynvVsqrbVt3qeqidFIO/BGMjxHP2L5z1Foq96Wc91XTuqaJhIbXQDeYW9xeObD58PFaYX05+XG72wq2FsOrBBqq4UhP8KoQ8ecbx9jyteNcHAFpBB5ELY2wu3SVOorldAB2FLTCm3usj3BxA8g34hWy8M8PujdiIixdgiIg89d/Bz5hY4OwQenFZC4HFP8AnBYzKLYs4DkZ6ouEJ3oWHq0LmioiIgKqbULU246LucrGB1VRwGqp3d7XsIfkf0Va10V9K2toaild82aJ8Z8i0j7VMVym5pwtdcy52yjrxgsqYI5uHLDmg/aujYvUOgsFz0/I4F9julRRtb0iLu0j+D8exYTZTUOqNntlDzl0MLqc/mPc37FkdASCj2l6xoc4FTT0Ve1vjuujcf6oVp7cXzZ1cUybKyiIjxxcY42RN3Y2NY3JOGgAcefJckQEREBFBRBKhMoUDKo93wzbHpxxLvXs1e0AeEkR4q7qjX8Fu17SLu51tuLf9kVMXw8r1lMqEUKJypXFEE5UqMplBKKMplBKIiAiIgKVCIJRQpQEREBERBidWtL9K3lowC6gqAM/9m5fOlpfvX6znh61gZxx+U1fR+pRnTl1HWjn/wBm5fNtkObxYHH6VgA9xYpjTD7atihSmFDNxKhclBCkQoUphBChSiCETCICIilDfqIiqkREQFrjSzPvm2w6mvknrwWKCKzUuRwDz68xHjnA9q2OtX2/Te0PStXfLfp6PT8tHdbhPXxXOrleJKcyYyHRAeuRjhxwpXw9rFrzXMtmkh0/p+Jlfqm4tIpKbm2BvfPL9WNvPxIwF00my+2M0FLpSrqJ5nVR9Iqq9pxNLVFweZ8nPrbwBHgAF7tFaFpNIRVFQ+oluN4rndpXXOo4y1D/APysHc0cArMhctdsWhdp+z2htsFrpKy63S/X++1zKNtZcZN809OPWlMbBhrPVAGcZ4lcHta/bXZ6eNu7FRWiQsaOTAd4DHswrXreM3LanamudmK0WqSo3c8pJpNxv9VjlVLYe125VJ/krOBz6kfrTb1vi439OZX3WzVhat2/UyH8rCzSwWd6XPV32rN6GKraHd29RqOqzntrzM0HqGNa0foWxlrbZsd7T882QTNcquQkd/4Uj7FsnmFNUniNe7bbbLV6Sjrombwt9S2aThxEbgWOPsyCfALSHMZHEFfWD2NkY5j2tc1wILXDII6EKjVexbSFVUOmZT1lIHHeMVNUuZH7G8cDwCtjlpjycdt3GmtNWOv1HfKWht0TnyMljllkx6kDA4Heee7lwHMlfT5OST1Kxti07atM0fodpooqWLOXbvFzz1c48XHzWSUZXa/Hh0iIiq0EREBERBwmf2cT3dAVhufDrwWSuL92nx9Y4WGq6ptHST1LzhsMbpCegAJ+xStFWtWyXT+qY31wiqqaSWpncYqSXs45GNeQG7uCBy5txzXbpBg0Dq6p0m8BlruhdWWx57n8nwk95AAxnjw8Vf8AZhROp9PUDng7wpmuOee8/wBY/pXj2r6Hk1FZH1Vt/B3KjeKqle3gWTN4jj0PI+wrOcn1arzv1pOTTKIq/ofVcWsLBDXhvZVTCYaqE8DFM35wx07x5qwK7ul3NwRERLy3H+DfnBYvKydzP73H84LEybxY7cID8HdJ5A9ylbHwzdGc0sfku5VbR9yrnXG62euqPSXUYhmjlLQDuyNJLTjhwcDjwVpRTexERQkXGQlrHEcwCVyRBRtjz8aWqqb/ANmudVH7N/P2rMWEej7apMZ/fWnsnzZUD9axOzFjYJNU07W7rYr5UAAcgDgrJ043NtNkeN717LWNPThIw/ar+3H8if3NbTRER4goyhUIJQooQEREBERAVI1Nlu1XRLg4jeprkwjqOzjP2fBXdUjVmRtN0G7jx+UW5z/mB+pIth5/3/8AS7oiIqIiICIiAiIgnKZUIg5IoygKCUREBMoiCQihTlAREQeC/N7Sx3Fn1qWUf1Cvmexn/Cumjw9axke7cX05dwTaq0DmaeTv/IK+YbE7/COlDx9ayyD+4pjXDxf56XIqFKFQyQVClQUEYULkoKkQoUoghEKIIwilRhBv1ERQCIiAiIgIic+CDVNRN6ZrrVFVnIhlpqFp8I4Q4j+lKVW7AC7bTdCc4baIwMD8pvNZjT8oqn3qtH/OrxWyDyEpYPgxYmx7zNs9xHIPs0Z88Pant9Dx49PFhGxz80+SwLPnt8ws8fmnyWBZ85vmFR0Yqpsz/wCSbP8A4yq/2zlslhyxp6gLW2zgBliq4eAMNzrGEDu/Ck/atjwHMEZ/JH6FN8qz7Y5oiKARFiNR6rtGlaZs90qxG6ThDAwb8s5+qxg4uPwUot15ZdFQRfdoOpQTZ7DR2Cjf8ypuzy6bHURN5e1ZGyaJuVPWw3K+asu90q43BzYo5OwpgenZt+cPNTpWZ78RbURFVcREQY66Py9jOgyqlrSR0lnbbYs9vdJ46JgHPDnesfY0OVlrX9pUvPcDgexYG1U33x7TqOjGTT2WldVS9O1k9Vo/o596W67o5cpjhbVzv1hv8mlIm6WuZt10p3CeFrmgxzgDAifkciMe3Cq+ntvdrbK6063o59O3iE7kwkicYXHqOZbnxyPErbHJYm/6TsWqYRDe7TSV7W/NM0eXN8nDiPYVzTKeMo8O5y3eTSeoNR6e0drD76tM3uguFourgy6UFPODJE/umazn5+0d62fQ11LcqaOqoqiKogkAc2SN28CDxWMrPuftntW4ubZ5qYk5/AVUjR5YJPBa61Ns1qNkuoabUFtmu1TpUStfVx0sxEtPg8O0A+ezPHPsOOa6Mc8b2dnB8mT6a2+i8tqutDe6GKvt1VHVU0oy2SM5B8PA+B4hevCl6G3hup/BMH5X2LGLI3Xj2Y8yseW4ReeGJ0ie011qd4xiOGji9u64/arqqLs3Jqbvq+t5tkuYhafCOMD7VelNZ4iIihYQ8kRBTtn8e5ctXnre5f7jT9q9oz+7HpnBx/guvz48WLq0M1pqNTyN+ne5/g1gXojZvbYNPO+raa4/1ox9qv7cnP8A4NbQUZTKhHhiw2oNZ6d0q6Jl7vNFQPmyY2TSYc4dcDjjxWZJwCcE47hzK+TbdG3aDqO+X+/g1ErpzEyB5IETeO6O7GAMAeamRfDGWW3xH1RbLvb71TCqttdTVsB5SU8ge3y4cj4L1L5bt837l2r7VfLU+SC21U7aWvpw4ljmOIzw+I6EeK2Pqv7oi3WK71lBa7HVXmGgduVNXHKGRtdnBDeBzx4Z4AlNLfp298e7bqLx2a6019tNHdKQk09ZCyePPPDhnB8e5ezKhkIoRBKo+snbu0TZ+ckA1Vc3n1piruqNroY1xs+fk5FyqW4A60zv1KYvh5/3XpFA5IoUTlMqEQSihTlARMogIiICIiCcqVxUhBKIiAiIgBSoypQee4DeoKkdYnj+qV8u2I/vvR7snjaZm+4MX1LVN3qaZvWNw+BXyzZP4To05/8AV9Q33NapjXDxf56q6qFyXFQyQikqEEIpUKRGFC5KEEKMKUQQinChBvxERQCIiAiIgKHODGl7jgN4n2KV4L/OaWxXGoBA7Klmfk92GEoRqTQpLtJ2+Ygh1QJKg57+0kc/7V4rcBFtnJ/lrJw9kgWV0nB6NpWyw4A3aGDl4xg/avBPCafalp6swN2ooqulJPUAPHtxlR7fS5TWE/0bBWAeN1zh0JWfWEq27lTIPysqrTFUNGfva8aroOA7K6du0D6ssYd9hWw6J29Sx+Awte0Y9B2kXGInDblbYaho6uicWO+BCvtsfmnLfquU1WeHsREUDhN2hif2JYJd07hf83exwz4ZWAsGi6O01brrWyuul7l4y3CoA3h+TG3lGwdwHvViRTtFkoiIoSIiIC4PmY1shDmkxjLgDxHDvXIuDQXOIDRxJPcFqDZ1daiv1De657n9leBJVMaXZG6yYsb8AQp0rctWRfp5mQRSTzODWRtL3k9wAyV6didslOn6vU1W0tqtQVLqsA82QD1Ym+4Z9oVQ166avoaLTdG7FXfqplC05+bGTmR3kG/pW7qKkit9HBRwN3YaeNsUY6NaAB8AsuW6mnH8/k8YR3IiLneaLi9jZGOY9rXMcC1zXDIIPMELkiDVN/2ZXTStfUag2eyMjEh7SqsMvCnqOvZfUd4e49y9WlNbW/VAkptyWgutPwqbdVDcmhI58DzHiPgtmKq6y2dWfWXZ1UvaUF2g409zpDuzxEcuP0m/kn4LbHl9ZOnh+Tlh2vhjLm78O1vRq8m8GjePJvE+xYCqu160nXst2tmx7spDKa8wMxTVHQPH8W/wPBevVFb8n6YutZzEVJK4YPP1SBx9q2j1sOTHLHqjybGmmTSMtcQM11fU1GQeeX4H6Fe1WdmVF8n6AsdOWlrvRmyOz1cS77VZlN8ow8QREULOisrqW3xtlrKmGnjc9sYdK8NBc44Aye8ld45geK1Vt/ufodossDXAOdXCfHfiMZz73LaHpDTTekA+qWdpnwxlTpSZbtiubPHCaz1tUP8AnNzrJc4xn8KR9i91BGJNrVrJH4uyVbvLM0QXh2YtI0Na5DzmbJMfHfkc77VlrIwv2ol5HCKxOGcci6pH7PwVvbm+T/g1f0REeIL5r1dbTorbBXwO9ShvzfSoeGGh7jxHmHBw/OC+lFUdpOzq37RLM2kqJDS1lOTJSVbRkxPxyPVp4ZHgMKZV8MpO18VpTWVsku2naqCFhfM3EsbRzJac492VVGUE9Fo+lsUNO75WvM4DYHcHY3uZzyAAHPqV69Sam1Fo24S6brY6KoudG8RvqY3GRsgIBbwH0iDxzx8F0aX01dNpFzq7jXV/okEJbTzdm0hxaRxY0ch456qcspjN10cfHlJq+PLbUm2Ow6Dstu0np+GfU9zoadlMRS/id5o4+uAd7jn5oPmvXova1qe6autth1LpyktrbmyV8Do5Hb7NxufWaSeeD48QsNE3SWzqibGZaO3ZbgueczS+f0j+heHTN2ZrLa3piqt1FX+hUEVRK6eemdGxw3SN5pI5ZwO7isMOW55dp2TePHVun0CijKZWrjSqNtBGNU6Ak6Xp7c+dNIrwqTtFGL1oSQEgt1AxvDxglCmL4eV2HIKVxHIKVCiSihEEooypQEREEooTKCUREBSoRBOVK4qQglERAUqEQQ8AscDxBBHwXytZvx2jT3ejVTfgvqrHAr5Ws5Ido3PLcq2/A/qUxrh4v89VdVBUlFDJxQhThQghFJUIIRThQpEKFyUIIREQb7REUAiIgIiICxupojPpy6xNGS+jnaB5xuWSXGWJs0T4nfNe0tPtGEI1Lp1wk0zZZByfbqZ39k1LpTsfWWitJLX0dfG5p8H5jcPc/wCC6dHZOi7IDzhpzTu843Fn/lXLUr3RWOqnZnegDZh+Y9rvsUe30874LgsXdI92cP7nD9CygcHjeach3EeS81wh7WnJHNnrBVJWvtWEW7UembzvFrG1L7fMe7cmbwz+c0K7WyTcmdGfpD4hVjWtqfedL3ClhH74bH20BHMSsO+34jHtXtsF7ju1nobxE5oZPC2Ykng049YHyII9in0n3YtyLrgnjqYWTROa+N7Q5rmnIIPiuxQgREQERO4nuHNARVy6bRNK2asjo6y90oqJHhnZxkyFpJwN7dzu8+9dWuNcQ6TgipqenfX3msyyjoYhlz3fWcBx3Qff8ROqr1Rj9qGop6W3xabtDi+93o+jwsZxMUZ4PkPQYyM+Z7lh9P2uKy6xmtFKAYLXZqan3gPnPc9zifMnJVl2b7N7hFWTam1PKai9Vo/CPPKBn8mzp0J5cMDxp90v0Wn7/tAu3zpIKuGhpmjiXyNjw1o8cnPsUTKW6jnx5ZlyLPoGhGqNp1xvT/Wo9Ow+g0/Q1LxmRw8m8PatwKpbLdKyaR0XQ0NUS6vmzVVjjzM0nrOz5cB7FbVz8mW8nm82fXnclW1jtM0zoSaCnvlbLDPUMMkcccD5CWg4zwGBx6qvM+6H2fOcAblWN8XUUmP0Lzbatk0et6Zt6oKiKmu9HFuATvDYqiMZO64ng0jJweXHj1HytLG6GR8bwA5ji0gEHiPEcCtePjwyi3Hx45R9gUu3PZ5V4A1HDET3TwyR/pbhZyi2haQuIHoup7NIT3elsB9xIXxDlQQDzAPmFe/Hx/K/6E/L76gqoKob1PPFMOsbw79C7TkeHmvgSCeWldvU8skLusTiw/BWbTmptfz1IpdP3fUVRMBnsaaaSUgZ5lvEYzjmqX4/7q3g/d9m11DSXSjlo66niqaaZu7JFK0Oa8dCCvnnalY7hpC2V9ho3udZbhPDT0TJZd+SJzn5Mbe/cwOR5Lbmyuk1dSaWadZ1slRcZZDI2OUNL4I8ABrnN4E8CfDOFTdqLmX3ahpGwMAc2ne64VA54DB6ufcfeq8XbLS3x9zK4xcLfSNt9BTUbBhsETYh+aAPsXoU+JULZ6wixunb5DqK1R3KBhZFI+RrQTnIa8tz7cZWQkeyJjpJHBrGguc4nAAHMob9tM7W6d2qNass7N5zLbZ6ireBxAeWOcPI8GfBbBp7wJtmrLsXc7R2xPLj2P61U9l8DtVXnVWrJwdy4SOoqYkcREB3ezcHsXTQXBzNglTGSTLDDLb8d+92u4B7iFf9mMvm/lfdC0xpNG2OEjBbQw5HiWg/asrpmESa5us/MxWyli8t6WZ32BLfT+i0NNTDh2UTI/c0D7F0aPMrdoOpWvLdx1BQuYAeOMyjj045VYx+Z24dL2i89wuNFaaSSsuFXBSU0Yy+ad4YxvtK1Xf9uYujn2zZ9bZrxWn1DXSxllLT5+lx4ux44HnyU/u8fHC5eGw9UawsejaA1t7uMNJHj1WuOXyHo1o4krVF02may19vQaRo36etJ4OulYPw8jerB3cOmT4hVe6/ImmK03PVNbNqjVEw3hG/1y09Gs5MaO4keQVW1Rf9W6nnpaKpa63wVxHo9DFlu8z67jzLfE8OBws5lcvs/wB3Vhw4496x9HS1NFX3mIXK3RCCcxz3mok3pN05/FjJLnOwT6uT4hbJ0fpzVN6tUVr0hQPsNmbkyXi5x4mqHnm5kfPj8OoWIsuh7RZ2sd2Dampb/HSjOD+SOQVgo9oGpdB1kdXUVdVfNPlwFTBUHtJ6Vv1o38yB0P8AvWlw6vPdF5pbrBsbSmx/S+mSKqal+WLo71pLhcB2sjnZzkNOQ32e9XccAGjgByA5BeS1XWivlup7lbqhlTSVLBJFKw8HA/oPcR3FetHNlbb3EREVFR9pnCt0S/vbqSm+LJAruSqRtSB3dJP33MDdS0Wcd+d8JF8PuXcclKjiiKJRRlSgIiIClQiCUUZUoJBRQpCAiIgKVCIJypUBSgIiIJB4hfKtrG6/SGcAiatbj2P/AFL6pHMea+V6EYfpQ8sV1az4yfqUxrx+L/PVXVQVKFQyQoUog4phERCEUlQiUIpUYUoRhQuSIlvlERQCIiAiIgJy49ERBqewQ+jUd3oQAPQLzWRAdGukMjfhIFzuVL6bbqqlP8dC+P3tIXrfCaXW+qqEt3W1IpbjGMc9+Ps3H+lEuPIg+1RfL6P42XVxR36VrTcNNWypccufTM3v5wGD8QVlVWtCv7Ghr7aSM0FdNG0dGOPaN+D1ZVFXnhh6ynNNNwHqni39S1hXTO07ZdZ6ewRHDTS19CDy7CX5zR/NeSPatxzwtnjLHew9CtX7W7DWfJXyjRU75qmCOWmkZG0uMtPK3dcABzw7dd71MM/G3ds5vM2laiDSN3lzBNE2e1VLuUsZAJj/AJzSTw6exbO5rVOs4IoNm7Jq6J4q6KmgfA5p3ZIqgBrWkHuOeY7113Pabd9LafrbdcmU0Oo6WKIxb+THO1+PwjB3kDOWnkQe5NbV6pj2rbEsrIY3SyvbHG0Zc95w0DxJVI1Dtl0nYXPiZVvuVQ3+LogHt/p/N+JXztdtRXi+vL7pdKytyc4mlLmjybyHuWOVpgxy576bUvX3QV9qy5lpoKO3R9z5MzSfHDR7iqNeda6jv5d8pXqtnY7nF2hZH/RbgfBYUAucGgEuccADmT4K52HY5rjULGS01imp4H8paxwgbjrh3rHn3BTbjj5Y5Z33Va0+Ld8tUPyrPNTW9szXVEkDSZGsByd3H0uh7l9d7N6HRFVSS3rShFdI93YT19QZJKhzgAS1zpPWHAg4GBxWr9M/cwTGphm1FeoTA0h0lNRMdvP/ACe0djHmAt7WOxW3Tdthtlpo4qOkhGGRxjh4knmSe8niVzc3JjlO1cvLnL2le/vWgtKbObzqLafe6+80slNZqG7y1jWyxkNqpifU3c/OAbg55cfFb7kkDB1K6vSDn5o96xx5OnanHcse+LvRQxweMhSqs2sNr2yCfaJLFcKS9S01RTQGNlJKN6CQ5JzzG6TnBPHu6LSEGwbaBM1p+RoYs90lXECPPivrw8l1PYDx5K858sZqNuPksmnyq37nbXRAJitYPQ1g/ZXCb7nrXjDltNbpe/1axo/SAvqgjBRP7Vm166+S37CdoDJWx/IjHb3021UZaPM54L3WTZNtW07cY620UE9BVD1e2hrYR6pIyHetxHAZBBX1MgOE/tWX4hc6xukpL83TVG7VApvlcRk1Ho+NzOTjlwzjGccM8lrPR4++baDqfVjhvQRPbbKN/cQz8YR7R8VdtpOrmaS0zLOwGWvqz6NQ07eL5p3cGgDw5lY3RlidprS9utUhBmghHbOH0pXHeef6RK04fFya/Fw77ZpVvXWqKXTum7tN6QwVcVIXxxA+tl53GHHQuPwKx+v9pVFpCOShpW+mXpzA5lO1jnNhaf4yTA4NHPHM/Fa6qLbfdeGCgsNFVOozN6bWXe7RGIV87eAJHHEbc4bGO5dEn5deefqNt6Ctb7LoyzUErCyWKlZ2jTzDj6xz7SqptY1RPN2GibHiW7XbEcuD+JiPXpkZ8mgnvC6Zafa9SSVFtiqrZXxz7u5c3NZH6OMesAzn7weXBRatCw6OvNjnqKt9yvNdWSSVVZITktbE4kNzxxkjJ5nhy5J+6LbZ0yLtpax0+l7NQ2elO8ymaA5/13k5c72nJWsqd0brLJpovdvzawNOQPqB4lPwC25THek49FRtR2rTGjdTnWV2us0W84zR29oDu0qCzcMjW8yd32Z45USrZ4602M0EkkDK1fBtVbZtWapjsltlvd5q6iCkpY2H8CyOGPBe947t9z+A6cwvDV1Oq9pIc+oll01ps8eyacVFSzq48MAjyHmvLZbjSWpztNbObTLfLg92ZKngYmZPOSQYyB3ch4qlz9Y965OfPHOdPpzu9inuI+X9puovSdxxLKNry2nh/Ja0cz4Ae0r3afodS69gbR6PoW6Z0404Nzmj3Xyjv7Jg5nnx+IVu0rsUbJVRXrXlYL9cxxjpT/BKbjnAb9L9Hgea2dNNT0FK+aV8cFPBGXOceDY2NGSfAABJx7759/8A04c+aTti1tLZtGbCtLVF3fTCsrngx+kVGH1NbKR8wE/Nae8DgBzytYafpK6411Tqe+O7W6153sEcIIzya0dwxgY7hwXg1fq6u2m6rddWta2z0DjHQQTE7p/zhA5uPAn2DuXutV8qhXx0Fe2ImYExSxAgOI5gg8it5GedsmvftYVDmte0sc0Oa4EEHkR0UojB5NAask2X6mbZ6+V33rXST8A9xy2imP6Gk8/Ye4r6Gyvna82mC922ahqAN2Qeq4j5ju5w8lfNhWtJr9p+Ww3STN2sbhTyb2d6SEcGPPUjBb7Ae9RY1v1Tq9tnKEyoVWaVStqbS6h04/h+D1Fb3HP/AGhH2q6KkbXDu2G0vwDu363Hjy/HhIvh90Xg8CfNEd853mVCKJyihEEomUBQSihSgJlEQSijKlBIRQpQFKhEEqVCZQSihSgDmPML5ZgaWy6aBHzbrWt8uMq+phzHmF8thpZNYhji2/VrT/TmUxrx+L/PVXFEQqGSFClQUEIiIBUKSoUgiIiEFFKhEt8oiKAREQEREBERBQdZR+ga8sNw5MuFLUW157t9uJox8JF5qiPs5XN7geHksptZiMWlWXZgJfZ62nrxj6jXhsn9R7156+IOAkbxA4ZHTuKiva/p+e+PSu2SUUet7jSng2uooqpvTejcWO+Bb7lYLNdqW+2ynuVG4up6hpcwkYPAkH4gqqXmX5N1Np+45w1756J5PL14y5ufzmKNi1U6q2e0Jd9Cadg8u0ceHvT1t1b1lpeVxkjbK3deMhckVV2uNqlE5zNPWyMlzLhd4GObjiQ073ksztC2TybSZbfPDcae3ime9sr3U++97TjGCCOXHgeHFYfaXMXay0HSNzk3F0pweOBuj7StvW4gUUZb9LJPvWfNncdWOL5GV2+Ur9sk1dT3qW2W7StfJTRSObDUNaHCducB7pM7oyBnHDHTvVv0n9zRcapzJ9UXGOhi5mloyJJT4F59Vvsyvocce5TlZX5OVmo5bnVd0xs80vo9g+R7RTwzd9RIO0mP57sn3YVkAHM8SuOVKwttu6pXa0rmF1tXYFeMq6J89p7F1r1OYHjBC4ejtzzOFW43bTHOa7lPnB6LsKABowOSFWk1Gdu7txcuty7HLrcq1OLgVxXIriQqVtEIpUKEqjrTZ8dWXO3XelvdXabjbmPZBLHEyZgDjxO4/wCl4jj7lhqnZvq+RuJdolzlhPzm01FDDJjwcMrZAGV2NC2w5cpNQnJcfDVVXZqLZhpi411upHmr3Q989U4vlqZHODRvvPEjJ5clcRktaXc8DI6FVjbBN6fW6d0+1w3rhcYd8EZzHHmR36ArRnPFdeG7juu/gts2hU26ymu2kUFM07zbdbZah4Hc6Vwa34NKuWFq2noX6s1FqWukq5obdJVNod2F266dkLcEb3c3eLicc1a5TGbq/JnMJuvfd9eVc1ZLZ9H0rLjcGncmqn/wak67zuTneA+KrddBYdFVIvGp66W/ajm4sa/1nZ7hGzk1vcCfYF63ahkq5vvW2e0EEkkQ3ZaxoxTUg7zn6TvHr1Vs0fs0tumJTcaqV91vMnGSuqeJB/IB+b581T6s/Paf+XPrPmu72ilXPT+sNY2S4XS/SmyWmCnkqIrbGPws26wubvnp1z7gt56FtVstWlLY21UNPRQz0sMzmwtxvOcwEknm48eZVY1rMKfR19lPJtvqD/ZuVv0gwxaSskZ4Ftvpwf8AumrXGSTUc3zsJhMZGWWmPuh9ZTw0tJou2SYqbn+Eqy08WQA8Gn+cQSfBvitzkgDJOB3novkquvLtY63vmpHlzonzGGl3voxN4NH9ED3lXxm64uPtvK+nbRUsdHTx08QwyMYHj4rkxva3+zxjmJZJD/NDDn4kLsYMld+mYPTblV3Q8YogaSDxwcyO9+B7CtL4Z4+basyIiogWL0tXv0vtltE8RLae9sNJUNBwHE8AT5ODCsoqnq+Y0eoNLVjB+Eir2Ecej2FGvD92vy+pkUu+c7zKhUZipG2A7mk6aT6l3tzueP8AnLFd1SdsnDQsjvq3Cgd/9TGkWw+6Lu757vMqFLvnu8yoRUREQEREEgooUhBKKFKApyoQIJUhQgQSiIgIiIJClQFKAOY8wvl2cFs9qA4bupKtp/7yZfUQ5jzC+YawBlTSDGN3VFUP7WVTGnH4v8/K1oURQzQiIggqFKhAUKUUiETCIIKKVGEG+URFAIiICIiAiIg8V7tcd7s1da5gDHWU8lO7PRzSPtWv9E1z7npK2S1HGdsAgnH+cjJjf8WlbNWsLLGLTqnVNjOA1laLjAP81UN3jjykbJ70vh6H9Pz1lcWG2s0LxoetqafPa0b46ppxxG67B+DivFsLq436LZRDAfTvLyPB7nEf3Sr1d7bDebXV22oLhDVQuheW8wHDGQqLs4sUWlNVXyww1L6hlNRUZD3gAuJ3yTgcuJKieHpWXrlbFREVWrXGu209RtN0PA7ImY+eUn8kDIHvBW07LPlj4SeI9YeXetN69ss2rtqFDaqWqko6mktL6mGdn8XNvksJ8MgZVr2da1luckluu7G0t/truyraf645do3q05B4d/gQs+bDeLk5J1bjZgJCnvUc+IUhcDiSFyUBSrK12MXautgXYtIyoiJlSgUFcZpo6dnaTSMiYPpPcGj3lIpo6iJssMjJI3cWvY4OB8iEBy4FdhXEhVqZXWQuOF2YUbqrpeV14TC7N1A1NJ6nENXIBRJJHBE+WaRkcbBvOe9wDWjqSeS1Hq/bpTz3GLTmh309ZcKp3Y/KMxxTwEg8W8PXIxnPLzWuHHb4RJcrqMHtD1eaba/TMpqGS5VVvo3xUdNF9Opl4DePcA3iStlWv00W2lFyMRreyb6R2QwztMetjwytcbD7W6ppLpqauldW11bVOibVy8XuYzmQTxGSfgFsa7XSnstsqrjVu3YKaMyPPUDuHiTw9q7Nakj1uLHpx28+przHp7T1xusrgBSwOkHi7GGj3kLUWmdN6m1FYaO2VZmstmw6WoeD++a57yXOP5LDnv8Aisle7/cNXaSsFnq3D0rUFxc6RrRjs6WN+8RjoMAexbDaAAGtGAOAHQKbPymYTku74j1afsdv07aoaC2UrKaBgzut5uPUnmT4lZFQBgAdApVWiq7U53QbP702PO/PCKZuOsj2s/8AMto0kHotLDTj+KjbH7gB9i1XtCYK773LRn/GN8pI3DPNjHGR391bZJySepyrzw8n+oZfVIwWu7i60aKvtew4fBQTOac8juED4lfLOkoexskPV7nO+OPsX0jtjJGy/UmDj95kf1mr5/s9pp63Ttva90rHCMPbJE/ccDx/Wr4uP/p/6uNVNM+SO30WDW1Xqs6RN+lIfAD4q32+hhtlFBR04xFCwMbnmfE+JPH2rHaftNNbHTmESPllA7SaV289+O4np4LMqbWds1qChzmsaXOcGtaMkk4AClVnWMpqJKG1ZPZVBfNOAcb0bMYafAuI9ygxm65VOso3vLLVRS14acGfeEcOfBx4u9gWCv10muV0056VTMhLK9m8xkm+Dl7O/AXuOAA0AAAYAHABYq4N37/p9uQM10Y4jI/GMVtajTis65qPsN3z3eZUKX/Pd5lceayZpJVK2xjOz2vd9Sekf7qmNXRUvbMD+5reSOBaIXe6eMqYth90XVx9d3mVCk8SVChUUqEQSiBEBERBKIECCUREEooClBKIEQEREEhSuK5IA5jzXzJcxuVo5+rqyoHH/tZF9NjmF8zXxobXVHI7mrpfLjM79amNONZkRFDNBRSoQFBUog4oiICYRFIhFJUIN8IiKAREQEREBERAWu9Z0zaPaTpyvjduPrqGro5hj8Y2PckZ7QS73rYi15tNqfQdVaHnI9WSuqKU8P5SAgfEBG/xrrljJqlUR9H2vXJnIVVmhkHiWSEfarqqPeHGj2uafm3mtbWW2ppj1JaQ8BRHu5+qvCIiqu13ZHis226glyT6HbYYBx5ElpKyOu9ETXeaLUFgkFHqOiwYZQcNnaP4t/ceGcE+XLlU9IXqWl2vajdIxpo7jWOoO1HJszGlzB7WsePNbfVr2Y4SZSysLs42mUOqmfI9wYbXqGmyya3z5a52O9mfnDw5j4q+bq1vrDZ/aNZNjlqRLS18P4mtpzuyx9BnvH/2CFX6bXeudm0jKTVFGdS2dgAFxpR+Hjb1f1/O/pLmz4N98XJy8GUu53bpAXJrVXNJbRNL61YPke6wyT4yaWX8HM38w8T5jIVpDcLHosvdx5XQBwUoitpntXtf6pl0XpKvvsNC+ukpmjdiBwMlwaHOPMNGcnHctP2Nu0zXtBDe6vXLrVRVeXxQUDACG5xjhjHIjiSeHFb9qaaGsp5aaojbLDMwxyMcMhzSMEHzBWh9nMkmj9UX3QFaXgU0zqmgLznfhPHh+bunz3lrx+Lry6fjzG3VjIN2U26rkbLqC8XvULgc7tdVO7PPXdB+1ejZqGaM2n3TSdLmK03GibcKSnLiWxSN4ODcnkRn3DoreSCFTqykrIts2kLjTUVTNC6CenmljbljAQ75x7sZzxVt2yyunmwnRW5SowuSLnec4EJury3W822xUjqu6V1NQ04z+EqJAwHhnhnmfALUuqPujKOOKVmkbTNdTHwfW1LTFTR5IAPU8T37qtjx3LwtjLfDcMsjIY3SSPZGxvFznEADzJWsNbfdA6Z0zv01rPy5XNO6WwP3YWecmCD5Nz7FpfUl71RtArnW6e81N+qi7PotCNyhgGeeeAdjrju5lZGh0hYNAMirNSStud2dg01ugG/63d6v0uPeeHgVr+njj93e/htOLX3Oq5XHXm13NRdKltBY4yZMuHY0sbeuOcnmc+YXiq75pnSNvqKDTMD7pXzxOikusgxuZGD2fDx7uHiVeKTTN31i5lXqwmjt4wYLLA7daB3GUjn5foVVjoYNZ7RbTRUUEcVpZLiGGNgDPRoHZe/H5bw4Z7wAtccd/d4/Dp/Ssk32/ZubQlkOndIWq2PbuSQ07TKOj3es74kqs63rjqW+vsELh8mWOnddrxJnA9RpdFD7Tgn/AHKz631VT6O0/U3SbDpQNyni75ZT81oHxPgCqpc9PT6D2EX6uuTnvvl+DJa6Rw9ZrpXtAYfBrSc+JKvPyv8AJ5OnGYT2r2zQfLt5bc3AdlaLdFQx8c70z8ySu97iFs9nF7R4hVTZvYxYtIUEZZuz1LfSZs895/ED2NwFaozl7PMKL5dnHNYs2iIqir3BhuG1bRtEBltJHWXF46YYGNPvctqLWGm81m2mueRltvsMcbfB0s2T8GrZ6u8P5uW+Wq5tGoXXLQWoaRgLnyW+bdA5khpI/QvnfSU3b6coX9I933EhfVEkbJWOjlaHxvBa5p5EHgR7l8t2+2y6Xvd40rVAsloKl74QeHaQOOWuHhjHvVsXPO+FjOUJ/CuHVq9yxUUhjeHDuWRinZKOBweilm7FUb67tNVY7oaFuPzpCfsVuVUvcRi1IZHfNqKNoafFjzke5wKmeVsfbzkJo+1O1VtSsdvhJ7OhkFVO9vHdDDvn4ho9qx95vEdtj7KM9pVyerHG3iQTyJH2d63lsQ2cS6KsclyujCL1cwHzNdzgj5tjPjnifHh3Kc6vxzpnXf8ARsonJJ6oilZM0KnbYj/6MtQn6tMHe6RhVxVQ2ut3tmOpuXChe73EFIth90W1jt9jXdWg/Bcl10x3qaF3WNh/qhdiKiIiCQUUKUBERAUqEQckUKUDKlQFKAFKgKUBERAXJcVyQF81ahYG3K4gHIbq15/tf96+lDyXzfqQBtyvWRxGqyeP/at/WpjTjZ5ERQzFBUoghERBChclBCCEREBQpRSN7oiKAREQEREBERAWs9uA7Gm0lWjgafUNN63QODgtmLWW3v19PWGBvGSW/wBGGeYLika8H+JGePMqibQ2vpdR6LugOI4bp6O89BK3A/QrfeLnDZ6CouFS4Np6dpklcTjdaOZVH2ryTVOzqnussTYpqaekrXR5zuHeGRn85RPL3s72dW2+/XCy2K3R2yomgqZqvf3onFri2NpcRw7s4yr3Y7pDfLTQ3OAgx1ULJRjuyOI9hyFS9U9ledpOj6R8bZYHUtXUvaeOWuZhcdmj5tK3W46FrnfwV5q7dIf46ncckDxaefmVOuysv1KrZbZNcbBrWrpQPlGmvbq6mcMg9rAS8DwyN4e1bgsl2p79aKO60pzDWQtmZ4ZHL2HI9i1/suYaao1XTOHrRXmXII6+CyOgKgadvlz0ZMd2KN7rhbST86ne7LmDxY7PsKXunHtJV4gqYKprnQTRytY8xuMbg4NcObTjkR0XmuUeWtkHd6p8lQdH6Hudxpr5fdL3X0C/Ul6rIZ6eck0tcwP3mtkb9E4dwcP96z9u1zR1MrrPqKF2nb20br6OucGNefrRSH1Xt6YOVFxV4/kY5ZXH3GE1Bs009fn+kejuoKzO8Kmj9R291I5H4FddHVbU9HdlHbbzS6loI+Ap7g0Nlx03yc/1vYvRV3fU819ugsVmjvFss7IWVkcLsVDpHguPZdzi1uMt8V77Dqu0akaRQVQ9IZwkpZRuTxHvDmHj9iWflbLHi5bcfbto/ugqWgDYtXaZvFjnP02R9tEfEHgf0rKs+6D2dvZvG8zM8HUcuf0Lqe1skZjkaHsdwLXDIPsVdu8mm9NiNr7dTuqqp+7BR0tM101S88gxgHHj38lToxrny+BhO+9LWzb7s5ezf++AM5+q6mlB/uqoav17ss1DqG135l/niuNqeSJoKOQioZx/BuOOWTnyJHesbrGObQ+kRW3S22uPUN4qXCit3YMlNMw4GM4wS0AZ6ucvTYfubZ7rDBXatvs7ZpGb76Ojia3sieO7vHhwzxw1R04Y97XL08eFmWOSZdt+myQ2ipLxXHkeypcY95U0u3xlvmEdLo68TVU7fwbJ3CLLRxJHAk44cV4td6BfsWFLqvSl1rRQmojgq6KdwcHNOeOeG8DgjBGQTkFc9QWA7TtojqcVlRBaLVQxsqZIj6znSHf7IdCRu58ArTHCzfpv1TkwZ61fdJ2ZsFQdR259uqWPxFDSyioL2445PANOe5YLU33QzbxKKWxXMWSneMOnmpDJPnwOd0e4rbWl9nmmdNUbWUNjoInlvF7og95HPBc7JKytx05aLrTOpqy20UsTxuuD6dhyDzHLgserCXw4r0yvli4VlrrriDm5ayu7+IdLI6VjSfgB5BZyl2f3i9s7XVNZFarZGN4UFG8NAA73H5o8+J8k0jczou66o062gmnfR17hTxRj1y3eIAc4/RwGnJ6rmZKjWz5n3erzTU8xiNupyWxNe367ub/0LW3PK6x7T8r244d69durvTGSWTZ5R09LSR4ZU3d7fVaere+R/iVlYLPYdntBUXy4TSVVZjMtdUnemleeTWZ5E9B71X+0q7Bqy2yWK2emT18T6FtFG8RNlcBvNOTwGMFX2x7Kb5qaqlu+uH09M+OGSO3WyncJY6V7mlvbPPJ7xnIHH7Faccx8Onj+RxYcfX7VmXUtVrW0Wi0WaF9Jc9RufEA5wcaWnBIkmJHdug4Vf0xrDT+ndYXy5NgqKptOwWy00VHEXyejRcC/oBhoJPeSStraO0FYdkFhqblqa9081RLA2klrZ/wUcUIHCGIZ3sHmccSfJYjTm0PZhpCpkqbJpq52yhqXNjkvAtr20/Qeu47wb5DHgrs8/lXPLqk3o0fZLltR1LSasvtunt1gtZDrbQVDfWqZefauHQHGOuBjvztPVEsNPpu6VFRHHJFBSSzObI0Oad1hcMg8+ICyMU0dREyaKRskcjQ9j2nIc0jIIPeMKrbWKl1Ls21HI0ZcaF8Y/Ow37UcWfJeTPdVagDhbqMO+d2EefPdC9LDhzT0IXBrdyNjBwDWhvuC5Z4Kj6VnkUMO8xp6gFSeShRXtnLRUbTNdVWB+CZQ0wPfwjc4rZq1lskAk1TtAnAOTdYo+P5MX+9bNV6+f+Td8tQqLtH2XU+t3QXKiqzbL7SN3IasNy17OfZyDvbxPHmM9/JXpEYy2XcfOFfZ9Radc6PUNnlpmsBJrYD2lK4Dm7fHzfJ2FXpNbWeGTddJPud0vYu3D5HvX1bLFHNG6OWNkkbhhzHtBDh4g8101duoq6mNLV0dNUU5GDFLE1zceRGFbqW3j7j5cm1/aKVoLaySXPcxhOPfheN15uuvZ4LVpuz1FTVOfls5bjsep3hwaMcyTy7l9K0OzzR9tmdPSaZtEUriSXCmaTx884Wehgip2dnDFHEz6sbQ0e4J1LTLDHxGttnGw+0aOkiut0eLtfB63bP4xQu6xtPf+UePTC2YUUKqmWVyu6KcqFKKoVV2qtL9mmqAP/dk5/qq1Kt7So+02d6nbnGbXU/7MlItj90Zq1O37XRO+tTxH+oF6l4bE7fsdtdnOaSE56/g2r3Ii+RERECkKFKAiIgIiIJUqFKAFKhSgBSoUoCIiCQpUKUEHkvnDVzd256gwfm6nY73yRfrX0eeRXzrrL/Gupgckt1DEf60CmNONmTzPmoUu+cfNQoZiIiCEQogIiIIKhSVCAiIg3uiIgIiICIiAiIgLUe268UNDqbQ0Nyq4qWiirJq+aSQ4a0RsAb8XYW3F46+zW26vhfcLfR1joCXROnhbIYyeZbkHCL8efRlMmqbPbp9sNYyespKil0XTHeayZpjku0vEA45iJvPxOPZhn0lVcdmepNKVxMtysTZaF5dzeI/Xhf7WBvHwW+wAAABgDgB0WsNYU505tJt1zwPQNSQfJ1SD80VMYLonH+czeb7FLt4Pk3Pl+r2oWiLgzVOvLHXtka8UGm498Nx6sjjukHHf4FbB1FpWm1BLR1fbzUVwoX79NWQY34882kHg5p7wV06V0HY9GzVk1pgkY+scC8yP3t1oJIa3o0ZVhVbfw9PHHtqqnS6Sp7JqO6XmKpme+5ta58RADGvHznDHecDyWM1zbKie3x3q1udHeLOTU0sjRnLfpscO9pbnI8Fcrm31GP6HCx7XbrhkAjvHVRtp0S46VvYbqo1+utTUUlJLROuUMNzNNIPxcoAbIWnva7ea4HvC3JdrJa79S+i3a3UlfBz7OpibI0eQI4Ko7Ip2mx11tc1hls9fPb2ux63Yh3aRNzzwGyAAeCvavXz3Pb+pWC0xoix6OdV/IdI+jiq3iSSBsrjEHceLWE4acYHDuAHcvHq7ZppnWjhPcqHs65n4uvpXdjUM/PHPyOVaUUM+q73tpXUOjtZaNpzLT6wtVVaXkxuq740RSUQIOH7w4SEYwG4yTjgsjsqqdmtJcXx2vUlNfNSzZ7avqiRNMe8RbwADPyW/FNqEVpO0bTMussfeq2mmEZn/AIKK7e9XtTyA3OWeHDpleiI7LNrNbPp+ntkUr6SLtqeqhg9HEjd7dc6CRuC4NdgHuye9S6cuXPPCTO3TB6qphfPujrFQXEB9HRUQqIYnAbu8A93I8/WA9w6LdK+db1p69Wuuh1JYp6vUTtI3KW3TOcTJPJS7rHtaSPnlgkkYSOI4dOGRuu3uG4sjotMW24XK5ztwxk7S1sTujgD62PDA8Vjy4XK9lpx9Umr4Wrb3erSzZ9crfVTRGonDPRoy4b75A8YLRzIHHJWvtg9/9BnrdLVdPM2rMzqnO58xoa0ODzz6Y81m7Np6f0f5U1hPBcrmHmftJwDHRD6jM8GgczjhnyyqFadXt0ttDu2pBSzXG0VkkkJqYW/RJBy0ngcEY8Qq8dmUuEbcese0fWQxjhyTGeHVa+09tl0jc6YBt7pGloA3ah/YvA5cQ7HwWN1vt30/aLfNSWOoF1vMwMVPFSnfax5GAS4cDjPIZJKy/Ty3rTnvFlLprim0deNoettb33TlwZS1VDX7sAk4R1HFwLCeQ4MHhx9qwViZqifV9xs1PQ0lBd58OqIqxxY1jmcHPa3m7IOcDPgt9bFtFVOi9GRxXFhbc6+Q1dUHfOY5wGGHxA5+JKxe3HRctytUOrLLG9t/sjmyxviaXOliByW4HPGcj84d63nL9XStMsblq+Gs71py+6Guum9T3m9R3F8N1hb2ELCxkYPPBOOYBHIL6I1fqem0hZZblPDLUv32w09LD+MqZnnDI2+JPuGT3LSm0Kvl1NbdC0jaaSKqu9fBOYCw5bgDeBBHcXLZ20eaqstRZ9Ui2/KlusssstXTR5MsbXtDfSI28nFg3uHRxIWmNtnc+Rjj1YyPPYdm094uMeptfviul3+dT0A40dtHc1jeT3Dvec5PLqujavr2wUFnuekYoXXW+1dN2ENqip3SEmQYYTgboAyDzzwCmv26afnc2j0lTVuq7nI3LKe3xO3G/wA+QjDR154Xr0Fpa+wXe5at1XNB8t3ONkApaY5ioqdpJbGHfSOTkn9Kt/3Yd59WbM6CsdVprRdls9bK6Wqo6SOKVxdvYdjiAegzgeAWH215/ct1AQM7sDHEeAlYSruqrtUpPTtm+poNzfJt0zgPFrd4foRTG/VLVaBDmhw5EAhSCvDYqoV1jt1WMfhqWJ/A55sC9qo+njN0jt6mjP5OF2ry2129TY+q4hepFKwWx0b1frmTOQ6/yDx4RtWyStbbGj++9cA43vvglyPzGrZKvXz3P/iVCIihihFKIOKIiAiIOJwOJ8EEIsTetX6e07wu96t9E7kI5Z2h5PQNHrH3LCt2huugxpvTN9vI7p3Qeh0//eTbpPsaUWmNq4LD6zpJbho6/UkEZklmt1RGxobnLjG4AY81ihBr+7/jqux6dhP0aeN1dOPzn7rAfYV2t2e0NUQ6+XO8X1/Mtrasthz/ANlHus94KlMkne100+vNK6btVsorxqG10NU2jhDoZqgb7SGAEEdxyCOKDa7oA/8ATGy9P4QrBBYLRS0zaWC1W+Knb82JtMwNHswoOnbKedntp86SP9lDeLAfuu7P/wDLCy/+I/3LmNrOgXZxq+y8P9ICzR0xYTzslqP+px/srqdo/Tbzl2nrOSRjjRRcv6Kdj6P3Y1u1TQjhkavsn/imrkNqGhjjGr7Hx/0tq9x0TpZwwdN2Ujnj0KL9lcHaF0o7npiyH/UY/wBlOx9H7vO3aXol3LVtj54/hjP1rkNo2jHctWWM/wCus/Wuf7n+jz/0Wsfd/wAyj7vYuDtnGi3/ADtJ2M/6mzrnoh9H7uf7oGjycffTZM5x/DY/1rkNe6RdjGqLJx/02P8AWvOdmeiDz0jY/wDwjP1KHbMNDOOTpGxn/VGp2Po/d7RrbSx5alsp7/4dF+0uY1lpkjI1HZsf/HRftLFnZRoNxydIWT/wwXW/ZDoB/PSFn9kOP0FOx9H7sz99+m84++Gz5H+mxftLsbqrT7xlt+tLgelZH+0sA7Y/s/cADpC0cBjhER9q4/uN7Pf8kLT/AN2f1p2Po/dZG6ksZ5Xm2Hyq4/2ly++KzHldrcc/6VH+tVY7FtnZ/wCiNs/ou/aXE7EtnJOfvSt/PPAvH/mTsfR+62C/2k8rpQHu/hLP1rkL3bHcW3GhI5cKhnTPXoqedh2zl3/ROiHk+Qf+ZQdhezj/ACVpPZLL+0nY1h+auLb1bnnDbjQuPhUMP2rs+U6Pj+/KXhxP4ZvD4qjfuD7OMY+9mHnnPby5/vKDsE2cu/6ONHlUy/tJ2NYfm/z/AFXv0+nI4VNOc8vwrf1r5411Ji4avMT2OcL5C9o3gM/iO9bL/cC2dYA+QXcP9Lm/aXW37n3Z6HSE2ipIeQQDWy+pwxgcfbxzxSLY3Ce1BfcL0CT8jUuM8/lFv7C4/KN8zgWOmI6/KLf2VsE/c+7PS0j5Jqh/r0vD+suJ+562fk5Fvrh4Cvl/WnY+j+f8qB8oXz/3FB//AGDf2VJuF9H/AKhgP/zBv7Kvh+530CcfvO4jyr5P1qP+DxoTOfR7oOGMfKEidj6P5/yofyhfuH/F+Lj/ANYN/ZT0+/Yz8gRDw9Pb+yr2fueNDH6F4HDHC4SLgfuddFEH8JfBk5/xg73ck7H0fz/lRjX3/wDyejPlXt/ZT0+//wCTzP8Ax7f2VeR9zxo1vKov48ri79Sg/c8aQJB9M1CMf9Yn9Sdj6P5/yoxuF/H/AEdYf9fZ+yhuF/8A8nGn/X2fsq8/8HrSmctuWpG8McLif2VA+570wM4u+px0xcOX9VOx9H83/wDVF+UdQf5Nt/8AHs/ZT5S1B/k23/x7P1K9f8HzTmeF81R5fKH/APlcmbALAwY+X9VH/wCYY/8AKnY+j+b/APraaIihkIiICIiAiIgIiICqu07TkuptGV1LSEtuFOBWUTxzbURHfZjzwR7VakRON1dxrvS98j1Lp633iIboq4WyOb9R/JzfY4ELKKp6ZgGm9X6m0njdgjnF0oh3dhPxc0eDZAR7VbFW+X0XFn14zJ0Vzd6lf4cVhys5OMwyA/VP6FgkbYu3ZPLu6n1vTcABV0s+M/XgAJ/qrZa1TsyeY9pWr4s8JKOglx5B4W1lZ898ua5shERHO6qqkp66B1PVU8NRC7G9HKwPacdQeCrmr9HaRu1uin1BR08VJbGOcyZsrqcU7CPWG8wjDTjiORWW1DqG26WtFRdrtUsp6SnbvOc48XHua0d7jyAWi7jUXzbHWtrruZ7XpWN+9SW5rt2SpweD5P8A74d3VRllMZutePC27nZxqdT1uqqc6W2aUo07pSnJZNcGsLHzk/ODc+txz13j3kcl7aO26Z2Y2d9Q97YARiSol9aac9B18hwHf1XO+6ptOjIKe10dL29a8COkttI31jngBgchn2lZrQuyKsuNwj1TtB3Ku4g71LbOcFIOY3hyLvDiBjjk8uf6ubve2LptmEawul4rtW3j0O/tqbPbuxFXT2yRpY6rj4kPe7vHDOPd1UaRY99gpO/tN9zR3AFxwPJb32u2S0V2i7rc6+ipZaygopnUlRIzL4XluBunnzI4dVp+xRQW+io6Nz2tlELWtYTx4Dj9q6sJMZqOfkz6sWPrNFW2ukL5rfGHuOS5jt3J9i77Db7voOufctNQWeqcfW9HrqYOePBkvzm+8LPopvftWc5cp7W/R+3S0XqsZadQUsmnrs4hojqDmGQnluv7vzseZWyH1lNHT+kvqIWQfypkAZzx87kvmPXUVumszzWuAdG5oaWNDntLj3D3+5duzGy0Ws71T6ZuWoKu4UFJQSyUMMZ3IqZ+RhxYeDnDeJ496xy4Je8bzWU6vC66X/8ASLttrb8wiWz6bYYKaQA7sk7sjIPXJcfIBbs8FhNHaQtmiLFBZ7VGRDHlz5H/AD5nnm9x7yVmytJNTTLlz6stx56SgpLexzKOlgpmOO85sMbWBx6nA4rvREZi81yo23G3VVE84bUwvhPk5pH2r0qCg0RsyqHS6KoIJPxtEZKOQdHRvI/RhWlYJtMdM7S9R2OQBkFzc280Q7iH8JQPJwWdVb5fTcGfXxzJkLU/jIzyK7aC4NuAqt1hYaeokp3AnPFuOPtBB9q8NDL2VQ0nk71SvLa5vQNaXi2yHdbXRRXGAdzsARSjzBaw/nIZ3Vc9k4FPqvX9Hn1hc4akN8JIs594WzFq3TMptG2e407ziK+WiOdnjJA7dI/onK2krPB+VjrlqCi66mohpIjNUzRwRDm+V4Y0e08FUaza3pOGodSUFdNe6xp3fRrPTvq3582DdHtKMJjb4XJQFRxqbXd7H+B9Gw2mJxOKi/VYa4Dr2MWXe8hR95WqryAdQ67rY2H51LY4G0cfl2h3nn3hSt0/mrZdr3a7DT+kXa40dvh+vUzNjHxPFVY7WLLXOMWnaG8allHD/BtG4xZ8ZX7rB7yvZbNl+j7VP6THY6eqqufpNc51VLnrvSF3wVpDQ1oY0BrRyaOAHsRH0xSzW7R7yP3rabHpyI/Tr53Vk4/MjwwHzcVP7ndXc+OpdX366tPzqankFDTnw3YsOI83K6YRQdd9MHY9E6a024vtFjoKSUnJmbEDKfN7suPvWcJJ5knzRMIi23yhFOEwiEIpwiCFKFO5BCIiAiIgIiICIiAiIgIoz0UgZ5oJz0TBQKUEYwpREAKVCIJTKhEE5UZREDKIiAiJhARMJhARMJhB2oiICIiAiIgIiICIiAiIg1ltRg+RNXaU1U0kROmdZqs93ZzcYyfJ4+Kzq9O0zTx1RoW8W2Mfvh1OZqcgZLZo/XYR45aB7VX9JXxmpdM227s4Gqga94+q/GHD+kCor1/gcm8bj+GTqTinkP5JWDWarDill8lhVV6WLx7OnD91zUgGf8U0mf6ZW3FqPZgBPtT1fMAfwNFRQ5894lbcV3z/AMz/ABshYzUeo7ZpS0T3a7VLYKaEc+bnu7mNHe49wWSe7ca52CcAnAGSV896t2iWKousd0uVRLda5h3aK2QsJFLn8k8N895PHoFXLLXrbLj4+uvTWQXHaNdmai1XE6jtVKS+32iQ4bG3+Vm7i49Ps5+STVF71rcX2LZ/S+kPZgT3SQYgpx4EjHkfcDzXstOzfWO02SOr1ZI/T9h3g9tti4TzD8rPLv4u49GrdVg07atL22O22eiio6WPiGRjme8uPNx8Ss5x9V6uT/ZvnyY4doqezvZHatDONxqJHXW+zAma4TjJaTzEYPzR48z8FfURbOXLK5Xda1273Ax6at1oY529dLhHG5o+lGzL3D4NWoqa31kFwjrrgaemjZIZXyOmHrcCA3wxlbQ212K9Xest1dREUtBaaGrq5617Q9rHYbhgbn5zgOfIDK1lSWMVMjaqvnluUwblpnA3I8/VYOAV54X7TGLDHIyWNskb2vY4ZDmnIPtXJYD0GtpHvZbKiOlhmO89ro97cd3lg5DPTkup1rufZ9vSX6uMnNplDXxu8CMckU6Z+XTruGmZTU1a4tbUQStdw+c+MH1h44znis9sZZSUm0WkqGN3X1lPPCDyGd0O5fmrD27ULriY7ZerZNRT1THRgvH4OY49YN6dcFctDxXCx650zFUxjs23BsLZ2yA5a5jmhrh1wR7lPppJfD6jRAizZIRFBICCUUbwPAZPksDfdd6Y0zwvF+t1E/ujknBkPkwZd8ETJb4VHbdaJoKC26yoGF9Vp+bfmY0ZMtK/Alb7OB966aaphrKeKpp5BJDMwSRvHJzSMgrIzbTPl+B9Pp3R1/v8M7XRuklpxSUr2kEEF8uMgjPILXeno7zs9uFPpnU1JFQ0daXyWuVs/bMYS7Po5kwASBy4Dn4pY9X4HL0/3eS7hYzXMdS20U2prc3fuNheanc/l4cYljPgW8fNoWTXbFK1rXxysEkMrSyRh5OaRg/BVj088dzSq6xv7fkuwbRNPGCrNpn335fhvYyt3JGPI4jBLc8Mjors2x6/v7N+46vobNTyAEQ2Ok337p4j8NLk+0NWrdG6IuktivVPp10M8tLUz2y62areWRVsZ4xysd/FybjgM8jujPjs3Yvd7xWaVNpv1sraKvsrxQl9TGW9swD1CDyJAwCRkcAe9XeL8rKW9U8zy9NNsh0qJhU3WnrNQVWcma8VT6nj/MJ3B7lbqOipbdAKeipoKWEco4IxG0ewABehMKHDcrfKMJhThMIhCKcKcIIRThEEYTClRlAREQERPighYm+6kpLG6nge2Sqr6txZSUNOA6aoI54HINHe84aO8rB3HXk1yuEtk0VRsvVyid2dRVucRQ0B/wA7IPnOH8mzJ8QsvpbSEFgNRWVVfJcr7WACquU7QHvxyYxvJkY7mDh1yeKLdOu9ea6/fzC/0y2Q2Gqia0F9sldIyU8OIE+d3OeWWALjYtf2q71ptVWyezXpo9a2XECOU+MZzuyt8WE+xWd5e3HbsOR/HRfaOY+IWLv+nbVqeiFNerVSXilBy0lo32Hq08wfFpBRMsvlkjwODwPiipMWgKigkDNMa5vlqA+bRVpbWRNHQMmG+B5OXMu2mWMZmo7BqeAf+zPdQ1GP5rt5h94Q6fxVzRU1u06losffDp/UOnmjG9PWUfaU7T4yxFzR5nCsNt1NYrzu/Jt5ttaXjLRT1THkjyByiLjYyKE4U4efouHmEDB38UVcck8gp3T3rmpwg4YTC54TCDgpU4WD1Den0VZarTSFpr7nUhjBzLIGetNJ5Bo3f5z2omTbNnhz4IOKxV0stEMFs96pi7jmhnmIHsGR8FhZbbVxAil17e6XH0K6khkx/TiB+KJk2t+FOFVItParqoxJBr9r4ncnx2qnPxyQpOkdX8xtCrd7xtlLu+7dQ6Z+VqwmFVPkHaBT/idX2eqH+k2YtPvZKP0KDRbS+Qumkj+UaCoz7u1Q6f3W3CYVS+R9osuXP1Pp6A9zYrO9w97pl4L5qPWmhrdJd79TWC62qBzBPLROlpp2Nc4N3hG/ea45I4bwQmO/FXzCYQceXJSiqMJhckQcUXJEHHCYXJEEoiICIiAiIgIiICIiAiIgLTuz6A2Wv1TpgjdFrusj4WnuhmHaMx4c1uJannY6k23XyNuAyss1LUOA73NeWZ9yenb8HLXJpn7icUrvEgfFYjmsndHYhY3q5VzUF4i0/Za26zEbtLEZAOrvoj2nCq9ydpt6ticZqb7rq6EZbLc2UrXY7omcv6y2sqTsc05NpvQFvjq2kV1bvV9Vnn2kp3sHxA3R7Fdlavm+bLqzuTyXe3i7Wqst5qJ6YVUL4TNA7dkj3hjLT3FVbQ2yTTGhI2S0dIKu4gevX1Q3pSfye5ns95V0RGcysmoIiIgREQUXbTXeiaBq6Zv4y4TQ0TeP13jP9UFa2axsY3WDACtG326NpXaVo5N4xvrpKp7WDLsRx8OHPm9VWCeOpgjnheHxyNDmuHIhWnhbL7Ywd403S1MxqIKispKt2T2sM7uB8s4wuWjnVEdskpKuTtJqeUgvxjea4BwPtyu+/wBQaeiq5W5zFA9wx/NK9lVb3WPU0NE5u6Kmx0NRnuc5rNxx/QpWltwu3C7wUTqKSasi346cdsCODmkciD3FYCx3eqqNZadt1W0uqBdqaSKUDhKwO7+jh3rLaqgbNYqx3YGWRkTizd5t7yfgq/b4bnW6q0zNZ300Nd6a0wGqcezD8ZAdu8cEAjh1Uzwnj9bfWxk48AsfdtQWqxRdrdbnQ2+P61TO2P8ASVTjoTV9846i1/WxROzvUljp20jMdN85eV77Tsk0XaJhUsskNZVjj6TcHOqpSeu9IT+hUV1jPNeN+2OyVzzFpygveppRy+TaJxiz4yv3WhcflDahfQ4UtnsemIDykuE5rJx+ZHhoPmVfI42xRiONoYxvANaMAewLlhDqk8RQXbMK28A/fVrS/wB3a7i6mpniipz4bsfEjzKzli2f6U00d+02C3U0uc9t2QfIfz3Zd8VYsJuqNoudricnmSfNYrU2l7Vq+0TWm8UoqKaTBHHDo3Dk9rubXDqsvuqcIiXXeNLV9r1Vs93mV0FVqWxM/F3ClZvVdO3pNGPnAfWb7Vxtuu9NXWHtIbxSROyQ6KokEUjCOYLXYIW6+SxdfpTT90ldNX2K1Vcrzl0k9JG9zj4kjJTUd/F/UM8ZrKban0BqGho9rlXQ2+sp62mv9EJJBTSCTsaiEHi7B4Atzx64W614rbYLRZyTbbVQUJI3SaanZGSOnqgL3I5ObknJncpNIwpwpwmEZIwmERAREKCCiKEDKKEQMog5qgP2j3LUtxrrNoayOrqqjndT1FfcHiGkpng4JIB7R/gABlEzG3wt9+1Ba9M26S5Xetio6WPgXyH5zu5rRzc49wHEqoMoNR7UAH1wrNNaWccikBMdfcW/5wg5hjP1R6xHPCy1h2cRxXKK/aor36hvjOMcszA2npD0gh5M/nHLj1VfqNs81xglbp60h1bHXwUsdNXPDPSBIXtxkH8G5pZkghxAIyOPCWmM/wDy2Ha7XbtPUENvttHHb6SEbscUUYDG+7v8TzXt3t9nrNbIw97eIK15rDXV609DpiknqLXbr5cJHGohlJfSYAxuOfjeblzmAOA4EknICsFo1lbbjpZmpayOW1QbzmTdoM9m5ryw8WjDm7wOHciOPBQrcbrawBrh+Ilzj6D+P+8LreY97M0Zgf8AyjTw9/61FPVQ11NFVQviq6eVofHPA4ODmnkQRzHku5uXAmKUOHR/HH2oq4SR9qzdmijqYz34GfceHuXU2mY127BVVEB+oXZHucD8F2FgYcmN0J+tFxHu/WFyBmcBkQzR9c4Pu4hBx7GsYDioik/JfHjPtB+xYK4aD0pdGSfKelrRni90wgYCPHfADh58FOodaWfTlUy3tFTX3eUb0VsoGmSd46lucMb+U4geKxbrBftZ+vqySO32o8fkOik3u1HSpmGN8dWMw3uJcpWks7+FboNGW7Vdy7XT9TebXpqAPifVU90qN66O5bse88gQt4+uOLjwbwGTsy1Wyms1tprdRsMdNSxtijaSSQ0DAyTzPiu+GKOCNkUTGRxsaGsYwANaBwAAHIBc1CMsrRERFREUoPJdbnR2W21Nyr52wUlLE6aWR3JrQMkqsbPLZWXSoqdcXqJ8NfdowyjpX5zQ0QOWR4+u757vEgdy8Oomt2g60i0i3L7LZzHXXgg+rPLzhpj1H03DoAFdrpW2qnjbBc5IGRSHdAmHqZ8+QUr+Jr3Xa6O4xuyyenmb9WSMtP8ASB+xcfTqqF+KmheGfykDu1HtGA74FdENlt742y0U08THjIdTVLw1w8gcFdraGspf4PXvlb/J1TQ/3OGCPblQr2cALNUSl4NOyZx4kHs3k/AruENZB+IqGTx9zZ+Y/OH2g+a65aqZrS2ttjpGd7ocTD3cHfArrp4bZWF3oE5glb85sDtxzf5zDw94RL1ek1jT69DvD/NytP6cKW17c4fT1UZ8YifiMhdXYXOL8XWQTN/z0OHe9pA+C74JKreDaiCP+fE/I9oOCPiiHe1we0OB4Fa51M52vdeU2lYyHWWxmK43Yg8Jp85gpz4cN9w6AK2601LFpDS9xvcrDL6LEXMiHOWQndYz85xaPasZs90zPprTrG3B4lu9dI6uuU38pUycXexvBo8GqVse06lmRSihQREQERMICYU4RAREQEREBERAREQEREBERAWpKCb5a2sasurDmCgip7RG7q9oL5MeROFtvIHEnAHErT2zV4bpM3WUHt7rWVNe/q8vldj+qAnp3fAw3nv8M5cpd+fdHJgx7VT/AJNO0TXVJptje0s1ne2tu0g4tfIPxcB8c8SOmeim+6pqauv+9/S8YueoajgGx+tHSA85JXcmgdP/AMHZ2z7Q9JoLT8dtgf29TI7tqyqd86omPznnw7gOntUSe3Z835Ewx6MfKzAYGEROSl4oi4l481G+Xch7kHNQXAd6rt/17pfTGReb/b6N4/inzAyHyY3Lvgq4drL7v6uktI6gv2eAqHQeiU/h68mMjyCaWmFvpsMydAuL5dxhe9waxvEuJwB5la/FNtWv2O2rtPaVgdn1aaN1bUD852GA+S5fuPWy6SNm1Ver7qaQZO5W1RjgHlFHgAeClPTJ5rXu2m70l71zaoqGup6uKgoJDIYJWyBkj5MYJBODhoKwWjYGx0lSWSSlraiSMNc8uHAg5GeR4kJtMpLPpbaLUW62UVNQUcVupwynposBzyXHkBkuOfEle/TtFJQWeninbuzuBllHRziXEezOPYr+k59p+zwakMk0DqSIkSVk0VI0jmN9wacewlZ7W2j6TRGtLCILhc6+SvpKmOSa4VBmeSwtIweQHPgBhY+z03yvtC0tQBocPTjWPB5bsTS79OFctvA7K76KqjjArZ4ST+UwfqULYeNfnavua17S1wDmuGCDyIVMnpavSVbbrjG5j6SgroKiPediSJgkA3T3EYPNXRYPWVP6TYK2MczA/HmBkfoSM+O6sfTIIcN5py08QR0U4WG0ZcPlbSFkryd41FDBITnPEsGfisyqIs1dCKcJhECYUphBGEXLCIIRSiCEREBQUJUICIoygnKhEKCEREBERAVZ1Hs70/qaqFfPTSUd0aPUuVBIaepZ09dvzvJ2VZkRMtnhQ2zbRNFjG7Dre2NHdu01wjH9yXh5Er3WvWejdeV9HSyymmu9vqBUMt1wjNPUxSgEfMd87GfokjgOitpIHNYbUek7Fq6nEF7tVNXNb8x8jcSR+LXjDmnyKlbql8sdrLZ+3V+p7LcKiOjdR26Obf3nSNme5w9QDdON0HBPfkcFTto9yZHW27QGnZ7jaK2EQ9jVU9S+njJlduuDt1p38N3nkkgZPMlWGPSmstKne0tqYXKjHK2X/Mm6OjKhvrj84ELubtSntOGat0jfLMQcOqYIvTaXHXtIskDzaEXxt9d2I0ncpNKStoaainikvdyLaOgc3McNPG/dfUkAlwMjAXkgBpdg8Mkmz6d17bdV6huVmhpaumqqAv8Awj90Fwa/cOQCSw7wyGvAJaQ4DCwtr07pHU9wrNSafurbjEaAUsdHRTNzAQ1zQGHg+I4IAaCzB3s8ysrs40RUaUtkT62sqzVygyTwelOkj7R2C5zs/OeTzPLoO8jLp8+1uxUx8iyUfleqfhw/QqVeNS3HU93qNOaQlbTimd2dzve6HspD3wxA8HzfBnfk8Fx1Bfrlq27VGldLVBpoKc9nd7yzj6LnnBD1mI5nkwHPPCs1kslv07a4LXa6ZtNSU7cMjbk+JJJ4lxPEk8SUU+3vfLzab0ratK0r4LbTlr5Tv1FTK7fnqX975JDxcfPh0AWXCnCKFbd+RERECIiCVXdeank0rp6SppIRU3OpkZSW+m/lqmQ4YPIfOPgCrEqHaI/v61/NfX+vZdNufR2/vZPWEYmmHUMH4MeO90RbGe6z2itJP0fp9lE2dtXcJnuqa6rlzmpqH8XvPhngB3ABZh1XVwA9vQue361O7f8AgcH3ZXrPrD1XY6EcV1PbUg5jkjcO9r24+I/UiLd3deGnns8lT2bGsp6h/HcewwvcfIgZ9iyBgc0fg5Xt8HesPj+teedzZWOhuFGx0R78dow+fDI93tXSylqKMB1tqGzQfyEzy4Y/JfxI8jkeSD0vrRTcKthib/KDiz2nu9vvUzUlHcWNkexkuOLJGn1m/wA1w4j2FdPy1TxndrGyUTs4/Dtw32PGWn3ribZRVP74pJDA93HtqV+7veYHqu9oKDtbT1lOMRVLZ2Dk2cet/SH2gr0xPe9v4SMxuHdkEewryxi405AeYquPqB2bx7Pmn4L2g5GcEeBQUPWLDqHXumdO/OpaPfvdazud2ZDIAfORxOPyFdlTNG7t51bqvUgy6I1EdppXHiDHTj1y09DK94/NV0wicvUQilEVRhThEQEREBERAREQEREBERAREQEREBEQkDmcIPLdBObZV+jBxn7CTsw3mXbpxj24WrbBsov12s1DRaluz7VbYKeOIWq1u3ZHAAZEs545PHIbw481tSsuFLb4TPV1ENNEOck0gY33nCpNw22aOp5zS0FfUXuqzjsLRTPqXE+bRu/FS14888ZZh7WfTmlLHpCh9Csdtp6GE8Xdm31pD1c48XHzKypkGcDiVrr77dod9P8AgTQ8Nqgd82pv1WGO8+yjy72EodCayvgH3ya/q4Yz86lsUDaVnl2hy8orcfeVXS8aitVgh7a7XOit8eM71TM2PPkCclUybbVYaqV1Ppy33rU9R3C20bjGT4yOw3HivdZ9kOi7NN6QLJHX1ffU3F7qqQnrl+QD5BW+JjIImxRMEcbRgMYA1oHgBwQ+mfuoIuW1PUGRR2SyaXp3cRLcJzVTgEfybMNB80OyuvvT9/Vmt77d2HnS0rhRU58N2PiR7VsDeCneCbOu+uyu2LZ1pLTR37Vp63wS5yZnRdpKT1335PxVjPHnxwoyOqZHVQrbb5SqZtV1jX6L05BVWuGCStrKyOjidOCY4y7PrEDnyVzWF1hpK361sU1nuIkbG8h8csZw+GRvzXtPUfFE4633fPdwj1o+6VV09Otdxqqsh0r5YezIwAA1uOTe4BeSTV11tbSL3YZoWcR6RTO32D/781YrtZtX6ImdT3i01V6oxgRXO2xF++O4PZza5cKaDV17cILRoy6tMnAT3BgghaD3uzxI8Fdpq3zJWT2Ji2aj1zUXmlry99voDG2nMRGe0dguyemMY8VZ/uh6B0mi6O6szvWu5QTuIP0XHcP6QrXs90PTaFsTaNpimrp3drW1TGBvbSHp0aOQH61kdWaei1Zpq5WOd24yugdCH4zuOPzXewgFV33R1SZzXhpV0jGsdIXNbGBvFxOAB1yqVqDVjro/5PsUDq0cWTTBhMYBGMZ+1dll01Jd6Ax3i519R6NPJTy0olxEXRu3emccFlL1P6BSw2Gx0zTcrgfR6Smgbggu4FxA5AceP6lYxxky15rdmx6qhq9mWnnQOe5sdKITvNwQ5ji0j3jmrlhYfR2m4dI6YttjpzvNo4Gsc767+bne1xJWZwqKZXdtgmFKIqIiICIiAhRQUBQUUICIiAoUoghFOFCAiIgghFBeBy4qPWd5IJLgFxyXclyDAOfFckHEM6rlhEQMIOHLh5IiCs6g2d2C/wA3pvozrddW8Y7nbj2FTG7rvN+d5OyFXLxfdf6ftkmn56V1zra6RlHbdQUsbQxrnnG9URc2OYMuyMtOByWysJyTa8z/AD3YzTenqLS1lpbRQNd2NO3Be85fK88XSOPe5xySfFZNERS3YiIgIiICkBMLzXK5Udnt9Rca+ojpqSmjMssrzgMaBxKDAa/vVbQ22C02V7W3y9S+hUJP8VkZkmPhGzLvPdHes1YrBRaY09SWa305fTUkQiaw43pOrjngXE5J6klV3R9vrdQ3uXW13ppaXtIfRrTRTDD6amJy6R47pJCASPotDR1V3RfLt2VyOk05U1Xo76JlHVvJIikYYHuPVuCA7zaSsky0Oh4QXKvjaM4a6QSAf0wT8VAlo716RRz0zKlkUpY8Oj3mAgAjieGcHuXSzT1vbxoZ6qjcHcDT1DgARzG4SWnyIRG3Y2e60BIqYmV8I/jadu7IPNhOD5tPsXbEaG4lzqaUslHzjGSx7T+U0/aF1GO+UrR2c1FXAfRlYYXn84bwz+aF0z3C3zhhutLNQytOA+ZpAYfCVvDHtCD29pWU3CWL0qP68WA72tPA+w+xeZtPa5p/wQdR1Lvqb0D3ezhvfFd8ME7Y2yUlf28RGWiYB4I8HDB9pyux8hewx1tKNzvLfwjP0ZHuRDlHT1ER/hbpG9JGNJ94wsHtGvlVYNI1tRb3Btxm3KSiBGSZ5XBjMDvILs+xZ+miijbmF7iw8hvlwHlnkqdev+Me0a02tvrUlgiN1qh3Gd4dHTt8wO1f7AicfKwacsNLpix0VnowexpIhGHO+c93Nzz1LnEknqVkkRFbdiIiAiIgIiICIiAiIgIiICJzVfv20DSmmQ75X1BbaV7eBidMHSeW43LvgiZLfCwItcfuxm8+ppDSGoL+ScCd0PotN59pJ3exQYtrWovx1bYNJ07u6nYa2pHhk4YCp0t0X32bGe9sbC97msYOJc44A9qqV82t6KsEvYVN/pZ6nIApqPNRKT03WZWFZsXtlwIk1Vfb/qaTmW1lW5kPsjZgfFW2x6TsGmoxHZrNb7eB3wQNa4+bufxQ1jP3VQbTNTX4f8Vdn91micPVq7vI2ih7+ODlxC4nTu02/nN21fb7DA7nT2Wl35AOnayd/iFsI8Tk8SibOvXiKJSbFNJCcVV3jr9Q1Wc9td6t8/H+bwb8Fc6C3UNpgEFuo6aiiHJlPE2NvuaAvSihFyt80RFKKiIiAowOinCYQRujom4FywiDjuBNzxXLCnCDgGuHJxCbr8/OyuzClB14kTMg7l2Ig0frDZxq626muFXpOgpq6gu8npBZLK2P0Oc/PJB5tPPh/wDm2bNdlsGjJJLxdZhc9RVLSJasj1IQfoRA8h3E9/LgFsRFO17ndacO2HQqe2b4rlgdE3W9AoUce1b1U9o3qnZt6KOyb0Qct5p7wpyOq6+xb1KdiOpQdiLq7I9zk7N4+l8UHaSoXXiTqmZAg54RcN547vgo7R31UHNFw7XqFPaDoUHJFx7Rvip329UEoSBzXAydFAbvcSUEmQcgo3XO5rmGgclKDiGAKcKUQQilEEKcIiBhOSIgIiICIiApUKcIIUqUQFWtY2WpvMtrzS+n22lnNTVUIlDDUOaAYuB4ODXetukgEgc8YVlREy6u2Ch1/YhUMpLhPLaKp/BsNyiNOXH8lzvUd+a4qwteyWMOa4OY4ZBByCPNeaopYK2B9PUwxTwvGHRSsDmuHQg8Cq07ZvaKWR01iqblp6UnePyZUlkRPjC7ejP9FE9qtbaZsLZBBiMvHTIBAwOHuXittsFDLVVEpfLPLIXGV53nFuBgDHIcOQCrvZbQrN+JrLLqOAcd2qY6iqCOm8zeYT+a1DtJda8DUmmL7Zh9KobAKumb/wDyQlxA82hE9N9M/ZamrLKqKuw30aVzGuf858fzmuJ5fNIHmDlYPTm0+y6mmbTUxzUzVDo4adrw57osEtmdnADXNBeBknd8cgZiy6v07qVv+Cbzb64ngY4pml48C3mPaFhq7Z/Z6GrZeKK3ntaDt62npacAb9S5mA7d4NJDWhrQeAypJrvtk4mWGd8b6GtbRy1Mz4oxTTdn2sjN7eAZ81xwxx5chlZKGK4U5w6ojq2Z+mzs3j2t4H3BaBqY67Sdts1xrny26okBhp8QsonRSB8ZlcWnDnB0TXN3+Jy49Qt7aVonUGnqGGSV8shiEkj3Zy57yXuODgji48MDHJKnPHU8spyGTw6qlbN2/KFNd9TO9Z18uEs8Tv8AR4/wUPs3Wb35y920a8S27Tc1HQvHyrdT6BQRj5zpZPV3h4MaXPJ7g1Zi02ynstro7ZSN3aejhZBGPyWtAH6FCvjF60REVEREBERAREQEREBY68ais+n4DPd7pRUEYGc1EzWfAnJVJGgtaXvjqbaFWRxHg6kscDaVmOnaHLivZZ9jWh7PKKj5Ejr6oHJqLi91TIT+eSPgpX1jPNeeo222Cpe6DTVvvWp5xwAtlG4x58ZHYb+ldT7ttY1CP3hY7HpendykuM5qZwP5jPVB8CtgRRRwRNihYyONowGMAa0DyHBc0OqTxGu37Ka++He1bri/3Zp4upaVwo6fPTdZxI9qzth2aaO0y4SWvTtvhlH8c+PtZf6b8lWdR3KNoueV9ncB3DkOiIUKKiImEEKcIpQRhSmFOEEYTC5YRBGFOEU4QRhMKcKUEYTClEBERAREQEREBEClAREQEREBERAREQQilQgIi4OkA8UHJcXFg54XHee/lyUti6oOBO9wDVyEfVdgAHIJhBwMbfFOyHUrkiDh2finZkd65og4br+vxTEgXNEHDL+ib7ui5og4doeidp4LmmB0Qce0HQp2jVy3Qe4KNxvRA329U3h1CdmOijsh1KDlkHvCnC4diOqjsj1QdildXZu+t8U3ZB3/ABQdqLq/CBN547vgg7UXV2rhzap7bq1B2BSuvth0Kds3oUHYi4dq3qp7RvVBhb3ofTOo3dpdbHQVU3MTmINlaeokbhwPkViP3PKy2u3tO6xv9sA5QVEoroAOm7MC4exyuW+3qEyOoRaZWKRPFrindB8p2jT2p46aQSxSQSuo5mvHJ25JvMJ/OHHyWSpdpFnbMykvUdVp+uLg30e5R7gJPAbsozG4E94d7lZlwngiqoXwTxMmhkBa+ORoc1wPcQeBCHVL5ipaZYzU2p7rqmUiWClkfa7X3tZGw4mkb3ZfIC3P1YwrgumioqW3UsVJRU8NNTQt3I4YWBrGDoAOAXciLdiIiIEREBERAREQERcDKAcYyg4oiICIiAoUogjuRSiAiYUoIwpU4RAwiIgIilAwpUZTKCUUZRBKIiAiIgIiICAKcIgIiICIiAiIgIiICKCQOZXW6b6oQdp4c11ulA5cVxDXv4n4rm2Jo8Sg4evJ5Lk2IDnxXYo5ICIiAiIgKMKUQRhMKUQQoUqUHFSpRBGEwpRBHFFKICIiAiIgIiYQEClEBMIiCN1vQKOzb9ULkiDh2Teidi3xXNEHX2I6lR2P5S7UQdPYu6hOzkHI/FdyIOnEo6pvSjuPuXciDp7R45j4J2zugXciDq7f8lSJh0K57oPcFG436oQR2zfFO1b1U9k3oo7JvigntG9VO+36wXDsR1K4CPePA8OqDsLt87rTgd5XIANGAuvsT1CjsneCCUREBETCAiYUoIwpwmFKCMKURAREQEREBERAREQFKhSgKURARFOEEYUoiAiIgIiICIiAi4uka3mV1mRzuDR7kHa5wbzK63Sk8GhGxE8XFdjWhvIIOoRudxccLsaxreQXJEBERAREQQmVKIIRSo5oCIiAiIgIiICIiAiIgIiICJhSghMKUQEREBERAREQEREBERAREQEREBERAREQEREBEJxxK6+Mp6N/SgZMhwODf0rsAAGAgGOARAREQde6pwERAKhEQThMIiAiIgIiICIiAiIgIiICIiCcKURATCIglERAREQEREBERBxe/cHJdRkc7wCIg5tiHMlcwABgDCIglERAREQEREBERAREQEREBERAUd6IgnCgoiApREDCgIiCUREBERAREQEREEd6lEQEREBERAREQEREBERAREQEREBERB1/jXdGjuXZyREBERAREQf/2Q==",
};

const ENDINGS = {
  good:   { title: "《天使偶像修炼册》", color: "#e879a8", emoji: "✨", text: ["被罚下凡的天堂打工人，意外在人间找到了认真的意义。","天堂人事部发来召回通知，小悠把邮件移进了垃圾桶。","人间从此多了一个第一偶像。"] },
  lazy:   { title: "《床是最小单位的天堂》", color: "#a78bfa", emoji: "😴", text: ["没有人知道为什么，小悠因为摆烂而出圈，摆烂成为了全球主流风格。","大家都不想工作，各国政府相继宣布「摆烂假」，联合国发表声明表示无能为力。","地球正式进入大摆烂时代，始作俑者正在家里睡午觉。"] },
  effort: { title: "《优秀员工奖》", color: "#60a5fa", emoji: "💼", text: ["小悠很努力，但是还是被开除了。","被开除前，小悠发了人生最后一条推：「求收留」","评论区炸了，涨了五十万粉。","可惜已经没有用了。"] },
  fired:  { title: "《求收留》", color: "#f87171", emoji: "🔥", text: ["小悠被开除了。","被开除前，小悠发了人生最后一条推：「求收留」","评论区炸了，涨了五万粉。","可惜已经没有用了。"] },
  hidden: { title: "《在哪里摔倒，就在哪里躺下。》", color: "#fbbf24", emoji: "☁️", text: ["天堂，某办公室角落。","小悠趴在桌上睡着了。","梦里她下凡当了十天偶像——","发帖、直播、签售会、黑粉私信。","闹钟响了。","「小悠，别偷懒了！快干活！」","她睁开眼，窗外还是天堂的云。","「……果然在哪里都是打工的命呀。」"] },
};

const ACHIEVEMENTS = {
  good:   { key: "good",   title: "难道她真的是天才？",                           emoji: "✨", color: "#e879a8", hint: "达成好结局（粉丝≥200万且偷懒<6）" },
  lazy:   { key: "lazy",   title: "我最大的能耐就是躺着不动。",                   emoji: "😴", color: "#a78bfa", hint: "达成摆烂结局（粉丝≥200万且偷懒≥6）" },
  effort: { key: "effort", title: "我已力竭，我已沉默，我已投降，我已绝望。",     emoji: "💼", color: "#60a5fa", hint: "达成努力结局（粉丝<200万且偷懒<6）" },
  fired:  { key: "fired",  title: "希望大家都能走出舒适圈，让我进去。",           emoji: "🔥", color: "#f87171", hint: "达成炒鱿鱼结局（粉丝<200万且偷懒≥6）" },
  hidden: { key: "hidden", title: "在哪里摔倒，就在哪里躺下。",                   emoji: "☁️", color: "#fbbf24", hint: "???" },
};

function getEnding(fans, lazy, allSleepDays, unlockedAchievements) {
  // 隐藏结局：全10天都选睡觉 且已解锁4个普通成就
  const hasAll4 = ["good","lazy","effort","fired"].every(k => unlockedAchievements.includes(k));
  if (allSleepDays && hasAll4) return "hidden";
  if (fans >= 200 && lazy < 6) return "good";
  if (fans >= 200 && lazy >= 6) return "lazy";
  if (fans < 200 && lazy < 6) return "effort";
  return "fired";
}

const EMPTY_SAVE = { used: false, day: 1, fans: 120, lazy: 3, actionPointsLeft: 3, eventDone: false, eventChoice: null, endingKey: null, dms: null, news: null, eventOrder: null };
function initSaves() { return [0,1,2].map(id => ({ ...EMPTY_SAVE, id })); }

// 根据天数生成每日私信（每天多条，不同角色）
function generateDailyDms(day) {
  const dmsByDay = {
    1: [
      { from: "一百",     role: "mama",      msg: "悠酱今天排练辛苦啦，有没有好好吃晚饭呀？肚子空空的话会没有力气的哦🥺", time: "10:23" },
      { from: "桜子碳🌸",     role: "career",    msg: "悠酱！新歌的打歌应援服大家都买好啦！到时候一定会给你全场最闪耀的排面~", time: "11:45" },
      { from: "七海小天使✨",  role: "dream",     msg: "看了直播回放，悠酱的wink直接把我击沉了！(*/ω＼*) 永远应援！", time: "12:10" },
    ],
    2: [
      { from: "柚子女仆🍊",   role: "colleague", msg: "悠悠！今天排练完要一起去吃草莓大福吗？南南也去哦！", time: "14:30" },
      { from: "一百",     role: "mama",      msg: "悠酱！今天看到你舞台直拍，表情管理太绝了！我循环了一整天😭", time: "09:15" },
      { from: "琴音sama🎹",   role: "staff",     msg: "小悠，明天上午10点有个杂志拍摄，记得早点休息！造型师8:30到位", time: "15:11" },
    ],
    3: [
      { from: "桜子碳🌸",     role: "career",    msg: "投票通道开了！我已经发动全家给你投票啦！冲呀！", time: "12:30" },
      { from: "弈白",   role: "mama",      msg: "宝贝今天直播声音有点哑，记得喝蜂蜜水啊，好心疼🥺", time: "21:00" },
      { from: "数据组_小薰",   role: "career",    msg: "悠酱！melon实时排名又升了！数据组全体爆肝中！", time: "11:05" },
      { from: "陌生号码",      role: "hater",     msg: "你知道大家私下怎么说你吗？营业机器，笑容全是假的。趁早退圈吧。", time: "23:40" },
    ],
    4: [
      { from: "七海小天使✨",  role: "dream",     msg: "昨晚梦到和你一起唱KTV了，你唱了我的本命曲……醒来哭了好久", time: "08:45" },
      { from: "画师_白夜",     role: "dream",     msg: "画了你的新同人图！今天发出来了，去看看嘛～", time: "19:30" },
      { from: "一百",     role: "mama",      msg: "冷空气要来啦！小悠一定要穿暖呼呼的才可以哦，不许着凉！", time: "17:00" },
    ],
    5: [
      { from: "柚子女仆🍊",   role: "colleague", msg: "悠悠，今天排练结束一起去吃拉面吗？我请客！", time: "17:20" },
      { from: "桜子碳🌸",     role: "career",    msg: "数据又破新高了！同好们都在加油，悠酱也加油！", time: "13:10" },
      { from: "七海小天使✨",  role: "dream",     msg: "看到新杂志封面的预告图了，悠酱好美啊，我要买十本！", time: "20:00" },
    ],
    6: [
      { from: "琴音sama🎹",   role: "staff",     msg: "小悠，下个月杂志封面确定是你了！恭喜！", time: "14:10" },
      { from: "一百",     role: "mama",      msg: "今天和应援团的姐妹们一起做了悠酱的周年应援小册子，超好看的～", time: "19:45" },
      { from: "数据组_小薰",   role: "career",    msg: "联动帖子数据爆炸了！好多路人转发，新粉一直在涌入！", time: "22:00" },
      { from: "匿名_000",      role: "hater",     msg: "联动不过是互相蹭热度。说真的，你以为新人真的尊重你吗？别太天真了。", time: "23:15" },
    ],
    7: [
      { from: "弈白",   role: "mama",      msg: "那个舆论的事不要放心上，我们都知道真相，宝贝你辛苦了", time: "10:30" },
      { from: "桜子碳🌸",     role: "career",    msg: "声明发出来之后路人好评很多，大家都在力挺你！", time: "15:55" },
      { from: "柚子女仆🍊",   role: "colleague", msg: "悠悠不用担心，队友们都在，有事说一声！", time: "18:20" },
    ],
    8: [
      { from: "数据组_小薰",   role: "career",    msg: "悠酱！melon实时排名又升了！数据组全体爆肝中！今晚冲前三！", time: "11:05" },
      { from: "七海小天使✨",  role: "dream",     msg: "新曲录音花絮太好看了！悠酱认真的侧脸，救命啊", time: "20:15" },
      { from: "一百",     role: "mama",      msg: "周末录音辛苦啦！明天记得补觉，不许熬夜哦！我命令！", time: "23:00" },
      { from: "陌生号码",      role: "hater",     msg: "周末加班录音？公司把你当工具使呢。这行就是这样，迟早被丢弃，看开点。", time: "01:20" },
    ],
    9: [
      { from: "画师_白夜",     role: "dream",     msg: "画了你的同人图！希望你能看到！明天就是最后一天了，加油啊！", time: "19:30" },
      { from: "桜子碳🌸",     role: "career",    msg: "最后一天了！打投组通宵待机，悠酱你只管发光就好，其他交给我们！", time: "22:30" },
      { from: "弈白",   role: "mama",      msg: "不管结果怎样，你都是我心里最好的宝贝，好好休息哦", time: "23:55" },
    ],
    10: [
      { from: "经理",          role: "manager",   msg: "最后一天了，无论结果如何，我都为你骄傲。", time: "07:50" },
      { from: "一百",     role: "mama",      msg: "今天陪你到最后！无论什么结果，我们都在！爱你悠酱💖", time: "08:30" },
      { from: "桜子碳🌸",     role: "career",    msg: "全员集合！最后一天总冲！悠酱加油！！！", time: "09:00" },
      { from: "七海小天使✨",  role: "dream",     msg: "认识你了解你的这段时间是我最快乐的时光，谢谢你清寺小悠", time: "23:00" },
    ],
  };
  return (dmsByDay[day] || []).map((dm, i) => ({ id: Date.now() + i + Math.random(), ...dm, read: false }));
}

// 根据每日事件生成新闻
// generateNewsForDay removed – replaced by NEWS_POOL random draw

// ═══════════════════════════════════════════════════════════════
//  SHARED COMPONENTS
// ═══════════════════════════════════════════════════════════════
function Avatar({ src, size = 40, fallback = "👼", C }) {
  return src ? (
    <img src={src} referrerPolicy="no-referrer" style={{ width: size, height: size, borderRadius: "50%", objectFit: "cover", flexShrink: 0, border: `${Math.max(1,size*0.04)}px solid rgba(255,183,213,0.6)`, boxShadow: `0 0 ${size*0.35}px rgba(232,121,168,0.4)` }} alt="avatar" />
  ) : (
    <div style={{ width: size, height: size, borderRadius: "50%", flexShrink: 0, background: `linear-gradient(135deg,${C.pink},${C.pinkDeep} 40%,${C.lav})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: size*0.44, boxShadow: `0 0 ${size*0.35}px rgba(232,121,168,0.45)`, border: `${Math.max(1,size*0.04)}px solid rgba(255,183,213,0.55)` }}>{fallback}</div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  GALLERY PICKER（相册选图弹窗）— 必须在所有用到它的组件之前定义
// ═══════════════════════════════════════════════════════════════
function GalleryPicker({ onSelect, onClose, C }) {
  return (
    <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.92)", zIndex:200, display:"flex", flexDirection:"column", overflow:"hidden" }}>
      <div style={{ padding:"12px 16px", display:"flex", alignItems:"center", justifyContent:"space-between", borderBottom:`1px solid ${C.border}`, flexShrink:0 }}>
        <span style={{ color:C.text, fontWeight:800, fontSize:15 }}>🖼 小悠相册</span>
        <button onClick={onClose} style={{ background:"none", border:"none", color:C.pink, fontSize:22, cursor:"pointer", lineHeight:1 }}>✕</button>
      </div>
      <div style={{ color:C.muted, fontSize:11, textAlign:"center", padding:"8px 0 4px" }}>点击图片即可选用</div>
      <div style={{ flex:1, overflowY:"auto", padding:12 }}>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8 }}>
          {YUYU_GALLERY.map(item => (
            <div key={item.id} onClick={() => onSelect(item.src)}
              style={{ aspectRatio:"1/1", borderRadius:12, overflow:"hidden", cursor:"pointer", border:"2px solid transparent", transition:"border 0.15s" }}
              onMouseEnter={e => e.currentTarget.style.border=`2px solid ${C.pinkDeep}`}
              onMouseLeave={e => e.currentTarget.style.border="2px solid transparent"}
            >
              <img src={item.src} referrerPolicy="no-referrer" alt={item.label} style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CommentRow({ c, C }) {
  const ft = FT[c.type] || FT.casual;
  const isReply = c.type === "fighter" && c.replyTo;
  return (
    <div style={{ padding: isReply ? "4px 12px 8px 44px" : "8px 12px", display: "flex", gap: 8, alignItems: "flex-start" }}>
      {isReply && <div style={{ width:2, background:"#f8717155", borderRadius:2, alignSelf:"stretch", marginRight:4, flexShrink:0 }} />}
      <div style={{ width: 26, height: 26, borderRadius: "50%", flexShrink: 0, background: `${ft.color}22`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, border: `1px solid ${ft.color}35` }}>{ft.e}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", gap: 5, alignItems: "center", flexWrap: "wrap", marginBottom: 2 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: c.type==="hater"?"#9ca3af":c.type==="fighter"?"#f87171":ft.color }}>{c.u}</span>
          <span style={{ fontSize: 8, padding: "1px 5px", borderRadius: 99, background: `${ft.color}18`, color: ft.color, fontWeight: 600 }}>{ft.label}</span>
          {isReply && <span style={{ fontSize: 9, color: "#f87171", fontWeight:600 }}></span>}
        </div>
        <p style={{ fontSize: 12, color: c.type==="hater"?"rgba(150,80,80,0.55)":C.text, lineHeight: 1.55, margin: 0, wordBreak: "break-all" }}>{c.t}</p>
        <span style={{ fontSize: 10, color: C.muted, marginTop: 3, display: "block" }}>♡ {c.likes.toLocaleString()}</span>
      </div>
    </div>
  );
}

function GameStatusBar({ fans, lazy, day, actionPoints, C }) {
  return (
    <div style={{ margin: "0 0 10px", background: C.bgCard, borderRadius: 14, padding: "10px 14px", border: `1px solid ${C.borderB}` }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        <span style={{ color: C.pink, fontWeight: 800, fontSize: 12 }}>📅 Day {day} / 10</span>
        <span style={{ color: C.dim, fontSize: 10 }}>目标：200万粉丝</span>
      </div>
      <div style={{ display: "flex", gap: 10, marginBottom: 8 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
            <span style={{ color: C.muted, fontSize: 10 }}>✨ 粉丝数</span>
            <span style={{ color: fans>=200?"#10b981":C.text, fontSize: 11, fontWeight: 800 }}>{fans}万 {fans>=200?"✅":""}</span>
          </div>
          <div style={{ height: 5, background: `${C.pink}20`, borderRadius: 99, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${Math.min(100, fans/2)}%`, background: `linear-gradient(90deg,${C.pinkDeep},${C.lav})`, borderRadius: 99, transition: "width 0.4s" }} />
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
            <span style={{ color: C.muted, fontSize: 10 }}>😴 偷懒值</span>
            <span style={{ color: lazy>=6?"#f87171":C.text, fontSize: 11, fontWeight: 800 }}>{lazy} / 10</span>
          </div>
          <div style={{ height: 5, background: `${C.pink}20`, borderRadius: 99, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${lazy*10}%`, background: lazy>=6?"linear-gradient(90deg,#f87171,#fb923c)":"linear-gradient(90deg,#a78bfa,#60a5fa)", borderRadius: 99, transition: "width 0.4s" }} />
          </div>
        </div>
      </div>
      <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
        <span style={{ color: C.muted, fontSize: 10 }}>今日行动点：</span>
        {[...Array(3)].map((_,i) => (
          <div key={i} style={{ width: 14, height: 14, borderRadius: "50%", background: i<actionPoints?C.pinkDeep:`${C.pink}20`, border: `1px solid ${C.border}`, transition: "all 0.2s" }} />
        ))}
        <span style={{ color: actionPoints===0?"#f87171":C.text, fontSize: 10, fontWeight: 700, marginLeft: 2 }}>{actionPoints===0?"已用完":`剩余 ${actionPoints} 点`}</span>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  SAVE SELECT SCREEN (with reset)
// ═══════════════════════════════════════════════════════════════
function SaveSelectScreen({ saves, onSelect, onReset, C, themeMode, toggleTheme, unlockedAchievements }) {
  const [showAchievements, setShowAchievements] = useState(false);
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: C.bgGradient, padding: "24px 20px", alignItems: "center", justifyContent: "center", gap: 14, overflowY: "auto" }}>
      <div style={{ textAlign: "center", marginBottom: 4 }}>
        <div style={{ fontSize: 40 }}>👼</div>
        <div style={{ color: C.pink, fontWeight: 800, fontSize: 18, marginTop: 6 }}>清寺小悠</div>
        <div style={{ color: C.muted, fontSize: 11 }}>天使偶像模拟器</div>
      </div>
      <div style={{ color: C.text, fontWeight: 800, fontSize: 14, alignSelf: "flex-start" }}>✦ 选择存档</div>
      {saves.map((s, i) => (
        <div key={i} style={{ width: "100%" }}>
          <div onClick={() => onSelect(i)} style={{ background: C.bgCard, border: `2px solid ${s.used?C.borderB:C.border}`, borderRadius: 16, padding: "14px 16px", cursor: "pointer" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ color: C.pink, fontWeight: 800, fontSize: 14 }}>存档 {i+1}</span>
              <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                {s.endingKey && <span style={{ fontSize: 10, background: `${C.pinkDeep}22`, color: C.pinkDeep, padding: "2px 8px", borderRadius: 99 }}>已通关</span>}
                {s.used && (
                  <span onClick={(e) => { e.stopPropagation(); onReset(i); }} style={{ fontSize: 9, background: "rgba(239,68,68,0.15)", color: "#f87171", padding: "2px 8px", borderRadius: 99, cursor: "pointer", border: "1px solid rgba(239,68,68,0.3)" }}>重置</span>
                )}
              </div>
            </div>
            {s.used ? (
              <div style={{ marginTop: 8 }}>
                <div style={{ color: C.text, fontSize: 12 }}>{s.endingKey ? "通关" : `Day ${s.day} / 10`}</div>
                <div style={{ display: "flex", gap: 12, marginTop: 4 }}>
                  <span style={{ color: C.muted, fontSize: 11 }}>粉丝 {s.fans}万</span>
                  <span style={{ color: C.muted, fontSize: 11 }}>偷懒值 {s.lazy}/10</span>
                </div>
                {s.endingKey && <div style={{ color: C.pinkDeep, fontSize: 11, marginTop: 4 }}>{ENDINGS[s.endingKey]?.title}</div>}
              </div>
            ) : (
              <div style={{ color: C.dim, fontSize: 12, marginTop: 6 }}>— 空存档，点击开始新游戏 —</div>
            )}
          </div>
        </div>
      ))}

      {/* 成就入口 */}
      <button onClick={() => setShowAchievements(v => !v)} style={{ width:"100%", padding:"10px 0", background:C.bgCard, border:`1px solid ${C.borderB}`, borderRadius:14, color:C.pink, fontSize:13, fontWeight:800, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
        🏆 成就 <span style={{ fontSize:11, color:C.muted }}>({unlockedAchievements.length}/5)</span>
        <span style={{ fontSize:11, color:C.muted }}>{showAchievements ? "▲" : "▼"}</span>
      </button>

      {showAchievements && (
        <div style={{ width:"100%", background:C.bgCard, border:`1px solid ${C.border}`, borderRadius:14, padding:14, display:"flex", flexDirection:"column", gap:10 }}>
          {Object.values(ACHIEVEMENTS).map(ach => {
            const unlocked = unlockedAchievements.includes(ach.key);
            const isHidden = ach.key === "hidden";
            const showHidden = isHidden && unlocked;
            const showLocked = isHidden && !unlocked;
            return (
              <div key={ach.key} style={{ display:"flex", alignItems:"center", gap:10, opacity: unlocked ? 1 : 0.45 }}>
                <div style={{ width:36, height:36, borderRadius:10, background: unlocked ? `${ach.color}20` : "rgba(100,100,100,0.1)", border:`1px solid ${unlocked?ach.color+"40":"#ffffff15"}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>
                  {unlocked ? ach.emoji : "🔒"}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ color: unlocked ? ach.color : C.dim, fontWeight:700, fontSize:11, lineHeight:1.4 }}>
                    {showLocked ? "???" : ach.title}
                  </div>
                  <div style={{ color:C.dim, fontSize:10, marginTop:1 }}>
                    {showLocked ? "解锁所有普通成就后尝试特殊方式通关" : showHidden ? ach.hint : unlocked ? ach.hint : ach.hint}
                  </div>
                </div>
                {unlocked && <span style={{ fontSize:9, color:ach.color, fontWeight:800, flexShrink:0 }}>已解锁</span>}
              </div>
            );
          })}
        </div>
      )}

      <button onClick={toggleTheme} style={{ marginTop: 4, padding: "6px 20px", borderRadius: 99, background: C.bgCard, border: `1px solid ${C.borderB}`, color: C.pink, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
        {themeMode==="purple"?"🌸 切换白天模式":"🌙 切换夜间模式"}
      </button>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  COPYRIGHT MODAL
// ═══════════════════════════════════════════════════════════════
function CopyrightModal({ onConfirm, C }) {
  const [step, setStep] = useState(1); // 1=版权声明, 2=画师感谢
  if (step === 1) return (
    <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.9)", zIndex: 250, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ background: C.bgGradient, border: `2px solid ${C.pinkDeep}`, borderRadius: 20, padding: 24, maxWidth: 320, width: "100%", textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 8 }}>⚠️</div>
        <div style={{ color: C.pink, fontWeight: 800, fontSize: 16, marginBottom: 12 }}>版权声明</div>
        <div style={{ color: C.text, fontSize: 13, lineHeight: 1.6, marginBottom: 20 }}>
          本游戏仅作为 OC（清寺小悠）创作分享，<br />
          所有美术、音乐、文案均属非商用同人作品。<br />
          <strong style={{ color: C.pinkDeep }}>禁止任何形式的盈利行为</strong>，包括但不限于售卖、众筹、付费下载等。
        </div>
        <button onClick={() => setStep(2)} style={{ background: `linear-gradient(135deg,${C.pinkDeep},${C.lav})`, border: "none", borderRadius: 99, padding: "10px 20px", color: "#fff", fontWeight: 800, fontSize: 14, cursor: "pointer", width: "100%" }}>
          我已知晓 →
        </button>
      </div>
    </div>
  );
  return (
    <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.9)", zIndex: 250, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ background: C.bgGradient, border: `2px solid ${C.borderB}`, borderRadius: 20, padding: 24, maxWidth: 320, width: "100%", textAlign: "center" }}>
        <div style={{ fontSize: 36, marginBottom: 8 }}>🎨</div>
        <div style={{ color: C.pink, fontWeight: 800, fontSize: 16, marginBottom: 4 }}>【感谢画师授权】</div>
        <div style={{ color: C.text, fontSize: 12, lineHeight: 1.7, marginBottom: 16 }}>
          本作品为非营利OC同人创作，仅供交流分享。<br />
          特别感谢以下画师提供精美插图<br />
          <span style={{ color: C.muted, fontSize: 11 }}>（排名不分先后）</span>
        </div>
        <div style={{ background: C.bgCard, borderRadius: 12, padding: "12px 16px", marginBottom: 16, border: `1px solid ${C.border}` }}>
          {["@UuYy","@某齐音","@kiromichii","@小玄","@弈白"].map(name => (
            <div key={name} style={{ color: C.pinkDeep, fontWeight: 700, fontSize: 13, padding: "3px 0" }}>{name}</div>
          ))}
        </div>
        <div style={{ color: C.muted, fontSize: 11, lineHeight: 1.6, marginBottom: 16 }}>
          作品著作权归原作者所有，<br />未经允许请勿将图片用于其他用途。
        </div>
        <button onClick={onConfirm} style={{ background: `linear-gradient(135deg,${C.pinkDeep},${C.lav})`, border: "none", borderRadius: 99, padding: "10px 20px", color: "#fff", fontWeight: 800, fontSize: 14, cursor: "pointer", width: "100%" }}>
          开始游戏 ✨
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  PROLOGUE MODAL
// ═══════════════════════════════════════════════════════════════
function PrologueModal({ onClose, C }) {
  return (
    <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ background: C.bgGradient, border: `2px solid ${C.borderB}`, borderRadius: 20, padding: 24, maxWidth: 340, width: "100%", boxShadow: `0 0 40px ${C.pinkDeep}55` }}>
        <div style={{ textAlign: "center", fontSize: 36, marginBottom: 12 }}>👼✨</div>
        <div style={{ color: C.text, fontSize: 13, lineHeight: 1.8, marginBottom: 16 }}>
          <p style={{ margin: "0 0 8px", fontWeight: 700, color: C.pink, fontSize: 14 }}>「 天堂紧急通报 」</p>
          <p style={{ margin: "0 0 6px" }}>你是清寺小悠——来自天堂的天选打工人。</p>
          <p style={{ margin: "0 0 6px" }}>因为连续旷工三百年，被天堂人事部罚下凡间体验「劳动的意义」。</p>
          <p style={{ margin: "0 0 6px" }}>目前身份：偶像艺人。现有粉丝：<span style={{ color: C.pinkDeep, fontWeight: 800 }}>120万</span>。</p>
          <p style={{ margin: "0 0 6px" }}>公司警告：回不到之前的粉丝量就解约。</p>
          <p style={{ margin: "0 0 6px" }}>目标：<span style={{ color: C.pinkDeep, fontWeight: 800 }}>10天内冲到200万</span>。</p>
          <p style={{ margin: 0, color: C.muted, fontSize: 11 }}>……但是床好软。</p>
        </div>
        <button onClick={onClose} style={{ width: "100%", padding: "12px 0", background: `linear-gradient(135deg,${C.pinkDeep},${C.lav})`, border: "none", borderRadius: 99, color: "#fff", fontWeight: 800, fontSize: 13, cursor: "pointer" }}>点击开启涨粉之旅 ✦</button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  ENDING SCREEN
// ═══════════════════════════════════════════════════════════════
function EndingScreen({ endingKey, onGoSave, fans, lazy, C }) {
  const ending = ENDINGS[endingKey];
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: C.bgGradient, alignItems: "center", justifyContent: "center", padding: 24, gap: 16, overflowY: "auto" }}>
      <div style={{ fontSize: 48 }}>{ending.emoji}</div>
      <div style={{ color: ending.color, fontWeight: 800, fontSize: 18, textAlign: "center" }}>{ending.title}</div>
        <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 16, padding: 16, width: "100%" }}>
        <div style={{ width: "100%", borderRadius: 12, overflow: "hidden", marginBottom: 14 }}>
          {ENDING_IMGS[endingKey] ? (
            <img
              src={ENDING_IMGS[endingKey]}
              alt="结局插图"
              style={{ width: "100%", display: "block", borderRadius: 12 }}
            />
          ) : (
            <div style={{ width:"100%", minHeight:120, background:`${ending.color}11`, border:`1px dashed ${ending.color}40`, borderRadius:12, display:"flex", alignItems:"center", justifyContent:"center", color:`${ending.color}60`, fontSize:12 }}>
              {ending.emoji} 插图待补充
            </div>
          )}
        </div>
        {ending.text.map((line, i) => (
          <p key={i} style={{ color: line.startsWith("「")? C.pinkDeep: C.text, fontSize: 13, lineHeight: 1.8, margin: "0 0 4px", fontWeight: line.startsWith("「")?700:400 }}>{line}</p>
        ))}
      </div>
      <div style={{ display: "flex", gap: 8, color: C.muted, fontSize: 11, justifyContent: "center" }}>
        <span>最终粉丝：{fans}万</span><span>·</span><span>偷懒值：{lazy}/10</span>
      </div>
      <button onClick={onGoSave} style={{ width: "100%", padding: "12px 0", background: `linear-gradient(135deg,${C.pinkDeep},${C.lav})`, border: "none", borderRadius: 99, color: "#fff", fontWeight: 800, fontSize: 13, cursor: "pointer" }}>返回存档选择 ✦</button>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  LOCK SCREEN
// ═══════════════════════════════════════════════════════════════
function LockScreen({ onUnlock, notifications, C }) {
  const [time, setTime] = useState(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
  useEffect(() => {
    const t = setInterval(() => setTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })), 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <div onClick={onUnlock} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", background: C.bgGradient, cursor: "pointer", position: "relative", overflow: "hidden", userSelect: "none" }}>
      {["✦","✧","✦","✧","✦","✧"].map((s,i) => (
        <span key={i} style={{ position: "absolute", color: "rgba(255,183,213,0.25)", fontSize: rnd(8,16), top: `${[10,25,60,75,40,85][i]}%`, left: `${[15,75,20,80,50,35][i]}%`, pointerEvents: "none" }}>{s}</span>
      ))}
      <div style={{ marginTop: 60, textAlign: "center" }}>
        <div style={{ fontSize: 52, fontWeight: 200, color: C.text, letterSpacing: 2 }}>{time}</div>
        <div style={{ color: C.muted, fontSize: 13, marginTop: 4 }}>向上滑动解锁</div>
      </div>
      <div style={{ marginTop: 28, position: "relative" }}>
        <div style={{ width: 90, height: 90, borderRadius: "50%", background: "linear-gradient(135deg,#ffb7d5,#e879a8,#d8b4fe)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 44, boxShadow: "0 0 40px rgba(232,121,168,0.5)", border: "3px solid rgba(255,183,213,0.6)" }}>👼</div>
        <div style={{ position: "absolute", bottom: -4, right: -4, background: "#e879a8", borderRadius: 99, fontSize: 10, padding: "2px 7px", color: "#fff", fontWeight: 700, border: "2px solid #120818" }}>在线✦</div>
      </div>
      <div style={{ marginTop: 12, color: C.text, fontSize: 16, fontWeight: 700 }}>清寺小悠</div>
      <div style={{ color: C.muted, fontSize: 11 }}>天使偶像 💒</div>
      {notifications.length > 0 && (
        <div style={{ marginTop: 24, width: "85%", display: "flex", flexDirection: "column", gap: 8 }}>
          {notifications.slice(0,3).map((n,i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.08)", backdropFilter: "blur(20px)", borderRadius: 14, padding: "10px 14px", border: `1px solid ${C.border}` }}>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <span style={{ fontSize: 16 }}>{n.icon}</span>
                <div>
                  <div style={{ color: C.text, fontSize: 11, fontWeight: 700 }}>{n.app}</div>
                  <div style={{ color: C.muted, fontSize: 11, lineHeight: 1.4 }}>{n.msg}</div>
                </div>
                <span style={{ marginLeft: "auto", color: C.dim, fontSize: 9 }}>{n.time}</span>
              </div>
            </div>
          ))}
        </div>
      )}
      <div style={{ position: "absolute", bottom: 40, color: C.dim, fontSize: 12, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
        <span>↑</span><span>向上滑动解锁</span>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  HOME LAUNCHER
// ═══════════════════════════════════════════════════════════════
function HomeLauncher({ setScreen, notifications, avatarSrc, onAvatarSelect, C, themeMode, toggleTheme, unreadTotal, newsUnread, day, fans, lazy, actionPoints, eventDone, onAction, onEndDay, onGoChat, currentEvent }) {
  const [showAvatarGallery, setShowAvatarGallery] = useState(false);
  const apps = [
    { id: "yuyu",      icon: "💒", label: "小悠主页",  color: "#e879a8", notif: 0,          actionKey: null },
    { id: "post",      icon: "✏️", label: "发帖",      color: "#f472b6", notif: 0,          actionKey: "post" },
    { id: "twitter",   icon: "🐦", label: "Twitter",  color: "#1d9bf0", notif: 0,          actionKey: "twitter" },
    { id: "instagram", icon: "📸", label: "Instagram",color: "#e1306c", notif: 0,          actionKey: "instagram" },
    { id: "live",      icon: "📡", label: "营业直播",  color: "#ff4b7d", notif: 0,          actionKey: "live" },
    { id: "music",     icon: "🎵", label: "天使CD",    color: "#a78bfa", notif: 0,          actionKey: "music" },
    { id: "game",      icon: "🎮", label: "打游戏",    color: "#94a3b8", notif: 0,          actionKey: "game" },
    { id: "sleep",     icon: "💤", label: "睡一会",    color: "#94a3b8", notif: 0,          actionKey: "sleep" },
    { id: "outside",   icon: "🌸", label: "出去玩",    color: "#94a3b8", notif: 0,          actionKey: "outside" },
    { id: "news",      icon: "📰", label: "新闻速递",  color: "#ff6b35", notif: newsUnread,  actionKey: null },
    { id: "messages",  icon: "💌", label: "专属私信",  color: "#34d399", notif: unreadTotal, actionKey: null },
    { id: "signing",   icon: "🎀", label: "签售会",    color: "#fbbf24", notif: 0,          actionKey: "signing" },
    { id: "calendar",  icon: "📅", label: "日程",      color: "#60a5fa", notif: 1,          actionKey: null },
  ];

  const handleAppTap = (app) => {
    if (app.actionKey) {
      onAction(app.actionKey, app.id);
    } else {
      setScreen(app.id);
    }
  };

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: C.bgGradient, padding: "16px 16px 8px", position: "relative", overflow: "hidden" }}>
      {Array.from({length:10}).map((_,i) => (
        <span key={i} style={{ position:"absolute", color:"rgba(255,183,213,0.15)", fontSize:rnd(8,18), top:`${rnd(5,90)}%`, left:`${rnd(5,92)}%`, pointerEvents:"none" }}>{pick(["✦","✧","✾","❋"])}</span>
      ))}

      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12, position:"relative", zIndex:1 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div onClick={() => setShowAvatarGallery(true)} style={{ cursor:"pointer", position:"relative" }}>
            <Avatar src={avatarSrc} size={44} C={C} />
            <div style={{ position:"absolute", bottom:-2, right:-2, background:C.pinkDeep, width:14, height:14, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:9, color:"#fff", border:`1px solid ${C.bg}` }}>+</div>
          </div>
          <div>
            <div style={{ color:C.text, fontWeight:800, fontSize:15, display:"flex", alignItems:"center", gap:4 }}>清寺小悠 <span style={{ fontSize:11 }}>✞</span></div>
            <div style={{ color:C.muted, fontSize:11 }}>粉丝: {fans}万</div>
          </div>
        </div>
        <div style={{ display:"flex", gap:6, alignItems:"center" }}>
          {(notifications.length+unreadTotal)>0 && (
            <div style={{ background:"#ef4444", borderRadius:99, minWidth:18, height:18, display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:800, color:"#fff", padding:"0 5px" }}>{notifications.length+unreadTotal}</div>
          )}
          <button onClick={toggleTheme} style={{ padding:"5px 10px", borderRadius:99, background:C.bgCard, border:`1px solid ${C.borderB}`, color:C.pink, fontSize:11, fontWeight:700, cursor:"pointer" }}>
            {themeMode==="purple"?"🌸":"🌙"}
          </button>
        </div>
      </div>
      {showAvatarGallery && <GalleryPicker onSelect={src => { onAvatarSelect(src); setShowAvatarGallery(false); }} onClose={() => setShowAvatarGallery(false)} C={C} />}

      <GameStatusBar fans={fans} lazy={lazy} day={day} actionPoints={actionPoints} C={C} />

      {!eventDone && currentEvent && (
        <div onClick={onGoChat} style={{ background:C.bgCard, border:`1px solid ${C.pink}`, borderRadius:12, padding:"10px 12px", marginBottom:10, cursor:"pointer", display:"flex", alignItems:"center", gap:10, position:"relative", zIndex:1 }}>
          <div style={{ width:32, height:32, borderRadius:"50%", background:"#10b981", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>💬</div>
          <div style={{ flex:1 }}>
            <div style={{ color:C.text, fontSize:12, fontWeight:700 }}>{currentEvent.sender} 发来消息</div>
            <div style={{ color:C.muted, fontSize:11 }}>今日剧情事件待处理</div>
          </div>
          <span style={{ width:8, height:8, background:"#f87171", borderRadius:"50%" }} />
        </div>
      )}

      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"12px 10px", flex:1, alignContent:"start", position:"relative", zIndex:1 }}>
        {apps.map(app => (
          <div key={app.id} onClick={() => handleAppTap(app)} style={{ display:"flex", flexDirection:"column", alignItems:"center", cursor:"pointer", position:"relative" }}>
            <div style={{ width:52, height:52, borderRadius:14, background:C.bgCard, border:`1px solid ${C.border}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, boxShadow:"0 4px 12px rgba(0,0,0,0.1)" }}>
              {app.icon}
            </div>
            <span style={{ color:C.text, fontSize:10, marginTop:5, fontWeight:600, textAlign:"center" }}>{app.label}</span>
            {app.notif>0 && <div style={{ position:"absolute", top:-4, right:2, background:"#ef4444", color:"#fff", fontSize:9, fontWeight:700, borderRadius:99, padding:"1px 5px", border:`1px solid ${C.bg}` }}>{app.notif}</div>}
          </div>
        ))}
      </div>

      {actionPoints===0 && (
        <button onClick={onEndDay} style={{ width:"100%", padding:"11px 0", background:`linear-gradient(135deg,${C.pinkDeep},${C.lav})`, border:"none", borderRadius:14, color:"#fff", fontWeight:800, fontSize:13, cursor:"pointer", marginTop:10, boxShadow:`0 4px 16px ${C.pinkDeep}44`, position:"relative", zIndex:1 }}>
          {day<10?`结束 Day ${day}，迎接明天 →`:"Day 10 结束，查看结局 ✦"}
        </button>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  CHAT SCREEN (daily event – with full conversation and manual return)
// ═══════════════════════════════════════════════════════════════
function ChatScreen({ setScreen, day, eventDone, eventChoice, onEventOption, C, pendingEventOption, setPendingEventOption, currentEvent }) {
  const ev = currentEvent;
  if (!ev) return null;
  const rm = ROLE_META[ev.role] || ROLE_META.manager;

  // If event not done yet, show options
  if (!eventDone) {
    return (
      <div style={{ flex:1, display:"flex", flexDirection:"column", background:C.bgGradient, overflow:"hidden" }}>
        <div style={{ height:44, display:"flex", alignItems:"center", padding:"0 14px", borderBottom:`1px solid ${C.border}`, flexShrink:0 }}>
          <button onClick={() => setScreen("home")} style={{ background:"none", border:"none", color:C.pink, fontSize:16, cursor:"pointer", padding:0 }}>← 返回</button>
          <div style={{ marginLeft:10, display:"flex", alignItems:"center", gap:8 }}>
            <div style={{ width:28, height:28, borderRadius:"50%", background:`${rm.color}22`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, border:`1px solid ${rm.color}44` }}>{rm.e}</div>
            <span style={{ color:C.text, fontWeight:700, fontSize:13 }}>{ev.sender}</span>
          </div>
        </div>
        <div style={{ flex:1, padding:16, display:"flex", flexDirection:"column", gap:14, overflowY:"auto" }}>
          <div style={{ display:"flex", gap:8 }}>
            <div style={{ width:32, height:32, borderRadius:"50%", background:`${rm.color}22`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, flexShrink:0, border:`1px solid ${rm.color}44` }}>{rm.e}</div>
            <div style={{ background:C.bgCard, border:`1px solid ${C.border}`, borderRadius:"0 14px 14px 14px", padding:10, maxWidth:"78%", color:C.text, fontSize:12, lineHeight:1.6 }}>{ev.intro}</div>
          </div>
        </div>
        <div style={{ padding:12, borderTop:`1px solid ${C.border}`, display:"flex", flexDirection:"column", gap:8, background:"rgba(0,0,0,0.05)", flexShrink:0 }}>
          <div style={{ color:C.muted, fontSize:11, textAlign:"center", marginBottom:2 }}>{ev.question}</div>
          {ev.options.map((opt,idx) => (
            <button key={idx} onClick={() => onEventOption(opt, true)} style={{ width:"100%", padding:10, background:C.bgCard, border:`1px solid ${C.pink}`, borderRadius:10, color:C.text, fontSize:12, cursor:"pointer", textAlign:"left" }}>{opt.text}</button>
          ))}
        </div>
      </div>
    );
  }

  // After option chosen, show conversation and then a "Return" button
  return (
    <div style={{ flex:1, display:"flex", flexDirection:"column", background:C.bgGradient, overflow:"hidden" }}>
      <div style={{ height:44, display:"flex", alignItems:"center", padding:"0 14px", borderBottom:`1px solid ${C.border}`, flexShrink:0 }}>
        <button onClick={() => setScreen("home")} style={{ background:"none", border:"none", color:C.pink, fontSize:16, cursor:"pointer", padding:0 }}>← 返回</button>
        <div style={{ marginLeft:10, display:"flex", alignItems:"center", gap:8 }}>
          <div style={{ width:28, height:28, borderRadius:"50%", background:`${rm.color}22`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, border:`1px solid ${rm.color}44` }}>{rm.e}</div>
          <span style={{ color:C.text, fontWeight:700, fontSize:13 }}>{ev.sender}</span>
        </div>
      </div>
      <div style={{ flex:1, padding:16, display:"flex", flexDirection:"column", gap:14, overflowY:"auto" }}>
        <div style={{ display:"flex", gap:8 }}>
          <div style={{ width:32, height:32, borderRadius:"50%", background:`${rm.color}22`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, flexShrink:0, border:`1px solid ${rm.color}44` }}>{rm.e}</div>
          <div style={{ background:C.bgCard, border:`1px solid ${C.border}`, borderRadius:"0 14px 14px 14px", padding:10, maxWidth:"78%", color:C.text, fontSize:12, lineHeight:1.6 }}>{ev.intro}</div>
        </div>
        <div style={{ display:"flex", gap:8, justifyContent:"flex-end" }}>
          <div style={{ background:`linear-gradient(135deg,${C.pinkDeep},${C.lav})`, borderRadius:"14px 0 14px 14px", padding:10, maxWidth:"78%", color:"#fff", fontSize:12, lineHeight:1.5 }}>{eventChoice.reply}</div>
        </div>
        <div style={{ display:"flex", gap:8 }}>
          <div style={{ width:32, height:32, borderRadius:"50%", background:`${rm.color}22`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, flexShrink:0 }}>{rm.e}</div>
          <div style={{ background:C.bgCard, border:`1px solid ${C.border}`, borderRadius:"0 14px 14px 14px", padding:10, maxWidth:"78%", color:C.text, fontSize:12, lineHeight:1.6 }}>{eventChoice.replyB}</div>
        </div>
        {eventChoice.fanDelta !== 0 && (
          <div style={{ textAlign:"center", color: eventChoice.fanDelta > 0 ? "#10b981" : "#f87171", fontSize:12, fontWeight:700, marginTop:8 }}>
            {eventChoice.fanDelta > 0 ? `✨ 粉丝 +${eventChoice.fanDelta}万` : `📉 粉丝 ${eventChoice.fanDelta}万`}
          </div>
        )}
      </div>
      <div style={{ padding:12, borderTop:`1px solid ${C.border}`, display:"flex", justifyContent:"center", flexShrink:0 }}>
        <button onClick={() => setScreen("home")} style={{ background:C.pinkDeep, border:"none", borderRadius:99, padding:"8px 24px", color:"#fff", fontWeight:700, fontSize:12, cursor:"pointer" }}>返回主页</button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  YUYU PROFILE
// ═══════════════════════════════════════════════════════════════
function YuyuProfile({ setScreen, posts, likedPosts, toggleLike, customComments, setViewing, C, avatarSrc, onAvatarSelect }) {
  const [showAvatarGallery, setShowAvatarGallery] = useState(false);
  return (
    <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden", background:C.bgGradient, position:"relative" }}>
      <div style={{ padding:"14px 16px", borderBottom:`1px solid ${C.border}`, background:"transparent", flexShrink:0 }}>
        <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:12 }}>
          <button onClick={() => setScreen("home")} style={{ background:"none", border:"none", color:C.pink, fontSize:16, cursor:"pointer", padding:0 }}>←</button>
          <div onClick={() => setShowAvatarGallery(true)} style={{ cursor:"pointer", position:"relative" }}>
            <Avatar src={avatarSrc} size={44} C={C} />
            <div style={{ position:"absolute", bottom:-2, right:-2, background:C.pinkDeep, width:14, height:14, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:9, color:"#fff", border:`1px solid ${C.bg}` }}>+</div>
          </div>
          <div>
            <div style={{ color:C.text, fontWeight:800, fontSize:15 }}>清寺小悠 ✞</div>
            <div style={{ color:C.muted, fontSize:10 }}>@yuyu_kiyotera · 天使偶像 💒</div>
          </div>
          <button onClick={() => setScreen("post")} style={{ marginLeft:"auto", padding:"6px 14px", background:`linear-gradient(135deg,${C.pinkDeep},${C.lav})`, border:"none", borderRadius:99, color:"#fff", fontSize:11, fontWeight:800, cursor:"pointer" }}>+ 发帖</button>
        </div>
        <div style={{ display:"flex", gap:10, paddingBottom:4, overflowX:"auto" }}>
          {["排练🎤","签售🎀","直播📡","幕后🌸","生日🎂"].map(s => (
            <div key={s} style={{ flexShrink:0, display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
              <div style={{ width:44, height:44, borderRadius:"50%", background:`linear-gradient(135deg,${C.pink},${C.lav})`, padding:1.5 }}>
                <div style={{ width:"100%", height:"100%", borderRadius:"50%", background:C.bg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>🌸</div>
              </div>
              <span style={{ fontSize:8, color:C.muted }}>{s}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ flex:1, overflowY:"auto", paddingTop:4 }}>
        {posts.map(post => {
          const isLiked = likedPosts[post.id]||false;
          const addedCount = (customComments[post.id]||[]).length;
          const totalCmt = post.comments.length+addedCount;
          return (
            <div key={post.id} style={{ padding:16, borderBottom:`1px solid ${C.border}`, background:C.bgCard, margin:"0 12px 12px", borderRadius:16 }}>
              <div style={{ display:"flex", gap:10, alignItems:"center", marginBottom:10 }}>
                <Avatar src={avatarSrc} size={34} C={C} />
                <div>
                  <div style={{ color:C.text, fontWeight:700, fontSize:12.5 }}>清寺小悠 ✞</div>
                  <div style={{ color:C.dim, fontSize:10 }}>{post.time} · 设定公开</div>
                </div>
                <span style={{ marginLeft:"auto", fontSize:9, padding:"2px 8px", borderRadius:99, background:`${C.pink}15`, color:C.pink, border:`1px solid ${C.border}` }}>{post.tag}</span>
              </div>
              <p style={{ color:C.text, fontSize:13, lineHeight:1.65, margin:"0 0 12px", whiteSpace:"pre-wrap" }}>{post.content}</p>
              {post.image && <img src={post.image} alt="post" style={{ width:"100%", borderRadius:12, marginBottom:12, maxHeight:200, objectFit:"cover" }} />}
              <div style={{ display:"flex", gap:20, borderTop:`1px solid ${C.border}`, paddingTop:10 }}>
                <button onClick={() => toggleLike(post.id)} style={{ background:"none", border:"none", color:isLiked?C.pinkDeep:C.muted, fontSize:12, cursor:"pointer", display:"flex", alignItems:"center", gap:4 }}>
                  <span>{isLiked?"❤️":"☊"}</span> {(post.likes+(isLiked?1:0)).toLocaleString()}
                </button>
                <button onClick={() => setViewing(post)} style={{ background:"none", border:"none", color:C.muted, fontSize:12, cursor:"pointer", display:"flex", alignItems:"center", gap:4 }}>
                  <span>💬</span> {totalCmt}
                </button>
              </div>
            </div>
          );
        })}
      </div>
      {showAvatarGallery && <GalleryPicker onSelect={src => { onAvatarSelect(src); setShowAvatarGallery(false); }} onClose={() => setShowAvatarGallery(false)} C={C} />}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  TWITTER SCREEN (点赞10-50万)
// ═══════════════════════════════════════════════════════════════
function TwitterScreen({ setScreen, feed, setFeed, likedSet, setLikedSet, C, addNotification, avatarSrc, onActionComplete }) {
  const [input, setInput] = useState("");
  const handleTweet = () => {
    if (!input.trim()) return;
    const newTweet = { id: uid("tw_self"), u: "清寺小悠 ✞", handle: "@yuyu_kiyotera", t: input, likes: rnd(100000, 500000), time: "刚刚", isMe: true };
    setFeed(prev => [newTweet, ...prev]);
    addNotification({ app: "Twitter", icon: "🐦", msg: "你发布了一条新推文！", time: "刚刚" });
    setInput("");
    if (onActionComplete) onActionComplete();
  };
  return (
    <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden", background:C.bgGradient }}>
      <div style={{ padding:"12px 16px", display:"flex", alignItems:"center", borderBottom:`1px solid ${C.border}`, flexShrink:0 }}>
        <button onClick={() => setScreen("home")} style={{ background:"none", border:"none", color:C.pink, fontSize:18, cursor:"pointer", padding:0 }}>←</button>
        <span style={{ color:C.text, fontWeight:800, fontSize:15, marginLeft:10 }}>🕊️ 瞬间推流 (Twitter)</span>
      </div>
      <div style={{ flex:1, overflowY:"auto" }}>
        {feed.map(post => (
          <div key={post.id} style={{ padding:"14px 16px", borderBottom:`1px solid ${C.border}`, background:post.isMe?`${C.pink}08`:"transparent" }}>
            <div style={{ display:"flex", gap:10 }}>
              <div style={{ width:36, height:36, borderRadius:"50%", flexShrink:0, border:`1px solid ${C.border}`, overflow:"hidden" }}>
                {post.isMe && avatarSrc
                  ? <img src={avatarSrc} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                  : <div style={{ width:"100%", height:"100%", background:post.isMe?`linear-gradient(135deg,${C.pinkDeep},${C.lav})`:`${C.pink}22`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>{post.isMe?"👼":"👤"}</div>
                }
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:"flex", gap:6, alignItems:"center", marginBottom:3 }}>
                  <span style={{ color:C.text, fontWeight:700, fontSize:13 }}>{post.u}</span>
                  <span style={{ color:C.dim, fontSize:11 }}>{post.handle}</span>
                  <span style={{ color:C.dim, fontSize:10, marginLeft:"auto" }}>{post.time}</span>
                </div>
                <p style={{ color:C.text, fontSize:12.5, lineHeight:1.6, margin:"0 0 8px" }}>{post.t}</p>
                <button onClick={() => { const n=new Set(likedSet); n.has(post.id)?n.delete(post.id):n.add(post.id); setLikedSet(n); }} style={{ background:"none", border:"none", cursor:"pointer", color:likedSet.has(post.id)?C.pinkDeep:C.muted, fontSize:11, padding:0 }}>
                  {likedSet.has(post.id)?"❤️已赞":"♡ 点赞"} ({(post.likes+(likedSet.has(post.id)?1:0)).toLocaleString()})
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ padding:"10px 14px", borderTop:`1px solid ${C.border}`, display:"flex", gap:8, flexShrink:0 }}>
        <input value={input} onChange={e=>setInput(e.target.value)} placeholder="以小悠身份发推..." style={{ flex:1, background:"rgba(255,183,213,0.07)", border:`1px solid ${C.border}`, borderRadius:99, color:C.text, fontSize:12, padding:"8px 14px", outline:"none" }} />
        <button onClick={handleTweet} disabled={!input.trim()} style={{ padding:"0 14px", background:`linear-gradient(135deg,${C.pinkDeep},${C.lav})`, border:"none", borderRadius:99, color:"#fff", fontSize:12, cursor:"pointer" }}>发推</button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  INSTAGRAM SCREEN (with delayed settlement)
// ═══════════════════════════════════════════════════════════════
function InstagramScreen({ setScreen, grid, setGrid, C, addNotification, onActionComplete }) {
  const [likedSet, setLikedSet] = useState(new Set());
  const [activeImg, setActiveImg] = useState(null);
  const [showGallery, setShowGallery] = useState(false);
  const [replacingId, setReplacingId] = useState(null);

  const handleGallerySelect = (src) => {
    if (replacingId) {
      setGrid(prev => prev.map(item => item.id===replacingId ? { ...item, isCustom:true, src } : item));
      if (activeImg && activeImg.id===replacingId) setActiveImg(prev => ({ ...prev, isCustom:true, src }));
      setReplacingId(null);
    } else {
      setGrid(prev => [{ id: uid("ig_custom"), isCustom: true, src, likes: rnd(15000,40000) }, ...prev]);
      addNotification({ app: "Instagram", icon: "📸", msg: "你上传了一张新照片！", time: "刚刚" });
      if (onActionComplete) onActionComplete();
    }
    setShowGallery(false);
  };

  const openReplace = (e, id) => { e.stopPropagation(); setReplacingId(id); setShowGallery(true); };

  return (
    <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden", background:C.bgGradient, position:"relative" }}>
      <div style={{ padding:"12px 16px", display:"flex", alignItems:"center", borderBottom:`1px solid ${C.border}`, flexShrink:0 }}>
        <button onClick={() => setScreen("home")} style={{ background:"none", border:"none", color:C.pink, fontSize:18, cursor:"pointer", padding:0 }}>←</button>
        <span style={{ color:C.text, fontWeight:800, fontSize:15, marginLeft:10 }}>📸 灵感切片 (Instagram)</span>
        <button onClick={() => { setReplacingId(null); setShowGallery(true); }} style={{ marginLeft:"auto", padding:"4px 12px", background:`linear-gradient(135deg,${C.pinkDeep},${C.lav})`, border:"none", borderRadius:99, color:"#fff", fontSize:10, cursor:"pointer" }}>+ 从相册选图</button>
      </div>
      <div style={{ flex:1, overflowY:"auto", padding:12 }}>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8 }}>
          {grid.map(item => (
            <div key={item.id} onClick={() => setActiveImg(item)} style={{ aspectRatio:"1/1", background:item.isCustom?"#221133":item.bg, borderRadius:12, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", position:"relative", cursor:"pointer", overflow:"hidden" }}>
              {item.isCustom ? <img src={item.src} style={{ width:"100%", height:"100%", objectFit:"cover" }} /> : <span style={{ fontSize:28 }}>{item.e}</span>}
              <div onClick={(e)=>openReplace(e,item.id)} style={{ position:"absolute", top:4, right:4, background:"rgba(0,0,0,0.5)", borderRadius:"50%", width:18, height:18, display:"flex", alignItems:"center", justifyContent:"center", fontSize:9, color:"#fff", cursor:"pointer" }}>🔄</div>
              <div style={{ position:"absolute", bottom:4, left:4, right:4, background:"rgba(0,0,0,0.45)", borderRadius:6, color:"#fff", fontSize:8, textAlign:"center", padding:"1px 0" }}>
                {likedSet.has(item.id)?"♥":"♡"} {(item.likes+(likedSet.has(item.id)?1:0)).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>
      {activeImg && (
        <div onClick={() => setActiveImg(null)} style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.9)", zIndex:50, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
          <div style={{ position:"relative", width:280, height:280 }}>
            <div style={{ width:280, height:280, borderRadius:16, background:activeImg.isCustom?"#221133":activeImg.bg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:80, overflow:"hidden" }}>
              {activeImg.isCustom ? <img src={activeImg.src} style={{ width:"100%", height:"100%", objectFit:"cover" }} /> : activeImg.e}
            </div>
            <div onClick={(e)=>{ e.stopPropagation(); setReplacingId(activeImg.id); setShowGallery(true); }} style={{ position:"absolute", top:8, right:8, background:"rgba(0,0,0,0.6)", borderRadius:99, padding:"4px 10px", color:"#fff", fontSize:10, cursor:"pointer" }}>🔄 换图</div>
          </div>
          <div style={{ marginTop:16, display:"flex", gap:12, alignItems:"center" }}>
            <button onClick={(e)=>{ e.stopPropagation(); const n=new Set(likedSet); n.has(activeImg.id)?n.delete(activeImg.id):n.add(activeImg.id); setLikedSet(n); }} style={{ background:"none", border:"none", cursor:"pointer", color:likedSet.has(activeImg.id)?"#f43f5e":"#fff", fontSize:26 }}>
              {likedSet.has(activeImg.id)?"♥":"♡"}
            </button>
            <span style={{ color:"#fff", fontSize:14 }}>{(activeImg.likes+(likedSet.has(activeImg.id)?1:0)).toLocaleString()}</span>
          </div>
        </div>
      )}
      {showGallery && <GalleryPicker onSelect={handleGallerySelect} onClose={() => { setShowGallery(false); setReplacingId(null); }} C={C} />}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  NEWS SCREEN (动态新闻)
// ═══════════════════════════════════════════════════════════════
function NewsScreen({ setScreen, newsList, setNewsList, C }) {
  const [selected, setSelected] = useState(null);
  const openNews = (n) => {
    setSelected(n);
    if (!n.read) {
      setNewsList(prev => prev.map(x => x.title === n.title ? { ...x, read: true } : x));
    }
  };
  const unread = newsList.filter(n => !n.read).length;
  if (selected) return (
    <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden", background:C.bgGradient }}>
      <div style={{ padding:"12px 16px", display:"flex", alignItems:"center", gap:10, borderBottom:`1px solid ${C.border}`, flexShrink:0 }}>
        <button onClick={() => setSelected(null)} style={{ background:"none", border:"none", color:C.pink, fontSize:18, cursor:"pointer", padding:0 }}>←</button>
        <span style={{ color:C.muted, fontSize:11 }}>{selected.src}</span>
      </div>
      <div style={{ flex:1, overflowY:"auto", padding:20 }}>
        <div style={{ color:C.text, fontSize:16, fontWeight:800, lineHeight:1.5, marginBottom:12 }}>{selected.title}</div>
        <div style={{ color:C.dim, fontSize:11, marginBottom:16 }}>{selected.src} · {selected.time}</div>
        {selected.isInitial && (
          <p style={{ color:C.text, fontSize:13, lineHeight:1.8 }}>
            {selected.title.includes("掉粉") || selected.title.includes("低活跃")
              ? "据多位数据分析人士指出，人气偶像清寺小悠近三个月来发帖频率大幅下降，互动数据持续走低，部分粉丝在论坛发文表示担忧：「小悠怎么了？是公司安排有问题还是本人状态不好？」目前事务所方面尚未就此作出回应，小悠未来的动向备受关注。"
              : "天使音乐事务所旗下新人清寺小悠近日凭借独特的蕾系舞台风格吸引了大量关注，本月最受期待偶像提名结果出炉，小悠以清新脱俗的形象成功入选。业内人士表示，小悠的出道表现超出预期，后续发展值得持续关注。"
            }
          </p>
        )}
      </div>
    </div>
  );
  return (
    <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden", background:C.bgGradient }}>
      <div style={{ padding:"12px 16px", display:"flex", alignItems:"center", borderBottom:`1px solid ${C.border}`, flexShrink:0 }}>
        <button onClick={() => setScreen("home")} style={{ background:"none", border:"none", color:C.pink, fontSize:18, cursor:"pointer", padding:0 }}>←</button>
        <span style={{ color:C.text, fontWeight:800, fontSize:15, marginLeft:10 }}>📰 天使风向标新闻</span>
        {unread > 0 && (
          <span style={{ marginLeft:8, background:"#ef4444", color:"#fff", borderRadius:99, minWidth:18, height:18, display:"inline-flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:800, padding:"0 5px" }}>{unread}</span>
        )}
      </div>
      <div style={{ flex:1, overflowY:"auto", padding:16 }}>
        {newsList.map((n,i) => (
          <div key={i} onClick={() => openNews(n)} style={{ padding:12, background: n.read ? C.bgCard : `${C.bgCard}`, borderRadius:12, marginBottom:10, border:`1px solid ${n.read ? C.border : C.pink}`, cursor:"pointer", position:"relative" }}>
            {!n.read && (
              <span style={{ position:"absolute", top:10, right:10, width:8, height:8, borderRadius:"50%", background:"#ef4444", display:"block" }} />
            )}
            <div style={{ display:"flex", justifyContent:"space-between", fontSize:10, color:C.dim, marginBottom:4 }}><span>{n.src}</span><span>{n.time}</span></div>
            <div style={{ color: n.read ? C.muted : C.text, fontSize:13, fontWeight: n.read ? 500 : 700, lineHeight:1.4 }}>{n.title}</div>
            {n.hot && <span style={{ display:"inline-block", marginTop:6, fontSize:8, background:"#ef4444", color:"#fff", padding:"1px 6px", borderRadius:4, fontWeight:700 }}>HOT</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  DMS SCREEN
// ═══════════════════════════════════════════════════════════════
function DmsScreen({ setScreen, dms, setDms, C }) {
  const [activeDm, setActiveDm] = useState(null);
  const [replyInput, setReplyInput] = useState("");
  const [replies, setReplies] = useState({});
  const open = (dm) => { setActiveDm(dm); setDms(prev => prev.map(d => d.id===dm.id?{...d,read:true}:d)); };
  const submitReply = () => { if (!replyInput.trim()) return; setReplies(p=>({...p,[activeDm.id]:replyInput})); setReplyInput(""); };
  if (activeDm) {
    const hasReplied = replies[activeDm.id];
    return (
      <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden", background:C.bgGradient }}>
        <div style={{ padding:"12px 16px", display:"flex", alignItems:"center", gap:10, borderBottom:`1px solid ${C.border}`, flexShrink:0 }}>
          <button onClick={() => setActiveDm(null)} style={{ background:"none", border:"none", color:C.pink, fontSize:18, cursor:"pointer", padding:0 }}>←</button>
          <span style={{ color:C.text, fontWeight:700, fontSize:14 }}>{activeDm.from}</span>
        </div>
        <div style={{ flex:1, overflowY:"auto", padding:16, display:"flex", flexDirection:"column", gap:12 }}>
          <div style={{ alignSelf:"flex-start", maxWidth:"80%", background: activeDm.role==="hater" ? "rgba(40,10,10,0.85)" : C.bgCard, border:`1px solid ${activeDm.role==="hater" ? "#6b728055" : C.border}`, padding:12, borderRadius:"4px 14px 14px 14px" }}>
            <p style={{ color: activeDm.role==="hater" ? "#9ca3af" : C.text, fontSize:12.5, margin:0, lineHeight:1.5 }}>{activeDm.msg}</p>
            <span style={{ fontSize:9, color:C.dim, marginTop:4, display:"block" }}>{activeDm.time}</span>
          </div>
          {hasReplied && (
            <div style={{ alignSelf:"flex-end", maxWidth:"80%", background:`linear-gradient(135deg,${C.pinkDeep},${C.lav})`, padding:12, borderRadius:"14px 4px 14px 14px" }}>
              <p style={{ color:"#fff", fontSize:12.5, margin:0, lineHeight:1.5 }}>{hasReplied}</p>
              <span style={{ fontSize:9, color:"rgba(255,255,255,0.7)", marginTop:4, display:"block" }}>刚刚</span>
            </div>
          )}
        </div>
        {!hasReplied && (
          <div style={{ padding:"10px 14px 6px", borderTop:`1px solid ${C.border}`, display:"flex", gap:8, flexShrink:0 }}>
            <input value={replyInput} onChange={e=>setReplyInput(e.target.value)} placeholder="回复营业私信..." style={{ flex:1, background:"rgba(255,183,213,0.07)", border:`1px solid ${C.border}`, borderRadius:99, color:C.text, fontSize:12, padding:"8px 14px", outline:"none" }} />
            <button onClick={submitReply} style={{ padding:"0 14px", background:`linear-gradient(135deg,${C.pinkDeep},${C.lav})`, border:"none", borderRadius:99, color:"#fff", fontSize:12, cursor:"pointer" }}>发送</button>
          </div>
        )}
      </div>
    );
  }
  return (
    <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden", background:C.bgGradient }}>
      <div style={{ padding:"12px 16px", display:"flex", alignItems:"center", borderBottom:`1px solid ${C.border}`, flexShrink:0 }}>
        <button onClick={() => setScreen("home")} style={{ background:"none", border:"none", color:C.pink, fontSize:18, cursor:"pointer", padding:0 }}>←</button>
        <span style={{ color:C.text, fontWeight:800, fontSize:15, marginLeft:10 }}>💌 专属营业私信箱箱</span>
      </div>
      <div style={{ flex:1, overflowY:"auto" }}>
        {dms.map(dm => {
          const rm = ROLE_META[dm.role]||ROLE_META.casual;
          return (
            <div key={dm.id} onClick={() => open(dm)} style={{ padding:"12px 16px", borderBottom:`1px solid ${C.border}`, background:dm.read?"transparent":"rgba(255,183,213,0.03)", cursor:"pointer", display:"flex", gap:12, alignItems:"center" }}>
              <div style={{ width:40, height:40, borderRadius:"50%", background:`${rm.color}18`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, border:`1px solid ${rm.color}30`, flexShrink:0 }}>{rm.e}</div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:3 }}>
                  <span style={{ color:C.text, fontWeight:700, fontSize:13 }}>{dm.from}</span>
                  <span style={{ fontSize:8, padding:"1px 5px", borderRadius:99, background:`${rm.color}15`, color:rm.color, fontWeight:600 }}>{rm.label}</span>
                  <span style={{ marginLeft:"auto", color:C.dim, fontSize:10 }}>{dm.time}</span>
                </div>
                <p style={{ color:dm.read?C.muted:C.text, fontSize:12, margin:0, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{dm.msg}</p>
              </div>
              {!dm.read && <div style={{ width:8, height:8, borderRadius:"50%", background:"#e879a8", flexShrink:0 }} />}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  LIVE SCREEN
// ═══════════════════════════════════════════════════════════════
function LiveScreen({ setScreen, C, onActionComplete }) {
  const [chats, setChats] = useState(["直播间开启成功！💞"]);
  const [likedCount, setLikedCount] = useState(1420);
  const scrollRef = useRef();
  useEffect(() => {
    const t = setInterval(() => {
      const isGift = Math.random()>0.75;
      const text = isGift ? `🎁 ${randUser()} ${pick(LIVE_GIFTS)}` : `💬 ${randUser()}: ${pick(LIVE_CHAT)}`;
      setChats(prev => [...prev.slice(-30), text]);
    }, 600);
    return () => clearInterval(t);
  }, []);
  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, [chats]);

  const handleEndLive = () => {
    if (onActionComplete) onActionComplete();
  };

  return (
    <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden", background:"#0a040f" }}>
      <div style={{ padding:"12px 16px", display:"flex", alignItems:"center", background:"rgba(0,0,0,0.3)", zIndex:10, flexShrink:0 }}>
        <button onClick={() => setScreen("home")} style={{ background:"none", border:"none", color:"#ffb7d5", fontSize:18, cursor:"pointer", padding:0 }}>←</button>
        <span style={{ color:"#fff", fontWeight:800, fontSize:14, marginLeft:10 }}>📡 天使降临·限时企划直播中</span>
        <span style={{ marginLeft:"auto", background:"#ef4444", color:"#fff", fontSize:9, padding:"2px 6px", borderRadius:4, fontWeight:700 }}>LIVE</span>
      </div>
      <div style={{ flex:1, position:"relative", display:"flex", flexDirection:"column", justifyContent:"flex-end", padding:12 }}>
        <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:10, background:"linear-gradient(180deg,#1a0d24 0%,#050208 100%)" }}>
          <div style={{ fontSize:40 }}>🎤</div>
          <div style={{ color:"#ffb7d5", fontSize:12, fontWeight:700, letterSpacing:1 }}>清寺小悠正在全息麦克风前调试音源...</div>
        </div>
        <div ref={scrollRef} style={{ position:"relative", zIndex:5, maxHeight:160, overflowY:"auto", display:"flex", flexDirection:"column", gap:4 }}>
          {chats.map((c,i) => (
            <div key={i} style={{ background:"rgba(0,0,0,0.5)", padding:"4px 8px", borderRadius:6, color:c.startsWith("🎁")?"#f472b6":"#ffe4f0", fontSize:11, width:"fit-content", wordBreak:"break-all" }}>{c}</div>
          ))}
        </div>
      </div>
      <div style={{ padding:"10px 14px", background:"rgba(0,0,0,0.4)", display:"flex", justifyContent:"space-between", alignItems:"center", flexShrink:0 }}>
        <span style={{ color:"rgba(255,220,240,0.4)", fontSize:11 }}>🔊 实时在线: {(32450).toLocaleString()}人</span>
        <button onClick={() => setLikedCount(c=>c+7)} style={{ background:"rgba(232,121,168,0.3)", border:"1px solid #e879a8", borderRadius:99, color:"#ffb7d5", padding:"4px 12px", fontSize:11, cursor:"pointer" }}>❤️ 点赞 ({likedCount})</button>
      </div>
      <div style={{ padding:12, borderTop:"1px solid rgba(255,255,255,0.1)", display:"flex", justifyContent:"center" }}>
        <button onClick={handleEndLive} style={{ background:"#e879a8", border:"none", borderRadius:99, padding:"6px 20px", color:"#fff", fontWeight:700, fontSize:12, cursor:"pointer" }}>结束直播并结算</button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  MUSIC SCREEN
// ═══════════════════════════════════════════════════════════════
function MusicScreen({ setScreen, C, onActionComplete }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const handleComplete = () => {
    if (onActionComplete) onActionComplete();
  };
  return (
    <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden", background:C.bgGradient }}>
      <div style={{ padding:"12px 16px", display:"flex", alignItems:"center", gap:10, borderBottom:`1px solid ${C.border}`, flexShrink:0 }}>
        <button onClick={() => setScreen("home")} style={{ background:"none", border:"none", color:C.pink, fontSize:18, cursor:"pointer", padding:0 }}>←</button>
        <span style={{ color:C.text, fontWeight:800, fontSize:15 }}>🎵 天使独家CD音乐盒</span>
      </div>
      <div style={{ flex:1, overflowY:"auto", padding:16, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
        <div style={{ width:160, height:160, borderRadius:"50%", background:"#22122c", border:`4px solid ${C.borderB}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:62, boxShadow:"0 8px 30px rgba(0,0,0,0.3)", animation:isPlaying?"spin 8s linear infinite":"none" }}>💿</div>
        <div style={{ marginTop:24, textAlign:"center" }}>
          <div style={{ color:C.text, fontSize:16, fontWeight:800 }}>《 ✞ 天使降临 ✞ 》</div>
          <div style={{ color:C.muted, fontSize:12, marginTop:4 }}>演唱: 清寺小悠 · Official Demo</div>
        </div>
        <button onClick={() => setIsPlaying(!isPlaying)} style={{ marginTop:30, padding:"10px 32px", background:`linear-gradient(135deg,${C.pinkDeep},${C.lav})`, border:"none", borderRadius:99, color:"#fff", fontWeight:800, fontSize:13, cursor:"pointer" }}>
          {isPlaying?"⏸ 暂停试听":"▶ 开启概念音源"}
        </button>
      </div>
      <div style={{ padding:12, display:"flex", justifyContent:"center", borderTop:`1px solid ${C.border}` }}>
        <button onClick={handleComplete} style={{ background:C.pinkDeep, border:"none", borderRadius:99, padding:"6px 20px", color:"#fff", fontWeight:700, fontSize:12, cursor:"pointer" }}>完成练习，结算行动</button>
      </div>
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════
//  POST CREATOR SCREEN
// ═══════════════════════════════════════════════════════════════
function PostCreatorScreen({ setScreen, onSave, C, avatarSrc, onActionComplete }) {
  const [text, setText] = useState("");
  const [tag, setTag] = useState("日常");
  const [imgSrc, setImgSrc] = useState(null);
  const [showGallery, setShowGallery] = useState(false);
  const handlePublish = () => {
    if (!text.trim()) return;
    onSave(text, tag, imgSrc);
    if (onActionComplete) onActionComplete();
  };
  return (
    <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden", background:C.bgGradient, position:"relative" }}>
      <div style={{ padding:"12px 16px", display:"flex", alignItems:"center", justifyContent:"space-between", borderBottom:`1px solid ${C.border}`, flexShrink:0 }}>
        <button onClick={() => setScreen("home")} style={{ background:"none", border:"none", color:C.pink, fontSize:14, cursor:"pointer" }}>取消</button>
        <span style={{ color:C.text, fontWeight:800, fontSize:15 }}>✏️ 企划内容新建</span>
        <button onClick={handlePublish} style={{ padding:"4px 14px", background:C.pinkDeep, border:"none", borderRadius:99, color:"#fff", fontSize:12, fontWeight:700, cursor:"pointer" }}>发布</button>
      </div>
      <div style={{ padding:16, flex:1, display:"flex", flexDirection:"column", gap:14, overflowY:"auto" }}>
        <div style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
          <Avatar src={avatarSrc} size={36} C={C} />
          <div style={{ flex:1 }}>
            <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:8 }}>
              {["日常","直播","打歌","公告"].map(t => (
                <button key={t} onClick={() => setTag(t)} style={{ background:tag===t?C.pinkDeep:"transparent", border:`1px solid ${tag===t?"transparent":C.border}`, borderRadius:99, padding:"4px 12px", cursor:"pointer", color:tag===t?"#fff":C.muted, fontSize:11, fontWeight:700 }}>{t}</button>
              ))}
            </div>
            <textarea value={text} onChange={e=>setText(e.target.value)} placeholder={`今天想和粉丝们说什么呢～（${tag}）`} style={{ width:"100%", minHeight:100, background:"rgba(255,183,213,0.04)", border:`1px solid ${C.border}`, borderRadius:14, color:C.text, fontSize:13, padding:14, resize:"none", outline:"none", lineHeight:1.6, boxSizing:"border-box" }} />
          </div>
        </div>
        {imgSrc && (
          <div style={{ position:"relative" }}>
            <img src={imgSrc} alt="preview" style={{ width:"100%", borderRadius:12, maxHeight:180, objectFit:"cover" }} />
            <button onClick={() => setImgSrc(null)} style={{ position:"absolute", top:6, right:6, background:"rgba(0,0,0,0.6)", border:"none", borderRadius:"50%", color:"#fff", width:22, height:22, cursor:"pointer", fontSize:12 }}>✕</button>
          </div>
        )}
        <div style={{ display:"flex", gap:10 }}>
          <button onClick={() => setShowGallery(true)} style={{ display:"flex", alignItems:"center", gap:6, background:"transparent", border:`1px solid ${C.border}`, borderRadius:99, padding:"6px 14px", color:C.muted, fontSize:12, cursor:"pointer" }}>🖼 从小悠相册选图</button>
        </div>
      </div>
      {showGallery && <GalleryPicker onSelect={src => { setImgSrc(src); setShowGallery(false); }} onClose={() => setShowGallery(false)} C={C} />}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  COMMENT VIEW SCREEN
// ═══════════════════════════════════════════════════════════════
function CommentViewScreen({ viewing, setViewing, customComments, setCustomComments, C }) {
  const [cmtInput, setCmtInput] = useState("");
  const postId = viewing.id;
  const added = customComments[postId]||[];
  const all = [...added, ...viewing.comments];
  return (
    <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden", background:C.bgGradient }}>
      <div style={{ padding:"12px 16px", display:"flex", alignItems:"center", gap:10, borderBottom:`1px solid ${C.border}`, flexShrink:0 }}>
        <button onClick={() => setViewing(null)} style={{ background:"none", border:"none", color:C.pink, fontSize:18, cursor:"pointer", padding:0 }}>←</button>
        <span style={{ color:C.text, fontWeight:700, fontSize:14 }}>评论区 ({all.length})</span>
      </div>
      <div style={{ padding:"10px 14px", borderBottom:`1px solid ${C.border}`, flexShrink:0 }}>
        <p style={{ color:C.muted, fontSize:11, margin:0 }}>{viewing.content}</p>
      </div>
      <div style={{ flex:1, overflowY:"auto" }}>{all.map(c => <CommentRow key={c.id} c={c} C={C} />)}</div>
      <div style={{ padding:"10px 14px 6px", borderTop:`1px solid ${C.border}`, display:"flex", gap:8, flexShrink:0 }}>
        <input value={cmtInput} onChange={e=>setCmtInput(e.target.value)} placeholder="撰写粉丝深情控评..." style={{ flex:1, background:"rgba(255,183,213,0.07)", border:`1px solid ${C.border}`, borderRadius:99, color:C.text, fontSize:12, padding:"8px 14px", outline:"none" }} />
        <button onClick={() => { if (!cmtInput.trim()) return; const newC={id:uid("myc"),u:randUser(),t:cmtInput,type:"mama",likes:rnd(10,200),time:"刚刚"}; setCustomComments(p=>({...p,[postId]:[newC,...(p[postId]||[])]})); setCmtInput(""); }} style={{ padding:"0 14px", background:C.pinkDeep, border:"none", borderRadius:99, color:"#fff", fontSize:12, cursor:"pointer" }}>评论</button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  SIGNING + CALENDAR
// ═══════════════════════════════════════════════════════════════
function SigningScreen({ setScreen, C, onFanBoost }) {
  const ALL_FANS_TEMPLATES = [
    { e: "🫶", msg: "宝贝，今天脸色好一点吗？带了你最爱的草莓大福来～", options: ["收下并用力抱了一下", "谢谢！（开心收下）", "「嗯谢谢」（手还没停在签名）"], best: 0, boosts: [11, 5, 1] },
    { e: "🫶", msg: "看你今天累了，吃点东西再上场嘛！", options: ["谢谢！我先垫一下", "不用了，我没事的", "（没听见，继续签名）"], best: 0, boosts: [10, 3, -2] },
    { e: "⭐", msg: "悠酱我生日快到了……可以帮我写「生日快乐」吗？好想哭啊", options: ["当然！还要加颗心💖", "哦，好的（写了写）", "只写了签名，没有看到留言"], best: 0, boosts: [10, 2, -5] },
    { e: "🌱", msg: "（小声）姐姐……我、我很喜欢你唱歌……（把小熊塞过来）", options: ["蹲下来认真道谢，摸摸头", "收下了，微笑点头", "没注意到，直接翻下一张"], best: 0, boosts: [12, 3, -8] },
    { e: "📊", msg: "悠酱！我们数据组每天爆肝给你打投！可以在牌子上签名支持我们吗！", options: ["签！还写了「谢谢大家的爱」", "签了名", "手有点酸了…（字写歪了）"], best: 0, boosts: [9, 4, 0] },
    { e: "🌿", msg: "这是我第一次来签售……我紧张到手在抖了，可以拍张合照吗？", options: ["当然！还握了握她的手", "可以呀！（摆pose）", "「今天不开放合照哦」（规定是这样的）"], best: 0, boosts: [8, 6, -2] },
    { e: "✨", msg: "我从外地坐了五个小时车来的……（眼眶红红的）", options: ["紧紧握住她的手说谢谢", "哇辛苦了！（感动）", "（来不及多说，被工作人员催着往前走）"], best: 0, boosts: [13, 5, -6] },
    { e: "🌸", msg: "我们打投组昨晚熬到三点！悠酱有没有看到实时排名！", options: ["看到了！谢谢你们，你们真的太好了！", "谢谢大家的努力！", "（边签名边点头）嗯嗯～"], best: 0, boosts: [10, 5, 2] },
    { e: "🌟", msg: "我追你好几年了。从街边小舞台到现在，一直都在。", options: ["放下笔认真对视：「谢谢你一直陪着我」", "（感动）谢谢！", "哦好的谢谢（继续往下签）"], best: 0, boosts: [14, 6, -4] },
    { e: "📖", msg: "我画了你的同人图带来了，可以亲笔签个名吗？", options: ["认真看图后签名：「画得好美，谢谢你」", "签名并说了声谢谢", "快速签了名（图没来得及细看）"], best: 0, boosts: [9, 4, 0] },
    { e: "👀", msg: "我朋友拉我来的，我不太了解你……但你今天好漂亮！", options: ["笑着说：「希望你以后也会喜欢我哦」", "谢谢！（认真签名）", "哦……好的（有点尴尬地签了）"], best: 0, boosts: [8, 5, 1] },
    { e: "🧸", msg: "我女儿太紧张说不出话来……她每天都在听你的歌，谢谢你陪她长大", options: ["蹲下来跟小朋友说：「以后要继续加油哦」", "感动地说谢谢，认真签名", "点了点头，签了个名"], best: 0, boosts: [12, 6, 1] },
    { e: "📈", msg: "我才刚加入数据组一周……大家都好厉害，我也想为悠酱做些什么", options: ["鼓励她：「你愿意来就已经很厉害了！」", "谢谢你！一起加油！", "（微笑点头）嗯嗯！"], best: 0, boosts: [9, 5, 2] },
    { e: "🌏", msg: "（用不太流利的中文）我……从很远的地方来……很高兴见到你", options: ["用心回应：「谢谢你！路上辛苦了！」", "（感动）谢谢你来！", "（点头微笑）谢谢！"], best: 0, boosts: [11, 6, 2] },
    { e: "💭", msg: "悠酱，我每次心情不好都会来刷你的动态……你知道吗，你帮了我好多。", options: ["认真地说：「谢谢你告诉我这些」", "轻轻点头，把签名写得格外认真", "「谢谢你喜欢我」（继续往下签）"], best: 0, boosts: [13, 7, 2] },
    { e: "🎀", msg: "我把你所有专辑都买了！可以在最新专辑上签名吗？", options: ["当然！还画了一颗小星星", "当然！（认真签上名字）", "（快速签了一个名字）"], best: 0, boosts: [9, 5, 1] },
  ];

  const [FANS_DATA] = useState(() => {
    const shuffled = [...ALL_FANS_TEMPLATES].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 6).map(t => ({ ...t, name: randUser() }));
  });

  const [phase, setPhase] = useState("intro"); // intro | game | result
  const [idx, setIdx] = useState(0);
  const [totalBoost, setTotalBoost] = useState(0);
  const [results, setResults] = useState([]);
  const [chosen, setChosen] = useState(null);

  const current = FANS_DATA[idx];

  const handleChoice = (i) => {
    if (chosen !== null) return;
    setChosen(i);
    const boost = current.boosts[i];
    setTotalBoost(b => b + boost);
    setResults(r => [...r, { name: current.name, e: current.e, choice: i, boost, best: current.best }]);
  };

  const handleNext = () => {
    if (idx + 1 >= FANS_DATA.length) {
      setPhase("result");
      if (onFanBoost) onFanBoost(totalBoost + (chosen !== null ? 0 : 0));
    } else {
      setIdx(i => i + 1);
      setChosen(null);
    }
  };

  if (phase === "intro") return (
    <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden", background:C.bgGradient }}>
      <div style={{ padding:"12px 16px", display:"flex", alignItems:"center", gap:10, borderBottom:`1px solid ${C.border}`, flexShrink:0 }}>
        <button onClick={() => setScreen("home")} style={{ background:"none", border:"none", color:C.pink, fontSize:18, cursor:"pointer", padding:0 }}>←</button>
        <span style={{ color:C.text, fontWeight:800, fontSize:15 }}>🎀 签售会</span>
      </div>
      <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:24, gap:20 }}>
        <div style={{ fontSize:48 }}>🎀</div>
        <div style={{ color:C.text, fontWeight:800, fontSize:18, textAlign:"center" }}>1st 迷你签售会</div>
        <div style={{ color:C.muted, fontSize:13, textAlign:"center", lineHeight:1.8 }}>今天有 {FANS_DATA.length} 位粉丝前来。{"\n"}每一次互动都会影响你在他们心中的印象。</div>
        <div style={{ background:C.bgCard, borderRadius:14, padding:14, width:"100%", border:`1px solid ${C.border}`, fontSize:12, color:C.muted }}>
          💡 认真对待每一位粉丝，可以获得额外粉丝数加成
        </div>
        <button onClick={() => setPhase("game")} style={{ padding:"12px 32px", background:`linear-gradient(135deg,${C.pinkDeep},${C.lav})`, border:"none", borderRadius:99, color:"#fff", fontSize:14, fontWeight:800, cursor:"pointer" }}>开始签售 🎀</button>
      </div>
    </div>
  );

  if (phase === "game") return (
    <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden", background:C.bgGradient }}>
      <div style={{ padding:"12px 16px", display:"flex", alignItems:"center", justifyContent:"space-between", borderBottom:`1px solid ${C.border}`, flexShrink:0 }}>
        <span style={{ color:C.text, fontWeight:800, fontSize:15 }}>🎀 签售会</span>
        <span style={{ color:C.muted, fontSize:12 }}>{idx + 1} / {FANS_DATA.length}</span>
      </div>
      <div style={{ flex:1, overflowY:"auto", padding:20, display:"flex", flexDirection:"column", gap:16 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:44, height:44, borderRadius:"50%", background:`${C.pink}25`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, flexShrink:0 }}>{current.e}</div>
          <div>
            <div style={{ color:C.text, fontWeight:700, fontSize:14 }}>{current.name}</div>
            <div style={{ color:C.muted, fontSize:10 }}>来到你面前</div>
          </div>
        </div>
        <div style={{ background:C.bgCard, borderRadius:16, padding:16, border:`1px solid ${C.border}`, fontSize:13, color:C.text, lineHeight:1.7 }}>
          「{current.msg}」
        </div>
        <div style={{ color:C.muted, fontSize:11, textAlign:"center" }}>你怎么回应？</div>
        {current.options.map((opt, i) => {
          const isChosen = chosen === i;
          const isBest = i === current.best;
          const boost = current.boosts[i];
          return (
            <button key={i} onClick={() => handleChoice(i)} disabled={chosen !== null}
              style={{ padding:"12px 16px", background: chosen === null ? C.bgCard : isChosen ? (boost > 5 ? "#10b98120" : boost < 0 ? "#f8717120" : `${C.pink}20`) : `${C.bgCard}80`, border:`1px solid ${chosen===null?C.border:isChosen?(boost>5?"#10b981":boost<0?"#f87171":C.pink):C.border}`, borderRadius:14, color: chosen!==null&&!isChosen?C.dim:C.text, fontSize:13, cursor:chosen===null?"pointer":"default", textAlign:"left", lineHeight:1.5, transition:"all 0.2s" }}>
              {opt}
              {chosen !== null && isChosen && (
                <span style={{ display:"block", fontSize:11, marginTop:4, color: boost > 5 ? "#10b981" : boost < 0 ? "#f87171" : C.muted, fontWeight:700 }}>
                  {boost > 0 ? `+${boost}万粉` : boost < 0 ? `${boost}万粉` : "没有变化"}
                  {isBest && boost > 0 ? " ✨ 最佳回应！" : ""}
                </span>
              )}
            </button>
          );
        })}
        {chosen !== null && (
          <button onClick={handleNext} style={{ padding:"11px", background:`linear-gradient(135deg,${C.pinkDeep},${C.lav})`, border:"none", borderRadius:99, color:"#fff", fontSize:13, fontWeight:800, cursor:"pointer", marginTop:4 }}>
            {idx + 1 < FANS_DATA.length ? "下一位 →" : "结束签售 🎀"}
          </button>
        )}
      </div>
    </div>
  );

  const totalReal = results.reduce((s, r) => s + r.boost, 0);
  return (
    <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden", background:C.bgGradient }}>
      <div style={{ padding:"12px 16px", display:"flex", alignItems:"center", gap:10, borderBottom:`1px solid ${C.border}`, flexShrink:0 }}>
        <button onClick={() => setScreen("home")} style={{ background:"none", border:"none", color:C.pink, fontSize:18, cursor:"pointer", padding:0 }}>←</button>
        <span style={{ color:C.text, fontWeight:800, fontSize:15 }}>🎀 签售会结束</span>
      </div>
      <div style={{ flex:1, overflowY:"auto", padding:20, display:"flex", flexDirection:"column", gap:14 }}>
        <div style={{ textAlign:"center", fontSize:36 }}>{totalReal >= 40 ? "🌟" : totalReal >= 20 ? "🎀" : "😔"}</div>
        <div style={{ textAlign:"center", color:C.text, fontWeight:800, fontSize:16 }}>
          {totalReal >= 40 ? "完美签售！粉丝都很满足" : totalReal >= 20 ? "签售顺利完成" : "这次签售有点遗憾…"}
        </div>
        <div style={{ textAlign:"center", color: totalReal > 0 ? "#10b981" : "#f87171", fontWeight:800, fontSize:18 }}>
          {totalReal > 0 ? `+${totalReal}万粉丝` : `${totalReal}万粉丝`}
        </div>
        {results.map((r, i) => (
          <div key={i} style={{ background:C.bgCard, borderRadius:12, padding:12, border:`1px solid ${C.border}`, display:"flex", alignItems:"center", gap:10 }}>
            <span style={{ fontSize:20 }}>{r.e}</span>
            <div style={{ flex:1 }}>
              <div style={{ color:C.text, fontSize:12, fontWeight:700 }}>{r.name}</div>
              <div style={{ color:r.boost>5?"#10b981":r.boost<0?"#f87171":C.muted, fontSize:11, fontWeight:600 }}>
                {r.boost > 0 ? `+${r.boost}万` : r.boost < 0 ? `${r.boost}万` : "±0"}
                {r.choice === r.best ? " · 最佳回应✨" : ""}
              </div>
            </div>
          </div>
        ))}
        <button onClick={() => setScreen("home")} style={{ padding:"11px", background:`linear-gradient(135deg,${C.pinkDeep},${C.lav})`, border:"none", borderRadius:99, color:"#fff", fontSize:13, fontWeight:800, cursor:"pointer", marginTop:4 }}>回到主页</button>
      </div>
    </div>
  );
}

function CalendarScreen({ setScreen, C }) {
  const events = [
    { time:"10:00", title:"杂志摄影 · 《周刊偶像》", place:"涩谷studio" },
    { time:"14:30", title:"新曲MV排练", place:"天使舞蹈室" },
    { time:"19:00", title:"线上粉丝交流会 (直播)", place:"YouTube Live" },
  ];
  return (
    <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden", background:C.bgGradient }}>
      <div style={{ padding:"12px 16px", display:"flex", alignItems:"center", gap:10, borderBottom:`1px solid ${C.border}`, flexShrink:0 }}>
        <button onClick={() => setScreen("home")} style={{ background:"none", border:"none", color:C.pink, fontSize:18, cursor:"pointer", padding:0 }}>←</button>
        <span style={{ color:C.text, fontWeight:800, fontSize:15 }}>📅 今日日程</span>
      </div>
      <div style={{ flex:1, overflowY:"auto", padding:16 }}>
        {events.map((e,i) => (
          <div key={i} style={{ display:"flex", gap:12, marginBottom:16, background:C.bgCard, borderRadius:14, padding:12, border:`1px solid ${C.border}` }}>
            <div style={{ width:60, fontSize:13, fontWeight:700, color:C.pinkDeep }}>{e.time}</div>
            <div>
              <div style={{ color:C.text, fontWeight:700, fontSize:13 }}>{e.title}</div>
              <div style={{ color:C.muted, fontSize:11 }}>{e.place}</div>
            </div>
          </div>
        ))}
        <div style={{ background:`${C.pink}10`, borderRadius:14, padding:12, marginTop:8, textAlign:"center", color:C.muted, fontSize:11 }}>✨ 明天有录音工作，记得早点休息哦 ✨</div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  ACTION RESULT TOAST
// ═══════════════════════════════════════════════════════════════
function ActionToast({ msg, C }) {
  return (
    <div style={{ position:"absolute", top:60, left:"50%", transform:"translateX(-50%)", background:`linear-gradient(135deg,${C.pinkDeep},${C.lav})`, color:"#fff", padding:"8px 18px", borderRadius:99, fontSize:12, fontWeight:700, zIndex:300, whiteSpace:"nowrap", boxShadow:"0 4px 20px rgba(0,0,0,0.3)" }}>
      {msg}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  ROOT APP
// ═══════════════════════════════════════════════════════════════
export default function App() {
  const [themeMode, setThemeMode] = useState("purple");
  const C = THEMES[themeMode];
  const toggleTheme = () => setThemeMode(p => p==="purple"?"pink":"purple");

  // Save system
  const [saves, setSaves] = useState(() => initSaves());
  const [currentSaveId, setCurrentSaveId] = useState(null);

  // Game state
  const [day, setDay] = useState(1);
  const [fans, setFans] = useState(120);
  const [lazy, setLazy] = useState(3);
  const [actionPoints, setActionPoints] = useState(3);
  const [eventDone, setEventDone] = useState(false);
  const [eventChoice, setEventChoice] = useState(null);
  const [endingKey, setEndingKey] = useState(null);
  const [showPrologue, setShowPrologue] = useState(false);

  // UI state
  const [screen, setScreen] = useState("saveSelect");
  const [isLocked, setIsLocked] = useState(true);
  const [viewingCommentPost, setViewingCommentPost] = useState(null);
  const [toast, setToast] = useState(null);

  // App content state
  const [posts, setPosts] = useState(() => makeInitialPosts());
  const [likedPosts, setLikedPosts] = useState({});
  const [customComments, setCustomComments] = useState({});
  const [twFeed, setTwFeed] = useState(() => TW_POSTS_BASE.map(p => ({ ...p, id: uid("tw_p"), likes: rnd(100000, 500000), time: pick(["2小时前","5小时前","1天前"]) })));
  const [twLiked, setTwLiked] = useState(new Set());
  const [igGrid, setIgGrid] = useState(() => INITIAL_IG_GRID);
  const [dms, setDms] = useState(() => generateDailyDms(1));
  const [avatarSrc, setAvatarSrc] = useState("https://s41.ax1x.com/2026/05/29/pmFQG1U.jpg");
  const [notifications, setNotifications] = useState([]);
  const [batteryLevel, setBatteryLevel] = useState(85);
  const [newsList, setNewsList] = useState(() => INITIAL_NEWS);
  const [eventOrder, setEventOrder] = useState(() => generateEventOrder());

  const [pendingAction, setPendingAction] = useState(null);

  // 成就系统（跨存档全局）
  const [unlockedAchievements, setUnlockedAchievements] = useState(() => {
    try { return JSON.parse(localStorage.getItem("yuyu_achievements") || "[]"); } catch { return []; }
  });
  const unlockAchievement = (key) => {
    setUnlockedAchievements(prev => {
      if (prev.includes(key)) return prev;
      const next = [...prev, key];
      try { localStorage.setItem("yuyu_achievements", JSON.stringify(next)); } catch {}
      return next;
    });
  };

  // 全选睡觉追踪：记录每天是否全部行动点都用于睡觉
  const [dailySleepOnly, setDailySleepOnly] = useState({}); // { day: true/false }
  const [dayActionLog, setDayActionLog] = useState([]); // 当天已用的action keys

  // Copyright modal
  const [showCopyright, setShowCopyright] = useState(false);
  const [pendingNewGameSaveId, setPendingNewGameSaveId] = useState(null);

  // Battery drain
  useEffect(() => {
    const t = setInterval(() => setBatteryLevel(b => Math.max(20, Math.min(100, b + (Math.random()>0.5?1:-1)))), 10000);
    return () => clearInterval(t);
  }, []);

  // Day event notification
  useEffect(() => {
    const ev = eventOrder ? eventOrder[day] : null;
    if (screen==="home" && !eventDone && ev) {
      setNotifications(prev => {
        const already = prev.some(n => n.app==="LINE" && n.day===day);
        if (already) return prev;
        return [{ app:"LINE", icon:"💬", msg:`${ev.sender}: 发来了一条消息`, time:"刚刚", day }, ...prev].slice(0,20);
      });
    }
  }, [day, screen, eventDone, eventOrder]);

  // Save progress
  const saveProgress = useCallback((updates = {}) => {
    if (currentSaveId===null) return;
    setSaves(prev => prev.map(s => {
      if (s.id!==currentSaveId) return s;
      return {
        ...s, used:true,
        day:   updates.day   !== undefined ? updates.day   : day,
        fans:  updates.fans  !== undefined ? updates.fans  : fans,
        lazy:  updates.lazy  !== undefined ? updates.lazy  : lazy,
        actionPointsLeft: updates.actionPoints !== undefined ? updates.actionPoints : actionPoints,
        eventDone:  updates.eventDone  !== undefined ? updates.eventDone  : eventDone,
        eventChoice:updates.eventChoice!== undefined ? updates.eventChoice : eventChoice,
        endingKey:  updates.endingKey  !== undefined ? updates.endingKey  : endingKey,
        dms: updates.dms !== undefined ? updates.dms : dms,
        news: updates.news !== undefined ? updates.news : newsList,
      };
    }));
  }, [currentSaveId, day, fans, lazy, actionPoints, eventDone, eventChoice, endingKey, dms, newsList, eventOrder]);

  useEffect(() => {
    if (screen!=="saveSelect") saveProgress();
  }, [day, fans, lazy, actionPoints, eventDone, eventChoice, endingKey, dms, newsList, eventOrder]);

  // 添加每日私信和新闻
  const addDailyContent = useCallback((newDay) => {
    // 私信：当天所有私信（多条），过滤掉已存在的
    const newDms = generateDailyDms(newDay).filter(
      nd => !dms.some(d => d.from === nd.from && d.time === nd.time)
    );
    if (newDms.length > 0) {
      setDms(prev => [...prev, ...newDms]);
    }
    // 新闻：每天随机从 NEWS_POOL 抽取1-2条
    const count = rnd(1, 2);
    const shuffled = [...NEWS_POOL].sort(() => Math.random() - 0.5);
    const added = [];
    for (let i = 0; i < shuffled.length && added.length < count; i++) {
      const n = shuffled[i];
      if (!newsList.some(x => x.title === n.title)) {
        added.push({ ...n, time: "刚刚", read: false });
      }
    }
    if (added.length > 0) {
      setNewsList(prev => [...added, ...prev]);
      added.forEach(n => {
        setNotifications(prev => {
          const already = prev.some(p => p.msg && p.msg.includes(n.title.slice(0, 10)));
          if (already) return prev;
          return [{ app:"新闻速递", icon:"📰", msg: n.title, time:"刚刚", id: Date.now()+Math.random() }, ...prev].slice(0, 20);
        });
      });
    }
  }, [dms, newsList]);

  // Handlers
  const showToast = (msg) => { setToast(msg); setTimeout(()=>setToast(null), 1800); };
  const addNotification = (notif) => setNotifications(prev => [{ ...notif, id: Date.now() }, ...prev].slice(0,20));

  const handleAvatarSelect = (src) => {
    setAvatarSrc(src);
  };

  const loadSave = (id, isNewGame = false) => {
    setCurrentSaveId(id);
    const save = saves[id];
    if (!isNewGame && save.used) {
      setDay(save.day); setFans(save.fans); setLazy(save.lazy);
      setActionPoints(save.actionPointsLeft); setEventDone(save.eventDone);
      setEventChoice(save.eventChoice); setEndingKey(save.endingKey);
      if (save.dms) setDms(save.dms);
      if (save.news) setNewsList(save.news);
      if (save.eventOrder) setEventOrder(save.eventOrder);
      if (save.endingKey) setScreen("ending");
      else { setScreen("lock"); setIsLocked(true); }
    } else {
      // new game or reset
      setDay(1); setFans(120); setLazy(3); setActionPoints(3);
      setEventDone(false); setEventChoice(null); setEndingKey(null);
      setPosts(makeInitialPosts());
      setTwFeed(TW_POSTS_BASE.map(p => ({ ...p, id: uid("tw_p"), likes: rnd(100000,500000), time: pick(["2小时前","5小时前","1天前"]) })));
      setIgGrid(INITIAL_IG_GRID);
      setDms(generateDailyDms(1));
      setDailySleepOnly({});
      setDayActionLog([]);
      setNewsList(INITIAL_NEWS);
      setLikedPosts({}); setCustomComments({}); setTwLiked(new Set());
      setEventOrder(generateEventOrder());
      setNotifications([]);
      setShowPrologue(true);
      setScreen("lock"); setIsLocked(true);
    }
  };

  const handleSelectSave = (id) => {
    const save = saves[id];
    if (!save.used) {
      setPendingNewGameSaveId(id);
      setShowCopyright(true);
    } else {
      loadSave(id);
    }
  };

  const handleCopyrightConfirm = () => {
    setShowCopyright(false);
    if (pendingNewGameSaveId !== null) {
      setSaves(prev => prev.map(s => s.id === pendingNewGameSaveId ? { ...EMPTY_SAVE, id: pendingNewGameSaveId } : s));
      loadSave(pendingNewGameSaveId, true);
      setPendingNewGameSaveId(null);
    }
  };

  const handleResetSave = (id) => {
    setSaves(prev => prev.map(s => s.id===id ? { ...EMPTY_SAVE, id } : s));
    if (currentSaveId===id) { setCurrentSaveId(null); }
  };

  // Settle action
  const settleAction = (actionKey) => {
    const act = ACTIONS[actionKey];
    if (!act) return false;
    if (actionPoints < act.cost) {
      showToast("今日行动点不足！💤");
      return false;
    }
    const fanDelta = rnd(act.fanMin, act.fanMax);
    const newFans = Math.max(0, fans + fanDelta);
    const newLazy = Math.min(10, Math.max(0, lazy + act.lazy));
    const newAP = actionPoints - act.cost;
    setFans(newFans); setLazy(newLazy); setActionPoints(newAP);
    setDayActionLog(prev => [...prev, actionKey]);
    showToast(fanDelta >= 0 ? `✨ 粉丝 +${fanDelta}万！行动点 -${act.cost}` : `📉 粉丝 ${fanDelta}万 行动点 -${act.cost}`);
    return true;
  };

  const handleAction = (actionKey, appId) => {
    const act = ACTIONS[actionKey];
    if (!act) {
      setScreen(appId);
      return;
    }
    if (actionKey === "signing") {
      if (actionPoints < 3) { showToast("签售会需要 3 个行动点！💤"); return; }
      setActionPoints(ap => ap - 3);
      setLazy(l => Math.max(0, l - 1));
      showToast("🎀 签售会开始！消耗全部行动点");
      setScreen("signing");
      return;
    }
    if (!act.requiresPublish) {
      settleAction(actionKey);
      if (act.screen) setScreen(act.screen);
    } else {
      if (actionPoints < act.cost) {
        showToast("今日行动点不足！💤");
        return;
      }
      setPendingAction({ actionKey, cost: act.cost });
      setScreen(act.screen);
    }
  };

  const handleActionComplete = () => {
    if (pendingAction) {
      settleAction(pendingAction.actionKey);
      setPendingAction(null);
      setScreen("home");
    } else {
      setScreen("home");
    }
  };

  const handleEventOption = (opt, stayInChat = true) => {
    setEventChoice(opt);
    setEventDone(true);
    const newLazy = Math.min(10, Math.max(0, lazy + opt.lazyDelta));
    const newFans = Math.max(0, fans + opt.fanDelta);
    setLazy(newLazy); setFans(newFans);
    // stay in chat to show conversation
  };

  const handleEndDay = () => {
    // 记录今天是否全部行动都是睡觉
    const todayAllSleep = dayActionLog.length > 0 && dayActionLog.every(k => k === "sleep");
    const newSleepLog = { ...dailySleepOnly, [day]: todayAllSleep };
    setDailySleepOnly(newSleepLog);
    setDayActionLog([]);

    if (day >= 10) {
      // 检查全10天是否都全选睡觉
      const allSleepDays = Object.keys(newSleepLog).length === 10 && Object.values(newSleepLog).every(Boolean);
      const eKey = getEnding(fans, lazy, allSleepDays, unlockedAchievements);
      setEndingKey(eKey);
      setScreen("ending");
      unlockAchievement(eKey);
      if (eKey === "hidden") showToast("☁️ 隐藏结局解锁！");
      saveProgress({ endingKey: eKey });
    } else {
      const nextDay = day + 1;
      setDay(nextDay); setActionPoints(3); setEventDone(false); setEventChoice(null);
      addDailyContent(nextDay);
      setScreen("lock"); setIsLocked(true);
      saveProgress({ day: nextDay, actionPoints: 3, eventDone: false, eventChoice: null, dms, news: newsList });
    }
  };

  const unreadDmsCount = dms.filter(d => !d.read).length;
  const currentTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const renderContent = () => {
    if (screen==="saveSelect") return (
      <SaveSelectScreen saves={saves} onSelect={handleSelectSave} onReset={handleResetSave} C={C} themeMode={themeMode} toggleTheme={toggleTheme} unlockedAchievements={unlockedAchievements} />
    );
    if (screen==="ending") return (
      <EndingScreen endingKey={endingKey} onGoSave={() => { setScreen("saveSelect"); setCurrentSaveId(null); }} fans={fans} lazy={lazy} C={C} />
    );
    if (isLocked) return <LockScreen onUnlock={() => { setIsLocked(false); setScreen("home"); }} notifications={notifications} C={C} />;

    if (viewingCommentPost) return (
      <CommentViewScreen viewing={viewingCommentPost} setViewing={setViewingCommentPost} customComments={customComments} setCustomComments={setCustomComments} C={C} />
    );

    switch (screen) {
      case "home": return (
        <HomeLauncher
          setScreen={setScreen}
          notifications={notifications}
          avatarSrc={avatarSrc}
          onAvatarSelect={handleAvatarSelect}
          C={C} themeMode={themeMode} toggleTheme={toggleTheme}
          unreadTotal={unreadDmsCount}
          newsUnread={newsList.filter(n => !n.read).length}
          day={day} fans={fans} lazy={lazy} actionPoints={actionPoints}
          eventDone={eventDone}
          onAction={handleAction}
          onEndDay={handleEndDay}
          onGoChat={() => setScreen("chat")}
          currentEvent={eventOrder ? eventOrder[day] : null}
        />
      );
      case "chat": return (
        <ChatScreen setScreen={setScreen} day={day} eventDone={eventDone} eventChoice={eventChoice} onEventOption={handleEventOption} C={C} pendingEventOption={null} setPendingEventOption={()=>{}} currentEvent={eventOrder ? eventOrder[day] : null} />
      );
      case "yuyu": return (
        <YuyuProfile setScreen={setScreen} posts={posts} likedPosts={likedPosts} toggleLike={(id)=>setLikedPosts(p=>({...p,[id]:!p[id]}))} customComments={customComments} setViewing={setViewingCommentPost} C={C} avatarSrc={avatarSrc} onAvatarSelect={handleAvatarSelect} />
      );
      case "post": return (
        <PostCreatorScreen setScreen={setScreen} avatarSrc={avatarSrc} onSave={(text,tag,imgSrc) => {
          const newP = { id:uid("post"), content:`✞ ${text} 💒 #${tag} #清寺小悠 #天使偶像`, tag, image:imgSrc||null, time:"刚刚", likes:rnd(8000,30000), shares:rnd(500,3000), comments:genComments(rnd(12,40)) };
          setPosts(p => [newP,...p]);
          addNotification({ app:"小悠主页", icon:"💒", msg:"你发布了一条新动态", time:"刚刚" });
        }} C={C} onActionComplete={handleActionComplete} />
      );
      case "twitter": return (
        <TwitterScreen setScreen={setScreen} feed={twFeed} setFeed={setTwFeed} likedSet={twLiked} setLikedSet={setTwLiked} C={C} addNotification={addNotification} avatarSrc={avatarSrc} onActionComplete={handleActionComplete} />
      );
      case "instagram": return (
        <InstagramScreen setScreen={setScreen} grid={igGrid} setGrid={setIgGrid} C={C} addNotification={addNotification} onActionComplete={handleActionComplete} />
      );
      case "news": return <NewsScreen setScreen={setScreen} newsList={newsList} setNewsList={setNewsList} C={C} />;
      case "messages": return <DmsScreen setScreen={setScreen} dms={dms} setDms={setDms} C={C} />;
      case "live": return <LiveScreen setScreen={setScreen} C={C} onActionComplete={handleActionComplete} />;
      case "music": return <MusicScreen setScreen={setScreen} C={C} onActionComplete={handleActionComplete} />;
      case "signing": return <SigningScreen setScreen={setScreen} C={C} onFanBoost={(boost) => { setFans(f => Math.max(0, f + boost)); showToast(boost > 0 ? `🎀 签售结束！+${boost}万粉丝` : `🎀 签售结束`); }} />;
      case "calendar": return <CalendarScreen setScreen={setScreen} C={C} />;
      default: return null;
    }
  };

  const showStatusBar = screen !== "saveSelect" && screen !== "ending";

  return (
    <div style={{ width:"100vw", height:"100vh", background:"#08020c", display:"flex", alignItems:"center", justifyContent:"center", overflow:"hidden", fontFamily:'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      <div style={{ width:"100%", maxWidth:412, height:"100%", maxHeight:892, background:C.bg, borderRadius:50, border:"12px solid #2d2630", boxShadow:"0 25px 60px rgba(0,0,0,0.8), inset 0 0 4px rgba(255,255,255,0.2)", display:"flex", flexDirection:"column", position:"relative", overflow:"hidden" }}>
        {showStatusBar && (
          <div style={{ position:"absolute", top:11, left:"50%", transform:"translateX(-50%)", width:110, height:28, background:"#000", borderRadius:20, zIndex:1000, display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 12px", boxSizing:"border-box" }}>
            <div style={{ width:11, height:11, background:"#1a1a2e", borderRadius:"50%", border:"1px solid #222" }} />
            <div style={{ width:5, height:5, background:"#08081a", borderRadius:"50%" }} />
          </div>
        )}
        {showStatusBar && (
          <div style={{ height:42, padding:"0 24px", display:"flex", alignItems:"center", justifyContent:"space-between", position:"relative", zIndex:999, color:themeMode==="purple"?"#ffe4f0":"#4a2835", userSelect:"none", fontSize:12, fontWeight:600 }}>
            <div>{currentTime}</div>
            <div style={{ display:"flex", alignItems:"center", gap:6 }}>
              <span>📶</span>
              <div style={{ display:"flex", alignItems:"center", gap:3 }}>
                <div style={{ width:22, height:11, border:`1px solid ${themeMode==="purple"?"#ffe4f0":"#4a2835"}`, borderRadius:3, padding:1, display:"flex", alignItems:"center" }}>
                  <div style={{ width:`${batteryLevel}%`, height:"100%", background:"#10b981", borderRadius:1.5 }} />
                </div>
                <span style={{ fontSize:10, fontWeight:700 }}>{batteryLevel}%</span>
              </div>
            </div>
          </div>
        )}
        <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden", position:"relative" }}>
          {renderContent()}
          {showCopyright && <CopyrightModal onConfirm={handleCopyrightConfirm} C={C} />}
          {showPrologue && screen!=="saveSelect" && <PrologueModal onClose={() => setShowPrologue(false)} C={C} />}
          {toast && <ActionToast msg={toast} C={C} />}
        </div>
        {showStatusBar && (
          <div style={{ height:20, display:"flex", alignItems:"center", justifyContent:"center", position:"relative", zIndex:999, paddingBottom:4 }}>
            <div onClick={() => { if (!isLocked && screen!=="saveSelect"&&screen!=="ending") { setScreen("home"); setViewingCommentPost(null); } }} style={{ width:134, height:5, background:themeMode==="purple"?"#ffe4f0":"#4a2835", borderRadius:10, cursor:"pointer", opacity:0.8 }} />
          </div>
        )}
      </div>
      <style>{`
        @keyframes pulse { 0%,100%{opacity:1}50%{opacity:0.4} }
        @keyframes bounce { 0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)} }
        @keyframes spin { 100%{transform:rotate(360deg)} }
      `}</style>
    </div>
  );
}