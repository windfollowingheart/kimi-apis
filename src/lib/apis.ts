import { cancelChatAgentResponse, createNewChat, getChatHistoryDetail, getChatHistoryDetailAllFileRefsInfos, getChatInfo } from "./chat"
import { checkUploadResult, fileTypeMap, getUploadPreSignedUrl, registerGetFileFromClipboardListener, uploadFile } from "./file"
import { deleteChatHistory, editChatHistoryName, getChatHistoryList } from "./history"
import { kimiStreamRequest } from "./https"
import { icons } from "./icons/icons"
import { checkLogin, genQRCode, getLoginId } from "./login"
import { markdown } from "./markdown"
import { getAccessToken } from "./token"
import { createAgentChatDiv, createChatBox, createChatHistoryDetailUI } from "./uis/layoutUis/chatUi"
import { 
    createKimiChatHistoryUiCss, 
    createKimiChatUiCss,
    createKimiMainCss, 
    createKimiMarkdownCss,
    createKimiNoteUiCss,
    createCreateNewNoteDialogUiCss,
    createEditorChatHistoryNameDialogUiCss,
    createDeleteChatHistoryDialogUiCss
} from "./css/css"
import { createUploadFileComponent,
    createSingleChatHistoryItemUI,
    createKimiMainContainerDiv,
    createMaskDiv,
    createChatHistorySwitchLoadingMaskDiv,
    createCreateNewNoteDialog,
    createEditChatHistoryNameDialog,
    createDeleteChatHistoryDialog,
    createLoginDiv,
    
    
} from "./uis/ui"
import { 
    createNoteText, 
    whenClickCreateNewNoteButton 
} from "./uis/noteUis/noteUi"
import { autoExpandUserInputTextArea } from "./uis/layoutUis/mainUi"
import { 
    calcUint8ArrayHash,
    checkUserInputIsILLegel, 
    decodeBase64, 
    formatDateTime, 
    parseFileNameAndExtension, 
    refineResponseText, 
    removeOnlineCite, 
    removeSVGElements, 
    replaceMathSymbols 
} from "./utils"



class KimiApi {
    endPoint: string
    chatId: string
    segmentId: string
    useMath: boolean
    accessToken: string
    refreshToken: string
    maxRetry: number
    refFiles: string[]
    isResponsing: boolean // 是否正在响应
    isLoadingChatList: boolean // 是否正在加载聊天列表
    oldChatListScrollHeight: number // 历史记录聊天列表的滚动高度
    loadingChatListTimeInterval: number // 加载聊天列表的时间间隔
    loadingChatListTaskNum: number // 加载聊天列表的任务数量
    isReloadChatHistoryList: boolean // 是否重新加载历史记录聊天列表(打开历史记录时是否重新加载)
    chatHistoryDetailLast: number // 获取聊天历史详细信息时，获取的最后几条信息
    isSwitchChatHistoryScrollToBottom: boolean // 是否切换聊天历史记录到最底部
    noteType: string // 笔记类型
    isRemoveSVGElements: boolean // 是否移除svg元素
    isEnablePreview: boolean // 是否启用预览

    readFileFunc: ((...args: any[]) => Promise<Uint8Array>) | undefined // 读取文件的函数, 不同环境实现不同

    createNewChatCallBackFuncSetter: ((func: () => any) => void) | undefined // 设置创建新聊天完成后的回调函数
    createNewNoteCallBackFuncSetter: ((func: () => any) => void) | undefined // 设置创建新笔记完成后的回调函数
    copyMessageCallBackFuncSetter: ((func: () => any) => void) | undefined // 设置创建复制消息完成后的回调函数
    uploadFileCallBackFuncSetter: ((func: () => any) => void) | undefined // 设置创建上传文件完成后的回调函数
    chatResponseCallBackFuncSetter: ((func: () => any) => void) | undefined // 设置创建聊天响应完成后的回调函数
    createNoteCallBackFuncSetter: ((func: () => any) => void) | undefined // 设置创建笔记完成后的回调函数
    loginFinishCallBackFuncSetter: ((args: any) => any) | undefined // 登录完成后的回调函数

    createNewChatCallBackFunc: ((args: any) => any) | undefined // 创建新聊天完成后的回调函数
    createNewNoteCallBackFunc: ((args: any) => any) | undefined // 创建新笔记完成后的回调函数
    copyMessageCallBackFunc: ((args: any) => any) | undefined // 创建复制消息完成后的回调函数
    uploadFileCallBackFunc: ((args: any) => any) | undefined // 创建上传文件完成后的回调函数
    chatResponseCallBackFunc: ((args: any) => any) | undefined // 创建聊天响应完成后的回调函数
    createNoteCallBackFunc: ((args: any) => any) | undefined // 创建笔记完成后的回调函数
    loginFinishCallBackFunc: ((args: any) => any) | undefined // 登录完成后的回调函数
    refreshAccessTokenFininshCallBackFuncSetter: ((func: () => any) => void) | undefined // 设置刷新access_token完成后的回调函数,
    refreshAccessTokenFininshCallBackFunc: ((args: any) => any) | undefined // 刷新access_token完成后的回调函数
    checkRfreshTokenFinishCallBackFuncSetter: ((func: () => any) => void) | undefined // 设置检查refresh_token完成后的回调函数,
    checkRfreshTokenFinishCallBackFunc: ((args: any) => any) | undefined // 检查refresh_token完成后的回调函数
    switchChatHistoryFinishCallBackFuncSetter: ((func: () => any) => void) | undefined // 设置切换聊天历史记录完成后的回调函数,
    switchChatHistoryFinishCallBackFunc: ((args: any) => any) | undefined // 切换聊天历史记录完成后的回调函数
    previewCallBackFuncSetter: ((func: () => any) => void) | undefined // 设置预览完成后的回调函数,
    previewCallBackFunc: ((args: any) => any) | undefined // 预览完成后的回调函数
    
    kimiMainContainerDiv: HTMLDivElement | undefined // kimi主界面容器
    doc: Document | undefined // 文档类型
    domElementStorageMap: Record<string, any> // 存储dom元素的列表
    valueSotorageMap: Record<string, any> // 存储额外变量的列表
    intervalStorageMap: Record<string, any> // 存储定时器的列表

    fileHashMap: Record<string, any> // 文件哈希值映射
    isEnableFileHashMapSearch: boolean // 是否启用文件哈希值搜索,启用后，在发送消息时，会检查文件哈希值是否在fileHashMap中，如果在，说明文件已经上传过
    cryptoJsUrl: string // crypto-js的url
    abortAgentResponseFunc: (() => void) | undefined // 终止聊天响应的函数
    kimiMessageContainerDivScrollTop: number // kimi消息容器div的滚动高度
    isUpdateKimiMessageContainerDivScrollTopByListener: boolean // 是否启用监听更新kimi消息容器div的滚动高度

    uploadFileUint8ArrayTimeout: number // 上传二进制文件的超时时间
    registerResizeObserverMaxRetry: number // 注册resizeObserver的最大重试次数

    constructor({
            doc,
            fileHashMap,
            isEnableFileHashMapSearch,
            cryptoJsUrl,
            kimiMainContainerDiv,
            endPoint, 
            chatId, 
            useMath, 
            accessToken, 
            refreshToken, 
            maxRetry, 
            chatHistoryDetailLast,
            isSwitchChatHistoryScrollToBottom,
            readFileFunc, 
            refFiles, 
            noteType,
            isRemoveSVGElements,
            isEnablePreview = true,
            domElementStorageMap,
            valueSotorageMap,
            uploadFileUint8ArrayTimeout,
            registerResizeObserverMaxRetry,

            createNewChatCallBackFuncSetter,
            createNewNoteCallBackFuncSetter,
            copyMessageCallBackFuncSetter,
            uploadFileCallBackFuncSetter,
            chatResponseCallBackFuncSetter,
            createNoteCallBackFuncSetter,
            createNewChatCallBackFunc,
            createNewNoteCallBackFunc,
            copyMessageCallBackFunc,
            uploadFileCallBackFunc,
            chatResponseCallBackFunc,
            createNoteCallBackFunc,
            loginFinishCallBackFuncSetter,
            loginFinishCallBackFunc,
            refreshAccessTokenFininshCallBackFuncSetter,
            refreshAccessTokenFininshCallBackFunc,
            checkRfreshTokenFinishCallBackFuncSetter,
            checkRfreshTokenFinishCallBackFunc,
            switchChatHistoryFinishCallBackFuncSetter,
            switchChatHistoryFinishCallBackFunc,
            previewCallBackFuncSetter,
            previewCallBackFunc
        }: 
        {
            kimiMainContainerDiv?: HTMLDivElement,
            doc?: Document,
            fileHashMap?: Record<string, any>,
            isEnableFileHashMapSearch?: boolean,
            cryptoJsUrl?: string,
            endPoint?: string,
            chatId?: string,
            useMath?: boolean
            accessToken?: string, 
            refreshToken?: string, 
            maxRetry?: number,
            chatHistoryDetailLast?: number,
            isSwitchChatHistoryScrollToBottom?: boolean,
            refFiles?: string[],
            readFileFunc?: ((...args: any[]) => Promise<Uint8Array>) | undefined,
            noteType?: string,
            isRemoveSVGElements?: boolean,
            isEnablePreview?: boolean,
            domElementStorageMap?: Record<string, any>,
            valueSotorageMap?: Record<string, any>,
            uploadFileUint8ArrayTimeout?: number,
            registerResizeObserverMaxRetry?: number,

            createNewChatCallBackFuncSetter?: (func: () => any) => void,
            createNewNoteCallBackFuncSetter?: (func: () => any) => void,
            copyMessageCallBackFuncSetter?: (func: () => any) => void,
            uploadFileCallBackFuncSetter?: (func: () => any) => void,
            chatResponseCallBackFuncSetter?: (func: () => any) => void,
            createNoteCallBackFuncSetter?: (func: () => any) => void,
            createNewChatCallBackFunc?: (args: any) => any,
            createNewNoteCallBackFunc?: (args: any) => any,
            copyMessageCallBackFunc?: (args: any) => any,
            uploadFileCallBackFunc?: (args: any) => any,
            chatResponseCallBackFunc?: (args: any) => any,
            createNoteCallBackFunc?: (args: any) => any
            loginFinishCallBackFuncSetter?: (func: () => any) => void,
            loginFinishCallBackFunc?: (args: any) => any
            refreshAccessTokenFininshCallBackFuncSetter?: (func: () => any) => void,
            refreshAccessTokenFininshCallBackFunc?: (args: any) => any
            checkRfreshTokenFinishCallBackFuncSetter?: (func: () => any) => void,
            checkRfreshTokenFinishCallBackFunc?: (args: any) => any
            switchChatHistoryFinishCallBackFuncSetter?: (func: () => any) => void,
            switchChatHistoryFinishCallBackFunc?: (args: any) => any
            previewCallBackFuncSetter?: (func: () => any) => void,
            previewCallBackFunc?: (args: any) => any
        }) {
            
        this.doc = doc || undefined
        this.fileHashMap = fileHashMap || {}
        this.isEnableFileHashMapSearch = isEnableFileHashMapSearch || false
        this.cryptoJsUrl = cryptoJsUrl || "https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js"
        this.endPoint = endPoint || "https://kimi.moonshot.cn"
        this.chatId = chatId || ""
        this.segmentId = ""
        this.useMath = useMath || false
        this.accessToken = accessToken || ""
        this.refreshToken = refreshToken || ""
        this.readFileFunc = readFileFunc || undefined
        this.maxRetry = maxRetry || 3
        this.refFiles = refFiles || []
        this.noteType = noteType || "zotero"
        this.isRemoveSVGElements = isRemoveSVGElements || false
        this.isEnablePreview = isEnablePreview
        this.isResponsing = false
        this.domElementStorageMap = domElementStorageMap || {}
        this.valueSotorageMap = valueSotorageMap || {}
        this.isLoadingChatList = false
        this.oldChatListScrollHeight = 0
        this.loadingChatListTimeInterval = 2000
        this.loadingChatListTaskNum = 0
        this.isReloadChatHistoryList = true
        this.chatHistoryDetailLast = chatHistoryDetailLast || 50
        this.isSwitchChatHistoryScrollToBottom = isSwitchChatHistoryScrollToBottom || true

        this.kimiMessageContainerDivScrollTop = 0
        this.isUpdateKimiMessageContainerDivScrollTopByListener = true
        this.intervalStorageMap = {}
        this.uploadFileUint8ArrayTimeout = uploadFileUint8ArrayTimeout || 10000
        this.registerResizeObserverMaxRetry = registerResizeObserverMaxRetry || 10

        this.createNewChatCallBackFuncSetter = createNewChatCallBackFuncSetter || undefined
        this.createNewNoteCallBackFuncSetter = createNewNoteCallBackFuncSetter || undefined
        this.createNewChatCallBackFunc = createNewChatCallBackFunc || undefined
        this.createNewNoteCallBackFunc = createNewNoteCallBackFunc || undefined
        this.copyMessageCallBackFuncSetter = copyMessageCallBackFuncSetter || undefined
        this.copyMessageCallBackFunc = copyMessageCallBackFunc || undefined
        this.uploadFileCallBackFuncSetter = uploadFileCallBackFuncSetter || undefined
        this.uploadFileCallBackFunc = uploadFileCallBackFunc || undefined
        this.chatResponseCallBackFuncSetter = chatResponseCallBackFuncSetter || undefined
        this.chatResponseCallBackFunc = chatResponseCallBackFunc || undefined
        this.createNoteCallBackFuncSetter = createNoteCallBackFuncSetter || undefined
        this.createNoteCallBackFunc = createNoteCallBackFunc || undefined
        this.kimiMainContainerDiv = kimiMainContainerDiv || undefined
        this.abortAgentResponseFunc = undefined
        this.loginFinishCallBackFuncSetter = loginFinishCallBackFuncSetter || undefined
        this.loginFinishCallBackFunc = loginFinishCallBackFunc || undefined
        this.refreshAccessTokenFininshCallBackFuncSetter = refreshAccessTokenFininshCallBackFuncSetter || undefined
        this.refreshAccessTokenFininshCallBackFunc = refreshAccessTokenFininshCallBackFunc || undefined
        this.checkRfreshTokenFinishCallBackFuncSetter = checkRfreshTokenFinishCallBackFuncSetter || undefined
        this.checkRfreshTokenFinishCallBackFunc = checkRfreshTokenFinishCallBackFunc || undefined
        this.switchChatHistoryFinishCallBackFuncSetter = switchChatHistoryFinishCallBackFuncSetter || undefined
        this.switchChatHistoryFinishCallBackFunc = switchChatHistoryFinishCallBackFunc || undefined
        this.previewCallBackFuncSetter = previewCallBackFuncSetter || undefined
        this.previewCallBackFunc = previewCallBackFunc || undefined
    }

