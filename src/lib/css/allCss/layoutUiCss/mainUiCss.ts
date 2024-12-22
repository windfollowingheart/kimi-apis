

function createKimiMainCss(doc:Document){
    const kimiMainCss = doc.createElement("style")
    kimiMainCss.innerHTML = `
    .disabled { opacity: 0.5; cursor: not-allowed; pointer-events: none;}.kimi-main-container-shallow { box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);}.kimi-main-container-div { box-sizing: border-box; background-color: #F5F4F4 !important; font-family: SimSun, Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace; height: 100%; width: 100%; display: flex; border-radius: 10px; overflow: hidden; position: relative;}.kimi-graph-container-div { height: 100%; width: calc(100% - 60px); display: flex; flex-direction: column; justify-content: center; align-items: center;}.kimi-sider-bar-container-div { height: 100%; width: 60px; background: linear-gradient(0deg, #D8E0E8 0%, #C2D5DE 100%); display: flex; align-items: center; justify-content: center;}.kimi-folder-container-div { height: 100%; width: 0%; position: relative;}.kimi-sidebar-button-container-div { box-sizing: border-box; height: 100%; width: 100%; display: flex; flex-direction: column; align-items: center;}.kimi-siderbar-button { display: inline-block; padding: 5px; transition: transform 0.3s ease; color: #fff; border-radius: 5px; width: 30px; height: 30px; margin: 10px; line-height: 16px; font-size: 12px; display: flex; font-family: SimSun, Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace; font-weight: 700; align-items: center; justify-content: center; border-radius: 5px; white-space: pre-wrap; cursor: pointer; user-select: none;}.kimi-siderbar-button:hover { transform: scale(1.1); background-color: #788ba8;}.kimi-chat-message-container-div { box-sizing: border-box; border: none; outline: none; height: 85%; width: 100%; overflow-wrap: break-all; overflow-y: auto; scrollbar-width: thin; padding: 10px;}.kimi-user-input-menu-container-div { box-sizing: border-box; display: flex; align-items: center; justify-content: center; height: 30px; margin: 5px 0px; padding: 2px; max-width: 60%; width: 100%;}.kimi-display-file-container-div { box-sizing: border-box; display: flex; flex-wrap: wrap; max-width: 100%; width: 100%; gap: 10px; height: 13%; padding: 1vh 0.5vw; overflow-y: auto; scrollbar-width: thin;}.select-file-button-div { width: 25px; height: 25px; position: relative; cursor: pointer;}.send-message-button-div { background-color: blue; width: 50px; height: 25px; font-size: 12px; color: white; display: flex; align-items: center; justify-content: center; border-radius: 5px; cursor: pointer;}.user-input-container-div { width: 320px; position: relative; height: 100%; padding: 0px 5px 5px 5px;}.user-input-text-area { background-color: #ffffff ; border: 1px solid #d3d3d3 ; margin: 0px 3px ; padding: 2px ; width: 90% ; height: 25px ; resize: none ; position: absolute ; bottom: 0px ; scrollbar-width: thin ; font-size: 16px ; word-break: break-all ; font-weight: normal ; transition: border-color 0.3s, box-shadow 0.3s ; border-radius: 10px;}.user-input-text-area:focus { border-color: #007bff; box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);}.kimi-note-button-container-div { background-color: #fff999;}.kimi-chat-history-loading-container-div { display: flex ; flex-shrink: 0; align-items: center; justify-content: center; height: 60px; width: 100%; user-select: none;}.kimi-chat-history-loading-more-button-div { display: flex ; align-items: center; justify-content: center; height: 30px; width: 70px; font-size: 12px; border: 1px solid #d3d3d3; border-radius: 5px; cursor: pointer;}.kimi-chat-history-no-more-div { display: none ; align-items: center; justify-content: center; height: 30px; width: 100%;}.kimi-chat-history-loading-div { display: none ; align-items: center; justify-content: center; height: 20px; width: 20px;}.kimi-sidebar-history-chat-list-container{ box-sizing: border-box; height: 100%; background-color: #EDEDED !important; position: absolute; left: 0px; top: 0px; overflow-y: auto; scrollbar-width: thin; display: flex; flex-direction: column; align-items: center; width: 0px; transition: transform 0.5s ease, width 0.5s ease; transform: translateX(0); resize: horizontal; z-index: 5;}.kimi-sidebar-history-chat-list-container-show { width: 500px; transform: translateX(0); z-index: 5;}.user-message-inner-container-div{ background-color: #a0baebda !important; align-items: flex-end; justify-content: flex-end; flex-grow: 0;}.svg-container { display: inline-block; transition: transform 0.3s ease;}.svg-container:hover { transform: scale(1.1); background-color: #bbbbbb;}.svg-container svg path { transition: fill 0.3s ease;}.svg-container:hover svg path { fill: #000;}.user-message-inner-container-div .svg-container:hover { transform: scale(1.1); background-color: #7583b1;}.kimi-stop-chat-agent-respones-container-div { box-sizing: border-box; box-sizing: none !important; padding: 5px; display: flex; align-items: center; height: 40px; width: 100%;}.kimi-stop-chat-agent-respones-button-div { color: #4747e977; font-size: 12px; font-weight: bold; border: 1px solid #4747e977; border-radius: 5px; background-color: rgba(133, 133, 133, 0); height: 90%; width: 100px; display: none; align-items: center; justify-content: center; transition: background-color 0.5s, transform 0.5s; user-select: none; } .kimi-stop-chat-agent-respones-button-div:hover { background-color: rgba(119, 119, 119, 0.205); transform: scale(1.02); }
    `
    return kimiMainCss
}

export {
    createKimiMainCss
}