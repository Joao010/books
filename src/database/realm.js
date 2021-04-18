import Realm from 'realm';
import BookSchema from '../Schemas/BookSchemas';

export const getRealm = () => {
  return Realm.open({
    schema: [ BookSchema ],
  });
}