import { Connection, getConnectionManager } from 'typeorm';
import { DEFAULT_CONNECTION_NAME, getPostgresOption } from './database';
// Put the connection to global scope to reuse connection when lambda kick off
let connection: Connection;

export const establishDBConnection = async () => {
  const connectionManager = getConnectionManager();
  // Use container when connection not existed
  if (connectionManager.has(DEFAULT_CONNECTION_NAME)) {
    console.log(`(establishDBConnection) ConnectionManger: using existing connection ${DEFAULT_CONNECTION_NAME}`);
    connection = await connectionManager.get(DEFAULT_CONNECTION_NAME);
  } else {
    connection = connectionManager.create(getPostgresOption());
  }
  if (!connection.isConnected) {
    connection = await connection.connect(); // performs connection
  }

  return connection;
};
