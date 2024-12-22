/**
 * 创建聊天窗口的
 */

import { icons } from "../../icons/icons"
import { markdown } from "../../markdown"
import { refineResponseText, removeOnlineCite, removeSVGElements, replaceMathSymbols } from "../../utils"
import { createUploadFileComponent } from "./fileUi"

/**
 * 创建agent聊天消息的div
 * @param doc 
 * @returns 
 */
function createAgentChatDiv(doc: Document): HTMLDivElement{

    // 创建一个最外层容器 (横向布局，包含avator和消息div)
    const agentChatContainerDiv = doc.createElement("div")
    agentChatContainerDiv.classList.add("agent-chat-container-div")
    agentChatContainerDiv.style.boxSizing = "border-box"
    agentChatContainerDiv.style.display = "flex"
    agentChatContainerDiv.style.justifyContent = "flex-start" // 左对齐 
    agentChatContainerDiv.style.padding = "10px"

    //  创建agent头像avator的容器
    const agentAvatorContainerDiv = doc.createElement("div")
    agentAvatorContainerDiv.classList.add("agent-avator-container-div")
    
    // 创建头像avator
    const agentAvatorDiv = doc.createElement("div")
    agentAvatorDiv.classList.add("agent-avator-div")
    agentAvatorDiv.style.display = "flex"
    agentAvatorDiv.style.justifyContent = "center"
    agentAvatorDiv.style.alignItems = "center"
    agentAvatorDiv.style.width = "40px"
    agentAvatorDiv.style.height = "40px"
    agentAvatorDiv.style.borderRadius = "50%"
    agentAvatorDiv.style.objectFit = "cover"
    agentAvatorDiv.style.objectPosition = "center"
    agentAvatorDiv.style.margin = "5px"
    agentAvatorContainerDiv.innerHTML = ""

    

    // 创建agent消息的容器(纵向布局，
    // 包含markdown展示的消息内容, 
    // 原始消息内容(隐藏, 用于copy), 
    // 代码原始消息内容(隐藏, 用于copy), 
    // 复制按钮等菜单DIV)
    // 一个初始loading的DIV, 后续隐藏
    const agentMessageContainerDiv = doc.createElement("div")
    agentMessageContainerDiv.classList.add("agent-message-container-div")
    agentMessageContainerDiv.style.display = "flex"
    agentMessageContainerDiv.style.flexDirection = "column"
    agentMessageContainerDiv.style.backgroundColor = "#fff"
    agentMessageContainerDiv.style.borderRadius = "2px 10px 10px 10px" // 左上角尖角
    agentMessageContainerDiv.style.padding = "5px"
    agentMessageContainerDiv.style.margin = "0"
    agentMessageContainerDiv.style.wordBreak = "break-all"
    agentMessageContainerDiv.style.fontSize = "14px"
    agentMessageContainerDiv.style.fontFamily = "Arial" // 设置字体
    agentMessageContainerDiv.style.fontWeight = "normal" // 设置字体的粗细
    agentMessageContainerDiv.style.lineHeight = "1.5" // 设置行高
    agentMessageContainerDiv.style.letterSpacing = "0.5px" // 设置字间距
    agentMessageContainerDiv.style.color = "#000" // 设置字体颜色
    // agentMessageContainerDiv.style.width = "100%"
    // agentMessageContainerDiv.style.maxWidth = "80%"
    agentMessageContainerDiv.style.maxWidth = "100%"
    agentMessageContainerDiv.style.userSelect = "text"
    agentMessageContainerDiv.style.whiteSpace = "pre-wrap"

    // 再创建一个MessageInnerContainerDiv, 用于将剩余元素和loading元素区分开来
    const agentMessageInnerContainerDiv = doc.createElement("div")
    agentMessageInnerContainerDiv.classList.add("agent-message-inner-container-div")
    agentMessageInnerContainerDiv.style.display = "flex"
    agentMessageInnerContainerDiv.style.flexDirection = "column"
    agentMessageInnerContainerDiv.style.width = "100%"
    agentMessageInnerContainerDiv.style.height = "100%"


    // 创建一个消息Div存放消息内容, markdown展示的内容
    const agentMessageMarkdownDisplayDiv = doc.createElement("div")
    agentMessageMarkdownDisplayDiv.classList.add("agent-message-markdown-display-div")
    agentMessageContainerDiv.innerHTML = ""

    // 创建一个消息Div存放原始消息内容, 隐藏
    const agentMessageOriginalDiv = doc.createElement("div")
    agentMessageOriginalDiv.classList.add("agent-message-original-div")
    agentMessageOriginalDiv.style.display = "none"

    // 创建一个消息Div存放代码原始消息内容, 隐藏
    const agentMessageCodeOriginalDiv = doc.createElement("div")
    agentMessageCodeOriginalDiv.classList.add("agent-message-code-original-div")
    agentMessageCodeOriginalDiv.style.display = "none"

    // 创建一个消息Div存放复制按钮等菜单DIV
    const agentMessageBottomMenuDiv = doc.createElement("div")
    agentMessageBottomMenuDiv.classList.add("agent-message-bottom-menu-div")
    agentMessageBottomMenuDiv.style.display = "flex"
    agentMessageBottomMenuDiv.style.width = "100%"
    agentMessageBottomMenuDiv.style.height = "25px"
    agentMessageBottomMenuDiv.style.alignItems = "center"
    agentMessageBottomMenuDiv.style.justifyContent = "flex-end" // 右对齐
    // agentMessageBottomMenuDiv.style.backgroundColor = "green"

    //  创建一个消息复制按钮的DIV
    const agentMessageCopyButtonDiv = doc.createElement("div")
    agentMessageCopyButtonDiv.classList.add("agent-message-copy-button-div")
    agentMessageCopyButtonDiv.classList.add("svg-container")
    agentMessageCopyButtonDiv.style.boxSizing = "border-box"
    agentMessageCopyButtonDiv.style.padding = "3px"
    agentMessageCopyButtonDiv.style.display = "flex"
    agentMessageCopyButtonDiv.style.width = "25px"
    agentMessageCopyButtonDiv.style.height = "25px"
    agentMessageCopyButtonDiv.style.borderRadius = "3px"
    agentMessageCopyButtonDiv.style.alignItems = "center"
    agentMessageCopyButtonDiv.style.justifyContent = "center"
    agentMessageCopyButtonDiv.style.cursor = "pointer"
    agentMessageCopyButtonDiv.setAttribute("title", "复制")
    agentMessageCopyButtonDiv.innerHTML = `<img style="width: 20px; height: 20px;" src="${icons.copyOriginalMessageButtonIcon}" alt="复制" />`


    // 创建一个消息Div存放回复中状态DIV
    const agentMessageBottomRespondingDiv = doc.createElement("div")
    agentMessageBottomRespondingDiv.classList.add("agent-message-bottom-responding-div")
    agentMessageBottomRespondingDiv.style.display = "flex"
    agentMessageBottomRespondingDiv.style.width = "100%"
    agentMessageBottomRespondingDiv.style.height = "25px"
    agentMessageBottomRespondingDiv.style.alignItems = "center"
    agentMessageBottomRespondingDiv.style.justifyContent = "flex-end" // 右对齐
    // agentMessageBottomMenuDiv.style.backgroundColor = "green"

    //  创建一个消息复制按钮的DIV
    const agentMessageRespondingDiv = doc.createElement("div")
    agentMessageRespondingDiv.classList.add("agent-message-responding-div")
    agentMessageRespondingDiv.classList.add("svg-container")
    agentMessageRespondingDiv.style.boxSizing = "border-box"
    agentMessageRespondingDiv.style.padding = "3px"
    agentMessageRespondingDiv.style.display = "flex"
    agentMessageRespondingDiv.style.width = "25px"
    agentMessageRespondingDiv.style.height = "25px"
    agentMessageRespondingDiv.style.borderRadius = "3px"
    agentMessageRespondingDiv.style.alignItems = "center"
    agentMessageRespondingDiv.style.justifyContent = "center"
    agentMessageRespondingDiv.style.cursor = "pointer"
    agentMessageRespondingDiv.setAttribute("title", "回复中")
    agentMessageRespondingDiv.innerHTML = `<img style="width: 25px; height: 25px;" src="${icons.agentMessageRespondingIcon}" alt="回复中" />`


    // 创建一个消息Div存放初始loading的DIV容器
    const agentMessageLoadingContainerDiv = doc.createElement("div")
    agentMessageLoadingContainerDiv.classList.add("agent-message-loading-container-div")
    agentMessageLoadingContainerDiv.style.width = "100px"
    agentMessageLoadingContainerDiv.style.height = "30px"
    agentMessageLoadingContainerDiv.style.display = "flex"
    agentMessageLoadingContainerDiv.style.justifyContent = "center"
    agentMessageLoadingContainerDiv.style.alignItems = "center"

    // 创建一个Div存放Loading图标
    const agentMessageLoadingDiv = doc.createElement("div")
    agentMessageLoadingDiv.classList.add("agent-message-loading-div")
    agentMessageLoadingDiv.style.width = "30px"
    agentMessageLoadingDiv.style.height = "30px"
    // agentMessageLoadingDiv.style.padding = "0 10px 0 0"
    agentMessageLoadingDiv.style.display = "flex"
    agentMessageLoadingDiv.style.justifyContent = "center"
    agentMessageLoadingDiv.style.alignItems = "center"
    agentMessageLoadingDiv.innerHTML = `<img style="width: 25px; height: 25px;" src="${icons.agentMessageLoadingIcon}" alt="加载中" />`

    // 创建一个文字图标，提示正在加载
    const agentMessageLoadingTextDiv = doc.createElement("div")
    agentMessageLoadingTextDiv.classList.add("agent-message-loading-text-div")
    agentMessageLoadingTextDiv.style.width = "60px"
    agentMessageLoadingTextDiv.style.height = "30px"
    agentMessageLoadingTextDiv.style.display = "flex"
    agentMessageLoadingTextDiv.style.justifyContent = "center"
    agentMessageLoadingTextDiv.style.alignItems = "center"
    agentMessageLoadingTextDiv.innerHTML = "加载中..."

    // 创建一个用户停止聊天的标识div
    const agentCancelResponseNoticeDiv =  doc.createElement("div")
    agentCancelResponseNoticeDiv.classList.add("agent-cancel-response-notice-div")
    agentCancelResponseNoticeDiv.innerHTML = "用户取消回复"

    // 将头像avator添加到头像avator容器中
    agentAvatorContainerDiv.appendChild(agentAvatorDiv)
    agentAvatorContainerDiv.style.display = "none" // 先默认隐藏，因为头像可有可无

    // 将用户取消回复标识、 复制按钮添加到底层菜单容器中
    agentMessageBottomMenuDiv.appendChild(agentCancelResponseNoticeDiv)
    agentMessageBottomMenuDiv.appendChild(agentMessageCopyButtonDiv)
    // agentMessageBottomMenuDiv.style.display = "none" // 先设置为隐藏，等到消息回复完成后设置为显示

    // 将回复中状态添加到底层菜单容器中
    agentMessageBottomRespondingDiv.appendChild(agentMessageRespondingDiv)

    // 将loading容器添加到loading容器中
    agentMessageLoadingContainerDiv.appendChild(agentMessageLoadingDiv)
    agentMessageLoadingContainerDiv.appendChild(agentMessageLoadingTextDiv)

    // 将markdonw展示消息容器、原始消息容器、代码原始消息容器、底层菜单容器 添加到innerMessageContainerDiv中
    agentMessageInnerContainerDiv.appendChild(agentMessageMarkdownDisplayDiv)
    agentMessageInnerContainerDiv.appendChild(agentMessageOriginalDiv)
    agentMessageInnerContainerDiv.appendChild(agentMessageCodeOriginalDiv)
    agentMessageInnerContainerDiv.appendChild(agentMessageBottomMenuDiv)
    agentMessageInnerContainerDiv.appendChild(agentMessageBottomRespondingDiv)
    // agentMessageInnerContainerDiv.style.display = "none" // 先隐藏，等到loading完成后显示   


    // 将innerMessageContainerDiv、loading容器添加到消息容器中
    agentMessageContainerDiv.appendChild(agentMessageInnerContainerDiv)
    agentMessageContainerDiv.appendChild(agentMessageLoadingContainerDiv)

    // 将avator和innerMessageContainerDiv添加到最外层容器中
    agentChatContainerDiv.appendChild(agentAvatorContainerDiv)
    agentChatContainerDiv.appendChild(agentMessageContainerDiv)

    return agentChatContainerDiv
}

