

function createCreateNewNoteDialogUiCss(doc:Document){
    const createNewNoteDialogUiCss = doc.createElement("style")
    createNewNoteDialogUiCss.innerHTML = `
    .kimi-create-new-note-dialog { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background-color: #fff; z-index: 10; background-color: #fff; border-radius: 10px; padding: 0 10px 10px 10px; width: 300px; font-size: 12px !important; font-family: Arial, Helvetica, sans-serif; box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);}.kimi-create-new-note-dialog-title-and-x-container-div { display: flex; justify-content: space-between; align-items: center; margin: 5px 0px 10px 0px;}.kimi-create-new-note-dialog-title-div { font-size: 16px; font-weight: 500;}.kimi-create-new-note-dialog-cancel-x-button { font-size: 20px; cursor: pointer; border: none; background-color: transparent;}.kimi-create-new-note-dialog-input-container-div { box-sizing: border-box; display: flex; flex-direction: column; align-items: center; margin: 5px 0px 10px 0px;}.kimi-create-new-note-dialog-input-input { box-sizing: border-box; width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 5px;}.kimi-create-new-note-dialog-confirm-and-cancel-button-container-div { box-sizing: border-box; display: flex; justify-content: flex-end; align-items: center; margin: 5px 0px; height: 20px;}.kimi-create-new-note-dialog-confirm-button-div { box-sizing: border-box; margin-right: 10px; border: 1px solid rgb(80, 123, 214); color: rgb(80, 123, 214); border-radius: 5px; padding: 5px; cursor: pointer; display: flex; align-items: center; justify-content: center;}.kimi-create-new-note-dialog-cancel-button-div { box-sizing: border-box; border-radius: 5px; padding: 5px; cursor: pointer; display: flex; align-items: center; justify-content: center; border: 1px solid rgb(80, 123, 214); background-color: rgb(80, 123, 214); color: #fff;}
    `
    return createNewNoteDialogUiCss
}

export {
    createCreateNewNoteDialogUiCss
}