import { icons } from "../../icons/icons"
import { createKimiNoteButtonContainerDiv } from "../noteUis/noteUi"
import { createAgentChatDiv } from "./chatUi"


const acceptInputFileType = [
  "image/png", 
  "image/jpg", 
  "image/jpeg", 
  "image/bmp", 
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "text/csv",
  "text/plain",
]

// 创建一个最外层的div
function createKimiMainContainerDiv(doc:Document, isRegisterListener: boolean): HTMLDivElement{


  // 创建一个最外层的container, 横向布局，包含侧边栏和右边的消息区域
  const kimiMainContainerDiv = doc.createElement("div")
  kimiMainContainerDiv.classList.add("kimi-main-container-div")
  kimiMainContainerDiv.classList.add("kimi-main-container-shallow")

  //在主节点下创建一个容器(即消息区域), 用于包含消息显示容器和输入菜单容器
  const kimiGraphContainerDiv = doc.createElement("div")
  kimiGraphContainerDiv.classList.add("kimi-graph-container-div")
  

  
  // 创建一个侧边栏容器 , 这里应该是横向布局，一个sidebar按钮容器和一个relative的folder容器
  const kimiSiderBarContainerDiv = doc.createElement("div")
  kimiSiderBarContainerDiv.classList.add("kimi-sider-bar-container-div")
  


  // 侧边栏折叠容器，存放历史记录容器和笔记按钮容器  
  const kimiFolderContainerDiv = doc.createElement("div")
  kimiFolderContainerDiv.classList.add("kimi-folder-container-div")
  

  

  // 侧边栏菜单按钮容器
  const kimiSidebarButtonContainerDiv = doc.createElement("div")
  kimiSidebarButtonContainerDiv.classList.add("kimi-sidebar-button-container-div") 
  

  // 侧边栏 新建聊天按钮
  const kimiSidebarCreateNewChatButton = createKimiSideBarButton(
    doc, 
    "新建\n聊天", 
    ["kimi-siderbar-button", "kimi-siderbar-create-new-chat-button"]
  )

  

  // 侧边栏 历史记录按钮
  const kimiSidebarHistoryButton = createKimiSideBarButton(
    doc, 
    "历史\n记录", 
    ["kimi-siderbar-button", "kimi-siderbar-history-button"]
  )

  // 侧边栏 新建笔记按钮
  const kimiSidebarCreateNewNoteButton = createKimiSideBarButton(
    doc, 
    "新建\n笔记", 
    ["kimi-siderbar-button", "kimi-siderbar-create-new-note-button"]
  )

  // 创建一个侧边栏历史记录显示Div
  const kimiSidebarHistoryChatListContainerDiv = createSidebarHistoryChatListContainerDiv(doc)

  kimiSidebarButtonContainerDiv.append(
    kimiSidebarCreateNewChatButton, 
    kimiSidebarHistoryButton, 
    kimiSidebarCreateNewNoteButton
  )

  // 创建一个聊天消息显示区域
  const kimiChatMessageContainerDiv = doc.createElement("div")
  kimiChatMessageContainerDiv.classList.add("kimi-chat-message-container-div")

  // 创建一个停止回答Div的容器
  const kimiStopChatAgentResponesContainerDiv = doc.createElement("div")
  kimiStopChatAgentResponesContainerDiv.classList.add("kimi-stop-chat-agent-respones-container-div")

  // 创建一个停止回答按钮
  const kimiStopChatAgentResponesButtonDiv = doc.createElement("div")
  kimiStopChatAgentResponesButtonDiv.classList.add("kimi-stop-chat-agent-respones-button-div")
  kimiStopChatAgentResponesButtonDiv.innerHTML = "停止回答"

  //创建一个div用于存放用户输入框和发送按钮以及选择附件按钮的容器
  const kimiUserInputMenuContainerDiv = doc.createElement("div")
  kimiUserInputMenuContainerDiv.classList.add("kimi-user-input-menu-container-div")
  

  //创建一个用于展示上传文件的frame
  const kimiDisplayFileContainerDiv = doc.createElement("div")
  kimiDisplayFileContainerDiv.classList.add("kimi-display-file-container-div")
  

  //创建选择附件按钮(img)
  const selectFileButtonDiv = doc.createElement("div")
  selectFileButtonDiv.classList.add("select-file-button-div")
  
  selectFileButtonDiv.title = "选择文件"
  selectFileButtonDiv.innerHTML = `<img style="width: 25px; height: 25px;" src="${icons.selectUploadFileButtonIcon}" alt="选择文件" />`

  // 创建一个隐藏的输入用于点击图片的选择文件DIV按钮时触发file选择打开文件选择窗口
  

  const fileInput = doc.createElement("input")
  fileInput.classList.add("user-input-file-input")
  fileInput.type = "file"
  fileInput.style.display = "none"
  fileInput.accept = acceptInputFileType.join(",")

  //创建发送按钮(div)
  const sendMessageButtonDiv = doc.createElement("div")
  sendMessageButtonDiv.classList.add("send-message-button-div")
  sendMessageButtonDiv.textContent = "发送";
  sendMessageButtonDiv.classList.add("disabled")

  // 用户输入区域的容器Div
  const userInputContainerDiv = doc.createElement("div")
  userInputContainerDiv.classList.add("user-input-container-div")



  //创建用户输入框
  const userInputTextArea = doc.createElement("textarea")
  userInputTextArea.classList.add("user-input-text-area")
  
  // userInputTextArea.style.outline = "none"
  userInputTextArea.placeholder = "默认填写"
  userInputTextArea.rows = 1

  // 创建一个笔记按钮容器
  const kimiNoteButtonContainerDiv = createKimiNoteButtonContainerDiv(doc)

  // 添加一个底部容器div ，存放加载更多按钮和加载动画图标
  // 点击加载更多按钮会加载更多，加载更多按钮会隐藏，加载动画图标会显示，知道加载完成再显示加载更多按钮，隐藏加载动画图标
  const kimiChatHistoryLoadingContainerDiv = doc.createElement("div")
  kimiChatHistoryLoadingContainerDiv.classList.add("kimi-chat-history-loading-container-div")


  // 创建一个加载更多按钮
  const kimiChatHistoryLoadingMoreButtonDiv = doc.createElement("div")
  kimiChatHistoryLoadingMoreButtonDiv.classList.add("kimi-chat-history-loading-more-button-div")

  kimiChatHistoryLoadingMoreButtonDiv.innerHTML = "加载更多"
  

  // 创建一个没有更多了的提示，用于提示没有更多历史了
  const kimiChatHistoryNoMoreDiv = doc.createElement("div")
  kimiChatHistoryNoMoreDiv.classList.add("kimi-chat-history-no-more-div")

  kimiChatHistoryNoMoreDiv.innerHTML = "没有更多了"


  // 创建一个loading的div用于history_ui的加载动画
  const kimiChatHistoryLoadingDiv = doc.createElement("div")
  kimiChatHistoryLoadingDiv.classList.add("kimi-chat-history-loading-div")

  kimiChatHistoryLoadingDiv.innerHTML = `<img style="width: 25px; height: 25px;" src="${icons.agentMessageLoadingIcon}" alt="加载中" />`

  // 将加载动画添加到历史记录容器中
  kimiChatHistoryLoadingContainerDiv.appendChild(kimiChatHistoryLoadingDiv)
  kimiChatHistoryLoadingContainerDiv.appendChild(kimiChatHistoryLoadingMoreButtonDiv)
  kimiChatHistoryLoadingContainerDiv.appendChild(kimiChatHistoryNoMoreDiv)
  kimiSidebarHistoryChatListContainerDiv.appendChild(kimiChatHistoryLoadingContainerDiv)


  // 将侧边栏容器添加到主容器中
  kimiSiderBarContainerDiv.appendChild(kimiSidebarButtonContainerDiv)
  kimiSiderBarContainerDiv.appendChild(kimiFolderContainerDiv)

  // 将侧边栏按钮添加到侧边栏按钮容器中
  kimiSidebarButtonContainerDiv.appendChild(kimiSidebarCreateNewChatButton)
  kimiSidebarButtonContainerDiv.appendChild(kimiSidebarHistoryButton)
  kimiSidebarButtonContainerDiv.appendChild(kimiSidebarCreateNewNoteButton)

  // 将侧边栏历史记录显示Div、笔记按钮容器添加到侧边栏折叠容器中
  kimiFolderContainerDiv.appendChild(kimiSidebarHistoryChatListContainerDiv)
  kimiFolderContainerDiv.appendChild(kimiNoteButtonContainerDiv)

  // 将聊天消息显示区域容器、停止回答容器、用户输入容器 、文件显示容器 添加到GraphContainerDiv中
  kimiGraphContainerDiv.appendChild(kimiChatMessageContainerDiv)
  kimiGraphContainerDiv.appendChild(kimiStopChatAgentResponesContainerDiv)
  kimiGraphContainerDiv.appendChild(kimiUserInputMenuContainerDiv)
  kimiGraphContainerDiv.appendChild(kimiDisplayFileContainerDiv)

  // 将停止回答按钮添加到停止回答容器中
  kimiStopChatAgentResponesContainerDiv.appendChild(kimiStopChatAgentResponesButtonDiv)

  // 将用户输入textarea添加到用户输入容器中
  userInputContainerDiv.appendChild(userInputTextArea)

  // 将文件选择按钮、用户输入框div、发送按钮添加到用户输入容器中
  kimiUserInputMenuContainerDiv.appendChild(selectFileButtonDiv)
  kimiUserInputMenuContainerDiv.appendChild(userInputContainerDiv)
  kimiUserInputMenuContainerDiv.appendChild(sendMessageButtonDiv)


  // 这里最好不要添加到selectFileButtonDiv中，因为selectFileButtonDiv的点击事件会触发fileInput的点击事件，导致fileInput的点击事件被触发两次
  kimiUserInputMenuContainerDiv.appendChild(fileInput)

  // 将测边栏容器和GraphContainerDiv添加到主容器中
  kimiMainContainerDiv.appendChild(kimiSiderBarContainerDiv)
  kimiMainContainerDiv.appendChild(kimiGraphContainerDiv)

  // // 创建一个css样式
  // const kimiMainCss = createKimiMainCss(doc)
  // kimiMainContainerDiv.appendChild(kimiMainCss)

  // // 创建一个起始默认聊天用于提示用户当前是新的聊天
  // const kimiStartNewChatTipDiv = createAgentChatDiv(doc)
  // kimiStartNewChatTipDiv.classList.add("kimi-start-new-chat-tip-div")
  // const agentMessageMarkdownDisplayDiv = kimiStartNewChatTipDiv.querySelector(".agent-message-markdown-display-div") as HTMLDivElement
  // agentMessageMarkdownDisplayDiv.innerHTML = "Hi，我是 Kimi～\n很高兴遇见你！你可以随时把网址🔗或者文件📃发给我，我来帮你看看"
  // const agentMessageBottomMenuDiv = kimiStartNewChatTipDiv.querySelector(".agent-message-bottom-menu-div") as HTMLDivElement
  // agentMessageBottomMenuDiv.style.display = "none"
  // const agentMessageLoadingContainerDiv = kimiStartNewChatTipDiv.querySelector(".agent-message-loading-container-div") as HTMLDivElement
  // agentMessageLoadingContainerDiv.style.display = "none"
  // const agentMessageBottomRespondingDiv = kimiStartNewChatTipDiv.querySelector(".agent-message-bottom-responding-div") as HTMLDivElement
  // agentMessageBottomRespondingDiv.style.display = "none"
  // kimiChatMessageContainerDiv.appendChild(kimiStartNewChatTipDiv)


  // 添加事件监听
  if(isRegisterListener){
    userInputTextArea.addEventListener("change", (e: any) => {
      autoExpandUserInputTextArea(userInputTextArea)
    })
    userInputTextArea.addEventListener("input", (e: any) => {
      autoExpandUserInputTextArea(userInputTextArea)
    })

      //添加选择监听
      selectFileButtonDiv.addEventListener("click", (e) => {
        fileInput.click()
      })

    fileInput.addEventListener('change', function (event: any) {
      const file = event.target.files[0]
      console.log(file)
      if (!acceptInputFileType.includes(file.type)) {
        return
      }

      // //然后转换为blob
      // const blobUrl = new Blob(file)
      // ztoolkit.getGlobal("console").log(blobUrl)
          
      // filePickerCallback(file, sendButton, selectFileButton, userInput, displayFileFrame)
    });
  }

  return kimiMainContainerDiv

}