function createUserChatDiv(doc: Document): HTMLDivElement{

    // 最外层容器
    const userChatContainerDiv = doc.createElement("div")
    userChatContainerDiv.classList.add("user-chat-container-div")
    userChatContainerDiv.style.boxSizing = "border-box"
    userChatContainerDiv.style.display = "flex"
    // userChatContainerDiv.style.overflow = "visible"
    userChatContainerDiv.style.width = "100%"
    
    userChatContainerDiv.style.justifyContent = "flex-end" // 右对齐
    userChatContainerDiv.style.padding = "5px"

    // 创建用户avator的容器
    const userAvatorContainerDiv = doc.createElement("div")
    userAvatorContainerDiv.classList.add("user-avator-container-div")
    userAvatorContainerDiv.style.display = "flex"
    userAvatorContainerDiv.style.justifyContent = "center"
    userAvatorContainerDiv.style.width = "40px"
    userAvatorContainerDiv.style.height = "100%"
    userAvatorContainerDiv.style.marginRight = "5px"

    // 创建用户avator
    const userAvatorDiv = doc.createElement("div")
    userAvatorDiv.classList.add("user-avator-div")
    userAvatorDiv.style.display = "flex"
    userAvatorDiv.style.justifyContent = "center"
    userAvatorDiv.style.alignItems = "center"
    userAvatorDiv.style.width = "40px"
    userAvatorDiv.style.height = "40px"
    userAvatorDiv.style.borderRadius = "50%"
    // userAvatorDiv.style.margin = "5px"

    // 创建一个inner容器, 用于存放用户消息容器和菜单div, 用于和文件展示DIV区分开来
    const userMessageInnerContainerDiv = doc.createElement("div")
    userMessageInnerContainerDiv.classList.add("user-message-inner-container-div")
    userMessageInnerContainerDiv.style.display = "flex"
    userMessageInnerContainerDiv.style.flexDirection = "column"
    userMessageInnerContainerDiv.style.maxWidth = "100%"
    userMessageInnerContainerDiv.style.backgroundColor = "#fff"
    userMessageInnerContainerDiv.style.borderRadius = "10px 2px 10px 10px"

    // 再创建一个容器,横向flex,因为如果让 userMessageInnerContainerDiv 和 userUploadFileDisplayDiv
    // 放再一个colum的flex中，userUploadFileDisplayDiv会将父元素撑大，导致userMessageInnerContainerDiv也变大
    const userMessageAndMenuRowContainerDiv = doc.createElement("div")
    userMessageAndMenuRowContainerDiv.classList.add("user-message-and-menu-row-container-div")
    userMessageAndMenuRowContainerDiv.style.display = "flex"
    userMessageAndMenuRowContainerDiv.style.justifyContent = "flex-end"
    userMessageInnerContainerDiv.style.maxWidth = "100%"

    // 再创建一个横向flex，存放userUploadFileDisplayDiv，与上一个横行flex区分开来
    const userUploadFileDisplayRowContainerDiv = doc.createElement("div")
    userUploadFileDisplayRowContainerDiv.classList.add("user-upload-flie-display-row-container-div")
    userUploadFileDisplayRowContainerDiv.style.display = "flex"
    userUploadFileDisplayRowContainerDiv.style.justifyContent = "flex-end"
    userUploadFileDisplayRowContainerDiv.style.maxWidth = "100%"
    


    // 创建一个用户消息的markdown展示容器
    const userMessageMarkdownDisplayDiv = doc.createElement("div")
    userMessageMarkdownDisplayDiv.classList.add("user-message-markdown-display-div")
    userMessageMarkdownDisplayDiv.style.boxSizing = "border-box"
    userMessageMarkdownDisplayDiv.style.display = "flex"
    userMessageMarkdownDisplayDiv.style.flexDirection = "column"
    // userMessageMarkdownDisplayDiv.style.textAlign = "center"
    userMessageMarkdownDisplayDiv.style.justifyContent = "center"
    // userMessageMarkdownDisplayDiv.style.backgroundColor = "#fff"
    userMessageMarkdownDisplayDiv.style.maxWidth = "100%"
    // userMessageMarkdownDisplayDiv.style.width = "70%"
    userMessageMarkdownDisplayDiv.style.padding = "5px"

    // 创建一个div元素, 用于用户消息容器(存放inner容器和文件��示DIV)
    const userMessageContainerDiv = doc.createElement("div")
    userMessageContainerDiv.classList.add("user-message-container")
    userMessageContainerDiv.style.display = "flex"
    userMessageContainerDiv.style.flexDirection = "column"
    userMessageContainerDiv.style.maxWidth = "100%"    
    // userMessageContainerDiv.style.width = "100%"    
    userMessageContainerDiv.style.wordBreak = "break-all"
    userMessageContainerDiv.style.fontSize = "14px"
    userMessageContainerDiv.style.fontFamily = "Arial" // 设置字体
    userMessageContainerDiv.style.fontWeight = "normal" // 设置字体的粗细
    userMessageContainerDiv.style.lineHeight = "1.5" // 设置行高
    userMessageContainerDiv.style.letterSpacing = "0.5px" // 设置字间距
    userMessageContainerDiv.style.color = "#000" // 设置字体颜色
    userMessageContainerDiv.style.userSelect = "text"
    userMessageContainerDiv.style.whiteSpace = "pre-wrap"   
    
    // 创建底层消息下层菜单按钮存放的DIV
    const userMessageBottomMenuDiv = doc.createElement("div")
    userMessageBottomMenuDiv.classList.add("user-message-bottom-menu-div")
    userMessageBottomMenuDiv.style.boxSizing = "border-box"
    userMessageBottomMenuDiv.style.display = "flex"
    userMessageBottomMenuDiv.style.width = "100%"
    userMessageBottomMenuDiv.style.height = "35px"
    userMessageBottomMenuDiv.style.alignItems = "center"
    userMessageBottomMenuDiv.style.justifyContent = "flex-start" // 左对齐
    userMessageBottomMenuDiv.style.padding = "5px"
    // userMessageBottomMenuDiv.style.backgroundColor = "#fff"

    //  创建一个用户消息复制按钮的DIV
    const userMessageCopyButtonDiv = doc.createElement("div")
    userMessageCopyButtonDiv.classList.add("user-message-copy-button-div")
    userMessageCopyButtonDiv.classList.add("svg-container")
    userMessageCopyButtonDiv.style.boxSizing = "border-box"
    userMessageCopyButtonDiv.style.padding = "3px"
    userMessageCopyButtonDiv.style.display = "flex"
    userMessageCopyButtonDiv.style.width = "22px"
    userMessageCopyButtonDiv.style.height = "22px"
    userMessageCopyButtonDiv.style.borderRadius = "3px"
    userMessageCopyButtonDiv.style.alignItems = "center"
    userMessageCopyButtonDiv.style.justifyContent = "center"
    userMessageCopyButtonDiv.style.cursor = "pointer"
    userMessageCopyButtonDiv.setAttribute("title", "复制")     
    userMessageCopyButtonDiv.innerHTML = `<img style="width: 20px; height: 20px;" src="${icons.copyOriginalMessageButtonIcon}" alt="复制" />`


    // 创建一个用于展示存放用户上传文件图标的DIV
    const userUploadFileDisplayDiv = doc.createElement("div")
    userUploadFileDisplayDiv.classList.add("user-upload-file-display-div")
    userUploadFileDisplayDiv.style.boxSizing = "border-box"
    userUploadFileDisplayDiv.style.display = "flex"
    userUploadFileDisplayDiv.style.flexDirection = "column"
    userUploadFileDisplayDiv.style.width = "100%"
    userUploadFileDisplayDiv.style.alignItems = "flex-end" // 右对齐
    userUploadFileDisplayDiv.style.backgroundColor = "#green"
    userUploadFileDisplayDiv.style.padding = "5px 5px 0 0"

    

    // 将avator添加到avator容器中
    userAvatorContainerDiv.appendChild(userAvatorDiv)
    userAvatorContainerDiv.style.display = "none" // 先默认隐藏，因为头像可有可无   


    // 将复制按钮添加到菜单DIV中
    userMessageBottomMenuDiv.appendChild(userMessageCopyButtonDiv)


    // 将用户消息markdown展示容器和菜单容器添加到用户消息inner容器中
    userMessageInnerContainerDiv.appendChild(userMessageMarkdownDisplayDiv)
    userMessageInnerContainerDiv.appendChild(userMessageBottomMenuDiv)

    // 将用户Inner容器和上传文件展示容器添加到用户消息容器中
    // userMessageContainerDiv.appendChild(userMessageInnerContainerDiv)
    // userMessageContainerDiv.appendChild(userUploadFileDisplayDiv)

    // 分别将InnerMessageDiv和displayfilediv放入两个横向flex容器中
    userMessageAndMenuRowContainerDiv.appendChild(userMessageInnerContainerDiv)
    userUploadFileDisplayRowContainerDiv.appendChild(userUploadFileDisplayDiv)
    userMessageContainerDiv.appendChild(userMessageAndMenuRowContainerDiv)
    userMessageContainerDiv.appendChild(userUploadFileDisplayRowContainerDiv)

    // 将用户消息容器、avator容器添加到最外层容器中
    userChatContainerDiv.appendChild(userMessageContainerDiv)
    userChatContainerDiv.appendChild(userAvatorContainerDiv)

    return userChatContainerDiv

}


