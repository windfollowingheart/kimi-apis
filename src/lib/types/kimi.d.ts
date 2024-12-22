
declare type KimiResponse = {
    isok: boolean,
    result: Record<string, any>,
    error: string,
    isTokenExpired: boolean // 是否是token过期  
    isRefreshTokenExpired?: boolean // 是否是refreshToken过期
}

declare type KimiApiResponse = {
    isok: boolean,
    result: Record<string, any>,
    error: string,
}

// 上传文件分为两种类型,一种是上传文件,一种是上传图片
declare type KimiUploadFileType = {
    type: string,
    name: string,
    object_name: string,
    chat_id: string,
    file_id: string
}

// declare type KimiUploadImageType = {
//     type: string,
//     name: string,
//     file_id: string,
//     meta: {
//         width: string,
//         height: string
//     }
// }