function autoExpandUserInputTextArea(userInput: HTMLTextAreaElement, baseHeight: number = 25) {
  // console.log("userInput.textLength",userInput.textLength)
  if (userInput.textLength === 0) {
    // userInput.style.height = 'auto'; // 重置高度
    userInput.style.height = baseHeight + "px"
    return
  }
  userInput.style.height = 'auto'; // 重置高度
  let computedHeight = userInput.scrollHeight; // 获取滚动高度
  userInput.style.height = `${computedHeight}px`; // 设置新的高度
  userInput.style.maxHeight = `${150}px`; // 设置新的高度
  if (computedHeight > 150) { // 如果高度超过最大高度
    userInput.style.overflowY = 'auto'; // 显示滚动条
  } else {
    userInput.style.overflowY = 'hidden'; // 隐藏滚动条
  }
}


// 创建侧边栏按钮
function createKimiSideBarButton(doc:Document, text: string, classList: string[]): HTMLDivElement {
  const createNewButton = doc.createElement("div")
  createNewButton.classList.add(...classList)
  
  createNewButton.textContent = text;
  return createNewButton
}

// 创建历史记录聊天列表
function createSidebarHistoryChatListContainerDiv(doc:Document): HTMLDivElement {
  const sidebarHistoryChatListContainerDiv = doc.createElement("div")
  sidebarHistoryChatListContainerDiv.classList.add("kimi-sidebar-history-chat-list-container") 
  
  return sidebarHistoryChatListContainerDiv
}



export {
  acceptInputFileType,
  createKimiMainContainerDiv,
  createKimiSideBarButton,
  autoExpandUserInputTextArea
}



