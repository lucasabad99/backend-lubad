# Entrega 2 - Realtime Products (Handlebars + Socket.IO)

Carpeta `02-api-entrega2` contiene la versión de la entrega 2 usando Handlebars y Socket.IO.

Instalación y ejecución:

```powershell
cd "c:\Users\Lucas\Desktop\MisRepo\backend-lubad\02-api-entrega2"
npm install
npm run dev
```

Abrir en navegador:
- http://localhost:8080/  → `home` (render server-side)
- http://localhost:8080/realtimeproducts → `realTimeProducts` (websockets para create/delete)

Notas:
- La carpeta `02-api` original quedó intacta para estudio y pruebas.
- Puedes usar la API REST en `/api/products` y las actualizaciones se emitirán también a los sockets.