    // 创建一个Kimi的主界面,默认样式，可以自己创建自己的界面
    // 默认注册监听事件
    public kimiCreateMainUi({doc, 
            isRegisterListener=false, 
            isObserveResize=false,
            isAddCss=false,
            cssConfigs={}
        }: 
        {
            doc: Document,
            isRegisterListener?: boolean,
            isObserveResize?: boolean,
            isAddCss?: boolean,
            cssConfigs?: Record<string, Record<string, string>> // 类名-样式名-样式值
        }): HTMLDivElement{
        this.doc = doc
        const kimiMainContainerDiv = createKimiMainContainerDiv(doc, false)
        this.kimiMainContainerDiv = kimiMainContainerDiv

        if(!isRegisterListener){
            return kimiMainContainerDiv
        }
        if(this.isUpdateKimiMessageContainerDivScrollTopByListener){
            const _kimiChatMessageContainerDiv = kimiMainContainerDiv.querySelector(".kimi-chat-message-container-div") as HTMLDivElement
            _kimiChatMessageContainerDiv.addEventListener("scroll", function(this:KimiApi, e:any) {
                this.kimiMessageContainerDivScrollTop = _kimiChatMessageContainerDiv.scrollTop
            }.bind(this))
        }



        
        const setResizeIntervalID = setInterval(() => {
            if(!this.kimiMainContainerDiv?.parentElement){
                return
            }
            this.registerResizeObserverMaxRetry--
            if(this.registerResizeObserverMaxRetry <= 0){
                clearInterval(setResizeIntervalID)
                return
            }
            if(isObserveResize){
                const resizeObserver = new ResizeObserver(entries => {
                    if(!this.kimiMainContainerDiv){
                        return
                    }
                    for (let entry of entries) {
                      const { width, height } = entry.contentRect;
                      this.kimiMainContainerDiv.style.width = `${width * 0.95}px`
                    }
                  });

                  resizeObserver.observe(this.kimiMainContainerDiv?.parentElement as HTMLElement);
                  clearInterval(setResizeIntervalID)
            }
        }, 100)

        this.intervalStorageMap["setResizeIntervalID"] = setResizeIntervalID

        if(isAddCss){
            const kimiMainCss = createKimiMainCss(doc)
            const kimiChatHistoryCss = createKimiChatHistoryUiCss(doc)
            const kimiChatCss = createKimiChatUiCss(doc)
            const kimiNoteCss = createKimiNoteUiCss(doc)
            const kimiMarkdownCss = createKimiMarkdownCss(doc)
            const createNewNoteDialogCss = createCreateNewNoteDialogUiCss(doc)
            const editorChatHistoryNameDialogCss = createEditorChatHistoryNameDialogUiCss(doc)
            const deleteChatHistoryDialogCss = createDeleteChatHistoryDialogUiCss(doc)
            kimiMainContainerDiv.appendChild(kimiMainCss)
            kimiMainContainerDiv.appendChild(kimiChatHistoryCss)
            kimiMainContainerDiv.appendChild(kimiChatCss)
            kimiMainContainerDiv.appendChild(kimiNoteCss)
            kimiMainContainerDiv.appendChild(kimiMarkdownCss)
            kimiMainContainerDiv.appendChild(createNewNoteDialogCss)
            kimiMainContainerDiv.appendChild(editorChatHistoryNameDialogCss)
            kimiMainContainerDiv.appendChild(deleteChatHistoryDialogCss)
        }
        if(cssConfigs){
            for(const className in cssConfigs){
                const styleNames = cssConfigs[className]
                let classElement: HTMLElement | null = null
                if(className === "kimi-main-container-div"){
                    classElement = kimiMainContainerDiv
                }else{
                    classElement = kimiMainContainerDiv.querySelector(`.${className}`) as HTMLElement
                }
                if(classElement){
                    for(const styleName in styleNames){
                        classElement.style.setProperty(styleName, styleNames[styleName])
                    }
                }
            }
        }

        // 绑定侧边栏的UI监听
        this.bindSideBarUiListener(kimiMainContainerDiv)

        // 绑定剪切板监听
        registerGetFileFromClipboardListener(this)

        const displayUploadFileContainerDiv = kimiMainContainerDiv.querySelector(".kimi-display-file-container-div") as HTMLDivElement
        const fileInput = kimiMainContainerDiv.querySelector('.user-input-file-input') as HTMLInputElement
        const userInputTextArea = kimiMainContainerDiv.querySelector('.user-input-text-area') as HTMLTextAreaElement
        const selectFileButtonDiv = kimiMainContainerDiv.querySelector('.select-file-button-div') as HTMLDivElement
        const sendMessageButtonDiv = kimiMainContainerDiv.querySelector('.send-message-button-div') as HTMLDivElement
        const kimiChatMessageContainerDiv = kimiMainContainerDiv.querySelector('.kimi-chat-message-container-div') as HTMLDivElement
        const kimiDisplayFileContainerDiv = kimiMainContainerDiv.querySelector('.kimi-display-file-container-div') as HTMLDivElement
        const kimiStopChatAgentResponesButtonDiv = kimiMainContainerDiv.querySelector('.kimi-stop-chat-agent-respones-button-div') as HTMLDivElement

        
        
        if(!fileInput || !userInputTextArea || !selectFileButtonDiv){
            return kimiMainContainerDiv
        }
        kimiStopChatAgentResponesButtonDiv.addEventListener("click", (e) => {
            this.kimiStopChatAgentRespones(kimiStopChatAgentResponesButtonDiv)       
        })

        

        // 添加userInputTextArea的监听
        // 检查是否按下了Shift键和Enter键
        let isShiftPressed = false;
        function handleKeyDown(e: any) {
          if (e.key === 'Shift') {
            isShiftPressed = true;
          }
        }
        function handleKeyUp(e: any) {
          if (e.key === 'Shift') {
            isShiftPressed = false;
          }
        }
        const handleKeyPress = (e: any) => {
            // 检查是否按下了Enter键
            if (e.key === 'Enter') {
                // 如果Shift键没有被按下，提交表单
                if (!isShiftPressed) {
                    e.preventDefault(); // 阻止默认行为，如换行
                    console.log("this@@@@@@@@", this)
                    this.sendChatQueryMessageFunc({
                        message: userInputTextArea.value, 
                        chatId: this.chatId,
                        useMath: this.useMath,
                    })
                    autoExpandUserInputTextArea(userInputTextArea)

                } else {
                    userInputTextArea.textContent += '\n';
                }
            }
        }
        userInputTextArea.addEventListener('keydown', handleKeyDown);
        userInputTextArea.addEventListener('keyup', handleKeyUp);
        userInputTextArea.addEventListener('keypress', handleKeyPress);
        userInputTextArea.addEventListener("change", (e: any) => {
            if(this.isResponsing){
                return
            }
            console.log("change")
            if(checkUserInputIsILLegel(userInputTextArea) && !selectFileButtonDiv.classList.contains("disabled")){
                sendMessageButtonDiv.classList.remove("disabled")
            }else{
                sendMessageButtonDiv.classList.add("disabled")
            }
            autoExpandUserInputTextArea(userInputTextArea)
        })
        userInputTextArea.addEventListener("input", (e: any) => {
            if(this.isResponsing){
                return
            }
            console.log("input")
            if(checkUserInputIsILLegel(userInputTextArea) && !selectFileButtonDiv.classList.contains("disabled")){
                sendMessageButtonDiv.classList.remove("disabled")
            }else{
                sendMessageButtonDiv.classList.add("disabled")
            }
            // console.log("input")
            autoExpandUserInputTextArea(userInputTextArea)
        })

        
        // 添加发送消息按钮的监听
        sendMessageButtonDiv.addEventListener("click", (e) => {
            // if(selectFileButtonDiv.classList.contains("disabled") || 
            // sendMessageButtonDiv.classList.contains("disabled")){
            //     return
            // } // 该逻辑移到sendChatQueryMessageFunc中
            // console.log("sendMessageButtonDiv click")
            this.sendChatQueryMessageFunc({
                message: userInputTextArea.value, 
                chatId: this.chatId,
                useMath: this.useMath,
            })
            autoExpandUserInputTextArea(userInputTextArea)
        })

        
        //添加选择监听
        selectFileButtonDiv.addEventListener("click", (e) => {
            console.log("selectFileButtonDiv click")
            fileInput.click()
        })
        
        fileInput.addEventListener('change', async function(this: KimiApi, event: any) {
            // console.log("this", this)
            console.log("fileInput change")
            const file = event.target.files[0]
            console.log(file)
            if (!fileInput.accept.split(",").includes(file.type)) {
              return
            }

            // 将选择文件按钮禁用
            selectFileButtonDiv.classList.add("disabled")
            // 将发送消息按钮禁用
            sendMessageButtonDiv.classList.add("disabled")

            const res = await this.kimiUploadFile({
                file: file, 
                doc: doc, 
                displayUploadFileContainerDiv: displayUploadFileContainerDiv
            })
            console.log("res", res)
            if(res.isok){
                
            }else{
                console.warn("apis.ts", " func kimiCreateMainUi ", " line 85", "upload file failed")
            }
            // 最后要将选中���文件清除，不然下次无法选择相同的文件，无法触发change事件
            fileInput.value = ""
            // 将选择文件按钮启用
            selectFileButtonDiv.classList.remove("disabled")
            // 将发送消息按钮启用
            if(checkUserInputIsILLegel(userInputTextArea)){ // 如果用户输入了内容，则可以发送消息
                sendMessageButtonDiv.classList.remove("disabled")
            }
        }.bind(this))
        return kimiMainContainerDiv
    }

