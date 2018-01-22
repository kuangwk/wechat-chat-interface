const girlMessages = [
    "工作怎么样呀？",
    "有对象了吗？",
    "工资多少啊？",
    "明年有什么打算呢？"
]

const boyMessage = [
    [{
        text: '不如您家孩子厉害，还要继续学习',
        score: 3
    }, {
        text: '一般啦，比您家孩子好一点。',
        score: -2
    }, {
        text: '领导经常叫我加班',
        score: 1
    }],
    [{
        text: '被你家孩子租回家过年了。',
        score: -2
    }, {
        text: '我还是个孩子，妈妈说不要早恋',
        score: 1
    }, {
        text: '对象对我挺好的，谢谢关心。',
        score: 3
    }],
    [{
        text: '刚好比你家孩子多那么一点。',
        score: -2
    }, {
        text: '一般，我刚买了个表',
        score: 1
    }, {
        text: '不多，刚好够基本生活。',
        score: 3
    }],
    [{
        text: '还没有什么打算。',
        score: 1
    }, {
        text: '多多努力，向您学习。',
        score: 3
    }, {
        text: '凑钱把房子买了，阿姨打算给我多少红包呀？',
        score: -2
    }]
]

const resultMsg = [{
    score: 8,
    tips: '传说中别人家的孩子，给你99分，多给一分怕你骄傲',
    girlSay: '好孩子',
}, {
    score: 4,
    tips: '来年继续加油吧！别人家的孩子都在虎视眈眈想超过你呢',
    girlSay: '不错',
}, {
    score: 0,
    tips: '恭喜你捡回一条命！来年可没这么好运了，保重。',
    girlSay: '呵呵',
}, {
    score: -10,
    tips: '请问你是怎么活过这么多年的？还是好好找个洞藏起来保命吧。',
    girlSay: '这孩子怎么这样子',
}]
