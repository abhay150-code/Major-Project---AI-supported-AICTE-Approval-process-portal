# AICTE Smart Approval Portal — 3D Institutional Model (Unity 3D)

A lightweight, beginner-friendly **Unity 3D** module for the **AICTE Smart Approval Portal**. This module provides a 3D visual preview of an AICTE-approved institutional campus building with interactive mouse rotation, adjustable rotation speed, camera zooming, directional sunlight, custom materials, and landscaping trees.

---

## 🏛️ Project Features

- **Institutional Architecture:** 3-floor administrative center, left and right academic/lab wings, grand entrance portico, classical columns/pillars, entrance steps, double doors, tinted glass windows, and an AICTE signboard plaque.
- **Interactive Mouse Rotation:** Click and drag anywhere with the left mouse button to inspect the building from any angle.
- **Adjustable Rotation Speed:** Public float variable exposed in the Unity Inspector and via an on-screen slider.
- **Simple Camera Viewing & Zoom:** Smooth target-focused camera using mouse scroll-wheel zoom.
- **Directional Lighting & Shadows:** Soft directional sunlight creating realistic architectural depth.
- **Landscaping & Trees (Prefabs):** Symmetrical campus trees surrounding the entrance pathway.
- **Completely Independent:** Contained entirely inside the `unity-model/` folder. Does **not** modify or affect the React frontend, Express backend, PostgreSQL database, or JWT authentication.

---

## 🚀 How to Open and Run in Unity

### Method 1: Using Unity Hub (Recommended)
1. Open **Unity Hub**.
2. Click the **"Add"** (or **"Open"**) button at the top right.
3. Select **"Add project from disk"**.
4. Browse to and select the `unity-model` folder:
   ```
   /Users/abhaysingh/Desktop/project _sem3/aicte-smart-approval-portal/unity-model
   ```
5. Click **Add Project**.
6. Select Unity version **6000.x (Unity 6)** or any compatible installed Unity editor (e.g., 2022.3 LTS).
7. Once the editor opens:
   - In the **Project** window at the bottom, navigate to `Assets > Scenes`.
   - Double-click **`MainScene`** to open it.
8. Click the **▶ Play** button at the top center of the Unity Editor.

### Method 2: One-Click Editor Campus Generator
If you open an empty scene or want to inspect every 3D object in the Hierarchy before playing:
1. Look at the top menu bar in Unity.
2. Click **AICTE Portal** > **Build Institutional Campus in Scene**.
3. All 3D GameObjects (Cubes, Pillars, Roof, Trees, Lights, Camera) will be created directly in your Hierarchy!
4. Click **▶ Play** to interact with the model.

---

## 🎮 How to Interact with the Model

| Action | Control |
|---|---|
| **Rotate Building** | **Left Click & Drag** horizontally across the screen |
| **Zoom Camera** | **Mouse Scroll Wheel** (Scroll up to zoom in, down to zoom out) |
| **Toggle Auto-Spin** | Press **Spacebar** or click the **Auto-Spin** button on screen |
| **Adjust Speed** | Move the on-screen **Speed Slider** or change `rotationSpeed` in Inspector |
| **Reset Orientation** | Press **'R'** or click the **Reset View** button |

---

## 📚 Syllabus Concepts Implemented

This project strictly adheres to fundamental computer graphics and game development syllabus concepts:

### 1. Basic 3D Primitive Shapes
- **Cubes (`PrimitiveType.Cube`):** Used for the central administrative block, side academic wings, foundation plinth, entrance steps, portico canopy, doors, and window panes.
- **Cylinders (`PrimitiveType.Cylinder`):** Used for the 4 classical portico columns/pillars and tree trunks.
- **Spheres (`PrimitiveType.Sphere`):** Used for tree foliage canopies.

### 2. Materials & Colors
Located in `Assets/Materials/`:
- `Mat_BuildingWalls.mat`: Off-white / cream limestone facade (`RGB: 0.93, 0.91, 0.86`).
- `Mat_BuildingRoof.mat`: AICTE institutional navy blue parapet (`RGB: 0.18, 0.28, 0.48`).
- `Mat_Pillars.mat`: Polished white marble columns (`RGB: 0.97, 0.97, 0.97`).
- `Mat_Windows.mat`: Tinted reflective blue glass (`RGB: 0.30, 0.65, 0.85`).
- `Mat_Door.mat`: Dark polished oak wood (`RGB: 0.38, 0.22, 0.10`).
- `Mat_Ground.mat`: Manicured green campus lawn (`RGB: 0.28, 0.58, 0.22`).
- `Mat_Pathway.mat`: Paved entrance walkway stone (`RGB: 0.72, 0.72, 0.70`).
- `Mat_Signboard.mat`: Institutional gold/bronze crest plaque (`RGB: 0.85, 0.70, 0.25`).
- `Mat_TreeTrunk.mat` & `Mat_TreeFoliage.mat`: Tree trunk bark and green canopy foliage.

### 3. Directional Lighting & Shadows
- Simulates natural outdoor sunlight angled at `(50°, -30°, 0°)`.
- Warm sunlight color (`RGB: 1.0, 0.965, 0.90`) with soft shadows enabled (`LightShadows.Soft`) to give realistic architectural depth.