    /**
     * 绑定侧边栏的UI监听
     * @param kimiMainContainerDiv 
     */
    public bindSideBarUiListener(kimiMainContainerDiv: HTMLDivElement){
        // 找到所有侧边栏按钮:
        const kimiSidebarCreateNewChatButton = kimiMainContainerDiv.querySelector(".kimi-siderbar-create-new-chat-button") as HTMLButtonElement
        const kimiSidebarHistoryButton = kimiMainContainerDiv.querySelector(".kimi-siderbar-history-button") as HTMLDivElement
        const kimiSidebarCreateNewNoteButton = kimiMainContainerDiv.querySelector(".kimi-siderbar-create-new-note-button") as HTMLButtonElement
        const kimiNoteButtonContainerDiv = kimiMainContainerDiv.querySelector(".kimi-note-button-container-div") as HTMLDivElement
        const kimiNoteButtonContainerDivConfirmButton = kimiMainContainerDiv.querySelector(".kimi-create-note-confirm-button-div") as HTMLDivElement
        const kimiNoteButtonContainerDivCancelButton = kimiMainContainerDiv.querySelector(".kimi-create-note-cancel-button-div") as HTMLDivElement
        const kimiChatHistoryLoadingMoreButtonDiv = kimiMainContainerDiv.querySelector(".kimi-chat-history-loading-more-button-div") as HTMLDivElement
        const kimiChatHistoryLoadingDiv = kimiMainContainerDiv.querySelector(".kimi-chat-history-loading-div") as HTMLDivElement
        const kimiSidebarHistoryChatListContainerDiv = kimiMainContainerDiv.querySelector(".kimi-sidebar-history-chat-list-container") as HTMLDivElement

        // 绑定新建聊天按钮
        if(kimiSidebarCreateNewChatButton){
            kimiSidebarCreateNewChatButton.addEventListener("click", async (e) => {
                console.log("kimiSidebarCreateNewChatButton click")
                const res = await this.kimiCreateNewChat({
                    useMath: this.useMath
                })
                if(res.isok){
                    this.chatId = res.result.id
                    // 清空聊天记录
                    const kimiChatMessageContainerDiv = kimiMainContainerDiv.querySelector(".kimi-chat-message-container-div") as HTMLDivElement
                    const kimiStartNewChatTipDiv = this.kimiMainContainerDiv?.querySelector(".kimi-start-new-chat-tip-div") as HTMLDivElement
                    const agentMessageMarkdownDisplayDiv = kimiStartNewChatTipDiv.querySelector(".agent-message-markdown-display-div") as HTMLDivElement
                    agentMessageMarkdownDisplayDiv.innerHTML = "Hi，我是 Kimi～\n很高兴遇见你！你可以随时把网址🔗或者文件📃发给我，我来帮你看看" 
                    while(kimiChatMessageContainerDiv.childNodes.length > 1){
                        kimiChatMessageContainerDiv.removeChild(kimiChatMessageContainerDiv.childNodes[1])
                    }
                    this.createNewChatCallBackFunc?.({
                        isok: true,
                        chatId: this.chatId
                    })
                }else{
                    console.warn("apis.ts", " func bindSideBarUiListener ", " line 225", "create new chat failed")
                    // 清空聊天记录
                    const kimiChatMessageContainerDiv = kimiMainContainerDiv.querySelector(".kimi-chat-message-container-div") as HTMLDivElement
                    const kimiStartNewChatTipDiv = this.kimiMainContainerDiv?.querySelector(".kimi-start-new-chat-tip-div") as HTMLDivElement
                    const agentMessageMarkdownDisplayDiv = kimiStartNewChatTipDiv.querySelector(".agent-message-markdown-display-div") as HTMLDivElement
                    agentMessageMarkdownDisplayDiv.innerHTML = "❌ 创建新聊天失败" 
                    while(kimiChatMessageContainerDiv.childNodes.length > 1){
                        kimiChatMessageContainerDiv.removeChild(kimiChatMessageContainerDiv.childNodes[1])
                    }
                    this.createNewChatCallBackFunc?.({
                        isok: false,
                        chatId: this.chatId
                    })
                }
            })
        }
        console.log("kimiNoteButtonContainerDiv", kimiNoteButtonContainerDiv)
        // 绑定创建笔记按钮
        if(kimiSidebarCreateNewNoteButton){
            kimiSidebarCreateNewNoteButton.addEventListener("click", (e) => {
                e.stopPropagation()
                console.log("kimiNoteButtonContainerDiv click")
                kimiNoteButtonContainerDiv.classList.toggle("kimi-note-button-container-div-show")
                    
                whenClickCreateNewNoteButton({
                    doc: kimiMainContainerDiv.ownerDocument,
                })
            })
        }
        // 绑定创建笔记对话框的确认按钮
        if(kimiNoteButtonContainerDivConfirmButton){
            kimiNoteButtonContainerDivConfirmButton.addEventListener("click", async (e) => {
                e.stopPropagation()
                console.log("kimiNoteButtonContainerDivConfirmButton click")
                const nowTime = formatDateTime()
                const noteName = `AI论文问答笔记_${nowTime}`
                const res = await this.kimiCreateNewNote({
                    noteName: noteName
                })
                if(res.isok){
                    console.log("create new note success")
                }else{
                    console.warn("apis.ts", " func bindSideBarUiListener ", " line 225", "create new note failed")
                }
                // kimiNoteButtonContainerDiv.classList.toggle("kimi-note-button-container-div-show")
                // whenClickCreateNewNoteButton({
                //     doc: kimiMainContainerDiv.ownerDocument,
                // })
            })
        }
        // 绑定创建笔记对话框的取消按钮
        if(kimiNoteButtonContainerDivCancelButton){
            kimiNoteButtonContainerDivCancelButton.addEventListener("click", (e) => {
                e.stopPropagation()
                console.log("kimiNoteButtonContainerDivCancelButton click")
                kimiNoteButtonContainerDiv.classList.toggle("kimi-note-button-container-div-show")
                whenClickCreateNewNoteButton({
                    doc: kimiMainContainerDiv.ownerDocument,
                })
            })
        }


        // 设置一个函数用于监听. kimi-main-container-div的点击事件，如果点击的不是chathistorylist的div，
        // 那么隐藏chathistorytlist
        function handleClickNotChatHistoryListDiv(e:any){
            console.log("handleClickNotChatHistoryListDiv click########")
            if(!kimiSidebarHistoryChatListContainerDiv.classList.contains("kimi-sidebar-history-chat-list-container-show")){
                return
            }else{
                var target = e.target;
                var parentElement = kimiMainContainerDiv.querySelector(".kimi-graph-container-div") // 点击右边区域触发隐藏
                while (target!== parentElement && target!== kimiMainContainerDiv) {
                    // target!== kimiMainContainerDiv 用于设置查找上限，这里设置上限为最外层容器，即kimiMainContainerDiv
                    // 如果target!== parentElement，则继续向上查找 ，直到找到parentElement或到达查找上限为止
                    target = target.parentNode;
                }
                console.log("target", target)
                if (target === parentElement) {
                    kimiMainContainerDiv.removeEventListener("click", handleClickNotChatHistoryListDiv)
                    kimiSidebarHistoryChatListContainerDiv.classList.toggle("kimi-sidebar-history-chat-list-container-show")
                } else {
                    return
                }
            }
            // console.log(e.target)           
        }

        // 那么隐藏chathistorytlist
        function handleClickNotNoteButtonContainerDiv(e:any){
            console.log("handleClickNotNoteButtonContainerDiv click########")
            if(!kimiNoteButtonContainerDiv.classList.contains("kimi-note-button-container-div-show")){
                return
            }else{
                var target = e.target;
                var parentElement = kimiMainContainerDiv.querySelector(".kimi-graph-container-div") // 点击右边区域触发隐藏
                while (target!== parentElement && target!== kimiMainContainerDiv) {
                    // target!== kimiMainContainerDiv 用于设置查找上限，这里设置上限为最外层容器，即kimiMainContainerDiv
                    // 如果target!== parentElement，则继续向上查找 ，直到找到parentElement或到达查找上限为止
                    target = target.parentNode;
                }
                console.log("target", target)
                if (target === parentElement) {
                    kimiMainContainerDiv.removeEventListener("click", handleClickNotNoteButtonContainerDiv)
                    kimiNoteButtonContainerDiv.classList.toggle("kimi-note-button-container-div-show")
                } else {
                    return
                }
            }
        }

        // 绑定加载更多按钮
        if(kimiChatHistoryLoadingMoreButtonDiv){
            kimiChatHistoryLoadingMoreButtonDiv.addEventListener("click", async (e) => {
                console.log("kimiChatHistoryLoadingMoreButton click")
                
                let chatList: any[] = []
                const historyChatListResponse = await this.kimiGetChatListHistory({
                    offset: kimiSidebarHistoryChatListContainerDiv.childNodes.length - 1, 
                    size: 20,
                    kimiMainContainerDiv
                })
                if(historyChatListResponse.isok){
                    chatList = historyChatListResponse.result.items
                    this.addChatHistoryItem({
                        chatList, 
                        kimiMainContainerDiv,
                    })
                }
            })
        }

        // 绑定历史记录聊天列表
        // 找到历史记录容器(main_ui.ts中创建的)
        if(kimiSidebarHistoryChatListContainerDiv && kimiSidebarHistoryButton){
            kimiSidebarHistoryButton.addEventListener("click", async (e) => {
                e.stopPropagation()

                console.log("kimiSidebarHistoryButton click")
                
                kimiSidebarHistoryChatListContainerDiv.classList.toggle("kimi-sidebar-history-chat-list-container-show")
                if(kimiSidebarHistoryChatListContainerDiv.classList.contains("kimi-sidebar-history-chat-list-container-show")){
                    if(this.isReloadChatHistoryList){
                        // 清空所有的历史记录
                        while(kimiSidebarHistoryChatListContainerDiv.childNodes.length > 1){
                            kimiSidebarHistoryChatListContainerDiv.removeChild(kimiSidebarHistoryChatListContainerDiv.childNodes[0])
                        }
                    }

                    // 绑定监听点击非chathistorylist元素事件
                    setTimeout(() => {
                        kimiMainContainerDiv.addEventListener("click", handleClickNotChatHistoryListDiv)
                    }, 100)
                    
                    // 创建历史记录聊天列表
                    let chatList: any[] = []
                    let historyChatListResponse : KimiApiResponse
                    if(kimiSidebarHistoryChatListContainerDiv.childNodes.length===1){
                        historyChatListResponse = await this.kimiGetChatListHistory({
                        offset: kimiSidebarHistoryChatListContainerDiv.childNodes.length - 1, 
                        size: 50, 
                        kimiMainContainerDiv
                        })
                    }else{
                        // 移除监听点击非chathistorylist元素事件
                        kimiMainContainerDiv.removeEventListener("click", handleClickNotChatHistoryListDiv)
                        return
                    }
                    
                    if(historyChatListResponse.isok){
                        chatList = historyChatListResponse.result.items
                        this.addChatHistoryItem({
                            chatList, 
                            kimiMainContainerDiv,
                            isScrollToBottom: false
                        })
                    }
                    
                }else{
                    // 清空列表, 保留最底部loadcontainerdiv
                    // while(kimiSidebarHistoryChatListContainerDiv.childNodes.length > 1){
                    //     kimiSidebarHistoryChatListContainerDiv.removeChild(kimiSidebarHistoryChatListContainerDiv.childNodes[0])
                    // }
                    
                    // 这里不清空，避免重复加载
                }
            })

            
        }
    }


    public async kimiInitChatHistory():Promise<KimiApiResponse>{
        if(!this.kimiMainContainerDiv){
            return {isok: false, result:{}, error: "kimiMainContainerDiv is not defined"}
        }
        // 创建一个起始默认聊天用于提示用户当前是新的聊天
        const kimiChatMessageContainerDiv = this.kimiMainContainerDiv.querySelector(".kimi-chat-message-container-div") as HTMLDivElement
        const kimiStartNewChatTipDiv = createAgentChatDiv(this.kimiMainContainerDiv.ownerDocument)
        kimiStartNewChatTipDiv.classList.add("kimi-start-new-chat-tip-div")
        kimiStartNewChatTipDiv.classList.remove("agent-chat-container-div")
        const agentMessageMarkdownDisplayDiv = kimiStartNewChatTipDiv.querySelector(".agent-message-markdown-display-div") as HTMLDivElement
        agentMessageMarkdownDisplayDiv.innerHTML = "Hi，我是 Kimi～\n很高兴遇见你！你可以随时把网址🔗或者文件📃发给我，我来帮你看看"
        const agentMessageBottomMenuDiv = kimiStartNewChatTipDiv.querySelector(".agent-message-bottom-menu-div") as HTMLDivElement
        agentMessageBottomMenuDiv.style.display = "none"
        const agentMessageLoadingContainerDiv = kimiStartNewChatTipDiv.querySelector(".agent-message-loading-container-div") as HTMLDivElement
        agentMessageLoadingContainerDiv.style.display = "none"
        const agentMessageBottomRespondingDiv = kimiStartNewChatTipDiv.querySelector(".agent-message-bottom-responding-div") as HTMLDivElement
        agentMessageBottomRespondingDiv.style.display = "none"
        kimiChatMessageContainerDiv.appendChild(kimiStartNewChatTipDiv)
        if(this.chatId !== ""){
            // 首先验证是否存在该聊天， 发送一条消息，如果存在，会有响应，否则返回错误
            this.kimiGetChatInfo ({
                chatId: this.chatId,
            }).then(async (res) => {
                // console.log("@@@@@@@@@res", res)
                if(res.isok){
                    // 如果存在就更新聊天历史记录到当前显示区域
                    this.kimiSwitchChatHistoryToMessageContainer({
                        chatId: this.chatId,
                    })
                }else{
                    agentMessageMarkdownDisplayDiv.innerHTML = "⚠️ 当前不存在聊天，请在历史记录中选择一个聊天或新建一个聊天"
                }
            })
            
        }else{
            agentMessageMarkdownDisplayDiv.innerHTML = "⚠️⚠️ 当前不存在聊天，请在历史记录中选择一个聊天或新建一个聊天"
        }

        return {isok: true, result:{}, error: ""}
    }

