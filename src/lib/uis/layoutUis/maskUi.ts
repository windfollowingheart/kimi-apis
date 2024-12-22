import { icons } from "../../icons/icons"



function createMaskDiv(doc: Document): HTMLDivElement{
    const maskDiv = doc.createElement("div")
    maskDiv.classList.add("kimi-mask-div")
    maskDiv.style.position = "absolute"
    maskDiv.style.top = "0"
    maskDiv.style.left = "0"
    maskDiv.style.right = "0"
    maskDiv.style.bottom = "0"
    maskDiv.style.background = "rgba(0, 0, 0, 0.5)"
    maskDiv.style.zIndex = "10"
    return maskDiv
}

function createChatHistorySwitchLoadingMaskDiv(doc: Document): HTMLDivElement{
    const chatHistorySwitchLoadingMaskDiv = doc.createElement("div")
    chatHistorySwitchLoadingMaskDiv.classList.add("kimi-chat-history-switch-loading-mask-div")
    // 创建一个loading动画
    const loadingAnimationDiv = doc.createElement("div")
    loadingAnimationDiv.classList.add("kimi-chat-history-switch-loading-animation-div")
    loadingAnimationDiv.innerHTML = `<img style="width: 40px; height: 40px;" src="${icons.uploadFileLoadingIcon}" alt="loading" />`
    // loadingAnimationDiv.innerHTML = `<img style="width: 25px; height: 25px;" src="${icons.agentMessageRespondingIcon}" alt="回复中" />`
    // <img style="width: 25px; height: 25px;" src="${icons.agentMessageRespondingIcon}" alt="回复中" />
    chatHistorySwitchLoadingMaskDiv.appendChild(loadingAnimationDiv)
    return chatHistorySwitchLoadingMaskDiv
}


export {
    createMaskDiv,
    createChatHistorySwitchLoadingMaskDiv
}


