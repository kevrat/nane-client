import axios from 'axios'
import {
  SET_ALL_FOR_ROOM,
  SET_ALL_OUTDATED,
  ADD_MESSAGE,
  SET_ROOM
} from './mutation-types'
export async function fetchByRoom ({ commit }, roomId) {
  const { data: { result } } = await axios.get(`rooms/${roomId}/history`)
  commit(
    SET_ALL_FOR_ROOM,
    {
      roomId,
      messages: result
        .map(message => ({
          ...message,
          id: message.room + message.sender.username + message.created,
          created: new Date(message.created)
        }))
        .sort((a, b) => a.created - b.created)
    }
  )
}
export async function newMessage ({ commit, getters }, newMessage) {
  const message = {
    ...newMessage,
    id: newMessage.room + newMessage.sender.username + newMessage.created,
    created: new Date(newMessage.created)
  }
  if (!getters.isRoomExist(message.room)) {
    commit(SET_ROOM, message.room)
  }
  commit(ADD_MESSAGE, message)
}
export async function sendMessage ({ commit, getters }, newMessage) {
  this._vm.$socket.sendObj(newMessage)
}
export async function outdateAll ({ commit }) {
  commit(SET_ALL_OUTDATED)
}