    async addChatHistoryItem({chatList, 
        kimiMainContainerDiv,
        isScrollToBottom = true
    }:
    {
        chatList: any[],
        kimiMainContainerDiv: HTMLDivElement,
        isScrollToBottom?: boolean
    }
    ){
        const kimiSidebarHistoryChatListContainerDiv = kimiMainContainerDiv.querySelector(".kimi-sidebar-history-chat-list-container") as HTMLDivElement
        const kimiChatHistoryLoadingContainerDiv = kimiMainContainerDiv.querySelector(".kimi-chat-history-loading-container-div") as HTMLDivElement
        const kimiChatHistoryLoadingMoreButtonDiv = kimiMainContainerDiv.querySelector(".kimi-chat-history-loading-more-button-div") as HTMLDivElement
        const kimiChatHistoryLoadingDiv = kimiMainContainerDiv.querySelector(".kimi-chat-history-loading-div") as HTMLDivElement
        const kimiChatHistoryNoMoreDiv = kimiMainContainerDiv.querySelector(".kimi-chat-history-no-more-div") as HTMLDivElement

        // 首先这里http请求已经结束了，隐藏Loadingdiv, 显示加载更多按钮
        kimiChatHistoryLoadingDiv.style.display = "none"
        kimiChatHistoryLoadingMoreButtonDiv.style.display = "flex"
        
        if(chatList.length === 0){
            // console.log("kimiChatHistoryNoMoreDiv",kimiChatHistoryNoMoreDiv)
            // console.log("kimiChatHistoryLoadingMoreButtonDiv",kimiChatHistoryNoMoreDiv)
            kimiChatHistoryNoMoreDiv.style.display = "flex"
            kimiChatHistoryLoadingMoreButtonDiv.style.display = "none"
            return
        }
        chatList.forEach((chat) => {
            const chatItemDiv = createSingleChatHistoryItemUI(kimiSidebarHistoryChatListContainerDiv.ownerDocument)
            kimiSidebarHistoryChatListContainerDiv.insertBefore(chatItemDiv, kimiChatHistoryLoadingContainerDiv)
            // kimiSidebarHistoryChatListContainerDiv.appendChild(chatItemDiv)

            // 判断是否与this.chatId相同
            if(chat.id === this.chatId){
                // console.log("找到了一样的")
                // console.log("chat", chat.id)
                // console.log("this.chatId", this.chatId)
                chatItemDiv.classList.add("kimi-sidebar-history-chat-list-container-item-active")
            }
            if(!chatItemDiv){
                return
            }

            // 然后找到元素，设置值和监听世家
            const chatHistoryItemTitleTextDiv = chatItemDiv.querySelector(".chat-history-item-title-text-div") as HTMLDivElement
            const chatHistoryItemDateDiv = chatItemDiv.querySelector(".chat-history-item-date-div") as HTMLDivElement
            const chatHistoryItemToolBarEditIconDiv = chatItemDiv.querySelector(".chat-history-item-tool-bar-edit-icon-div") as HTMLDivElement
            const chatHistoryItemToolBarDeleteIconDiv = chatItemDiv.querySelector(".chat-history-item-tool-bar-delete-icon-div") as HTMLDivElement
            const chatHistoryItemToolBarDiv = chatItemDiv.querySelector(".chat-history-item-tool-bar-div") as HTMLDivElement

            chatItemDiv.addEventListener("click", async (e:any) => {
                e.stopPropagation()
                console.log("chatItemDiv click")
                const _switchChatHistoryToMessageContainerResponse = await this.kimiSwitchChatHistoryToMessageContainer({chatId: chat.id})
                console.log("_switchChatHistoryToMessageContainerResponse", _switchChatHistoryToMessageContainerResponse)
                // 关闭侧边栏
                
                if(_switchChatHistoryToMessageContainerResponse.isok){
                    
                    kimiSidebarHistoryChatListContainerDiv.classList.toggle("kimi-sidebar-history-chat-list-container-show")
                    // 将message container的最上方提示文本替换
       
                    const kimiStartNewChatTipDiv = kimiMainContainerDiv.querySelector(".kimi-start-new-chat-tip-div") as HTMLDivElement
                    if(kimiStartNewChatTipDiv){
                        const kimiStartNewChatTipMarkdownDisplay = kimiStartNewChatTipDiv.querySelector(".agent-message-markdown-display-div")
                        if(kimiStartNewChatTipMarkdownDisplay){
                            kimiStartNewChatTipMarkdownDisplay.innerHTML = "Hi，我是 Kimi～\n很高兴遇见你！你可以随时把网址🔗或者文件📃发给我，我来帮你看看"
                        }
                    }
                    this.switchChatHistoryFinishCallBackFunc?.({
                        isok: true,
                        chatId: this.chatId
                    })
                }else{
                    this.switchChatHistoryFinishCallBackFunc?.({
                        isok: false
                    })
                }
            
            })

            if(chatHistoryItemTitleTextDiv){
                chatHistoryItemTitleTextDiv.textContent += chat.name
            }
            if(chatHistoryItemDateDiv){
                chatHistoryItemDateDiv.textContent = chat.created_at.split('.')[0].replace('T', ' ')
            }
            if(chatHistoryItemToolBarEditIconDiv){
                chatHistoryItemToolBarEditIconDiv.addEventListener("click", (e:any) => {
                    e.stopPropagation()
                    console.log("chatHistoryItemToolBarEditIconDiv click")
                    // 创建一个编辑历史记录名称的对话框
                    const editChatHistoryNameDialog = createEditChatHistoryNameDialog({
                        doc: kimiMainContainerDiv.ownerDocument,
                        oldName: chat.name
                    })
                    // 创建一个mask
                    const maskDiv = createMaskDiv(kimiMainContainerDiv.ownerDocument)
                    kimiMainContainerDiv.appendChild(maskDiv)
                    kimiMainContainerDiv.appendChild(editChatHistoryNameDialog)

                    // 绑定两个按钮事件
                    const confirmButton = editChatHistoryNameDialog.querySelector(".kimi-edit-chat-history-name-dialog-confirm-button-div") as HTMLButtonElement
                    const cancelButton = editChatHistoryNameDialog.querySelector(".kimi-edit-chat-history-name-dialog-cancel-button-div") as HTMLButtonElement
                    const inputInput = editChatHistoryNameDialog.querySelector(".kimi-edit-chat-history-name-dialog-input-input") as HTMLInputElement
                    confirmButton.addEventListener("click", async (e) => {
                        e.stopPropagation()
                        console.log("confirmButton click")
                        try{
                            const newName = inputInput.value
                            console.log("newName", newName)
                            console.log("chat", chat.id)
                            const response = await this.kimiEditChatHistoryName({
                                chatId: chat.id,
                                newName: newName
                            })
                            console.log("response", response)
                            if(response.isok){
                                chatHistoryItemTitleTextDiv.textContent = newName
                                chat.name = response.result.name
                            }else{
                                console.error("apis.ts", " func addChatHistoryItem ", " line 548", "confirmButton click error", response.error)
                            }

                        }catch(e){
                            console.error("apis.ts", " func addChatHistoryItem ", " line 548", "confirmButton click error", e)
                        }finally{
                            editChatHistoryNameDialog.remove()
                            maskDiv.remove()
                        }
                    })
                    cancelButton.addEventListener("click", (e) => {
                        e.stopPropagation()
                        console.log("cancelButton click")
                        editChatHistoryNameDialog.remove()
                        maskDiv.remove()
                    })
                    
                })
            }
            if(chatHistoryItemToolBarDeleteIconDiv){
                chatHistoryItemToolBarDeleteIconDiv.addEventListener("click", (e:any) => {
                    e.stopPropagation()
                    console.log("chatHistoryItemToolBarDeleteIconDiv click")
                    // 创建一个删除历史记录的对话框
                    const deleteChatHistoryDialog = createDeleteChatHistoryDialog({
                        doc: kimiMainContainerDiv.ownerDocument,
                    })
                    // 创建一个mask
                    const maskDiv = createMaskDiv(kimiMainContainerDiv.ownerDocument)
                    kimiMainContainerDiv.appendChild(maskDiv)
                    kimiMainContainerDiv.appendChild(deleteChatHistoryDialog)

                    // 绑定两个按钮事件
                    const confirmButton = deleteChatHistoryDialog.querySelector(".kimi-delete-chat-history-dialog-confirm-button-div") as HTMLButtonElement
                    const cancelButton = deleteChatHistoryDialog.querySelector(".kimi-delete-chat-history-dialog-cancel-button-div") as HTMLButtonElement

                    confirmButton.addEventListener("click", async (e) => {
                        e.stopPropagation()
                        console.log("confirmButton click")
                        try{
                            const response = await this.kimiDeleteChatHistory({
                                chatId: chat.id
                            })
                            console.log("response", response)
                            if(response.isok){
                                chatItemDiv.remove()
                            }else{
                                console.error("apis.ts", " func addChatHistoryItem ", " line 632", "confirmButton click error", response.error)
                            }
                        }catch(e){
                            console.error("apis.ts", " func addChatHistoryItem ", " line 632", "confirmButton click error", e)
                        }finally{
                            deleteChatHistoryDialog.remove()
                            maskDiv.remove()
                        }
                    })
                    cancelButton.addEventListener("click", (e) => {
                        e.stopPropagation()
                        console.log("cancelButton click")
                        deleteChatHistoryDialog.remove()
                        maskDiv.remove()
                    })
                })
            }
            if(chatHistoryItemDateDiv){
                chatHistoryItemDateDiv.addEventListener("mouseenter", (e) => {
                    console.log("chatHistoryItemDateDiv mouseenter")
                    // console.log("chatHistoryItemDateDiv", chatHistoryItemDateDiv )
                    // console.log("chatHistoryItemToolBarDiv", chatHistoryItemToolBarDiv )
                    chatHistoryItemDateDiv.style.display = "none"
                    chatHistoryItemToolBarDiv.style.display = "flex"
                })
                // chatHistoryItemDateDiv.addEventListener("mouseleave", (e) => {
                //     console.log("chatHistoryItemDateDiv mouseleave")
                //     chatHistoryItemDateDiv.style.display = "flex"
                //     chatHistoryItemToolBarDiv.style.display = "none"
                // })
            }

            if(chatHistoryItemToolBarDiv){
                
                chatHistoryItemToolBarDiv.addEventListener("mouseleave", (e) => {
                    console.log("chatHistoryItemToolBarDiv mouseleave")
                    chatHistoryItemDateDiv.style.display = "flex"
                    chatHistoryItemToolBarDiv.style.display = "none"
                })
            }

            if(chatItemDiv){
                chatItemDiv.addEventListener("mouseleave", (e) => {
                    console.log("chatItemDiv mouseleave")
                    chatHistoryItemDateDiv.style.display = "flex"
                    chatHistoryItemToolBarDiv.style.display = "none"
                })
            }
        })
        if(isScrollToBottom){
            kimiSidebarHistoryChatListContainerDiv.scrollTop = kimiSidebarHistoryChatListContainerDiv.scrollHeight
        }
    }

    public async refreshAccessToken(): Promise<KimiApiResponse>{
        try{
            const accessTokenResponse = await getAccessToken(this.refreshToken)
            if(accessTokenResponse.isok){
                this.accessToken = accessTokenResponse.result.accessToken
            }
            if(accessTokenResponse.isok){
                this.refreshAccessTokenFininshCallBackFunc?.({
                    isok: true,
                    refreshToken: this.refreshToken,
                    accessToken: this.accessToken,
                })
            }else{
                this.refreshAccessTokenFininshCallBackFunc?.({
                    isok:false
                })
            }
            return accessTokenResponse
        }catch(e:any){
            return {isok:false, result:{},  error:"refresh access token error"}
        }
    }

    // 检查refreshtoken的有效性，如果无效了，要重新登录。
    public async kimiCheckRefreshToken(): Promise<KimiApiResponse>{
        // return {isok: false, result: {}, error: "hello error"}
        try{
            const refreshAccessTokenResponse = await this.refreshAccessToken()
            console.log("refreshAccessTokenResponse", refreshAccessTokenResponse)
            if(!refreshAccessTokenResponse.isok){
                const kimiLoginResponse = await this.kimiLogin({
                    maxCheckLoginRetry: 1000
                })
                if(kimiLoginResponse.isok){
                    this.checkRfreshTokenFinishCallBackFunc?.({
                        isok: true,
                        refreshToken: this.refreshToken,
                        accessToken: this.accessToken,
                    })
                    return {isok: true, result:refreshAccessTokenResponse.result, error:""}
                }else{
                    this.checkRfreshTokenFinishCallBackFunc?.({
                        isok: false,
                    })
                    return {isok: false, result:refreshAccessTokenResponse.result, error:"kimi login error!"}
                }
            }else{
                return refreshAccessTokenResponse
            }
        }catch(e:any){
            return {isok: false, result: {}, error: JSON.stringify(e)}
        }
    }

