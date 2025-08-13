import { BackSide, Color, FrontSide, Matrix4, ShaderMaterial, Vector2 } from "three";
import { BVHShaderGLSL, FloatVertexAttributeTexture, MeshBVHUniformStruct } from "three-mesh-bvh";




export const faceDisplacementShader = (amplitude: number, color: number) => {

    let options = {

        'amplitude': { value: amplitude },
        'color': { value: new Color( color ) },
    }

    return new ShaderMaterial({

        vertexShader: `

            uniform float amplitude;

            varying vec3 vNormal;
            varying vec2 vUv;

            void main() {

                vNormal = normal;
                vUv = ( 0.5 + amplitude ) * uv + vec2( amplitude );

                vec3 newPosition = position + amplitude * normal * vec3( 0.02 );
                gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );
            }
        `,
        fragmentShader: `

            varying vec3 vNormal;
            varying vec2 vUv;

            uniform vec3 color;

            void main() {

                vec3 light = vec3( 0.5, 0.2, 1.0 );
                light = normalize( light );

                float dProd = dot( vNormal, light ) * 0.5 + 0.5;

                gl_FragColor = vec4( vec3( dProd ) * vec3( color ), 1.0 );

            }
        `,
        uniforms: {

            time: { value: 1.0 },
            resolution: { value: new Vector2() },
            ...options
        } 
    })
}

export const fluidSimulationMaterial = (w, h,) => {
        
    const uniforms = {
        uTime: { value: 0 },
        uResolution: { value: new Vector2(w, h) },
        uColorA: { value: new Color('#3498db') }, // Blue
        uColorB: { value: new Color('#e74c3c') }  // Red
    };
    return new ShaderMaterial({
        uniforms: uniforms,
        vertexShader: `
            varying vec2 vUv;

            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform float uTime;
            uniform vec2 uResolution;
            uniform vec3 uColorA;
            uniform vec3 uColorB;

            varying vec2 vUv;

            // Hash function
            float hash(vec2 p) {
                return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
            }

            // 2D noise function
            float noise(vec2 p) {
                vec2 i = floor(p);
                vec2 f = fract(p);
                vec2 u = f * f * (3.0 - 2.0 * f);

                return mix(
                    mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
                    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
                    u.y
                );
            }

            void main() {
                vec2 uv = vUv;
                vec2 q = uv * 3.0;
                float t = uTime * 0.2;
                float strength = 0.2;

                vec2 flow = vec2(
                    noise(q + vec2(t, 0.0)),
                    noise(q + vec2(0.0, t))
                );

                uv += (flow - 0.5) * strength;

                vec3 color = mix(uColorA, uColorB, noise(uv * 3.0 + t));

                gl_FragColor = vec4(color, 1.0);
            }
        `
        })

    }



    export const rtMaterial = () => {

        const rtM = new ShaderMaterial({

        defines: {
            SMOOTH_NORMALS: 1,
        },

        uniforms: {
            bvh: { value: new MeshBVHUniformStruct() },
            normalAttribute: { value: new FloatVertexAttributeTexture() },
            cameraWorldMatrix: { value: new Matrix4() },
            invProjectionMatrix: { value: new Matrix4() },
            invModelMatrix: { value: new Matrix4() }, // mesh.modelMatrix⁻¹
            objectMatrix: { value: new Matrix4() },   // mesh.modelMatrix
            projectionMatrix: { value: new Matrix4() },
        },

        vertexShader: /* glsl */`
            varying vec2 vUv;
            void main() {
                vUv = uv;
                // Fullscreen quad in clip space
                gl_Position = vec4(position.xy, 0.0, 1.0);
            }
        `,

        fragmentShader: /* glsl */`
            precision highp isampler2D;
            precision highp usampler2D;

            ${ BVHShaderGLSL.common_functions }
            ${ BVHShaderGLSL.bvh_struct_definitions }
            ${ BVHShaderGLSL.bvh_ray_functions }

            uniform mat4 cameraWorldMatrix;
            uniform mat4 invProjectionMatrix;
            uniform mat4 invModelMatrix;   // inverse of mesh.modelMatrix
            uniform mat4 objectMatrix;     // mesh.modelMatrix
            uniform sampler2D normalAttribute;
            uniform BVH bvh;
            uniform mat4 projectionMatrix;

            varying vec2 vUv;

            void main() {

                // NDC [-1, 1]
                vec2 ndc = 2.0 * vUv - vec2(1.0);

                // Build ray in mesh local space
                vec3 rayOrigin, rayDirection;
                ndcToCameraRay(
                    ndc,
                    invModelMatrix * cameraWorldMatrix,
                    invProjectionMatrix,
                    rayOrigin, rayDirection
                );

                // BVH intersection
                uvec4 faceIndices = uvec4(0u);
                vec3 faceNormal = vec3(0.0, 0.0, 1.0);
                vec3 barycoord = vec3(0.0);
                float side = 1.0;
                float dist = 0.0;

                bool didHit = bvhIntersectFirstHit(
                    bvh, rayOrigin, rayDirection,
                    faceIndices, faceNormal, barycoord, side, dist
                );

                if (!didHit) {
                    discard; // no hit
                }

                // Shading
                vec3 normal;
                #if SMOOTH_NORMALS
                    normal = textureSampleBarycoord(
                        normalAttribute, barycoord, faceIndices.xyz
                    ).xyz;
                #else
                    normal = faceNormal;
                #endif

                // Depth
                vec3 localHit = rayOrigin + rayDirection * dist;
                vec4 worldPos = objectMatrix * vec4(localHit, 1.0);
                vec4 clipPos = projectionMatrix * viewMatrix * worldPos;
                float ndcDepth = clipPos.z / clipPos.w;
                gl_FragDepth = ndcDepth * 0.5 + 0.5;

                // Output
                gl_FragColor = vec4(normal * 0.5 + 0.5, 1.0); // visualize normals
            }
        `
    });

    rtM.depthTest = false;
    rtM.depthWrite = false;
    rtM.transparent = false;
    
    return rtM
}