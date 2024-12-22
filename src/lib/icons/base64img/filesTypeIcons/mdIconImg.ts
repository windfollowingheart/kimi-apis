const mdIconImg = "data:image/png;base64,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"

export {
    mdIconImg
}