    public async kimiUploadFile({file, doc, displayUploadFileContainerDiv}:
        {
            file: File | string | {filePath:string, fileUint8Array:Uint8Array} | any
            doc?: Document // 文档类型, 用于创建上传UI, 传入该参数则返回一个上传UI  
            displayUploadFileContainerDiv?: HTMLDivElement // 存在则将上传UI显示在displayUploadFileContainerDiv中
        }
    ): Promise<KimiApiResponse> {

        let uploadFileComp: HTMLElement | undefined = undefined
        let cancelXButton: HTMLButtonElement | undefined = undefined
        let preSignedUrl: string = ""
        let checkBody: KimiUploadFileType = {} as KimiUploadFileType
        let originalFileInfo: {fileName: string, fileExtension: string} = {} as {fileName: string, fileExtension: string}
        let isUploaded: boolean = false // 是否上传完成
        let uploadFileResponse: KimiResponse = {} as KimiResponse // 上传文件的响应
        let isUploadedSuccess: boolean = false // 是否上传成功
        let checkFileResponse: KimiResponse = {} as KimiResponse // 检查文件上传结果的响应

        let _abortUploadRequestFunc: (() => void) | undefined = undefined
        let _abortCheckUploadRequestFunc: (() => void) | undefined = undefined
        let isUploadPipeFinish: boolean = false // 是否上传管道完成
        
        let filePath: string = ""
        let fileUint8Array: Uint8Array | undefined = undefined
        let fileType: string = ""

        let fileHash: string = ""
        let isFileExistInHashMap: boolean = false // 文件是否存在
        // console.info(file)
        // console.info(Object.keys(file))
        // console.info(file.webkitRelativePath)
        // console.info(file.name)
        if(file instanceof File){
            // console.log("file is a File")
            filePath = file.name
            fileUint8Array = new Uint8Array(await file.arrayBuffer())
        }else if(file.name && file.size && file.lastModified){
            // console.log("file is a File from input")
            const _file = file as File
            filePath = _file.name
            fileUint8Array = new Uint8Array(await _file.arrayBuffer())
        }else if(typeof file === "string"){
            if(this.readFileFunc){
                fileUint8Array = await this.readFileFunc(file)
            }else{
                return {isok: false, result: {}, error: "readFileFunc is not defined"}
            }
            filePath = file
        }else{
            filePath = file.filePath
            fileUint8Array = file.fileUint8Array
        }
        if(!fileUint8Array){
            return {isok: false, result: {}, error: "fileUint8Array is not defined"}
        }
        const {fileName, fileExtension} = parseFileNameAndExtension(filePath)
        Object.keys(fileTypeMap).forEach((key) => {
            if(key === fileExtension){
                fileType = fileTypeMap[key][0]
            }
        })
        if(fileType === ""){
            // 如果fileType为空, 则说明文件类型不支持
            return {isok: false, result: {}, error: "fileType is not defined or not supported"}
        }
        
        if(!this.kimiMainContainerDiv){
            return {isok: false, result: {}, error: "kimiMainContainerDiv is not defined"}
        }
        if(!doc){
            doc = this.kimiMainContainerDiv.ownerDocument
        }

        // 这里由于计算hash值需要耗时, 所以先创建上传UI
        
        const _uploadFileComp = createUploadFileComponent({
            fileName: fileName,
            fileType: fileExtension,
            fileSize: fileUint8Array.length,
            enablePreview: this.isEnablePreview,
            previewCallBackFunc: this.previewCallBackFunc,
            doc: doc
        })
        if(_uploadFileComp){
            uploadFileComp = _uploadFileComp
            const filePreviewDiv = _uploadFileComp.querySelector(".kimi_upload_file_comp_img_background_img") as HTMLImageElement
            
        }
        if(!displayUploadFileContainerDiv){
            displayUploadFileContainerDiv = this.kimiMainContainerDiv.querySelector(".kimi-display-file-container-div") as HTMLDivElement
        }

        if(displayUploadFileContainerDiv && uploadFileComp){
            displayUploadFileContainerDiv.appendChild(uploadFileComp)
        }else{
            isUploadPipeFinish = true
            return {isok: false, result: {}, error: "upload file comp is created failed"}
        }

        // 先让ui显示在执行耗时操作
        if(this.isEnableFileHashMapSearch){
            // 如果启用文件哈希值搜索, 则检查文件哈希值是否在fileHashMap中
            fileHash = await calcUint8ArrayHash({
                uint8Array: fileUint8Array,
                cryptoJsUrl: this.cryptoJsUrl
            })
            if(this.fileHashMap[fileHash]){
                isFileExistInHashMap = true
                // return {isok: true, result: {file: this.fileHashMap[fileHash]}, error: ""}
            }
        }

        
        if(!isFileExistInHashMap){
            for(let i = 0; i < this.maxRetry; i++){
                // console.debug("开始获取getUploadPreSignedUrl")
                const preSignedUrlResponse = await getUploadPreSignedUrl({
                    filePath: filePath, 
                    accessToken: this.accessToken, 
                    endPoint: this.endPoint
                })
                // console.debug(preSignedUrlResponse)
                if(preSignedUrlResponse.isok){
                    preSignedUrl = preSignedUrlResponse.result.url
                    checkBody = preSignedUrlResponse.result.checkBody
                    originalFileInfo = preSignedUrlResponse.result.originalFileInfo
                    break
                }else{
                    // console.debug(`第${i}次重新获取getUploadPreSignedUrl`)
                    if(preSignedUrlResponse.isTokenExpired){
                        const accessTokenResponse = await getAccessToken(this.refreshToken)
                        if(accessTokenResponse.isok){
                            this.accessToken = accessTokenResponse.result.accessToken
                        }else{
                            uploadFailedFunc.call(this)
                            return accessTokenResponse
                        }
                    }else{
                        uploadFailedFunc.call(this)
                        return preSignedUrlResponse
                    }
                }
            }
            if (preSignedUrl === "") {
                isUploadPipeFinish = true
                uploadFailedFunc.call(this)
                return {isok: false, result: {}, error: "get preSignedUrl failed"}
            }
        }else{
            const existFileInfo = this.fileHashMap[fileHash]
            originalFileInfo = {
                fileName: existFileInfo.name,
                fileExtension: existFileInfo.name.split(".")[1] || ""
            }
            checkFileResponse.result = existFileInfo
        }
        

        // 添加请求终端逻辑，绑定一个按钮
        if(uploadFileComp){
            // 为上传UI取消按钮添加事件监听
            cancelXButton = uploadFileComp.querySelector(".kimi-upload-file-comp-cancel-x-img-div") as HTMLButtonElement
            if(cancelXButton){
                console.log("cancelButton", cancelXButton)
                cancelXButton.addEventListener("click", _cancelButtonClickFunc)
            }
        }

        if(!isFileExistInHashMap){
            
            for(let i = 0; i < this.maxRetry; i++){  
                uploadFileResponse = await uploadFile(fileUint8Array, preSignedUrl, fileExtension, 
                    this.uploadFileUint8ArrayTimeout, 
                    (abortFunc) => {
                    _abortUploadRequestFunc = abortFunc
                })
                if(uploadFileResponse.isok){
                    isUploaded = true
                    break
                }else{
                    if(uploadFileResponse.isTokenExpired){
                        const accessTokenResponse = await getAccessToken(this.refreshToken)
                        if(accessTokenResponse.isok){
                            this.accessToken = accessTokenResponse.result.accessToken
                        }else{
                            uploadFailedFunc.call(this)
                            return accessTokenResponse
                        }
                    }else{
                        uploadFailedFunc.call(this)
                        return uploadFileResponse
                    }
                }
            }
            if(!isUploaded){
                uploadFailedFunc.call(this)
                return {isok: false, result: {}, error: "upload file failed"}
            }
    
            // 检查文件是否上传成功 
            console.log("checkBody", checkBody)
            for(let i = 0; i < this.maxRetry; i++){
                checkFileResponse = await checkUploadResult({
                    fileRequestParams: checkBody, 
                    accessToken: this.accessToken, 
                    endPoint: this.endPoint,
                    abortFuncSetter: (abortFunc) => {
                        _abortCheckUploadRequestFunc = abortFunc
                    }
                })
                if(checkFileResponse.isok){
                    isUploadedSuccess = true
                    break
                }else{
                    if(checkFileResponse.isTokenExpired){
                        const accessTokenResponse = await getAccessToken(this.refreshToken)
                        if(accessTokenResponse.isok){
                            this.accessToken = accessTokenResponse.result.accessToken
                        }else{
                            uploadFailedFunc.call(this)
                            return accessTokenResponse
                        }
                    }else{
                        uploadFailedFunc.call(this)
                        return checkFileResponse
                    }
                }
            }
            if(!isUploadedSuccess){
                uploadFailedFunc.call(this)
                return {isok: false, result: {}, error: "check file upload result failed"}
            }
        }

        // 如果元素没有被移除，那么上传成功
        if (uploadFileComp) {
            return uploadSuccessFunc.call(this)
        } else {
            return uploadFailedFunc.call(this)
        }

        async function uploadFailedFunc(this: KimiApi){
            console.log("uploadFailedFunc this", this)
            isUploadPipeFinish = true
            if(uploadFileComp){
                uploadFileComp.remove()
            }
            cancelXButton?.removeEventListener("click", _cancelButtonClickFunc)
            this.refFiles = this.refFiles.filter((id) => id !== uploadFileResponse.result.id)
            if(this.uploadFileCallBackFunc){
                this.uploadFileCallBackFunc.call(this, {
                    isok: false,
                    result: {},
                    error: "upload file failed"
                })
            }
            return {isok: false, result: {}, error: "check file upload result failed"}
        }

        async function uploadSuccessFunc(this: KimiApi){
            // 上传成功需要更新UI
            console.log("uploadSuccessFunc this", this)
            isUploadPipeFinish = true
            if(uploadFileComp){
                const imgLoadingElement = uploadFileComp.querySelector(".kimi_upload_file_comp_img_loading_div") as HTMLDivElement
                const imgBackGroundElement = uploadFileComp.querySelector(".kimi_upload_file_comp_img_background_img") as HTMLImageElement
                
                if(imgLoadingElement){
                    imgLoadingElement.remove()
                }
                if(imgBackGroundElement){
                    if(checkFileResponse.result.type === "file"){
                        imgBackGroundElement.src = icons[`${fileExtension}Icon` as keyof typeof icons]

                        // imgBackGroundElement.src = fileImageIconSrc
                    }else if(checkFileResponse.result.type === "image"){
                        imgBackGroundElement.src = checkFileResponse.result.presigned_url
                        imgBackGroundElement.style.height = "100%"
                        imgBackGroundElement.style.width = "100%"
                        imgBackGroundElement.style.objectFit = "cover"
                        imgBackGroundElement.style.objectPosition = "center"
                        imgBackGroundElement.style.borderRadius = "5px"
                        imgBackGroundElement.style.overflow = "hidden"
                        imgBackGroundElement.style.border = "1px solid #ccc"
                        imgBackGroundElement.style.boxShadow = "0 0 1px 0 rgba(0, 0, 0, 0.3)"
                    }
                }
                const cancelButton = uploadFileComp.querySelector(".kimi-upload-file-comp-cancel-x-img-div") as HTMLButtonElement
                if(cancelButton){
                    cancelButton.addEventListener("click", (e) => {
                        e.stopPropagation()
                        this.refFiles = this.refFiles.filter((id) => id !== checkFileResponse.result.id)
                        uploadFileComp.remove()
                        console.log("this.refFiles", this.refFiles)
                    })
                }

                // 将文件哈希值添加到fileHashMap中
                // const _fileUint8Array = fileUint8Array || new Uint8Array(await file.arrayBuffer())
                // const fileHash = await calcUint8ArrayHash(_fileUint8Array)
                console.log("fileHash", fileHash)
                this.fileHashMap[fileHash] = checkFileResponse.result
                console.log("this.fileHashMap", this.fileHashMap)
                this.refFiles.push(checkFileResponse.result.id)
                console.log("this.refFiles", this.refFiles)
            }
            
            // 将预览链接的值存储起来
            const previewUrlDiv = uploadFileComp?.querySelector(".kimi-upload-file-comp-preview-url-div")
            console.log("previewUrlDiv", previewUrlDiv)
            console.log(checkFileResponse.result.presigned_url)
            if(previewUrlDiv){
                previewUrlDiv.textContent = checkFileResponse.result.presigned_url 
            }

            if(this.uploadFileCallBackFunc){
                this.uploadFileCallBackFunc.call(this, {
                    isok: true,
                    result: {
                        file: checkFileResponse.result,
                        uploadFileComp: uploadFileComp
                    },
                    error: ""
                })
            }
            cancelXButton?.removeEventListener("click", _cancelButtonClickFunc)
            // console.log("checkFileResponse", checkFileResponse)
            return {isok: true, result: {...checkFileResponse.result, uploadFileComp: uploadFileComp}, error: ""}
        }

        async function _cancelButtonClickFunc( this: KimiApi , e: any) {
            console.log("cancelButton click")
            if(isUploadPipeFinish){
                return
            }

            if(!uploadFileResponse.isok){
                _abortUploadRequestFunc?.()
                uploadFailedFunc.call(this)
            }
            if(!checkFileResponse.isok){
                _abortCheckUploadRequestFunc?.()
                uploadFailedFunc.call(this)
            }
            // 如果两个都是ok, 则isUploadPipeFinish的值为true，移除监听事件
            cancelXButton?.removeEventListener("click", _cancelButtonClickFunc)
        }
        

        
    }

