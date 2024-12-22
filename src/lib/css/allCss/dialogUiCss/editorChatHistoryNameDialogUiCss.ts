

function createEditorChatHistoryNameDialogUiCss(doc:Document){
    const editorChatHistoryNameDialogUiCss = doc.createElement("style")
    editorChatHistoryNameDialogUiCss.innerHTML = `
    .kimi-edit-chat-history-name-dialog { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background-color: #fff; z-index: 10; background-color: #fff; border-radius: 10px; padding: 0 10px 10px 10px; width: 300px; font-size: 12px; font-family: Arial, Helvetica, sans-serif; box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);}.kimi-edit-chat-history-name-dialog-title-and-x-container-div { display: flex; justify-content: space-between; align-items: center; margin: 5px 0px 10px 0px;}.kimi-edit-chat-history-name-dialog-title-div { font-size: 16px; font-weight: 500;}.kimi-edit-chat-history-name-dialog-cancel-x-button { font-size: 20px; cursor: pointer; border: none; background-color: transparent;}.kimi-edit-chat-history-name-dialog-input-container-div { box-sizing: border-box; display: flex; flex-direction: column; align-items: center; margin: 5px 0px 10px 0px;}.kimi-edit-chat-history-name-dialog-input-input { box-sizing: border-box; width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 5px;}.kimi-edit-chat-history-name-dialog-confirm-and-cancel-button-container-div { box-sizing: border-box; display: flex; justify-content: flex-end; align-items: center; margin: 5px 0px; height: 20px;}.kimi-edit-chat-history-name-dialog-confirm-button-div { box-sizing: border-box; margin-right: 10px; border: 1px solid rgb(80, 123, 214); color: rgb(80, 123, 214); border-radius: 5px; padding: 5px; cursor: pointer; display: flex; align-items: center; justify-content: center;}.kimi-edit-chat-history-name-dialog-cancel-button-div { box-sizing: border-box; border-radius: 5px; padding: 5px; cursor: pointer; display: flex; align-items: center; justify-content: center; border: 1px solid rgb(80, 123, 214); background-color: rgb(80, 123, 214); color: #fff;}
    `
    return editorChatHistoryNameDialogUiCss
}

export {
    createEditorChatHistoryNameDialogUiCss
}