function createChatBox(doc: Document): [Record<string, HTMLDivElement>, Record<string, HTMLDivElement>] | null {
    const userChatDiv = createUserChatDiv(doc)
    const agentChatDiv = createAgentChatDiv(doc)
    if(!userChatDiv || !agentChatDiv){
        return null
    }
    const userMessageMarkdownDisplayDiv = userChatDiv.querySelector(".user-message-markdown-display-div") as HTMLDivElement
    const userMessageCopyButtonDiv = userChatDiv.querySelector(".user-message-copy-button-div") as HTMLDivElement
    const userUploadFileDisplayDiv = userChatDiv.querySelector(".user-upload-file-display-div") as HTMLDivElement
    
    const agentMessageMarkdownDisplayDiv = agentChatDiv.querySelector(".agent-message-markdown-display-div") as HTMLDivElement
    const agentMessageOriginalDiv = agentChatDiv.querySelector(".agent-message-original-div") as HTMLDivElement
    const agentMessageCodeOriginalDiv = agentChatDiv.querySelector(".agent-message-code-original-div") as HTMLDivElement
    // const agentMessageCodeDisplayDiv = agentChatDiv.querySelector(".agent-message-code-display-div") as HTMLDivElement
    const agentMessageCopyButtonDiv = agentChatDiv.querySelector(".agent-message-copy-button-div") as HTMLDivElement
    const agentMessageBottomMenuDiv = agentChatDiv.querySelector(".agent-message-bottom-menu-div") as HTMLDivElement
    const agentMessageLoadingContainerDiv = agentChatDiv.querySelector(".agent-message-loading-container-div") as HTMLDivElement
    const agentMessageInnerContainerDiv = agentChatDiv.querySelector(".agent-message-inner-container-div") as HTMLDivElement
    const agentMessageBottomRespondingDiv = agentChatDiv.querySelector(".agent-message-bottom-responding-div") as HTMLDivElement
    const agentMessageRespondingDiv = agentChatDiv.querySelector(".agent-message-responding-div") as HTMLDivElement
    const agentCancelResponseNoticeDiv = agentChatDiv.querySelector(".agent-cancel-response-notice-div") as HTMLDivElement
            


    if(
        !userMessageMarkdownDisplayDiv || 
        !userMessageCopyButtonDiv || 
        !userUploadFileDisplayDiv ||
        
        
        !agentMessageMarkdownDisplayDiv || 
        !agentMessageOriginalDiv || 
        !agentMessageCodeOriginalDiv ||
        // !agentMessageCodeDisplayDiv ||
        !agentMessageCopyButtonDiv || 
        !agentMessageBottomMenuDiv || 
        !agentMessageLoadingContainerDiv ||
        !agentMessageInnerContainerDiv || 
        !agentMessageBottomRespondingDiv || 
        !agentMessageRespondingDiv ||
        !agentCancelResponseNoticeDiv
    ){
        console.log("userMessageMarkdownDisplayDiv", userMessageMarkdownDisplayDiv)
        console.log("userMessageCopyButtonDiv", userMessageCopyButtonDiv)
        console.log("agentMessageMarkdownDisplayDiv", agentMessageMarkdownDisplayDiv)
        console.log("agentMessageOriginalDiv", agentMessageOriginalDiv)
        console.log("agentMessageCodeOriginalDiv", agentMessageCodeOriginalDiv)
        // console.log("agentMessageCodeDisplayDiv", agentMessageCodeDisplayDiv)
        console.log("agentMessageBottomMenuDiv", agentMessageBottomMenuDiv)
        console.log("agentMessageLoadingContainerDiv", agentMessageLoadingContainerDiv)
        console.log("agentMessageInnerContainerDiv", agentMessageInnerContainerDiv)
        console.log("agentMessageBottomRespondingDiv", agentMessageBottomRespondingDiv)
        console.log("agentMessageRespondingDiv", agentMessageRespondingDiv)
        console.log("agentCancelResponseNoticeDiv", agentCancelResponseNoticeDiv)
        console.warn("chat_ui.ts", "line 394", "func createChatBox", "chatbox element is not all ready")
        return null
    }

    // 为笔记功能添加监听
    userChatDiv.addEventListener("click", function (e: any) {
        // e.stopPropagation()
        if (userChatDiv.classList.contains("add-this-message-box-to-notes-border")) {
            userChatDiv.classList.toggle("add-this-message-box-to-notes")
        }
    })

    agentChatDiv.addEventListener("click", function (e: any) {
        // e.stopPropagation()
        if (agentChatDiv.classList.contains("add-this-message-box-to-notes-border")) {
            agentChatDiv.classList.toggle("add-this-message-box-to-notes")
        }
    })

    // console.log("agentMessageBottomRespondingDiv:", agentMessageBottomRespondingDiv)
    // console.log("agentMessageRespondingDiv:", agentMessageRespondingDiv)
    // userMessageCopyButtonDiv.addEventListener("click", () => {
    //     const content = userMessageMarkdownDisplayDiv.textContent
    //     navigator.clipboard.writeText(content || "")
    //     alert("复制成功")
    // })
    // agentMessageCopyButtonDiv.addEventListener("click", () => {
    //     const content = agentMessageOriginalDiv.innerHTML
    //     navigator.clipboard.writeText(refineResponseText(content))
    //     console.log(refineResponseText(content))
    //     alert("复制成功")
    // })
    agentMessageBottomMenuDiv.style.display = "none"
    agentMessageInnerContainerDiv.style.display = "none"

    const userChatDivDict = {
        userChatDiv: userChatDiv,
        userMessageMarkdownDisplayDiv: userMessageMarkdownDisplayDiv,
        userMessageCopyButtonDiv: userMessageCopyButtonDiv,
        userUploadFileDisplayDiv: userUploadFileDisplayDiv
    }
    const agentChatDivDict = {
        agentChatDiv: agentChatDiv,
        agentMessageMarkdownDisplayDiv: agentMessageMarkdownDisplayDiv,
        agentMessageOriginalDiv: agentMessageOriginalDiv,
        agentMessageCodeOriginalDiv: agentMessageCodeOriginalDiv,

        agentMessageCopyButtonDiv: agentMessageCopyButtonDiv,
        agentMessageBottomMenuDiv: agentMessageBottomMenuDiv,
        agentMessageLoadingContainerDiv: agentMessageLoadingContainerDiv,
        agentMessageInnerContainerDiv: agentMessageInnerContainerDiv,
        agentMessageBottomRespondingDiv: agentMessageBottomRespondingDiv,
        agentMessageRespondingDiv: agentMessageRespondingDiv,
        agentCancelResponseNoticeDiv: agentCancelResponseNoticeDiv
    }
    return [userChatDivDict, agentChatDivDict]
    
}


