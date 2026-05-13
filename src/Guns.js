import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

export class GunSystem {
    constructor(camera) {
        this.camera = camera;
        this.gunGroup = new THREE.Group();
        this.camera.add(this.gunGroup);

        this.wepList = ["SMG", "SNIPER", "FIST"];
        this.index = 0;
        this.current = this.wepList[this.index];

        // Create Weapon Meshes
        this.weapons = {
            SMG: new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.15, 0.5), new THREE.MeshStandardMaterial({color: 0x333333})),
            SNIPER: new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.2, 1.2), new THREE.MeshStandardMaterial({color: 0x111111})),
            FIST: new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.2, 0.2), new THREE.MeshStandardMaterial({color: 0xffdbac}))
        };

        this.updateVisual();
    }

    updateVisual() {
        this.gunGroup.clear();
        const mesh = this.weapons[this.current];
        mesh.position.set(0.3, -0.3, -0.6); // Hip position
        this.gunGroup.add(mesh);
    }

    switch() {
        this.index = (this.index + 1) % this.wepList.length;
        this.current = this.wepList[this.index];
        this.updateVisual();
    }

    update(isFiring, isADS) {
        const mesh = this.weapons[this.current];

        // ADS Logic (SMG Only)
        if (this.current === "SMG" && isADS) {
            this.gunGroup.position.x += (0 - this.gunGroup.position.x) * 0.15; // Center it
            this.camera.fov += (45 - this.camera.fov) * 0.15; // Zoom
        } else {
            this.gunGroup.position.x += (0.2 - this.gunGroup.position.x) * 0.1; // Back to hip
            this.camera.fov += (75 - this.camera.fov) * 0.1; // Reset Zoom
        }
        this.camera.updateProjectionMatrix();

        // Fist Logic (Stretch on Punch)
        if (this.current === "FIST" && isFiring) {
            mesh.scale.z += (4 - mesh.scale.z) * 0.2;
        } else {
            mesh.scale.z += (1 - mesh.scale.z) * 0.2;
        }

        // Recovery (Recoil bounce back)
        this.gunGroup.position.z += (0 - this.gunGroup.position.z) * 0.1;
    }

    shoot() {
        if (this.current === "SNIPER") {
            this.gunGroup.position.z += 0.4; // Heavy recoil kick
            console.log("Sniper Fired!");
        }
    }
              }
