# Falso Profeta

Juego de deducción social bíblico estilo "Among Us". Un impostor se infiltra entre los creyentes — pero solo tiene una pista.

## Stack

- **Frontend**: Expo Router (React Native) — pantallas en `app/`
- **Backend**: Express + TypeScript en `server/`
- **Estado del juego**: React Context (`contexts/GameContext.tsx`)
- **Datos**: personajes bíblicos en `data/characters.ts` (16 personajes)

## Flujo del juego

1. **Inicio** (`app/index.tsx`) — pantalla de bienvenida con reglas
2. **Setup** (`app/setup.tsx`) — agregar/quitar jugadores (mínimo 3)
3. **Revelación** (`app/reveal.tsx`) — cada jugador ve su rol en privado
   - **Creyentes**: ven nombre completo del personaje + descripción completa
   - **Falso Profeta**: solo recibe una pista vaga
4. **Juego** (`app/game.tsx`) — tablero con lista de jugadores activos, eliminación con confirmación
5. **Resultado** (`app/result.tsx`) — ganador, revelación del impostor, resumen de jugadores

## Condiciones de victoria

- **Civiles ganan**: eliminan al impostor
- **Impostor gana**: quedan 1 civil + 1 impostor

## Personajes bíblicos (16)

Moisés, David, Salomón, Abraham, Noé, José, Elías, Sansón, Daniel, Jonás, Ester, María, Pedro, Pablo, Josué, Rut

## Tema visual

Oscuro, misterioso, rojo carmesí y dorado. Inspirado en pergaminos antiguos y atmósfera bíblica.

## Workflows

- `Start Backend`: `npm run server:dev` → puerto 5000
- `Start Frontend`: `npm run expo:dev` → puerto 8081