    public async kimiGetLoginId(): Promise<KimiApiResponse>{
        try{
            return await getLoginId({
                endPoint: this.endPoint
            })
        }catch(e:any){
            return {isok: false, result:{}, error:"getloginid error!"}
        }
    }

    public async kimiCheckLogin({ loginId, maxCheckLoginRetry = 100}:
        {
            loginId: string, 
            maxCheckLoginRetry?: number
        }
    ): Promise<KimiApiResponse>{
        return new Promise(async (resolve, reject) => {
            try{
                if(loginId){
                    const checkLoginResponse = await checkLogin({
                        loginId: loginId,
                        endPoint: this.endPoint
                    })
                    if(checkLoginResponse.isok && checkLoginResponse.result.status == "login"){
                        resolve({isok: true, result: checkLoginResponse.result, error: ""})
                    }else{
                        reject({isok: false, result: checkLoginResponse.result, error: "登录状态不是login"})
                    }
                }else{
                    reject({isok: false, result: {}, error: "loginId is not defined"})
                }
            }catch(e:any){
                console.warn("apis.ts", " func kimiCheckLogin ", " line 214", e)
                reject({isok: false, result: {}, error: JSON.stringify(e)})
            }
        })
    }

    /**
     * 登录整体逻辑，暂时不用
     * @param maxCheckLoginRetry
     * @returns 
     */
    public async kimiLogin({maxCheckLoginRetry = 100}: {maxCheckLoginRetry?: number}): Promise<KimiApiResponse>{
        return new Promise(async (resolve, reject) => {   
            try{
                let curCheckLoginRetry = 0
                const loginIdResponse = await getLoginId({
                    endPoint: this.endPoint
                })
                
                
                if(loginIdResponse.isok){
                    const loginId = loginIdResponse.result.id
                    console.log("loginId", loginId)
                    // 获取loginid成功后生成二维码UI
                    if(!this.kimiMainContainerDiv){
                        return {isok: false, result: {}, error: "this.kimiMainContainerDiv is undefine"}
                    }
                    
                    const genQrcodeResponse = this.kimiGenQrcodeDiv(loginId, this.kimiMainContainerDiv.ownerDocument)
                    const qrcodeDiv = genQrcodeResponse.result.qrcodeDiv
                    const loginDiv = createLoginDiv({
                        doc: this.kimiMainContainerDiv.ownerDocument,
                        qrcodeDiv: qrcodeDiv
                    })
                    this.kimiMainContainerDiv.appendChild(loginDiv)
                    const loginIntervalID = setInterval(async (e: any) => {
                        try{
                            const kimiCheckLoginResponse = await this.kimiCheckLogin({loginId: loginId})
                            if(curCheckLoginRetry > maxCheckLoginRetry){
                                clearInterval(loginIntervalID)
                                this.loginFinishCallBackFunc?.({
                                    isok: false,
                                })
                                reject({isok: true, result: {}, error: "重试次数耗尽"})
                            }
                            
                            if(kimiCheckLoginResponse.isok){
                                clearInterval(loginIntervalID)
                                this.accessToken = kimiCheckLoginResponse.result.access_token
                                this.refreshToken = kimiCheckLoginResponse.result.refresh_token
                                loginDiv.remove()
                                this.loginFinishCallBackFunc?.({
                                    isok: true,
                                    refreshToken: this.refreshToken,
                                    accessToken: this.accessToken
                                })
                                resolve({isok: true, result: {}, error: ""})
                            }else{
                                // clearInterval(intervalID)
                                console.warn("apis.ts", " func kimiLogin ", " line 209", `check login failed, over max retry ${curCheckLoginRetry} / ${maxCheckLoginRetry}`)
                                // reject({
                                //     isok: false, 
                                //     result: {}, 
                                //     error: `check login failed, over max retry ${curCheckLoginRetry} / ${maxCheckLoginRetry}`
                                // })
                            }
                            curCheckLoginRetry++
                            
                        }catch(e:any){
                            console.warn("apis.ts function kimiLogin line 1459", e)
                        }
                        
                    }, 1000)

                    this.intervalStorageMap["loginIntervalID"] = loginIntervalID

                }
            }catch(e:any){
                this.loginFinishCallBackFunc?.({
                    isok: false,
                })
                console.warn("apis.ts", " func kimiLogin ", " line 212", e)
                reject({isok: false, result: {}, error: "get login id failed"})
            }
                
    })
    }

    public kimiGenQrcodeDiv(id: string, doc: Document): KimiApiResponse{
        const qrcodeDiv = genQRCode({
            login_id: id,
            doc: doc,
            endPoint: this.endPoint
        })
        if(qrcodeDiv){
            return {isok: true, result: {qrcodeDiv: qrcodeDiv}, error: ""}
        }else{
            return {isok: false, result: {}, error: "gen qrcode failed"}
        }
    }

    /**
     * 创建一个chat
     * @returns KimiApiResponse中的result: {id: string, ...}
     */
    public async kimiCreateNewChat({useMath=false}: 
        {
            useMath?: boolean
        }
    ): Promise<KimiApiResponse>{
        return await createNewChat({
            accessToken: this.accessToken,
            endPoint: this.endPoint,
            useMath: useMath
        })
    }

