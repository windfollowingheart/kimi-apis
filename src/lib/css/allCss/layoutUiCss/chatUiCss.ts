

function createKimiChatUiCss(doc:Document){
    const kimiChatUiCss = doc.createElement("style")
    kimiChatUiCss.innerHTML = `
    .agent-cancel-response-notice-div { display: none; justify-content: center; align-items: center; border-radius: 5px; background-color: #f5f5f5; height:20px; width:100px; font-size:10px; margin-left: 0; color: #BFBFBF;}
    `
    return kimiChatUiCss
}

export {
    createKimiChatUiCss
}