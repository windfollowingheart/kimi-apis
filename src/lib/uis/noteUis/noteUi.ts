import { createNoteTextForZotero } from "./noteTexts/zoteroNotes"


function createKimiNoteButtonContainerDiv(doc:Document) {
    const kimiNoteButtonContainerDiv = doc.createElement("div")
    kimiNoteButtonContainerDiv.classList.add("kimi-note-button-container-div")

    // 创建两个按钮 确认和取消
    const confirmButton = doc.createElement("div")
    confirmButton.classList.add("kimi-create-note-confirm-button-div")
    confirmButton.textContent = "确认"
    const cancelButton = doc.createElement("div")
    cancelButton.classList.add("kimi-create-note-cancel-button-div")
    cancelButton.textContent = "取消"

    // 将按钮添加到容器中
    kimiNoteButtonContainerDiv.appendChild(confirmButton)
    kimiNoteButtonContainerDiv.appendChild(cancelButton)

    return kimiNoteButtonContainerDiv
}



function whenClickCreateNewNoteButton({doc, needScrollToBottomNum = 1000, needScrollToBottomPercent = 0.1}:
    {
        doc: Document,
        needScrollToBottomNum?: number,
        needScrollToBottomPercent?: number
    }
) {
    console.log("whenClickCreateNewNoteButton")
    const createNewNoteButtonDiv = doc.querySelector(".kimi-siderbar-create-new-note-button") as HTMLDivElement
    const createNewNoteButtonContainerDiv = doc.querySelector(".kimi-note-button-container-div") as HTMLDivElement
    // createNewNoteButtonContainerDiv.classList.toggle("kimi-note-button-container-div-show")
    const kimiChatMessageContainerDiv = doc.querySelector(".kimi-chat-message-container-div")

    // createNewNoteButtonDiv.classList.remove("chat-list-show")

    // 监听动画结束事件
    const agentMessageContainers = doc?.querySelectorAll(".agent-chat-container-div") as NodeListOf<HTMLDivElement>;
    const userMessageContainers = doc?.querySelectorAll(".user-chat-container-div") as NodeListOf<HTMLDivElement>;

    if (createNewNoteButtonContainerDiv.classList.contains("kimi-note-button-container-div-show")) {
        createNewNoteButtonContainerDiv.style.zIndex = "11";

        //然后给所有bot和user的messagebox添加样式, 即一个虚线边框
        console.log("agentMessageContainers", agentMessageContainers.length)
        console.log("userMessageContainers", userMessageContainers.length)
        for (let i = 0; i < agentMessageContainers.length; i++) {
            if(i<agentMessageContainers.length){
                agentMessageContainers[i].classList.add("add-this-message-box-to-notes-border")
                agentMessageContainers[i].style.padding = "5px"
                userMessageContainers[i].classList.add("add-this-message-box-to-notes-border")
                userMessageContainers[i].style.padding = "5px"
            }
        }
    }
    createNewNoteButtonContainerDiv.addEventListener('transitionend', function handleTransitionEnd() {
        // 确保在动画结束后移除事件监听器
        console.log("createNewNoteButtonContainerDiv transitionend")
        createNewNoteButtonContainerDiv.removeEventListener('transitionend', handleTransitionEnd);

        // 确保 z-index 在动画结束后生效
        if (!createNewNoteButtonContainerDiv.classList.contains("kimi-note-button-container-div-show")) {
            // chatNewNoteButtonContainerDiv.style.zIndex = "-1";
            selectMessageBoxToNoteFinish(doc)
        }
    })
    console.log("kimiChatMessageContainerDiv scrollTop", kimiChatMessageContainerDiv?.scrollTop)
    console.log("kimiChatMessageContainerDiv scrollHeight", kimiChatMessageContainerDiv?.scrollHeight)
    // if (kimiChatMessageContainerDiv && kimiChatMessageContainerDiv.scrollTop + needScrollToBottomNum > kimiChatMessageContainerDiv.scrollHeight) {
        
    //     kimiChatMessageContainerDiv.scrollTop = kimiChatMessageContainerDiv.scrollHeight
    // }
    if (kimiChatMessageContainerDiv && kimiChatMessageContainerDiv.scrollTop > 
        kimiChatMessageContainerDiv.scrollHeight * (1 - needScrollToBottomPercent) && 
        createNewNoteButtonContainerDiv.classList.contains("kimi-note-button-container-div-show")
    ) {
        
        kimiChatMessageContainerDiv.scrollTop = kimiChatMessageContainerDiv.scrollHeight
    }

}

function selectMessageBoxToNoteFinish(doc: Document) {
    // const createNewNoteButtonContainerDiv = doc.querySelector(".kimi-note-button-container-div") as HTMLDivElement
    // createNewNoteButtonContainerDiv.classList.toggle("kimi-note-button-container-div-show")
    removeCreateNewNoteStyle(doc)
}

function removeCreateNewNoteStyle(doc: Document) {
    const agentMessageContainers = doc.querySelectorAll(".agent-chat-container-div") as NodeListOf<HTMLDivElement>;
    const userMessageContainers = doc.querySelectorAll(".user-chat-container-div") as NodeListOf<HTMLDivElement>;
    for (let i = 0; i < agentMessageContainers.length; i++) {
        agentMessageContainers[i].classList.remove("add-this-message-box-to-notes-border")
        agentMessageContainers[i].classList.remove("add-this-message-box-to-notes") 
        if(i<agentMessageContainers.length ){
            userMessageContainers[i].classList.remove("add-this-message-box-to-notes-border")
            userMessageContainers[i].classList.remove("add-this-message-box-to-notes")
        }
        // agentMessageContainers[i].style.padding = "0"
        // userMessageContainers[i].style.padding = "0"
    }
}


function createNoteText({doc, noteType, noteTitle}: 
    {
        doc: Document,
        noteType: string,
        noteTitle: string
    }
) {
    let noteText = ""
    if(noteType === "zotero"){
        noteText = createNoteTextForZotero({
            doc: doc,
            noteTitle: noteTitle
        })
    }
    return noteText
}

export {
    createKimiNoteButtonContainerDiv,
    whenClickCreateNewNoteButton,
    removeCreateNewNoteStyle,
    createNoteText,
}

