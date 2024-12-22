

function createEditChatHistoryNameDialog({doc, oldName}: 
    {
        doc: Document,
        oldName: string
    }): HTMLDivElement{
    const editChatHistoryNameDialog = doc.createElement("div")
    editChatHistoryNameDialog.classList.add("kimi-edit-chat-history-name-dialog")

    // 创建三个子div 纵向布局，分别是第一行 dialog标题和一个cancelx
    //第二行输入框
    // 第三行取消和确认按钮

    // 创建标题和x 容器
    const titleAndXContainerDiv = doc.createElement("div")
    titleAndXContainerDiv.classList.add("kimi-edit-chat-history-name-dialog-title-and-x-container-div")
    
    // 创建标题div
    const dialogTitleDiv = doc.createElement("div")
    dialogTitleDiv.classList.add("kimi-edit-chat-history-name-dialog-title-div")
    dialogTitleDiv.innerHTML = "修改历史记录名称"
    
    // // 创建x按钮
    // const cancelXButton = doc.createElement("button")
    // cancelXButton.classList.add("kimi-edit-chat-history-name-dialog-cancel-x-button")
    // cancelXButton.innerHTML = "x"

    // 创建输入框容器
    const inputContainerDiv = doc.createElement("div")
    inputContainerDiv.classList.add("kimi-edit-chat-history-name-dialog-input-container-div")

    // 创建输入框
    const inputInput = doc.createElement("input")
    inputInput.classList.add("kimi-edit-chat-history-name-dialog-input-input")
    inputInput.value = oldName

    // 创建确定取消按钮容器
    const confirmAndCancelButtonContainerDiv = doc.createElement("div")
    confirmAndCancelButtonContainerDiv.classList.add("kimi-edit-chat-history-name-dialog-confirm-and-cancel-button-container-div")

    // 创建确定按钮
    const confirmButton = doc.createElement("div")
    confirmButton.classList.add("kimi-edit-chat-history-name-dialog-confirm-button-div")
    confirmButton.innerHTML = "确定"

    // 创建取消按钮
    const cancelButton = doc.createElement("div")
    cancelButton.classList.add("kimi-edit-chat-history-name-dialog-cancel-button-div")
    cancelButton.innerHTML = "取消"

    // 将所有子div添加到父div中
    // titleAndXContainerDiv.append(dialogTitleDiv, cancelXButton)
    titleAndXContainerDiv.append(dialogTitleDiv)
    inputContainerDiv.append(inputInput)
    confirmAndCancelButtonContainerDiv.append(confirmButton, cancelButton)
    editChatHistoryNameDialog.append(titleAndXContainerDiv, inputContainerDiv, confirmAndCancelButtonContainerDiv)

    return editChatHistoryNameDialog
}


export {
    createEditChatHistoryNameDialog
}

