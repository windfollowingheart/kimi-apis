

function createKimiChatHistoryUiCss(doc:Document){
    const kimiChatHistoryUiCss = doc.createElement("style")
    kimiChatHistoryUiCss.innerHTML = `
    .chat-history-item-container-div { display: flex; align-items: center; justify-content: space-between; margin: 5px; background-color: #fff; border-radius: 5px; padding: 5px; box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1); width: 90%; color: #000; font-size: 12px; font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace; cursor: pointer; height: 40px;}.kimi-sidebar-history-chat-list-container-item-active{ background-color: #94d0f8;}.chat-history-item-title-text-div { display: block; line-height: 50px; width: 60%; width: 260px; text-overflow: ellipsis; white-space: nowrap; overflow: hidden; font-size: 12px; font-weight: 500;}.chat-history-item-date-div { display: block; line-height: 50px; width: 150px; white-space: nowrap; overflow: hidden; font-size: 12px;}.chat-history-item-tool-bar-div { display: none; align-items: center; justify-content: flex-end;}.chat-history-item-tool-bar-edit-icon-div,.chat-history-item-tool-bar-delete-icon-div { width: 20px; height: 20px; margin-right: 5px; cursor: pointer;}.kimi-chat-history-switch-loading-mask-div { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(0, 0, 0, 0.5); z-index: 10;}.kimi-chat-history-switch-loading-animation-div { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 40px; height: 40px; z-index: 10;}
    `
    return kimiChatHistoryUiCss
}

export {
    createKimiChatHistoryUiCss
}