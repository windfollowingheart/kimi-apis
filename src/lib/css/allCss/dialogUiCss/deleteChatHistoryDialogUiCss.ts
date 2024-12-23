

function createDeleteChatHistoryDialogUiCss(doc:Document){
    const deleteChatHistoryDialogUiCss = doc.createElement("style")
    deleteChatHistoryDialogUiCss.innerHTML = `
    .kimi-delete-chat-history-dialog { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background-color: #fff; z-index: 10; background-color: #fff; border-radius: 10px; padding: 0 10px 10px 10px; width: 300px; font-size: 12px; font-family: Arial, Helvetica, sans-serif; box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);}.kimi-delete-chat-history-dialog-title-container-div { display: flex; justify-content: space-between; align-items: center; margin: 5px 0px 10px 0px;}.kimi-delete-chat-history-dialog-title-div { font-size: 16px; font-weight: 500;}.kimi-delete-chat-history-dialog-prompt-div { box-sizing: border-box; font-size: 14px; font-weight: 300; padding: 10px; color: #666;}.kimi-delete-chat-history-dialog-confirm-and-cancel-button-container-div { box-sizing: border-box; display: flex; justify-content: flex-end; align-items: center; margin: 5px 0px; height: 20px;}.kimi-delete-chat-history-dialog-confirm-button-div { box-sizing: border-box; margin-right: 10px; border: 1px solid rgb(80, 123, 214); color: rgb(80, 123, 214); border-radius: 5px; padding: 5px; cursor: pointer; display: flex; align-items: center; justify-content: center;}.kimi-delete-chat-history-dialog-cancel-button-div { box-sizing: border-box; border-radius: 5px; padding: 5px; cursor: pointer; display: flex; align-items: center; justify-content: center; border: 1px solid rgb(80, 123, 214); background-color: rgb(80, 123, 214); color: #fff;}
    `
    return deleteChatHistoryDialogUiCss
}

export {
    createDeleteChatHistoryDialogUiCss
}