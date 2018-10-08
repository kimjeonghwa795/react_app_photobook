import Network from "../Network"
import actions from "./creator"
import {HistoryManager} from "../utils"

export const GET_TEMPLATES = "GET_TEMPLATES"
export const GET_TEMPLATE_INFO = "GET_TEMPLATE_INFO"
export const RESET_TEMPLATE_INFO = "RESET_TEMPLATE_INFO"
export const CREATE_PHOTOBOOK = "CREATE_PHOTOBOOK"
export const UPLOAD_PHOTOBOOK = "UPLOAD_PHOTOBOOK"
export const CREATE_PHOTO = "CREATE_PHOTO"
export const DELETE_PHOTO = "DELETE_PHOTO"
export const RESET_PHOTO_STATE = "RESET_PHOTO_STATE"
export const DRAG_PHOTO = "DRAG_PHOTO"
export const RESIZE_PHOTO = "RESIZE_PHOTO"
export const GET_STICKERS = "GET_STICKERS"
export const CREATE_STICKER = "CREATE_STICKER"
export const DELETE_STICKER = "DELETE_STICKER"
export const RESET_STICKER_STATE = "RESET_STICKER_STATE"
export const DRAG_STICKER = "DRAG_STICKER"
export const RESIZE_STICKER = "RESIZE_STICKER"
export const CREATE_TEXTBOX = "CREATE_TEXTBOX"
export const DELETE_TEXTBOX = "DELETE_TEXTBOX"
export const RESET_TEXTBOX_STATE = "RESET_TEXTBOX_STATE"
export const DRAG_TEXTBOX = "DRAG_TEXTBOX"
export const RESIZE_TEXTBOX = "RESIZE_TEXTBOX"
export const REDO_HISTORY = "REDO_HISTORY"
export const UNDO_HISTORY = "UNDO_HISTORY"

export let GetTemplates = actions( GET_TEMPLATES, async()=>{
    return await Network.init().get('/templates')
})

export let GetTemplateInfo = actions( GET_TEMPLATE_INFO, async(templatId)=>{
    return await Network.init().get('/template/',templatId)
})

export let ResetTemplateInfo = actions (RESET_TEMPLATE_INFO, ()=>{
    return null
})

export let UploadPhotobook = actions (UPLOAD_PHOTOBOOK, async(zip)=>{
    return await Network.init().post('/upload/photobook',zip)
})

export let CreatePhotobook = actions (CREATE_PHOTOBOOK, ()=>{
    return true
})

export let CreatePhoto = actions( CREATE_PHOTO, (src)=>{
    return src
})

export let DeletePhoto = actions( DELETE_PHOTO, (src, idx)=>{
    return {src: src, idx: idx}
})

export let ResetPhotoState = actions( RESET_PHOTO_STATE, ()=>{
    return true
})

export let DragPhoto = actions( DRAG_PHOTO, (idx, prev, next)=>{
    return {idx: idx, prev: prev, next: next}
})

export let ResizePhoto = actions( RESIZE_PHOTO, (idx, prev, next)=>{
    return {idx : idx, prev: prev, next: next}
})

export let GetStickers = actions( GET_STICKERS, async ()=>{
    return await Network.init().get('/stickers')
})

export let CreateSticker = actions (CREATE_STICKER, (id)=>{
    return id
})

export let DeleteSticker = actions (DELETE_STICKER, (id,idx)=>{
    return {id: id, idx: idx}
})

export let ResetStickerState = actions(RESET_STICKER_STATE, ()=>{
    return true
})

export let DragSticker = actions( DRAG_STICKER, (idx,prev,next)=>{
    return {idx : idx, prev:prev, next:next}
})

export let ResizeSticker = actions( RESIZE_STICKER, (idx,prev,next)=>{
    return {idx : idx, prev: prev, next: next}
})

export let CreateTextBox = actions(CREATE_TEXTBOX, ()=>{
    return true
})

export let DeleteTextBox = actions(DELETE_TEXTBOX, (txt,color,idx)=>{
    return {txt: txt, color: color, idx: idx}
})

export let ResetTextBoxState = actions(RESET_TEXTBOX_STATE, ()=>{
    return true
})

export let DragTextBox = actions( DRAG_TEXTBOX, (idx,prev,next)=>{
    return {idx : idx, prev:prev, next:next}
})

export let ResizeTextBox = actions( RESIZE_TEXTBOX, (idx,prev,next)=>{
    return {idx : idx, prev: prev, next: next}
})

export let UndoHistory = actions( UNDO_HISTORY, async ()=>{
    return await HistoryManager.init().UndoHistory()
})

export let RedoHistory = actions( REDO_HISTORY, async ()=>{
    return await HistoryManager.init().RedoHistory()
})