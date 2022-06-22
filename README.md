# How To Use

You can use dynamodb session storage for `Shopify.Context.initialize`.

```javascript
Shopify.Context.initialize({
  ...
  SESSION_STORAGE: SessionStorage.createShopifyStorage(tableName, options),
});
```
