const uuid=require('uuid/v1')
const db=require('./dynamo')
const TableName = 'cart';
module.exports= {
    CartGet:function(){
        const params = {
            TableName,
            AttributesToGet: [
              'id',
              'name',
              'price',
              'quantity',
              'deliveryType',
              'product',
            ],
          };
        return db.scan(params);
    },
    CartGetItem:function(args) {
        const params = {
          TableName,
          Key: {
            id:args.id,
          },
        };
      
        return db.get(params);
      },
    CartUpdateItem:function(args){
      if(args.quantity>0){
      const params = {
        TableName,
        Key: {
          id: args.id,
        },
        UpdateExpression: 'SET quantity = :quantity, deliveryType = :deliveryType',
        ExpressionAttributeValues: {
          ':quantity': args.quantity,
          ':deliveryType': args.deliveryType,
        },
       ReturnValues: 'UPDATED_NEW',
      };
      return db.updateItem(params, args);
    }
    else{
      return this.CartDeleteItem(args);
      }
    },
     getProduct: function(code){
      const params = {
        TableName: 'Product',
        Key: {
          code:code,
        },
      };
      return db.get(params);
    },
   CartAddItem: function(args){
     return this.getProduct(args.cartItem.code).then( function(product){
        console.log(product);
        if(!product)
          throw new Error("Product does not exist");
  
        const cartParams = {
          TableName,
          Item: {
            product:product,
            id: uuid(),
            price:product.origPrice,
            quantity:args.cartItem.quantity,
            deliveryType:args.cartItem.deliveryType,
          },
          ReturnValues: 'ALL_OLD',
        };
       return db.createItem(cartParams).then( function(result){
           console.log(result);
           return result;
         });
      });
    },
    
    CartDeleteItem:function(args){
      const params = {
      TableName,
      Key: {
      id: args.id,
    },
    ReturnValues: 'ALL_OLD',
  };
    return db.deleteItem(params, args);
    }
}


