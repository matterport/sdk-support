import type { Mesh, TorusGeometry, MeshBasicMaterial, ColorRepresentation, SphereGeometry } from 'three';
import type { MpSdk } from '@common/public/assets/sdk';

// Additional Typescript resources
import { SceneComponent } from '@common/SceneComponents';

// Allow inputs to be defined and strongly typed
export interface ITagComponent extends SceneComponent {
  inputs: Inputs;
}
type Inputs = {
  tagId: string;
  color1: ColorRepresentation;
  color2: ColorRepresentation;
  hoverColor1: ColorRepresentation;
  hoverColor2: ColorRepresentation;
  shape: 'sphere' | 'box' | 'heart';
};

export class TagComponent extends SceneComponent implements ITagComponent {
  private mesh: Mesh<SphereGeometry | TorusGeometry, MeshBasicMaterial> | undefined;
  private material: MeshBasicMaterial | undefined;
  private material2: MeshBasicMaterial | undefined;

  inputs: Inputs = {
    tagId: '',
    color1: 'black',
    color2: 'red',
    hoverColor1: 'red',
    hoverColor2: 'black',
    shape: 'sphere',
  };
  events = {
    'INTERACTION.CLICK': true,
    'INTERACTION.HOVER': true,
  };
  emits = {
    'TAG.CLICK': true,
    'TAG.HOVER': true,
  };
  onInit() {
    const THREE = this.context.three;
    let geometry = undefined;

    if (this.inputs.shape == 'sphere') {
      geometry = new THREE.SphereGeometry(0.25, 16, 16);
    } else if (this.inputs.shape == 'heart') {
      const heartShape = new THREE.Shape();
      heartShape.moveTo(5, 5);
      heartShape.bezierCurveTo(5, 5, 4, 0, 0, 0);
      heartShape.bezierCurveTo(-6, 0, -6, 7, -6, 7);
      heartShape.bezierCurveTo(-6, 11, -3, 15.4, 5, 19);
      heartShape.bezierCurveTo(12, 15.4, 16, 11, 16, 7);
      heartShape.bezierCurveTo(16, 7, 16, 0, 10, 0);
      heartShape.bezierCurveTo(7, 0, 5, 5, 5, 5);
      geometry = new THREE.ShapeGeometry(heartShape);
    } else {
      geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    }

    geometry.computeBoundingSphere();
    this.material = new THREE.ShaderMaterial({
      uniforms: {
        color1: {
          value: new THREE.Color(this.inputs.color1),
        },
        color2: {
          value: new THREE.Color(this.inputs.color2),
        },
      },
      vertexShader: `
			varying vec2 vUv;
			void main() {
			  vUv = uv;
			  gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
			}
		  `,
      fragmentShader: `
			uniform vec3 color1;
			uniform vec3 color2;
			varying vec2 vUv;
			void main() {
			  gl_FragColor = vec4(mix(color1, color2, vUv.y), 1.0);
			}
		  `,
      wireframe: false,
    });
    this.material2 = new THREE.ShaderMaterial({
      uniforms: {
        color1: {
          value: new THREE.Color(this.inputs.hoverColor1),
        },
        color2: {
          value: new THREE.Color(this.inputs.hoverColor2),
        },
      },
      vertexShader: `
			varying vec2 vUv;
			void main() {
			  vUv = uv;
			  gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
			}
		  `,
      fragmentShader: `
			uniform vec3 color1;
			uniform vec3 color2;
			varying vec2 vUv;
			void main() {
			  gl_FragColor = vec4(mix(color1, color2, vUv.y), 1.0);
			}
		  `,
      wireframe: false,
    });
    this.mesh = new THREE.Mesh(geometry, this.material);
    this.outputs.collider = this.mesh;
    this.outputs.objectRoot = this.mesh;
  }
  onEvent(eventType: MpSdk.Scene.InteractionType, data: Record<string, boolean>) {
    if (eventType === 'INTERACTION.CLICK') {
      this.notify('TAG.CLICK', this.inputs.tagId);
    } else if (eventType === 'INTERACTION.HOVER') {
      this.notify('TAG.HOVER', this.inputs.tagId);
      if (this.mesh && this.material && this.material2) {
        if (data.hover) {
          this.mesh.material = this.material2;
          document.body.style.cursor = 'pointer';
        } else {
          this.mesh.material = this.material;
          document.body.style.cursor = 'auto';
        }
      }
    }
  }
  onDestroy() {
    this.material?.dispose();
    this.mesh?.geometry.dispose();
  }
}

export function tagComponentFactory() {
  return function () {
    return new TagComponent();
  };
}
