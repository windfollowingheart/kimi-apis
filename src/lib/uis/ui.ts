/**
 * 创建UI
 */
import { createChatHistoryUI, createSingleChatHistoryItemUI } from "./layoutUis/chatHistoryUi"
import { createAgentChatDiv, createUserChatDiv } from "./layoutUis/chatUi"
import { createUploadFileComponent } from "./layoutUis/fileUi"
import { createLoginDiv } from "./layoutUis/loginUi"
import { createKimiMainContainerDiv } from "./layoutUis/mainUi"
import { createMaskDiv, createChatHistorySwitchLoadingMaskDiv } from "./layoutUis/maskUi"

import { createNoteText, whenClickCreateNewNoteButton } from "./noteUis/noteUi"

import { createCreateNewNoteDialog } from "./dialogUis/createNewNoteDialogUI"
import { createEditChatHistoryNameDialog } from "./dialogUis/editorChatHistoryNameDialogUI"
import { createDeleteChatHistoryDialog } from "./dialogUis/deleteChatHistoryDialogUI"













export {
    createKimiMainContainerDiv,
    createLoginDiv,
    createChatHistoryUI,
    createAgentChatDiv,
    createUserChatDiv,
    createUploadFileComponent,
    createSingleChatHistoryItemUI,
    createMaskDiv,
    createChatHistorySwitchLoadingMaskDiv,

    createNoteText,
    whenClickCreateNewNoteButton,

    createCreateNewNoteDialog,
    createEditChatHistoryNameDialog,
    createDeleteChatHistoryDialog,
}