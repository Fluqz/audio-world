// import { BoxCollisionComponent } from "../components/box-collision-component";
// import { TransformationComponent } from "../components/transformation-component";
// import { VelocityComponent } from "../components/velocity-component";
// import { ECS } from "../ecs";
// import { System } from "./system";

// export class CollisionResponseSystem implements System {

//   update(ecs: ECS, dt: number): void {

//     // Collect all entities with Position, Velocity, Collider
//     const entities = Array.from(ecs.queryEntities(TransformationComponent, VelocityComponent, BoxCollisionComponent));

//     // Naive O(n^2) pairwise check
//     for (let i = 0; i < entities.length; i++) {
//       const [aEntity, [aTrans, aVel, aCol]] = entities[i];
//       for (let j = i + 1; j < entities.length; j++) {
//         const [bEntity, [bTrans, bVel, bCol]] = entities[j];

//         // Distance between centers
//         const dx = aTrans.position.x - bTrans.position.x;
//         const dy = aTrans.position.y - bTrans.position.y;
//         const dz = aTrans.position.z - bTrans.position.z;
//         const distSq = dx*dx + dy*dy + dz*dz;
//         const minDist = aCol.radius + bCol.radius;

//         if (distSq < minDist * minDist) {
//           const dist = Math.sqrt(distSq) || 0.0001;
//           const overlap = minDist - dist;

//           // Normalize
//           const nx = dx / dist;
//           const ny = dy / dist;
//           const nz = dz / dist;

//           // Push entities apart equally
//           const correction = overlap / 2;
//           aTrans.position.x += nx * correction;
//           aTrans.position.y += ny * correction;
//           aTrans.position.z += nz * correction;

//           bTrans.position.x -= nx * correction;
//           bTrans.position.y -= ny * correction;
//           bTrans.position.z -= nz * correction;

//           // Reflect velocities (simple elastic collision)
//           const dotA = aVel.x * nx + aVel.y * ny + aVel.z * nz;
//           const dotB = bVel.x * nx + bVel.y * ny + bVel.z * nz;

//           aVel.x -= 2 * dotA * nx;
//           aVel.y -= 2 * dotA * ny;
//           aVel.z -= 2 * dotA * nz;

//           bVel.x -= 2 * dotB * nx;
//           bVel.y -= 2 * dotB * ny;
//           bVel.z -= 2 * dotB * nz;
//         }
//       }
//     }
//   }
// }
