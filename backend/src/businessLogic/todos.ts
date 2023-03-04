import { TodosAccess } from '../dataLayerLogic/todosAcess'
import { AttachmentUtils } from '../helpers/attachmentUtils'
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
import * as createError from 'http-errors'

// TODO: Implement businessLogic
const attachmentUtils = new AttachmentUtils()
const todosAccess = new TodosAccess()


export const getTodos = async(userId: string): Promise<TodoItem[]> => {
  try {
    const userTodos = await todosAccess.getAllTodos(userId)
    return userTodos;
  } catch (e) {
    createError('Error getting user todos ', e)
    return e
  }
}


export const createTodo = async (userId: string, newTodo: CreateTodoRequest): Promise<TodoItem> => {
  createLogger('creating todo')
  const todoId = uuid.v4()
  const todoItem = {
    createdAt: new Date().toString(),
    userId,
    todoId,
    attachmentUrl: attachmentUtils.getAttachmentUrl(todoId),
    done: false,
    ...newTodo
  }

  return await todosAccess.createTodo(todoItem)
}


export const updateTodo = async(todoId: string, userId: string, updateTodoRequest: UpdateTodoRequest): Promise<void> => {
  return await todosAccess.updateTodoItem(todoId, userId, updateTodoRequest)
}


export const deleteTodo = async(todoId: string, userId: string): Promise<void> => {
  return await todosAccess.deleteTodoItem(todoId, userId)
}


export const generatePresignedUrl = async(todoId: string): Promise<String> => {
  return attachmentUtils.getUploadUrl(todoId)
}