### 4. C# Variables (Data Types)
Defined across `BuildingRotator.cs` and `CameraController.cs`:
- `float rotationSpeed = 150.0f;` — Controls manual mouse sensitivity.
- `float autoRotateSpeed = 20.0f;` — Controls automatic spinning speed.
- `bool isAutoRotating = false;` — Tracks whether auto-spin is active.
- `Vector3 initialRotation;` — Stores the starting angle for reset operations.
- `Transform target;` — References the building the camera tracks.
- `float distance = 28.0f;` — Camera orbit radius.

### 5. C# Methods (Lifecycle & Custom)
- `Start()`: Initializes baseline orientation and default references.
- `Update()`: Polls for user inputs every frame.
- `LateUpdate()`: Updates camera tracking smoothly after objects finish rotating.
- `HandleMouseInput()`: Calculates rotation delta using mouse movement.
- `ToggleAutoRotate()`: Inverts the boolean flag to start or stop auto-rotation.
- `ResetRotation()`: Restores original `eulerAngles`.
- `OnGUI()`: Renders clean, immediate-mode UI controls on screen.

### 6. User Inputs
- `Input.GetMouseButtonDown(0)` & `Input.GetMouseButton(0)`: Detects left-click down and hold.
- `Input.GetAxis("Mouse X")`: Captures horizontal drag displacement.
- `Input.GetAxis("Mouse ScrollWheel")`: Captures wheel scrolling for camera zoom.
- `Input.GetKeyDown(KeyCode.Space)`: Captures keyboard spacebar press.
- `Input.GetKeyDown(KeyCode.R)`: Captures keyboard 'R' press for reset.

### 7. Prefabs
- Located in `Assets/Prefabs/Tree.prefab`: A compound reusable asset consisting of a trunk cylinder and foliage sphere.
- Instantiated dynamically using `Instantiate(treePrefab, position, rotation, parent)` in `TreeSpawner.cs` and `CampusBuilder.cs`.

---

## 📂 Project Directory Structure

```
unity-model/
├── Assets/
│   ├── Editor/
│   │   └── AICTEModelMenu.cs          # Custom Unity top menu ("AICTE Portal > Build...")
│   ├── Materials/
│   │   ├── Mat_BuildingWalls.mat      # Off-white facade material
│   │   ├── Mat_BuildingRoof.mat       # Navy blue roof material
│   │   ├── Mat_Pillars.mat            # White marble column material
│   │   ├── Mat_Windows.mat            # Tinted glass material
│   │   ├── Mat_Door.mat               # Oak wood door material
│   │   ├── Mat_Ground.mat             # Green lawn material
│   │   ├── Mat_Pathway.mat            # Paved stone pathway material
│   │   ├── Mat_Signboard.mat          # Gold plaque material
│   │   ├── Mat_TreeTrunk.mat          # Brown bark material
│   │   └── Mat_TreeFoliage.mat        # Leaf canopy material
│   ├── Prefabs/
│   │   └── Tree.prefab                # Reusable compound tree asset
│   ├── Scenes/
│   │   └── MainScene.unity            # Pre-configured Unity scene
│   └── Scripts/
│       ├── BuildingRotator.cs         # Mouse drag rotation & speed variable
│       ├── CameraController.cs        # Camera viewing, lookAt, and scroll zoom
│       ├── CampusBuilder.cs           # Automated 3D scene construction
│       ├── CampusHUD.cs               # On-screen controls & speed slider
│       └── TreeSpawner.cs             # Prefab instantiation demonstration
├── Packages/
│   └── manifest.json                  # Standard package dependencies
├── ProjectSettings/
│   └── ProjectVersion.txt             # Unity Editor version specification (6000.6.7f1)
└── README.md                          # Documentation & viva cheat sheet
```

---

## 🎓 Viva & Presentation Q&A Cheat Sheet

**Q1: How does the mouse-based rotation work in your script?**
> *"In `BuildingRotator.cs`, we use `Input.GetAxis("Mouse X")` inside `Update()` when the left mouse button is held down (`Input.GetMouseButton(0)`). We multiply the horizontal mouse displacement by our public variable `rotationSpeed` and `Time.deltaTime` to ensure frame-rate independent rotation, then apply it using `transform.Rotate(Vector3.up, rotationAmount, Space.World)`."*

**Q2: What is the purpose of public variables versus private variables in your scripts?**
> *"Public variables like `rotationSpeed` and `autoRotateSpeed` are serialized and exposed directly in the Unity Inspector, allowing designers to tune values in real time without recompiling code. Private variables like `isDragging` and `initialRotation` encapsulate internal state that should not be edited outside the script."*

**Q3: How does the camera keep the building in view?**
> *"In `CameraController.cs`, we calculate the camera's 3D coordinates using trigonometry (`Sin` and `Cos` of an isometric angle multiplied by our `distance` variable). We then call `transform.LookAt(target)` in `LateUpdate()`, which ensures the camera always points directly at the institutional building center even when zoomed or repositioned."*

**Q4: How did you implement Prefabs?**
> *"We created `Tree.prefab` as a reusable template composed of a cylinder trunk and a sphere foliage canopy. Using `Instantiate(treePrefab, spawnPosition, Quaternion.identity)`, our `TreeSpawner.cs` script clones identical instances across the campus grounds, demonstrating object reusability and memory efficiency."*

**Q5: Is this Unity module integrated into or modifying the web backend?**
> *"No, it is deliberately kept as a completely isolated module inside the `unity-model/` folder. It serves as an architectural 3D prototype for institutional campus verification, leaving the React frontend, Express API routes, PostgreSQL schema, and JWT authentication completely untouched."*
