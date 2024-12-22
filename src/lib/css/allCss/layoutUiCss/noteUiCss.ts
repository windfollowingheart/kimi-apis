

function createKimiNoteUiCss(doc:Document){
    const kimiNoteUiCss = doc.createElement("style")
    kimiNoteUiCss.innerHTML = `
    .kimi-note-button-container-div { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 15%; /* background-color: #EDEDED; */ background-color: rgba(237, 237, 237, 1); position: absolute; left: 0px; bottom: 0px; overflow-y: auto; scrollbar-width: thin; overflow: hidden; white-space: nowrap; transition: transform 0.5s ease, width 0.5s ease; transform: translateX(0); width: 0px; font-size: 16px; z-index: 5 !important; border-radius: 0 5px 5px 0; }.kimi-note-button-container-div-show { width: 70px; transform: translateX(0); box-shadow: 3px 0px 5px 0 rgba(0, 0, 0, 0.212); z-index: 5 !important; }.kimi-create-note-confirm-button-div { background-color: rgba(0, 123, 255, 1) !important; color: rgba(255, 255, 255, 1) !important; border-radius: 5px; border:none; padding: 5px 10px; cursor: pointer; margin: 5px 0px;}.kimi-create-note-cancel-button-div { background-color: rgba(212, 111, 72, 1) !important; color: rgba(255, 255, 255, 1) !important; border-radius: 5px; border:none; padding: 5px 10px; cursor: pointer; margin: 5px 0px;}.add-this-message-box-to-notes { position: relative;}.add-this-message-box-to-notes::before { content: ""; position: absolute; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(0, 0, 0, 0.2); z-index: 10;}.add-this-message-box-to-notes-border { border-bottom: 2px dashed rgba(138, 138, 138, 1);}
    `
    return kimiNoteUiCss
}

export {
    createKimiNoteUiCss
}