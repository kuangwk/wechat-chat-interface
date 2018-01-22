(function () {

    // 一些用到的 DOM
    const input = document.querySelector('.js-input');
    const wrapper = document.querySelector('.wrapper');
    const main = document.querySelector('main');
    const messageList = document.querySelector('.message-list');
    const selectList = document.querySelector('.message-select');
    const tips = document.querySelector('.cover-tips');
    const wechatPage = document.querySelector('.wechat-page');
    const firstPage = document.querySelector('.first-page');


    const showSelectorClass = 'show-selector';
    const maxStep = CONFIG.messages.length;
    let score = 0; // 总分数
    let step = 0;

    // util 函数
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

    function isWeixinBrowser(){
        return /micromessenger/.test(navigator.userAgent.toLowerCase())
    }

    function changeTitle(title) {
        document.title = title;
    }

    /* ----  end of util ----- */

    function bindEvents() {

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


    function showSelect() {
        addClass(wrapper, showSelectorClass);
        scrollToBottom(main, 400);
    }

    function getMessageStr(side, message) {
        return `<div class="message-item message-item--${side}">
                <img class="avatar" src="${CONFIG.avatar[side]}" alt="头像">
                <div class="message-bubble">${message}</div>
            </div>`;
    }

    function getSelectMsgStr(messageObj) {
        return `<div class="message-item message-item--right js-to-select" data-score=${messageObj.score}>
                <img class="avatar" src="./img/boy.png" alt="头像">
                <div class="message-bubble">${messageObj.text}</div>
            </div>`;
    }

    function appendMessage(side, message) {
        const msgDom = strToDomObj(getMessageStr(side, message));
        messageList.appendChild(msgDom);
    }

    function changeSelectMessage(step) {
        const messageToSelect = CONFIG.messages[step].right;
        let str = '';
        messageToSelect.forEach(message => {
            str += getSelectMsgStr(message);
        });
        selectList.innerHTML = str;
    }

    function appendLeftMessage(stepOrMessage) {
        appendMessage('left', CONFIG.messages[stepOrMessage].left || stepOrMessage);
    }

    function getResultByScore(score) {
        const resultMsg = CONFIG.result;
        let result =  resultMsg[0];
        resultMsg.every((resultObj)=> {
            if (score >= resultObj.score) {
                result = resultObj
                return false;
            }
            return true;
        })
        return result;
    }

    function showTips() {
        tips.querySelector('.tips-text').innerText = `分数：${score}
        ${resultObj.tips}`;
        tips.classList.remove('hide');
    }

    function showResult() {
        setTimeout(() => {
            // 显示左边最后的对话
            const resultObj = getResultByScore(score);
            appendLeftMessage(resultObj.say);
            // 延时 1s 显示结果窗口
            setTimeout(()=> {
                showTips()
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
                appendLeftMessage(currentStep);
                setTimeout(()=> {
                    showSelect()
                }, 300);
            }, 1000);
        } else {
            showResult();
        }
        step += 1;
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
        preloadImg(CONFIG.avatar.left);
        preloadImg(CONFIG.avatar.right);
        preloadImg('./img/icon/replay.svg');
        preloadImg('./img/icon/share.svg');
    }

    function setWording() {
        document.querySelector('.first-page-text').innerText = CONFIG.firstPage;
    }

    function init() {
        checkBrowser();
        setWording();
        bindEvents();
        hideLoading();
        preloadImages();
    }

    window.onload = function() {
        init();
    }

}())