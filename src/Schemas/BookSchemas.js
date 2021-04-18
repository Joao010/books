export default class BookSchema {
  static schema = {
    name: 'Book',
    primaryKey: 'id',
    properties: {
      id: { type: 'int', indexed: true },
      name: 'string',
      price: 'string',
    }
  }
}