class DisplayObject {
    constructor(type, mesh_type) {
        this.type = type;
        this.mesh_type = mesh_type;
        // this.material_type = mesh_type;
        this.color = 0xffffff;
        this.oldMaterial = null;
        //['Cube', 'Sphere','Cone','Cylinder','Torus','Tea pot']
        this.geometries = {
            "Sphere": new THREE.SphereGeometry(3, 64, 64),
            "Cube": new THREE.BoxGeometry(4, 4, 4, 20, 20, 20),
            "Cylinder": new THREE.CylinderGeometry(1.5, 1.5, 5, 64, 64),
            "Torus": new THREE.TorusGeometry(2, 0.8, 30, 200), //radius, tube, radialSegments, tubularSegments
            "Cone": new THREE.ConeGeometry(2, 4, 64, 64),
            "Knot": new THREE.TorusKnotGeometry(2, 0.4, 150, 32),
            "Tetrahedron": new THREE.TetrahedronGeometry(2, 100),
            "Dodecahedron": new THREE.DodecahedronGeometry(2, 32),
        };
        this.materials = {
            'Mesh': new THREE.MeshStandardMaterial(this.color),
            'Points': new THREE.PointsMaterial({ size: 0.01, color: this.color }),
            'Line': new THREE.WireframeGeometry(this.geometries[this.type]),
        }
        // this.materials = new THREE.PointsMaterial({
        //     size: 0.00005,
        // });
        // this.mesh = new THREE.Points(this.geometries[type], this.materials);
        this.mesh = {
            'Mesh': new THREE.Mesh(this.geometries[type], this.materials['Mesh']),
            'Points': new THREE.Points(this.geometries[type], this.materials['Points']),
            'Line': new THREE.LineSegments(this.materials['Line']),
        }
        this.display = this.mesh[this.mesh_type];
    }
    updateGeometry(type) {
        if (this.mesh.geometry == null) {
            console.log("Error: Please select display type.");
            window.alert("Please select Display type in Mesh setting first.")
        }
        this.mesh.geometry.dispose();
        // var update_geometry = this.geometries[type];
        // var update_material =
        this.mesh.geometry = this.geometries[type];
    }
    updateColor(color) {
        this.mesh.material.color.set(color);
    }
    updateSurface(value) {
        if (value === "Solid") {
            this.swapSolid();
        }
        if (value === "Point") {
            this.swapPoint();
        }
        if (value === "Line") {
            this.swapLine();
        }
    }
    swapPoint() {
        // this.mesh_type = 'Points';
        // this.display = this.mesh[this.mesh_type];
        // var points_material = this.materials['Points'];
        // var point_geometry = this.geometries[this.type];
        this.mesh_type = 'Points';
        // var points_mesh = new THREE.Points(point_geometry, points_material);
        this.mesh = new THREE.Points(this.geometries[this.type], this.materials['Points']);;
        this.display = this.mesh;
        this.display.castShadow = true;
        this.display.position.z = 4;
        this.display.position.x = 1;
        this.display.position.y = 1;
        // this.mesh[this.mesh_type].material = new THREE.PointsMaterial({
        //     color: 'blue'
        // });
        // this.mesh.mesh_type = 'Points'
    }
    swapLine() {
        var wireframe = new THREE.WireframeGeometry(this.geometries[this.type]);
        // var line = new THREE.LineSegments(wireframe);
        // line.material.depthTest = false;
        // line.material.opacity = 0.25;
        // line.material.transparent = true;
        this.mesh = new THREE.LineSegments(wireframe);
        this.mesh.material.depthTest = false;
        this.mesh.material.opacity = 0.25;
        this.mesh.material.transparent = true;
        this.display = this.mesh;
        this.display.castShadow = true;
        this.display.position.z = 4;
        this.display.position.x = 1;
        this.display.position.y = 1;
    }
    swapSolid() {
        this.mesh_type = 'Mesh';
        this.mesh = new THREE.Mesh(this.geometries[this.type], this.materials[this.mesh_type])
        this.display = this.mesh;
        this.display.castShadow = true;
        this.display.position.z = 4;
        this.display.position.x = 1;
        this.display.position.y = 1;
    }

}