    /**
     * 获取chat的completion
     * @param chatId 
     * @param query 
     * @param useMath 
     * @returns KimiApiResponse中的result: {id: string, ...}    
     */
    public async kimiGetChatCompletion({chatId, query, refFileIds=[], useMath=false, useStream=true, abortFuncSetter}: 
        {
            chatId: string, 
            query: string, 
            refFileIds?: string[],
            useMath?: boolean,
            useStream?: boolean,
            abortFuncSetter?: (abortFunc: () => void) => void
        }
    ): Promise<KimiApiResponse>{
        
        try{
            refFileIds = refFileIds || this.refFiles
            console.log("refFileIds", refFileIds)
            const url = `${this.endPoint}/api/chat/${chatId}/completion/stream`
            const headers = {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${this.accessToken}`,
                "Host": "kimi.moonshot.cn",
            } 
            let body: Record<string, any> = {
                "messages": [
                    {
                        "role": "user",
                        "content": query
                    }
                ],
                "use_search": true,
                "extend": {
                    "sidebar": false
                },
                "kimiplus_id": "kimi",
                "use_research": false,
                "refs": refFileIds,
                "refs_file": []
            }
            if(useMath){
                body["use_math"] = true
            }

            let _streamResponse: KimiResponse = {} as KimiResponse
            let getStreamResponseOk: boolean = false
            let abortFunc: (() => void) | undefined
            for(let i = 0; i < this.maxRetry; i++){
                const streamResponse = await kimiStreamRequest({
                    url: url,
                    method: "POST",
                    headers: headers,
                    body: body,
                    abortFuncSetter: (abortFunc) => {
                        abortFunc = abortFunc
                    }
                })
                if(streamResponse.isok){
                    _streamResponse = streamResponse
                    getStreamResponseOk = true
                    break
                }else{
                    if(streamResponse.isTokenExpired){
                        const accessTokenResponse = await getAccessToken(this.refreshToken)
                        if(accessTokenResponse.isok){
                            this.accessToken = accessTokenResponse.result.accessToken
                        }else{
                            return accessTokenResponse
                        }
                    }else{
                        return streamResponse
                    }
                }
            }
            if(!getStreamResponseOk){
                return {isok: false, result: {}, error: "get chat completion stream failed"}
            }else{
                if(useStream){
                    return {isok: true, result: _streamResponse.result, error: ""}
                }else{
                    return new Promise(async (resolve, reject) => {
                        try{
                            let res = ""
                            const stream = _streamResponse.result.stream
                            for await (const chunk of stream){
                                if(chunk.event === "cmpl" && chunk.text){
                                    res += chunk.text
                                }
                            }
                            resolve({isok: true, result: {content: res}, error: ""})
                        }catch(e:any){
                            console.warn("apis.ts", " func kimiGetChatCompletion ", " line 362", e)
                            reject({isok: false, result: {}, error: JSON.stringify(e)})
                        }
                    })
                }
            }
        }catch(e:any){
            console.warn("apis.ts", " func kimiGetChatCompletionStream ", " line 293", e)
            return {isok: false, result: {}, error: JSON.stringify(e)}
        }
    }

    // 定义一个发送消息的函数
    public async sendChatQueryMessageFunc({
            message, 
            chatId = this.chatId, 
            useMath=false,
            // kimiChatMessageContainerDiv,
            // kimiDisplayFileContainerDiv,
            // userInputTextArea,
            // selectFileButtonDiv,
            // sendMessageButtonDiv,
            // doc
        }: 
        {
            message: string, 
            chatId?: string,
            useMath?: boolean
            // kimiChatMessageContainerDiv: HTMLDivElement,
            // kimiDisplayFileContainerDiv: HTMLDivElement,
            // userInputTextArea: HTMLTextAreaElement,
            // selectFileButtonDiv: HTMLDivElement,
            // sendMessageButtonDiv: HTMLDivElement,
            // doc: Document
        }): Promise<KimiApiResponse> {
        if(chatId === ""){
            return {isok: false, result: {}, error: "chatId is empty"}
        }
        const selectFileButtonDiv = this.kimiMainContainerDiv?.querySelector(".select-file-button-div") as HTMLDivElement
        const sendMessageButtonDiv = this.kimiMainContainerDiv?.querySelector(".send-message-button-div") as HTMLDivElement
        const kimiChatMessageContainerDiv = this.kimiMainContainerDiv?.querySelector(".kimi-chat-message-container-div") as HTMLDivElement
        const kimiDisplayFileContainerDiv = this.kimiMainContainerDiv?.querySelector(".kimi-display-file-container-div") as HTMLDivElement
        const userInputTextArea = this.kimiMainContainerDiv?.querySelector(".user-input-text-area") as HTMLTextAreaElement

        if(selectFileButtonDiv.classList.contains("disabled") || 
            sendMessageButtonDiv.classList.contains("disabled")){
            return {isok: false, result: {}, error: "select file button or send message button is disabled"}
        }
        if(this.isResponsing){
            return {isok: false, result: {}, error: "the chat is responding"}
        }

        let userChatDiv: HTMLDivElement | undefined
        let agentChatDiv: HTMLDivElement | undefined
        let userMessageMarkdownDisplayDiv: HTMLDivElement | undefined;
        let userMessageCopyButtonDiv: HTMLDivElement | undefined;
        let userUploadFileDisplayDiv: HTMLDivElement | undefined;
        let agentMessageMarkdownDisplayDiv: HTMLDivElement | undefined;
        let agentMessageOriginalDiv: HTMLDivElement | undefined;
        let agentMessageCodeOriginalDiv: HTMLDivElement | undefined;
        let agentMessageCodeCopyButtonDiv: HTMLDivElement | undefined;
        let agentMessageCopyButtonDiv: HTMLDivElement | undefined;
        let agentMessageBottomMenuDiv: HTMLDivElement | undefined;
        let agentMessageLoadingContainerDiv: HTMLDivElement | undefined;
        let agentMessageInnerContainerDiv: HTMLDivElement | undefined;
        let agentMessageBottomRespondingDiv: HTMLDivElement | undefined;
        let agentMessageRespondingDiv: HTMLDivElement | undefined;

        const kimiStopChatAgentResponesButtonDiv = this.kimiMainContainerDiv?.querySelector(".kimi-stop-chat-agent-respones-button-div") as HTMLDivElement
        let originalResponseText = ""
        try{
            const streamResponse = await this.kimiGetChatCompletion({
                chatId: this.chatId, 
                query: message,
                useMath: useMath,
                refFileIds: this.refFiles,
                abortFuncSetter: (abortFunc) => {
                    this.abortAgentResponseFunc = abortFunc
                    
                }
            })

            // console.log("streamResponse", streamResponse)
            if(streamResponse.isok){
                kimiStopChatAgentResponesButtonDiv.style.display = "flex"
                this.isResponsing = true // 正在响应   
                if(!this.doc){
                    return {isok: false, result: {}, error: "doc is undefined"}
                }
                const chatBoxes = createChatBox(this.doc)
                if(!chatBoxes){
                    return {isok: false, result: {}, error: "create chat box failed"}
                }
                const [userChatDivDict, agentChatDivDict] = chatBoxes
                if(!userChatDivDict || !agentChatDivDict){
                    return {isok: false, result: {}, error: "create chat box failed"}
                }
                // console.log("kimiChatMessageContainerDiv", kimiChatMessageContainerDiv)
                
                userChatDiv = userChatDivDict.userChatDiv
                agentChatDiv = agentChatDivDict.agentChatDiv
                kimiChatMessageContainerDiv.appendChild(userChatDiv)
                kimiChatMessageContainerDiv.appendChild(agentChatDiv)
    
                // 将文件图标append到userChatDiv中
                userUploadFileDisplayDiv = userChatDivDict.userUploadFileDisplayDiv as HTMLDivElement
                while(kimiDisplayFileContainerDiv.childNodes.length !==0){
                    const fileDisplayDiv = kimiDisplayFileContainerDiv.childNodes[0] as HTMLDivElement
                    if(fileDisplayDiv){
                        const cancelXButton = fileDisplayDiv.querySelector(".kimi-upload-file-comp-cancel-x-img-div") as HTMLDivElement
                        if(cancelXButton){
                            cancelXButton.style.display = "none"
                        }
                        userUploadFileDisplayDiv.appendChild(fileDisplayDiv)
                    }
                }
                
    
                userMessageMarkdownDisplayDiv = userChatDivDict.userMessageMarkdownDisplayDiv as HTMLDivElement
                userMessageCopyButtonDiv = userChatDivDict.userMessageCopyButtonDiv as HTMLDivElement
                agentMessageMarkdownDisplayDiv = agentChatDivDict.agentMessageMarkdownDisplayDiv as HTMLDivElement
                agentMessageOriginalDiv = agentChatDivDict.agentMessageOriginalDiv as HTMLDivElement
                // agentMessageCodeOriginalDiv = agentChatDivDict.agentMessageCodeOriginalDiv as HTMLDivElement
                // agentMessageCodeDisplayDiv = agentChatDivDict.agentMessageCodeDisplayDiv as HTMLDivElement
                agentMessageCopyButtonDiv = agentChatDivDict.agentMessageCopyButtonDiv as HTMLDivElement
                agentMessageBottomMenuDiv = agentChatDivDict.agentMessageBottomMenuDiv as HTMLDivElement
                agentMessageLoadingContainerDiv = agentChatDivDict.agentMessageLoadingContainerDiv as HTMLDivElement
                agentMessageInnerContainerDiv = agentChatDivDict.agentMessageInnerContainerDiv as HTMLDivElement
                agentMessageBottomRespondingDiv = agentChatDivDict.agentMessageBottomRespondingDiv as HTMLDivElement
                agentMessageRespondingDiv = agentChatDivDict.agentMessageRespondingDiv as HTMLDivElement
    
                // userMessageMarkdownDisplayDiv.innerHTML = message
                userMessageMarkdownDisplayDiv.textContent = message
                // 实时刷新，底部显示
                kimiChatMessageContainerDiv.scrollTop = kimiChatMessageContainerDiv.scrollHeight
                this.kimiMessageContainerDivScrollTop = kimiChatMessageContainerDiv.scrollHeight
                userInputTextArea.value = ""
                autoExpandUserInputTextArea(userInputTextArea) // 必须要在value真的变为""后再重新计算
                selectFileButtonDiv.classList.add("disabled")
                sendMessageButtonDiv.classList.add("disabled")
                
                
                const stream = streamResponse.result.stream
                for await (const data of stream){
                    try{
                        // console.log(data)
                        // console.log(userInputTextArea.textLength)
                        if(data.event === "resp" && data.id && data.group_id){
                            this.segmentId = data.id
                        }
                        if(data.event !== "cmpl") continue
                        //console.log(data);
                        originalResponseText += (data.text ? data.text : "")
                        
                        originalResponseText = replaceMathSymbols(originalResponseText)
                        originalResponseText = removeOnlineCite(originalResponseText)
                        const _markdownText = markdown.render(originalResponseText)
                        
                        agentChatDivDict.agentMessageMarkdownDisplayDiv.innerHTML = _markdownText
                        // console.log("agentChatDivDict@@@@@@@@@@@@", agentChatDivDict.agentMessageMarkdownDisplayDiv.innerHTML)
                        if(this.isRemoveSVGElements){
                            removeSVGElements(agentChatDivDict.agentMessageMarkdownDisplayDiv)
                        }
                        if (originalResponseText.length > 0){
                            agentMessageLoadingContainerDiv.style.display = "none"
                            agentMessageInnerContainerDiv.style.display = "flex"
                            agentMessageBottomRespondingDiv.style.display = "flex"
                        }
        
                        // 实时刷新，底部显示
                        kimiChatMessageContainerDiv.scrollTop = kimiChatMessageContainerDiv.scrollHeight
                        this.kimiMessageContainerDivScrollTop = kimiChatMessageContainerDiv.scrollHeight
                    }catch(e:any){
                        // console.log("e", e)
                        // console.log("originalResponseText", originalResponseText)
                        // console.log("agentChatDivDict.agentMessageMarkdownDisplayDiv.innerHTML", agentChatDivDict.agentMessageMarkdownDisplayDiv.innerHTML)
                        console.warn("apis.ts", " func sendChatQueryMessageFunc ", " line 1619", e)
                    }
                }
                
                sendFinishFunc.call(this)
                return {isok: true, result: {}, error: ""}
            }else{
                sendFinishFunc.call(this)
                return streamResponse
            }
        }catch(e:any){
            return {isok: false, result: {}, error: JSON.stringify(e)}
        }
        
        

        function sendFinishFunc (this: KimiApi){
            try{
                
    
                // 回答完毕后再去找code的code-content(隐藏)和code-copy-button
                if(agentChatDiv){
                    agentMessageCodeOriginalDiv = agentChatDiv.querySelector(".kimi-markdown-code-original-content") as HTMLDivElement
                    agentMessageCodeCopyButtonDiv = agentChatDiv.querySelector(".kimi-markdown-code-copy-button") as HTMLDivElement
                   
                    if(agentMessageCodeCopyButtonDiv){
                        agentMessageCodeCopyButtonDiv.classList.remove("disabled") // 解除禁制
                        agentMessageCodeCopyButtonDiv.addEventListener('click', ()=>{
                            console.log("agentMessageCodeCopyButtonDiv click")
                            try{
                                navigator.clipboard.writeText(decodeBase64(agentMessageCodeOriginalDiv?.textContent || ""))
                                // alert("复制成功")
                                this.copyMessageCallBackFunc?.({isok: true, content: agentMessageCodeOriginalDiv?.textContent || ""})
                            }catch(e:any){
                                this.copyMessageCallBackFunc?.({isok: false, content: ""})
                            }
                            
                        })
                    }
                    console.log("agentMessageCopyButtonDiv$$@@", agentMessageCopyButtonDiv)
                    if(agentMessageCopyButtonDiv){
                        agentMessageCopyButtonDiv.addEventListener("click", () => {
                            console.log("agentMessageCopyButtonDiv click")
                            try{
                                const content = agentMessageOriginalDiv?.innerHTML || ""
                                navigator.clipboard.writeText(refineResponseText(content))
                                console.log(refineResponseText(content))
                                this.copyMessageCallBackFunc?.({isok: true, content: content})
                            }catch(e:any){
                                this.copyMessageCallBackFunc?.({isok: false, content: ""})
                            }
                        })
                    }
                }
                if (userMessageCopyButtonDiv){
                    userMessageCopyButtonDiv.addEventListener("click", () => {
                        try{
                            console.log("userMessageCopyButtonDiv click")
                            const content = userMessageMarkdownDisplayDiv?.textContent
                            navigator.clipboard.writeText(content || "")
                            this.copyMessageCallBackFunc?.({isok: true, content: content || ""})
                        }catch(e:any){
                            this.copyMessageCallBackFunc?.({isok: false, content: ""})
                        }
                    })
                }
                
                
            }catch(e:any){
                console.warn("apis.ts", " func sendFinishFunc ", " line 1262", e)
            }finally{
                this.refFiles = []
                this.isResponsing = false // 响应完毕
    
                selectFileButtonDiv.classList.remove("disabled")
    
                if(checkUserInputIsILLegel(userInputTextArea)){ // 如果用户输入了内容，则可以发送消息
                    sendMessageButtonDiv.classList.remove("disabled")
                }
                this.segmentId = ""
                this.abortAgentResponseFunc = undefined
                kimiStopChatAgentResponesButtonDiv.style.display = "none"
                if(agentMessageLoadingContainerDiv){
                    agentMessageLoadingContainerDiv.style.display = "none"
                }
                if(agentMessageInnerContainerDiv){
                    agentMessageInnerContainerDiv.style.display = "flex"
                }
                if(agentMessageOriginalDiv){
                    agentMessageOriginalDiv.textContent = originalResponseText
                }
                if(agentMessageBottomMenuDiv){
                    agentMessageBottomMenuDiv.style.display = "flex"
                }
                if(agentMessageBottomRespondingDiv){
                    agentMessageBottomRespondingDiv.style.display = "none"
                }
                
            }
            
        }
    }
    
    public async kimiStopChatAgentRespones(kimiStopChatAgentResponesButtonDiv: HTMLDivElement){
        console.log("kimiStopChatAgentRespones")
        try{
            // 如果正在响应，则取消响应 如果没有就单纯当作最后让停止按钮消失
            if(this.isResponsing){
                const cancelResponse = await cancelChatAgentResponse({
                    endPoint: this.endPoint,
                    accessToken: this.accessToken,
                    chatId: this.chatId,
                    segmentId: this.segmentId
                })
            }
            
        }catch(e:any){
            console.warn("apis.ts", " func handleStopChatAgentResponesButtonClick ", " line 1195", e)
        }finally{
            if(this.abortAgentResponseFunc){
                this.abortAgentResponseFunc()
            }
            this.isResponsing = false
            this.segmentId = ""
            this.abortAgentResponseFunc = undefined
            kimiStopChatAgentResponesButtonDiv.style.display = "none"
            const agentMessageRespondingDivs = this.kimiMainContainerDiv?.querySelectorAll(".agent-message-responding-div") as NodeListOf<HTMLDivElement>
            agentMessageRespondingDivs[agentMessageRespondingDivs.length - 1].style.display = "none"


            // 将标识符加上
            const agentCancelResponseNoticeDiv = this.kimiMainContainerDiv?.querySelectorAll(".agent-cancel-response-notice-div") as NodeListOf<HTMLDivElement>
            if(agentCancelResponseNoticeDiv){
                agentCancelResponseNoticeDiv[agentCancelResponseNoticeDiv.length - 1].style.display = "flex"
            }
            // 如果没有人户响应,设置一下agentMessageMarkdownDisplayDiv的innerHTML
            const agentMessageMarkdownDisplayDiv = this.kimiMainContainerDiv?.querySelectorAll(".agent-message-markdown-display-div") as NodeListOf<HTMLDivElement>
            if(agentMessageMarkdownDisplayDiv.length > 0){
                agentMessageMarkdownDisplayDiv[agentMessageMarkdownDisplayDiv.length - 1].innerHTML = 
                agentMessageMarkdownDisplayDiv[agentMessageMarkdownDisplayDiv.length - 1].innerHTML ? 
                agentMessageMarkdownDisplayDiv[agentMessageMarkdownDisplayDiv.length - 1].innerHTML : "📖 用户取消了回答, 未回复任何内容"
            }
            
        }
    }

    // 切换聊天历史记录
    public async kimiSwitchChatHistoryToMessageContainer({chatId}: 
        {
            chatId: string,
        }
    ): Promise<KimiApiResponse>
    {
        try{
            console.info("开始加载历史记录")
            this.chatId = chatId // 更新this.chatId
            let chatHistoryDetail: Record<string, any>[] = []
            let chatHistoryDetailAllFileRefsInfos: Record<string, any>[] = []
            let chatHistorySwitchLoadingMaskDiv: HTMLDivElement | undefined
            // 创建一个加载的mask
            if(this.doc && this.kimiMainContainerDiv){
                chatHistorySwitchLoadingMaskDiv = createChatHistorySwitchLoadingMaskDiv(this.doc)
                this.kimiMainContainerDiv.appendChild(chatHistorySwitchLoadingMaskDiv)
            }
            console.log("chatHistorySwitchLoadingMaskDiv@@", chatHistorySwitchLoadingMaskDiv)
            // 先获取当前聊天的详细信息
            const chatHistoryDetailResponse = await this.kimiGetChatHistoryDetail()
            if(chatHistoryDetailResponse.isok){
                chatHistoryDetail = chatHistoryDetailResponse.result.items
            }
            console.log("chatHistoryDetailResponse@@", chatHistoryDetailResponse)
            // 再获取当前聊天文件信息
            const chatHistoryDetailAllFileRefsInfosResponse = await this.kimiGetChatHistoryDetailAllFileRefsInfos()
            if(chatHistoryDetailAllFileRefsInfosResponse.isok){
                chatHistoryDetailAllFileRefsInfos = chatHistoryDetailAllFileRefsInfosResponse.result.items
            }
            console.log("chatHistoryDetailAllFileRefsInfosResponse@@", chatHistoryDetailAllFileRefsInfosResponse)
            if(!this.kimiMainContainerDiv){
                return {isok: false, result: {}, error: "kimiMainContainerDiv is undefined"}
            }
            console.log("chatHistoryDetail@@", chatHistoryDetail)
            console.log("chatHistoryDetailAllFileRefsInfos@@", chatHistoryDetailAllFileRefsInfos)

            // 网络请求完毕,开始创建UI，这里可以移除加载的mask
            if(chatHistorySwitchLoadingMaskDiv){
                chatHistorySwitchLoadingMaskDiv.remove()
            }
            const chatHistoryDetailMessageBoxList = createChatHistoryDetailUI({
                kimiMainContainerDiv: this.kimiMainContainerDiv,
                chatHistoryDetail: chatHistoryDetail,
                allFileRefs: chatHistoryDetailAllFileRefsInfos,
                copyMessageCallBackFunc: this.copyMessageCallBackFunc,
                previewFileCallBackFunc: this.previewCallBackFunc,
                isEnablePreview: this.isEnablePreview,
                isRemoveSVGElements: this.isRemoveSVGElements
            })
            console.log("chatHistoryDetailMessageBoxList@@", chatHistoryDetailMessageBoxList)
            if(!chatHistoryDetailMessageBoxList){
                return {isok: false, result: {}, error: "create chat history detail message box list failed"}
            }
            // 将chatHistoryDetailMessageBoxList append到kimiChatMessageContainerDiv中
            const kimiChatMessageContainerDiv = this.kimiMainContainerDiv.querySelector(".kimi-chat-message-container-div") as HTMLDivElement
            if(!kimiChatMessageContainerDiv){
                return {isok: false, result: {}, error: "kimiChatMessageContainerDiv is undefined"}
            }
            // 清空kimiChatMessageContainerDiv
            // while(kimiChatMessageContainerDiv.childNodes.length !== 0){
            //     const childNode = kimiChatMessageContainerDiv.childNodes[0]
            //     if(childNode){
            //         kimiChatMessageContainerDiv.removeChild(childNode)
            //     }
            // }
            while(kimiChatMessageContainerDiv.childNodes.length > 1){
                const childNode = kimiChatMessageContainerDiv.childNodes[1]
                if(childNode){
                    kimiChatMessageContainerDiv.removeChild(childNode)
                }
            }
            chatHistoryDetailMessageBoxList.forEach(messageBox => {
                // console.log("messageBox", messageBox)
                kimiChatMessageContainerDiv.appendChild(messageBox)
            })
            if(this.isSwitchChatHistoryScrollToBottom){
                kimiChatMessageContainerDiv.scrollTop = kimiChatMessageContainerDiv.scrollHeight
                this.kimiMessageContainerDivScrollTop = kimiChatMessageContainerDiv.scrollHeight
            }
            return {isok: true, result: {chatHistoryDetailMessageBoxList}, error: ""}
        }catch(e:any){
            console.warn("apis.ts", " func kimiSwitchChatHistoryToMessageContainer ", " line 1695", e)
            return {isok: false, result: {}, error: JSON.stringify(e)}
        }
    }

    // 获取当前聊天文件信息
    public async kimiGetChatHistoryDetailAllFileRefsInfos(){
        try{
            let chatHistoryDetailAllFileRefsInfosResponse: KimiApiResponse = {} as KimiApiResponse
            for(let i = 0; i < this.maxRetry; i++){
                const _chatHistoryDetailAllFileRefsInfosResponse = await getChatHistoryDetailAllFileRefsInfos({
                    endPoint: this.endPoint,
                    accessToken: this.accessToken,
                    chatId: this.chatId,
                })
                if(_chatHistoryDetailAllFileRefsInfosResponse.isok){
                    setTimeout(() => {
                        this.isLoadingChatList = false
                    }, this.loadingChatListTimeInterval)
                    chatHistoryDetailAllFileRefsInfosResponse = _chatHistoryDetailAllFileRefsInfosResponse
                    break
                }else{
                    if(_chatHistoryDetailAllFileRefsInfosResponse.isTokenExpired){
                        const accessTokenResponse = await getAccessToken(this.refreshToken)
                        if(accessTokenResponse.isok){
                            this.accessToken = accessTokenResponse.result.accessToken
                        }else{
                            chatHistoryDetailAllFileRefsInfosResponse = accessTokenResponse
                        }
                    }else{
                        chatHistoryDetailAllFileRefsInfosResponse = _chatHistoryDetailAllFileRefsInfosResponse
                    }
                }
            }
            
            if(!chatHistoryDetailAllFileRefsInfosResponse.isok){
                return chatHistoryDetailAllFileRefsInfosResponse
            }
            
            return {isok: true, result: chatHistoryDetailAllFileRefsInfosResponse.result, error: ""}
        }catch(e:any){
            return {isok: false, result: {}, error: JSON.stringify(e)}
        }
    }

    // 获取聊天历史详细信息
    public async kimiGetChatHistoryDetail(){
        try{
            let chatHistoryDetailResponse: KimiApiResponse = {} as KimiApiResponse
            for(let i = 0; i < this.maxRetry; i++){
                const _chatHistoryDetailResponse = await getChatHistoryDetail({
                    endPoint: this.endPoint,
                    accessToken: this.accessToken,
                    chatId: this.chatId,
                    last: this.chatHistoryDetailLast
                })
                console.info("_chatHistoryDetailResponse@@", _chatHistoryDetailResponse)
                if(_chatHistoryDetailResponse.isok){
                    setTimeout(() => {
                        this.isLoadingChatList = false
                    }, this.loadingChatListTimeInterval)
                    chatHistoryDetailResponse = _chatHistoryDetailResponse
                    break
                }else{
                    if(_chatHistoryDetailResponse.isTokenExpired){
                        const accessTokenResponse = await getAccessToken(this.refreshToken)
                        if(accessTokenResponse.isok){
                            this.accessToken = accessTokenResponse.result.accessToken
                        }else{
                            chatHistoryDetailResponse = accessTokenResponse
                        }
                    }else{
                        chatHistoryDetailResponse = _chatHistoryDetailResponse
                    }
                }
            }
            
            if(!chatHistoryDetailResponse.isok){
                return chatHistoryDetailResponse
            }
            
            return {isok: true, result: chatHistoryDetailResponse.result, error: ""}
        }catch(e:any){
            return {isok: false, result: {}, error: JSON.stringify(e)}
        }
    }

    // 获取历史记录
    public async kimiGetChatListHistory({offset=0, size=50, kimiMainContainerDiv}: 
        {
            offset?: number, 
            size?: number,
            kimiMainContainerDiv: HTMLDivElement
        }
    ): Promise<KimiApiResponse>{
        try{
            const kimiChatHistoryLoadingDiv = kimiMainContainerDiv.querySelector(".kimi-chat-history-loading-div") as HTMLDivElement
            const kimiChatHistoryLoadingMoreButtonDiv = kimiMainContainerDiv.querySelector(".kimi-chat-history-loading-more-button-div") as HTMLDivElement
            const kimiChatHistoryNoMoreDiv = kimiMainContainerDiv.querySelector(".kimi-chat-history-no-more-div") as HTMLDivElement
    
            // 显示loadingdiv图标，隐藏其他图标
            kimiChatHistoryLoadingDiv.style.display = "flex"
            kimiChatHistoryLoadingMoreButtonDiv.style.display = "none"
            kimiChatHistoryNoMoreDiv.style.display = "none"

            this.isLoadingChatList = true
            let chatListResponse: KimiApiResponse = {} as KimiApiResponse
            for(let i = 0; i < this.maxRetry; i++){
                const chatHistoryResponse = await getChatHistoryList({
                    endPoint: this.endPoint,
                    accessToken: this.accessToken,
                    offset: offset,
                    size: size
                })
                if(chatHistoryResponse.isok){
                    setTimeout(() => {
                        this.isLoadingChatList = false
                    }, this.loadingChatListTimeInterval)
                    chatListResponse = chatHistoryResponse
                    break
                }else{
                    if(chatHistoryResponse.isTokenExpired){
                        const accessTokenResponse = await getAccessToken(this.refreshToken)
                        if(accessTokenResponse.isok){
                            this.accessToken = accessTokenResponse.result.accessToken
                        }else{
                            chatListResponse = accessTokenResponse
                        }
                    }else{
                        chatListResponse = chatHistoryResponse
                    }
                }
            }
            
            if(!chatListResponse.isok){
                return chatListResponse
            }
            
            return {isok: true, result: chatListResponse.result, error: ""}
            
        }catch(e:any){
            return {isok: false, result: {}, error: JSON.stringify(e)}
        }
    }


    public async kimiEditChatHistoryName({chatId, newName}: {chatId: string, newName: string}): Promise<KimiApiResponse>{
        return await editChatHistoryName({
            endPoint: this.endPoint,
            accessToken: this.accessToken,
            chatId: chatId,
            newName: newName
        })
    }

    public async kimiDeleteChatHistory({chatId}: {chatId: string}): Promise<KimiApiResponse>{
        return await deleteChatHistory({
            endPoint: this.endPoint,
            accessToken: this.accessToken,
            chatId: chatId
        })
    }

    public async kimiCreateNewNote({noteName}: {noteName: string}): Promise<KimiApiResponse>{
        if(!this.kimiMainContainerDiv){
            return {isok: false, result: {}, error: "kimiMainContainerDiv is undefined"}
        }
        const kimiNoteButtonContainerDiv = this.kimiMainContainerDiv.querySelector(".kimi-note-button-container-div") as HTMLDivElement
        if(!kimiNoteButtonContainerDiv){
            return {isok: false, result: {}, error: "kimiNoteButtonContainerDiv is undefined"}
        }
        // 创建一个mask
        const createNewNoteDialogMaskDiv = createMaskDiv(this.kimiMainContainerDiv.ownerDocument)
        this.kimiMainContainerDiv.appendChild(createNewNoteDialogMaskDiv)
        // 创建一个dialog
        const createNewNoteDialog = createCreateNewNoteDialog({
            doc: this.kimiMainContainerDiv.ownerDocument,
            defaultNoteName: noteName
        })
        this.kimiMainContainerDiv.appendChild(createNewNoteDialog)
        // 绑定创建笔记对话框的确认按钮
        const createNewNoteDialogConfirmButton = createNewNoteDialog.querySelector(".kimi-create-new-note-dialog-confirm-button-div") as HTMLButtonElement
        const createNewNoteDialogCancelButton = createNewNoteDialog.querySelector(".kimi-create-new-note-dialog-cancel-button-div") as HTMLButtonElement
        if(createNewNoteDialogConfirmButton){
            createNewNoteDialogConfirmButton.addEventListener("click", async (e) => {
                e.stopPropagation()
                console.log("createNewNoteDialogConfirmButton click")
                // 获取输入框的值
                const noteNameInput = createNewNoteDialog.querySelector(".kimi-create-new-note-dialog-input-input") as HTMLInputElement
                console.log("noteNameInput@@", noteNameInput)
                if(noteNameInput && this.kimiMainContainerDiv){
                    const noteName = noteNameInput.value
                    console.log("noteName@@", noteName)
                    const noteText = createNoteText({
                        doc: this.kimiMainContainerDiv.ownerDocument,
                        noteType: "zotero",
                        noteTitle: noteName
                    })
                    if(this.createNoteCallBackFunc){
                        this.createNoteCallBackFunc({
                            noteText: noteText
                        })
                    }
                    kimiNoteButtonContainerDiv.classList.toggle("kimi-note-button-container-div-show")
                    whenClickCreateNewNoteButton({
                        doc: this.kimiMainContainerDiv.ownerDocument,
                    })
                    this.createNewNoteCallBackFunc?.({
                        noteText: noteText
                    })
                    createNewNoteDialog.remove()
                    createNewNoteDialogMaskDiv.remove()
                }
            })
        }
        if(createNewNoteDialogCancelButton){
            createNewNoteDialogCancelButton.addEventListener("click", (e) => {
                e.stopPropagation()
                console.log("createNewNoteDialogCancelButton click")
                createNewNoteDialog.remove()
                createNewNoteDialogMaskDiv.remove()
            })
        }
        return {isok: true, result: {}, error: ""}
    }

    public async kimiGetChatInfo({chatId}: {chatId: string}): Promise<KimiApiResponse>{
        return await getChatInfo({
            endPoint: this.endPoint,
            accessToken: this.accessToken,
            chatId: chatId
        })
    }
}



export {
    KimiApi
}

