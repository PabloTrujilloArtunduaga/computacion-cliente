import mongoose from 'mongoose';
import app from './app.js';
import { config } from './config/config.js';
import { connectDB, disconnectDB } from './config/db.js';

let server;

const start = async () => {
  await connectDB();

  server = app.listen(config.port, () => {
    console.log(`\n🚀 Servidor corriendo en http://localhost:${config.port}`);
    console.log(`   Entorno: ${config.env}\n`);
  });

  server.on('error', (error) => {
    console.error('❌ Error del servidor HTTP:', error.message);
    process.exit(1);
  });
};

const shutdown = async (signal) => {
  console.log(`\n🛑 ${signal} recibido. Cerrando servidor...`);

  try {
    if (server) {
      await new Promise((resolve) => server.close(resolve));
    }

    await disconnectDB();
    console.log('✅ Servidor cerrado correctamente');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error cerrando servidor:', error.message);
    process.exit(1);
  }
};

['SIGINT', 'SIGTERM'].forEach((signal) => {
  process.on(signal, () => shutdown(signal));
});

process.on('unhandledRejection', (reason) => {
  console.error('❌ Promesa rechazada sin manejar:', reason);
});

start().catch(async (error) => {
  console.error('❌ No se pudo iniciar el servidor:', error.message);
  await mongoose.connection.close().catch(() => {});
  process.exit(1);
});
