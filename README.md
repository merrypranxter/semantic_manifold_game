# Semantic Manifold Game

Do not ask what the destination looks like. Ask what the current thing becomes by traveling there this particular way.

This is not a blender and not a prompt box. You move a persistent musical organism through conceptual space. The route, the ruler, and the wreckage are part of the artwork. Suno is just the first synthesizer plugged into it.

The design spec that this instrument implements:

**[docs/design-specification-v0.1.pdf](docs/design-specification-v0.1.pdf)**

## Play

1. Begin as a pulse.
2. Talk to it like a driver, not a form: `take this via déjà vu`, `collide with wasp nest`, `find the geodesic to the void`.
3. Switch rulers. Neighborhoods rearrange. Hunt the WTF neighbor.
4. Open LAB when you want the machine visible.
5. Compile when the creature has a medical history.

`A → C` and `A → B → C` are not allowed to be the same song with extra garnish.

## Commands the parser already hears

| You say | Operator |
| --- | --- |
| take this to X | DIRECT |
| via / by way of X | VIA |
| through / swan dive | THROUGH |
| geodesic / shortest path | GEODESIC |
| run that parallel to X | PARALLEL |
| hover around X | HOVER |
| overshoot / drive past | OVERSHOOT |
| collide / smash / wreck | COLLISION |
| keep going | KEEP_GOING |

Unknown nouns get transduced into operational structure (what the concept *does*, not what it is themed as).

## Repo layout

```
docs/          design specification (source of truth)
public/docs/   same PDF, served in-app
src/lib/manifold/   state, operators, metrics, compile
src/lib/xai/        concept transduction
src/components/console/  map, inspector, command bar, compile
```

## Local

```bash
npm install
npm run dev
```

Preview binds `0.0.0.0:8080`. Persist is local to the browser; there is no account layer.
