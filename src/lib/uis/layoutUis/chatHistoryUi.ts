

// 创建一个最外层容器

import { icons } from "../../icons/icons"

function createChatHistoryUI(doc: Document): HTMLDivElement{
    const chatHistoryContainerDiv = doc.createElement("div")
    chatHistoryContainerDiv.classList.add("chat-history-container-div")
    

    // 创建一个标题

    return chatHistoryContainerDiv
}


function createSingleChatHistoryItemUI(doc: Document): HTMLDivElement{
    const chatHistoryItemContainerDiv = doc.createElement("div")
    chatHistoryItemContainerDiv.classList.add("chat-history-item-container-div")
    


    // 创建标题文字Div
    const chatHistoryItemTitleTextDiv = doc.createElement("div")
    chatHistoryItemTitleTextDiv.classList.add("chat-history-item-title-text-div")
    chatHistoryItemTitleTextDiv.innerHTML = ' 📑 '

    
    

    // 创建一个显示日期Div
    const chatHistoryItemDateDiv = doc.createElement("div")
    chatHistoryItemDateDiv.classList.add("chat-history-item-date-div")

    
    // 创建一个工具栏Div (包含一个编辑图标，和一个删除图标) 
    // 这里工具栏和日期是默认显示日期，然后鼠标hover到工具栏上时，显示工具栏，隐藏日期
    const chatHistoryItemToolBarDiv = doc.createElement("div")
    chatHistoryItemToolBarDiv.classList.add("chat-history-item-tool-bar-div")


    // 创建一个编辑图标
    const chatHistoryItemToolBarEditIconDiv = doc.createElement("div")
    chatHistoryItemToolBarEditIconDiv.classList.add("chat-history-item-tool-bar-edit-icon-div")

    chatHistoryItemToolBarEditIconDiv.innerHTML = `<img style="width: 20px; height: 20px;" src="${icons.editorChatHistoryIcon}" alt="编辑" />`

    // 创建一个删除图标
    const chatHistoryItemToolBarDeleteIconDiv = doc.createElement("div")
    chatHistoryItemToolBarDeleteIconDiv.classList.add("chat-history-item-tool-bar-delete-icon-div")

    chatHistoryItemToolBarDeleteIconDiv.innerHTML = `<img style="width: 20px; height: 20px;" src="${icons.deleteChatHistoryIcon}" alt="删除" />`
    
    

    // 将两个工具图标添加到工具栏
    chatHistoryItemToolBarDiv.appendChild(chatHistoryItemToolBarEditIconDiv)
    chatHistoryItemToolBarDiv.appendChild(chatHistoryItemToolBarDeleteIconDiv)
    

    // 将标题容器添加到最外层容器
    chatHistoryItemContainerDiv.appendChild(chatHistoryItemTitleTextDiv)


    // 将工具栏和日期添加到最外层容器
    chatHistoryItemContainerDiv.appendChild(chatHistoryItemDateDiv)
    chatHistoryItemContainerDiv.appendChild(chatHistoryItemToolBarDiv)



    return chatHistoryItemContainerDiv
}



export {
    createChatHistoryUI,
    createSingleChatHistoryItemUI
}
