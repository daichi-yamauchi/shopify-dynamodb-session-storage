import DynamoDB, { DocumentClient } from "aws-sdk/clients/dynamodb";
import Shopify, { SessionInterface } from "@shopify/shopify-api";

export class SessionStorage {
  private client: DocumentClient;
  constructor(
    private TableName: string,
    options: DocumentClient.DocumentClientOptions &
      DynamoDB.Types.ClientConfiguration = {}
  ) {
    this.client = new DocumentClient(options);
  }

  async store(session: SessionInterface): Promise<boolean> {
    try {
      await this.client
        .put({
          TableName: this.TableName,
          Item: {
            id: session.id,
            session: JSON.stringify(session),
          },
        })
        .promise();
      return true;
    } catch (e) {
      throw new Error(e);
    }
  }

  async load(id: string): Promise<SessionInterface> {
    try {
      const data = await this.client
        .get({
          TableName: this.TableName,
          Key: { id },
        })
        .promise();
      return (
        data?.Item?.session &&
        (JSON.parse(data?.Item?.session as string) as SessionInterface)
      );
    } catch (e) {
      throw new Error(e);
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.client
        .delete({
          TableName: this.TableName,
          Key: { id },
        })
        .promise();
      return true;
    } catch (e) {
      throw new Error(e);
    }
  }

  static createShopifyStorage(
    tableName: string,
    options?: DocumentClient.DocumentClientOptions &
      DynamoDB.Types.ClientConfiguration
  ) {
    const sessionStorage = new SessionStorage(tableName, options);
    return new Shopify.Session.CustomSessionStorage(
      sessionStorage.store.bind(sessionStorage),
      sessionStorage.load.bind(sessionStorage),
      sessionStorage.delete.bind(sessionStorage)
    );
  }
}
