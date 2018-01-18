(function () {

    const girlMessages = ['你好!', '我肚子疼', '这个瓶盖好紧']
    const boyMessage = [
        [{
            text: 'hello',
            score: 0
        }, {
            text: '美女，发个真人照片呗',
            score: -3
        }, {
            text: '你好，你的头像很可爱',
            score: 1
        }], [{
            text: '多喝热水',
            score: -1
        }, {
            text: '我已经在美团买了姜茶了',
            score: 1
        }, {
            text: '开门，我买了姜茶在门口',
            score: 3
        }],[{
            text: '大力点，可以的',
            score: -1
        }, {
            text: '别装了，上次看你开都没问题',
            score: -2
        }, {
            text: '我来帮你开',
            score: 3
        }]
    ]
    const resultMsg = [{
        score: 4,
        tips: '超级棒',
        girlSay: '你真贴心',
    }, {
        score: 0,
        tips: '还行吧',
        girlSay: '哦',
    }, {
        score: -2,
        tips: '你走远了',
        girlSay: '呵呵',
    }, {
        score: -10,
        tips: '你已经被拉黑',
        girlSay: '再见',
    }]

    const input = document.querySelector('.js-input');
    const wrapper = document.querySelector('.wrapper');
    const main = document.querySelector('main');
    const messageList = document.querySelector('.message-list');
    const selectList = document.querySelector('.message-select');
    const tips = document.querySelector('.cover-tips');
    const wechatPage = document.querySelector('.wechat-page');
    const firstPage = document.querySelector('.first-page');


    const showSelectorClass = 'show-selector';
    const maxStep = girlMessages.length;
    let score = 0; // 总分数

    function hasClass(element, className) {
        return element.classList.contains(className);
    }


    function removeClass(element, className) {
        element.classList.remove(className);
    }

    function addClass(element, className) {
        element.classList.add(className);
    }


    function scrollToBottom(element, timeout) {
        setTimeout(() => {
            element.scrollTop = element.scrollHeight;
        }, timeout || 0)
    }

    function showSelect() {
        addClass(wrapper, showSelectorClass);
        scrollToBottom(main, 400);
    }

    function bindEvents() {
        // input.addEventListener('touchend', (e) => {
        //     addClass(wrapper, showSelectorClass);
        //     scrollToBottom(main, 400);
        // });

        // 实现事件委托
        selectList.addEventListener('touchend', (event) => {
            let target = event.target;
            const currentTarget = event.currentTarget;
            while (target !== currentTarget) {
                if (target.classList.contains('js-to-select')) {
                    const currentScore = +target.getAttribute('data-score');
                    const message = target.querySelector('.message-bubble').innerText;
                    appendMessage('boy', message);
                    score += currentScore;
                    nextStep();
                    return;
                }
                target = target.parentNode;
            }
        })

        document.querySelector('.icon-replay').addEventListener('touchend', (event)=> {
            window.location.reload();
        })

        document.querySelector('.btn-continue').addEventListener('touchend', (event)=> {
            removeClass(wechatPage, 'hide');
            fadeout(firstPage);
            nextStep();
        })
    }

    function fadeout(element, duration) {
        addClass(element, 'fadeout');
        setTimeout(()=> {
            element.remove();
        }, duration || 300);
    }

    function strToDomObj(str) {
        const div = document.createElement('div');
        div.innerHTML = str;
        return div.firstChild;
    }

    function getMessageStr(who, message) {
        return `<div class="message-item message-item--${who === 'boy' ? 'right' : 'left'}">
                <img class="avatar" src="./img/${who}.png" alt="头像">
                <div class="message-bubble">${message}</div>
            </div>`;
    }

    function getSelectMsgStr(messageObj) {
        return `<div class="message-item message-item--right js-to-select" data-score=${messageObj.score}>
                <img class="avatar" src="./img/boy.png" alt="头像">
                <div class="message-bubble">${messageObj.text}</div>
            </div>`;
    }

    function appendMessage(who, message) {
        const msgDom = strToDomObj(getMessageStr(who, message));
        messageList.appendChild(msgDom);
    }

    function changeSelectMessage(step) {
        const messageToSelect = boyMessage[step];
        let str = '';
        messageToSelect.forEach(message => {
            str += getSelectMsgStr(message);
        });
        selectList.innerHTML = str;
    }

    function appendGirlMessage(stepOrMessage) {
        appendMessage('girl', girlMessages[stepOrMessage] || stepOrMessage);
    }

    let step = 0;

    function getResultByScore(score) {
        let result = resultMsg[0];
        resultMsg.every((resultObj)=> {
            console.log(score, resultObj.score);
            if (score >= resultObj.score) {
                result = resultObj
                return false;
            }
            return true;
        })
        return result;
    }

    function showResult() {
        setTimeout(() => {
            const resultObj = getResultByScore(score);
            appendGirlMessage(resultObj.girlSay);
            // 显示结果窗口
            setTimeout(()=> {
                let text = ''
                tips.querySelector('.tips-text').innerText = `分数：${score}
                ${resultObj.tips}`;
                tips.classList.remove('hide');
            }, 1000);
        }, 1000);
    }

    function nextStep() {
        currentStep = step;
        removeClass(wrapper, showSelectorClass);
        if (step < maxStep) {
            setTimeout(() => {
                changeSelectMessage(currentStep);
            }, 300);
            setTimeout(() => {
                appendGirlMessage(currentStep);
                setTimeout(()=> {
                    showSelect()
                }, 300);
            }, 1000);
        } else {
            showResult();
        }
        step += 1;
    }

    function isWeixinBrowser(){
        return /micromessenger/.test(navigator.userAgent.toLowerCase())
    }

    function checkBrowser() {
        if (isWeixinBrowser()) {
            document.body.classList.add('wechat');
        }
    }

    function hideLoading() {
        const loading = document.querySelector('.loading');
        fadeout(loading);
    }

    function preloadImg(src) {
        const img = new Image();
        img.src = src;
    }

    function preloadImages() {
        preloadImg('./img/boy.png');
        preloadImg('./img/girl.png');
        preloadImg('./img/icon/replay.svg');
        preloadImg('./img/icon/share.svg');
    }

    function init() {
        checkBrowser();
        bindEvents();
        hideLoading();
        preloadImages();
    }

    window.onload = function() {
        init();
    }

}())