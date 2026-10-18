# Ecommerce Frontend

Frontend de tienda construido con Next.js 16, App Router y TypeScript. Consume la API REST del proyecto Laravel y ofrece catálogo, autenticación, carrito, creación de órdenes, pago de prueba con Stripe e historial protegido.

## Requisitos

- Node.js 20.9 o posterior y npm.
- El backend `ecommerce-api` iniciado y accesible desde el navegador local.
- Una cuenta de Stripe en modo de prueba para recorrer el flujo de pago.

## Configuración

1. Copia `.env.example` como `.env.local` en la raíz de este proyecto.
2. Ajusta `BASE_URL` para que apunte a la URL de Laravel y termine en `/api`.
3. Copia la clave publicable de prueba de Stripe en `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`.
4. En el archivo `.env` del backend configura la clave secreta de prueba como `STRIPE_SECRET_KEY`. Nunca pongas esa clave en el frontend ni la subas a GitHub.
5. Instala dependencias e inicia el frontend:

```bash
npm install
npm run dev
```

Abre <http://localhost:3000>.

Para revisar la versión de producción:

```bash
npm run build
npm run start
```

## Rutas implementadas

| Ruta | Uso | Acceso |
| --- | --- | --- |
| `/` | Catálogo público, paginado en el servidor | Público |
| `/products/[id]` | Detalle de producto y opción para agregar al carrito | Público |
| `/register` | Registro de usuario | Público |
| `/login` | Inicio de sesión | Público |
| `/cart` | Carrito, creación de orden y formulario de pago Stripe | Requiere sesión para ordenar |
| `/orders` | Historial con estado, productos y total de cada orden | Protegido; redirige a login |

## Integración y seguridad

- Las lecturas del catálogo y del detalle se hacen desde Server Components.
- Registro, login, creación de órdenes e inicio/confirmación de pagos usan Server Actions del servidor Next.js.
- El JWT de Laravel se guarda en una cookie `httpOnly`, `sameSite=lax` y `secure` en producción. No se expone al código del navegador.
- El historial solicita las órdenes a Laravel con el token de esa cookie y no usa caché compartida.
- El carrito vive en Context y se conserva en `localStorage` del navegador.
- La confirmación del pago consulta el Payment Intent en Laravel y solo marca orden y pago como `paid` cuando Stripe confirma estado, moneda y monto.
- `revalidatePath()` actualiza las rutas del catálogo, carrito e historial tras las mutaciones pertinentes.
- Se reportan LCP, CLS, INP, FCP y TTFB en la consola del navegador mediante `useReportWebVitals`.
- La API actual no entrega imágenes por producto; mientras se agrega ese campo, el catálogo usa una ilustración local optimizada con `next/image`.

## API Laravel y Swagger

Con Laravel iniciado en `http://127.0.0.1:8000`, la documentación Swagger está en:

<http://127.0.0.1:8000/api/documentation>

El frontend consume, entre otros, `GET /api/products`, `GET /api/products/{id}`, `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/orders`, `POST /api/orders`, `POST /api/payments` y `POST /api/payments/{orderId}/confirm`.

## Rendimiento y resiliencia

- Hay estados `loading.tsx` para catálogo, checkout e historial.
- Hay límites `error.tsx` con acción de reintento para la aplicación, checkout, producto e historial.
- La lista del catálogo y el historial se muestran bajo `Suspense` con esqueletos de carga.
- Los detalles generan metadata SEO con nombre y descripción del producto.
- Lighthouse se midió en modo móvil contra la versión de producción local. En esa ejecución obtuvo 95 en rendimiento, 95 en accesibilidad, 100 en buenas prácticas y 100 en SEO. Las puntuaciones pueden variar un poco entre ejecuciones.

## Evidencias para la entrega

El reporte completo de Lighthouse está guardado en `evidence/lighthouse-mobile-final.report.html` y sus datos en `evidence/lighthouse-mobile-final.report.json`. Las capturas de Swagger y del flujo de compra se pueden entregar en un PDF separado.
