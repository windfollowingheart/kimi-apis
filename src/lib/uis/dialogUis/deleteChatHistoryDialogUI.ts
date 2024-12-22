

function createDeleteChatHistoryDialog({doc}: 
    {
        doc: Document,
    }): HTMLDivElement{
    const deleteChatHistoryDialog = doc.createElement("div")
    deleteChatHistoryDialog.classList.add("kimi-delete-chat-history-dialog")

    // 创建三个子div 纵向布局，分别是第一行 dialog标题
    //第二行提示
    // 第三行取消和确认按钮

    // 创建标题和x 容器
    const titleContainerDiv = doc.createElement("div")
    titleContainerDiv.classList.add("kimi-delete-chat-history-dialog-title-container-div")
    
    // 创建标题div
    const dialogTitleDiv = doc.createElement("div")
    dialogTitleDiv.classList.add("kimi-delete-chat-history-dialog-title-div")
    dialogTitleDiv.innerHTML = "永久删除会话"
    
    // 创建提示div
    const promptDiv = doc.createElement("div")
    promptDiv.classList.add("kimi-delete-chat-history-dialog-prompt-div")
    promptDiv.innerHTML = "本条会话数据将被永久删除，不可恢复及撤销。确定要删除吗？"

    

    // 创建确定取消按钮容器
    const confirmAndCancelButtonContainerDiv = doc.createElement("div")
    confirmAndCancelButtonContainerDiv.classList.add("kimi-delete-chat-history-dialog-confirm-and-cancel-button-container-div")

    // 创建确定按钮
    const confirmButton = doc.createElement("div")
    confirmButton.classList.add("kimi-delete-chat-history-dialog-confirm-button-div")
    confirmButton.innerHTML = "确定"

    // 创建取消按钮
    const cancelButton = doc.createElement("div")
    cancelButton.classList.add("kimi-delete-chat-history-dialog-cancel-button-div")
    cancelButton.innerHTML = "取消"

    // 将所有子div添加到父div中
    titleContainerDiv.append(dialogTitleDiv)
    confirmAndCancelButtonContainerDiv.append(confirmButton, cancelButton)
    deleteChatHistoryDialog.append(titleContainerDiv, promptDiv, confirmAndCancelButtonContainerDiv)

    return deleteChatHistoryDialog
}


export {
    createDeleteChatHistoryDialog
}

