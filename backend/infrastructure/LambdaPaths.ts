import { Access } from './GenericTable';

enum Method {
  POST = 'POST',
  GET = 'GET',
  PUT = 'PUT',
  DELETE = 'DELETE'
}

export interface LambdaPath {
  path: string,
  access: Access[]
  method: Method
}
const lambdaPaths: LambdaPath[] = [
  {
    path: 'Create',
    access: [Access.WRITE],
    method: Method.POST
  },
  {
    path: 'Read',
    access: [Access.READ],
    method: Method.GET
  },
  {
    path: 'Update',
    access: [Access.WRITE],
    method: Method.PUT
  },
  {
    path: 'Delete',
    access: [Access.WRITE],
    method: Method.DELETE
  }
]

export default lambdaPaths