// 根据历史记录创建新的chatBoxList ，用于填充kimiMainContainerDiv的
function createChatHistoryDetailUI({
        kimiMainContainerDiv,
        chatHistoryDetail, 
        allFileRefs, 
        copyMessageCallBackFunc, 
        previewFileCallBackFunc,
        isEnablePreview = false,
        isRemoveSVGElements
    }: 
    {
        kimiMainContainerDiv: HTMLDivElement, 
        chatHistoryDetail: Record<string, any>[],
        allFileRefs: any[],
        copyMessageCallBackFunc: ((args: any) => any) | undefined,
        previewFileCallBackFunc?: ((args: any) => any) | undefined,
        isEnablePreview?: boolean
        isRemoveSVGElements: boolean
    }): HTMLDivElement[] | null {
    const doc = kimiMainContainerDiv.ownerDocument
    if(!doc){
        return null
    }
    // 先找到kimiChatMessageContainerDiv
    const kimiChatMessageContainerDiv = kimiMainContainerDiv.querySelector(".kimi-chat-message-container-div") as HTMLDivElement
    if(!kimiChatMessageContainerDiv){
        return null
    }
    // 这里已经找到了,
    // 遍历chatHistoryDetail，创建新的chatBoxList
    try{
        let chatHistoryDetailMessageBoxList: HTMLDivElement[] = []
        // 将fileRefs和chatHistoryDetail进行匹配，获取到fileRefs对应的文件信息
        console.info("chatHistoryDetail", chatHistoryDetail)
        console.info("allFileRefs", allFileRefs)
        const matchChatHistoryDetailResults = chatHistoryDetail.map((item: any) => {
            console.log("item", item)
            if ("error" in item) {
                return {
                    role: item.role,
                    // content: "token超限制,请开启新聊天",
                    content: item.error.message,
                    fileRefs: []
                }
            }
            if(item.canceled){
                return {
                    role: item.role,
                    content: item.content ? item.content : "",
                    fileRefs: [],
                    isCanceled: true
                }
            }
            let matchFileRefs: string[] = []
            if (item.file_refs) {
                matchFileRefs = item.file_refs.map((thisBoxFileRefId: any) => {
                    console.log("thisBoxFileRefId", thisBoxFileRefId)
                    console.log("allFileRefs", allFileRefs)
                    return allFileRefs.find((allFileRefItem: any) => allFileRefItem.id === thisBoxFileRefId)
                })
            }
            return {
                role: item.role,
                content: item.content,
                fileRefs: matchFileRefs
            }
        })
        console.log("matchChatHistoryDetailResults", matchChatHistoryDetailResults)
        for(const chatHistory of matchChatHistoryDetailResults){
            const chatBoxes = createChatBox(doc)
            if(!chatBoxes){
                return null
            }
            const [userChatDivDict, agentChatDivDict] = chatBoxes

            const userChatDiv = userChatDivDict.userChatDiv
            const agentChatDiv = agentChatDivDict.agentChatDiv
            const userMessageMarkdownDisplayDiv = userChatDivDict.userMessageMarkdownDisplayDiv
            const userMessageCopyButtonDiv = userChatDivDict.userMessageCopyButtonDiv
            const userUploadFileDisplayDiv = userChatDivDict.userUploadFileDisplayDiv
            const agentMessageMarkdownDisplayDiv = agentChatDivDict.agentMessageMarkdownDisplayDiv
            const agentMessageOriginalDiv = agentChatDivDict.agentMessageOriginalDiv
            const agentMessageCodeOriginalDiv = agentChatDivDict.agentMessageCodeOriginalDiv
            // const agentMessageCodeCopyButtonDiv = agentChatDivDict.agentMessageCodeCopyButtonDiv
            const agentMessageCopyButtonDiv = agentChatDivDict.agentMessageCopyButtonDiv
            const agentMessageBottomMenuDiv = agentChatDivDict.agentMessageBottomMenuDiv
            const agentMessageLoadingContainerDiv = agentChatDivDict.agentMessageLoadingContainerDiv
            const agentMessageInnerContainerDiv = agentChatDivDict.agentMessageInnerContainerDiv
            const agentMessageBottomRespondingDiv = agentChatDivDict.agentMessageBottomRespondingDiv
            const agentMessageRespondingDiv = agentChatDivDict.agentMessageRespondingDiv
            const agentCancelResponseNoticeDiv = agentChatDivDict.agentCancelResponseNoticeDiv

            let content = chatHistory.content
            const role = chatHistory.role
            const isCanceled = chatHistory.isCanceled
            const fileRefs = chatHistory.fileRefs

            if (role === "user") {
                // userMessageMarkdownDisplayDiv.innerHTML = markdown.render(replaceMathSymbols(content))
                userMessageMarkdownDisplayDiv.textContent = content
                if (fileRefs.length > 0) {
                    fileRefs.forEach(async (file_info: any) => {
                        if (!file_info) return
                        let uploadImageComp: HTMLDivElement
                        if (file_info.type === "image") {
                            //说明是图片
                            uploadImageComp = createUploadFileComponent({
                                isUploading: false,
                                isShowCancelX: false,
                                fileName: file_info.name,
                                fileType: file_info.content_type.split("/")[1],
                                fileSize: file_info.size,
                                doc: doc,
                                icon: file_info.presigned_url, //图片直接显示图标
                                preview_url: file_info.presigned_url,
                                enablePreview: isEnablePreview,
                                previewCallBackFunc: previewFileCallBackFunc
                            }) as HTMLDivElement

                        } else {
                            //说明是pdf
                            uploadImageComp = createUploadFileComponent({
                                isUploading: false,
                                isShowCancelX: false,
                                fileName: file_info.name,
                                fileType: file_info.content_type.split("/")[1],
                                fileSize: file_info.size,
                                doc: doc,
                                icon: icons.pdfIcon,
                                preview_url: file_info.presigned_url,
                                enablePreview: isEnablePreview,
                                previewCallBackFunc: previewFileCallBackFunc
                            }) as HTMLDivElement
                        }
                        userUploadFileDisplayDiv.append(uploadImageComp)
                    })
                }
                userMessageCopyButtonDiv.style.display = "flex"
                userMessageCopyButtonDiv.addEventListener("click", () => {
                    try{
                        navigator.clipboard.writeText(content)
                        copyMessageCallBackFunc?.({isok: true, content: content})
                    }catch(e:any){
                        console.warn("chat_ui.ts", "line 591", "func createChatHistoryDetailUI", "copy message failed", e)
                        copyMessageCallBackFunc?.({isok: false, content: "", error: e})
                    }
                })
                chatHistoryDetailMessageBoxList.push(userChatDiv)
            } else {
                if(isCanceled && !content){
                    content = "📖 用户取消了回答, 未回复任何内容"
                }
                const _markdownText = markdown.render(removeOnlineCite(replaceMathSymbols(content)))
                console.log("markdownText", _markdownText)
                agentMessageMarkdownDisplayDiv.innerHTML = _markdownText
                if(isRemoveSVGElements){
                    removeSVGElements(agentMessageMarkdownDisplayDiv)
                }
                console.log("取消svg", content)
                agentMessageOriginalDiv.textContent = replaceMathSymbols(content)
                console.log("取消svg1", content.match(/```(.*?)```/gs))
                agentMessageCodeOriginalDiv.textContent = content.match(/```(.*?)```/gs) || ""
                const agentMessageCodeCopyButtonDiv = agentMessageMarkdownDisplayDiv.querySelector(".kimi-markdown-code-copy-button") as HTMLDivElement
                // console.log("agentMessageCodeCopyButtonDiv!!!!!!!!!!!!!!!!!!!", agentMessageCodeCopyButtonDiv)
                if(agentMessageCodeCopyButtonDiv){
                    agentMessageCodeCopyButtonDiv.classList.remove("disabled")
                    agentMessageCodeCopyButtonDiv.addEventListener("click", () => {
                    try{
                        const content = agentMessageCodeOriginalDiv.innerHTML
                        navigator.clipboard.writeText(refineResponseText(content))
                        copyMessageCallBackFunc?.({isok: true, content: content})
                    }catch(e:any){
                        console.warn("chat_ui.ts", "line 622", "func createChatHistoryDetailUI", "copy message failed", e)
                            copyMessageCallBackFunc?.({isok: false, content: "", error: e})
                        }
                    })
                }
                
                agentMessageCopyButtonDiv.style.display = "flex"
                agentMessageCopyButtonDiv.addEventListener("click", () => {
                    try{
                        const content = agentMessageOriginalDiv.innerHTML
                        navigator.clipboard.writeText(refineResponseText(content))
                        copyMessageCallBackFunc?.({isok: true, content: content})
                    }catch(e:any){
                        console.warn("chat_ui.ts", "line 633", "func createChatHistoryDetailUI", "copy message failed", e)
                        copyMessageCallBackFunc?.({isok: false, content: "", error: e})
                    }
                })
                if(isCanceled){
                    agentCancelResponseNoticeDiv.style.display = "flex"
                }
                agentMessageBottomMenuDiv.style.display = "flex"
                agentMessageLoadingContainerDiv.style.display = "none"
                agentMessageInnerContainerDiv.style.display = "flex"
                agentMessageBottomRespondingDiv.style.display = "none"
                agentMessageRespondingDiv.style.display = "none"
                chatHistoryDetailMessageBoxList.push(agentChatDiv)
            }
        }

        return chatHistoryDetailMessageBoxList
    }catch(e:any){
        console.warn("chat_ui.ts", "line 490", "func createChatHistoryDetailUI", "create chat box failed", e)
        return null
    }
    
        
}

export {
    createAgentChatDiv,
    createUserChatDiv,
    createChatBox,
    createChatHistoryDetailUI
}