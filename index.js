/* eslint-env browser */

(function () {
    // 工具函数
  function getHash (key) {
    const match = window.location.hash.match(new RegExp(`${key}=([^&]*)`))
    return match ? match[1] : ''
  }

  function removeClass (element, className) {
    element.classList.remove(className)
  }

  function addClass (element, className) {
    element.classList.add(className)
  }

  function scrollToBottom (element, timeout) {
    setTimeout(() => {
      element.scrollTop = element.scrollHeight
    }, timeout || 0)
  }

  function fadeout (element, duration) {
    addClass(element, 'fadeout')
    setTimeout(() => {
      element.remove()
    }, duration || 300)
  }

  function strToDomObj (str) {
    const div = document.createElement('div')
    div.innerHTML = str
    return div.firstChild
  }

  function isWeixinBrowser () {
    return /micromessenger/.test(navigator.userAgent.toLowerCase())
  }

  /* ----  end of 工具函数 ----- */

  // 通过 hash 获取当前主题。 因为没有模块化，暂时主题变量就暴露在 window 上
  const theme = getHash('theme') || 'NEW_YEAR'
  const CONFIG = window[theme]

  const wrapper = document.querySelector('.wrapper')
  const main = document.querySelector('main')
  const messageList = document.querySelector('.message-list')
  const selectList = document.querySelector('.message-select')
  const tips = document.querySelector('.cover-tips')
  const wechatPage = document.querySelector('.wechat-page')
  const firstPage = document.querySelector('.first-page')

  const maxStep = CONFIG.messages.length
  let score = 0 // 总分数
  let step = 0

  function bindEvents () {
        // 实现事件委托
    selectList.addEventListener('touchend', (event) => {
      let target = event.target
      const currentTarget = event.currentTarget
      while (target !== currentTarget) {
        if (target.classList.contains('js-to-select')) {
          const currentScore = +target.getAttribute('data-score')
          const message = target.querySelector('.message-bubble').innerText
          appendMessage('right', message)
          score += currentScore
          nextStep()
          return
        }
        target = target.parentNode
      }
    })

    document.querySelector('.icon-replay').addEventListener('touchend', (event) => {
      window.location.reload()
    })

    document.querySelector('.btn-continue').addEventListener('touchend', (event) => {
      removeClass(wechatPage, 'hide')
      fadeout(firstPage)
      nextStep()
    })
  }

  function toggleSelector (isShow) {
    let className = 'show-selector'
    if (isShow) {
      addClass(wrapper, className)
      scrollToBottom(main, 400)
    } else {
      removeClass(wrapper, className)
    }
  }

  function getMessageStr (side, message) {
    return `<div class="message-item message-item--${side}">
                <img class="avatar" src="${CONFIG.avatar[side]}" alt="头像">
                <div class="message-bubble">${message}</div>
            </div>`
  }

  function getSelectMsgStr (messageObj) {
    return `<div class="message-item message-item--right js-to-select" data-score=${messageObj.score}>
                <img class="avatar" src="${CONFIG.avatar.right}" alt="头像">
                <div class="message-bubble">${messageObj.text}</div>
            </div>`
  }

  function appendMessage (side, message) {
    const msgDom = strToDomObj(getMessageStr(side, message))
    messageList.appendChild(msgDom)
  }

  function changeSelectMessage (step) {
    const messageToSelect = CONFIG.messages[step].right
    let str = ''
    messageToSelect.forEach(message => {
      str += getSelectMsgStr(message)
    })
    selectList.innerHTML = str
  }

  function appendLeftMessage (step) {
    appendMessage('left', CONFIG.messages[step].left)
  }

  function getResultByScore (score) {
    const resultMsg = CONFIG.result
    let result = resultMsg[0]
    resultMsg.every((resultObj) => {
      if (score >= resultObj.score) {
        result = resultObj
        return false
      }
      return true
    })
    return result
  }

  function showTips (resultObj) {
    tips.querySelector('.tips-text').innerText = `分数：${score}
        ${resultObj.tips}`
    removeClass(tips, 'hide')
  }

  function showResult () {
    setTimeout(() => {
            // 显示左边最后的对话
      const resultObj = getResultByScore(score)
            // 延时 1s 显示结果窗口
      appendMessage('left', resultObj.say)
            // 显示结果窗口
      setTimeout(() => {
        showTips(resultObj)
      }, 1000)
    }, 1000)
  }

  function nextStep () {
    const currentStep = step
    toggleSelector(false)
    if (step < maxStep) {
      setTimeout(() => {
        changeSelectMessage(currentStep)
      }, 300)
      setTimeout(() => {
        appendLeftMessage(currentStep)
        setTimeout(() => {
          toggleSelector(true)
        }, 300)  // 0.3s后显示选择框
      }, 1000) // 延时1s显示小时
    } else {
      showResult()
    }
    step += 1
  }

  function checkBrowser () {
    if (isWeixinBrowser()) {
      document.body.classList.add('wechat')
    }
  }

  function hideLoading () {
    const loading = document.querySelector('.loading')
    fadeout(loading)
  }

  function preloadImg (src) {
    const img = new Image()
    img.src = src
  }

  function preloadImages () {
    preloadImg(CONFIG.avatar.left)
    preloadImg(CONFIG.avatar.right)
    preloadImg('./img/icon/replay.svg')
    preloadImg('./img/icon/share.svg')
  }

  function setWording () {
    document.title = CONFIG.title
    document.querySelector('.first-page-text').innerText = CONFIG.firstPage
    document.querySelector('.nav-name').innerText = CONFIG.name
  }

  function init () {
    checkBrowser()
    setWording()
    bindEvents()
    hideLoading()
    preloadImages()
  }

  window.onload = function () {
    init()
  }
}())
