import { decodeBase64, mathMLToLaTeX } from "../../../utils";


function createNoteTextForZotero({doc, noteTitle}: 
    {
        doc: Document,
        noteTitle: string
    }): string {
    const agentMessageContainers = doc.querySelectorAll(".agent-chat-container-div") as NodeListOf<HTMLDivElement>;
    const userMessageContainers = doc.querySelectorAll(".user-chat-container-div") as NodeListOf<HTMLDivElement>;

    let zoteroNoteText: string = ""
    let attachmentText = ""
    let originalResponseText = ""

    //然后给所有bot和user的messagebox添加样式, 最上面的是bot的messagebox是提示，所以agentMessageContainers.length 比 userMessageContainers.length 多1
    for (let i = 0; i < agentMessageContainers.length; i++) {
        console.log("userMessageContainers[i]", userMessageContainers.length)
        console.log("agentMessageContainers[i]", agentMessageContainers.length)
        if(i < agentMessageContainers.length ){
            
            if (userMessageContainers[i].classList.contains("add-this-message-box-to-notes")) {
                const userMessageMarkdownDisplayDiv = userMessageContainers[i].querySelector(".user-message-markdown-display-div") as HTMLDivElement
                const userUploadFileDisplayDiv = userMessageContainers[i].querySelector(".user-upload-file-display-div") as HTMLDivElement
                if (userMessageMarkdownDisplayDiv) {
                    zoteroNoteText += `<h1>提问</h1>\n<blockquote>\n<p> ${userMessageMarkdownDisplayDiv.innerHTML}</p>\n`
                }
                if (userUploadFileDisplayDiv) {
                    for (let i = 0; i < userUploadFileDisplayDiv.childNodes.length; i++) {
                        const child = userUploadFileDisplayDiv.childNodes[i] as HTMLDivElement
                        const fileNameDisplayDiv = child.querySelector(".kimi_upload_file_comp_file_name_display_div")
                        const imgBackGroundElement = child.querySelector(".kimi_upload_file_comp_img_background_img")
                        if (fileNameDisplayDiv && imgBackGroundElement) {
                            const fileName = fileNameDisplayDiv.textContent || ""
                            const shuffix = fileName.split(".").pop()
                            console.log(shuffix)
                            
                            if (shuffix == "pdf") {
                                attachmentText += `<ul>\n<li>\n${fileName}\n</li>\n`
                            } else {
                                const imageUrl = imgBackGroundElement.getAttribute("src")
                                if (imageUrl) {
                                    attachmentText += `<li>\n<img alt="" src="${imageUrl}" width="50" height="50">\n</li>\n`
                                }
                            }
                            //如果有附件则添加标题: 附件
                            if (attachmentText) {
                                attachmentText = `<h2>附件</h2>\n${attachmentText}`
                                zoteroNoteText += attachmentText
                            }
    
                        }
                    }
                    if (zoteroNoteText) {
                        zoteroNoteText += "<ul>\n"
                    }
    
                }
                if (zoteroNoteText) {
                    zoteroNoteText += "</blockquote>\n"
                }
            }
        }

        const agentMessageOriginalDiv = agentMessageContainers[i].querySelectorAll(".agent-message-original-div")[0] as HTMLDivElement
        console.log("responseOriginalDiv", agentMessageOriginalDiv)
        if (agentMessageContainers[i].classList.contains("add-this-message-box-to-notes")) {

            const agentMessageMarkdownDisplayDiv = agentMessageContainers[i].querySelectorAll(".agent-message-markdown-display-div")[0] as HTMLDivElement

            console.log("agentMessageMarkdownDisplayDiv: ", agentMessageMarkdownDisplayDiv)
            console.log(agentMessageMarkdownDisplayDiv.innerHTML)
            if (agentMessageMarkdownDisplayDiv) {
                let tt = agentMessageMarkdownDisplayDiv.innerHTML.replace(/<div style="display:none" class="kimi-markdown-code-header">(.*?)<\/div>/g, "")
                tt = tt.replace(/<div class="kimi-markdown-code-header">(.*?)复制代码<\/div><\/div>/g, "")
                tt = tt.replace(/<div style="display:none" class="kimi-markdown-code-original-content">(.*?)<\/div>/g, "")
                zoteroNoteText += `<h1>回答</h1>\n<blockquote>\n${tt}</blockquote>\n`
            }
            console.info("agentMessageOriginalDiv", agentMessageOriginalDiv.textContent)
            originalResponseText += (agentMessageOriginalDiv.textContent || "")
            console.log("originalResponseText", originalResponseText)
        }

        

    }
    if (zoteroNoteText.length === 0 || !zoteroNoteText.trim()) {
        return ""
    }

    zoteroNoteText = `<h1><strong>${noteTitle}</strong></h1>\n` + zoteroNoteText
    zoteroNoteText = mathMLToLaTeX(zoteroNoteText, originalResponseText)

    return zoteroNoteText

}

export {
    createNoteTextForZotero
}