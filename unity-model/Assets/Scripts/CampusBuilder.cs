using UnityEngine;

/// <summary>
/// AICTE Smart Approval Portal - 3D Institutional Model
/// Script: CampusBuilder.cs
/// 
/// Purpose:
/// Demonstrates the core Unity concepts taught in the syllabus:
/// - Creating and transforming basic 3D shapes (Cubes, Cylinders, Spheres)
/// - Creating and applying Materials with colors and shaders
/// - Setting up Directional Lighting and Shadows
/// - Setting up the Main Camera with viewing scripts
/// - Demonstrating Prefabs / Reusable objects (Trees, Pillars)
/// - Hooking up C# interactive scripts (BuildingRotator, CameraController, CampusHUD)
/// 
/// This script runs automatically on Awake/Start to guarantee that all 3D objects,
/// materials, lights, and scripts are present and configured when the scene runs.
/// </summary>
public class CampusBuilder : MonoBehaviour
{
    [Header("Generation Settings")]
    [Tooltip("If true, rebuilds campus whenever the scene starts")]
    public bool buildOnStart = true;

    // Materials created at runtime
    private Material matGround;
    private Material matPathway;
    private Material matWalls;
    private Material matWings;
    private Material matRoof;
    private Material matPillars;
    private Material matWindows;
    private Material matDoor;
    private Material matSignboard;
    private Material matTrunk;
    private Material matFoliage;

    void Awake()
    {
        if (buildOnStart)
        {
            BuildCampus();
        }
    }

    /// <summary>
    /// Master method to construct the entire 3D AICTE Institutional Campus.
    /// </summary>
    [ContextMenu("Rebuild Campus")]
    public void BuildCampus()
    {
        // 1. Initialize Materials
        CreateMaterials();

        // 2. Setup Directional Light & Camera
        SetupLighting();
        SetupCamera();

        // 3. Setup Ground & Walkway
        SetupGroundAndPathways();

        // 4. Construct the Institutional Building (Centerpiece)
        GameObject building = ConstructInstitutionalBuilding();

        // 5. Construct Trees (Replicating Prefab-like instances)
        ConstructLandscaping(building.transform);

        Debug.Log("AICTE 3D Institutional Campus constructed successfully!");
    }

    // ============================================================
    // 1. MATERIALS INITIALIZATION
    // ============================================================
    private void CreateMaterials()
    {
        // Find standard built-in shader
        Shader standardShader = Shader.Find("Standard");
        if (standardShader == null) standardShader = Shader.Find("Mobile/Diffuse");
        if (standardShader == null) standardShader = Shader.Find("Diffuse");
        if (standardShader == null) standardShader = Shader.Find("Universal Render Pipeline/Lit");

        matGround = CreateColorMaterial(standardShader, new Color(0.28f, 0.58f, 0.22f), 0.1f);      // Green lawn
        matPathway = CreateColorMaterial(standardShader, new Color(0.72f, 0.72f, 0.70f), 0.1f);     // Paved stone
        matWalls = CreateColorMaterial(standardShader, new Color(0.93f, 0.91f, 0.86f), 0.2f);       // Off-white stone
        matWings = CreateColorMaterial(standardShader, new Color(0.88f, 0.85f, 0.80f), 0.2f);       // Secondary stone
        matRoof = CreateColorMaterial(standardShader, new Color(0.18f, 0.28f, 0.48f), 0.4f);        // AICTE Navy Blue
        matPillars = CreateColorMaterial(standardShader, new Color(0.97f, 0.97f, 0.97f), 0.3f);     // White marble
        matWindows = CreateColorMaterial(standardShader, new Color(0.30f, 0.65f, 0.85f), 0.9f);     // Tinted glass
        matDoor = CreateColorMaterial(standardShader, new Color(0.38f, 0.22f, 0.10f), 0.3f);        // Dark oak wood
        matSignboard = CreateColorMaterial(standardShader, new Color(0.85f, 0.70f, 0.25f), 0.6f);   // Bronze/Gold plaque
        matTrunk = CreateColorMaterial(standardShader, new Color(0.42f, 0.26f, 0.14f), 0.1f);       // Tree trunk bark
        matFoliage = CreateColorMaterial(standardShader, new Color(0.18f, 0.52f, 0.16f), 0.1f);     // Green leaves
    }

    private Material CreateColorMaterial(Shader shader, Color color, float smoothness)
    {
        Material mat = new Material(shader);
        mat.color = color;
        if (mat.HasProperty("_Smoothness"))
        {
            mat.SetFloat("_Smoothness", smoothness);
        }
        return mat;
    }

    // ============================================================
    // 2. LIGHTING & CAMERA SETUP
    // ============================================================
    private void SetupLighting()
    {
        // Check if a directional light already exists in scene
        Light dirLight = FindFirstObjectByType<Light>();
        GameObject lightObj;
        if (dirLight == null)
        {
            lightObj = new GameObject("Directional Light");
            dirLight = lightObj.AddComponent<Light>();
        }
        else
        {
            lightObj = dirLight.gameObject;
        }

        dirLight.type = LightType.Directional;
        dirLight.color = new Color(1.0f, 0.97f, 0.90f); // Warm sunlight
        dirLight.intensity = 1.15f;
        dirLight.shadows = LightShadows.Soft;
        lightObj.transform.rotation = Quaternion.Euler(50.0f, -30.0f, 0.0f);
    }

    private void SetupCamera()
    {
        Camera cam = Camera.main;
        GameObject camObj;
        if (cam == null)
        {
            camObj = new GameObject("Main Camera");
            cam = camObj.AddComponent<Camera>();
            camObj.tag = "MainCamera";
        }
        else
        {
            camObj = cam.gameObject;
        }

        cam.clearFlags = CameraClearFlags.Skybox;
        cam.backgroundColor = new Color(0.70f, 0.85f, 0.95f);

        // Attach CameraController script
        CameraController camCtrl = camObj.GetComponent<CameraController>();
        if (camCtrl == null)
        {
            camCtrl = camObj.AddComponent<CameraController>();
        }

        // Attach CampusHUD for UI controls
        CampusHUD hud = camObj.GetComponent<CampusHUD>();
        if (hud == null)
        {
            hud = camObj.AddComponent<CampusHUD>();
        }
    }

    // ============================================================
    // 3. GROUND & WALKWAYS
    // ============================================================
    private void SetupGroundAndPathways()
    {
        if (GameObject.Find("CampusGround") != null) return;

        // Campus Ground Lawn (Green Cube)
        GameObject ground = GameObject.CreatePrimitive(PrimitiveType.Cube);
        ground.name = "CampusGround";
        ground.transform.position = new Vector3(0, -0.15f, 0);
        ground.transform.localScale = new Vector3(40.0f, 0.3f, 40.0f);
        ground.GetComponent<Renderer>().material = matGround;

        // Entrance Pathway (Paved Walkway Cube)
        GameObject pathway = GameObject.CreatePrimitive(PrimitiveType.Cube);
        pathway.name = "EntrancePathway";
        pathway.transform.position = new Vector3(0, 0.02f, -11.0f);
        pathway.transform.localScale = new Vector3(6.0f, 0.05f, 16.0f);
        pathway.GetComponent<Renderer>().material = matPathway;
    }

    // ============================================================
    // 4. INSTITUTIONAL BUILDING (Centerpiece)
    // ============================================================
    private GameObject ConstructInstitutionalBuilding()
    {
        GameObject existing = GameObject.Find("InstitutionalBuilding");
        if (existing != null) return existing;

        // Root container for rotating the entire building
        GameObject buildingRoot = new GameObject("InstitutionalBuilding");
        buildingRoot.transform.position = Vector3.zero;

        // Attach the BuildingRotator script to the root
        BuildingRotator rotator = buildingRoot.AddComponent<BuildingRotator>();
        rotator.rotationSpeed = 150.0f;
        rotator.autoRotateSpeed = 20.0f;
        rotator.isAutoRotating = false;

        // --- A. Base Plinth / Foundation ---
        CreateShape("BuildingPlinth", PrimitiveType.Cube, buildingRoot.transform,
            new Vector3(0, 0.3f, 0), new Vector3(26.0f, 0.6f, 12.0f), matWings);

        // --- B. Central Administrative Block (Main Tower) ---
        CreateShape("CentralBlock", PrimitiveType.Cube, buildingRoot.transform,
            new Vector3(0, 4.0f, 0), new Vector3(10.0f, 7.0f, 10.0f), matWalls);

        // Central Top Parapet / Roof Cap
        CreateShape("CentralRoofCap", PrimitiveType.Cube, buildingRoot.transform,
            new Vector3(0, 7.8f, 0), new Vector3(10.6f, 0.6f, 10.6f), matRoof);

        // Central Upper Pediment Crest (AICTE Identity)
        CreateShape("CentralPediment", PrimitiveType.Cube, buildingRoot.transform,
            new Vector3(0, 8.4f, -0.5f), new Vector3(6.0f, 0.8f, 8.0f), matWalls);

        // --- C. Left Academic Wing ---
        CreateShape("LeftAcademicWing", PrimitiveType.Cube, buildingRoot.transform,
            new Vector3(-8.5f, 3.2f, 0), new Vector3(7.0f, 5.4f, 9.0f), matWings);

        CreateShape("LeftWingRoof", PrimitiveType.Cube, buildingRoot.transform,
            new Vector3(-8.5f, 6.1f, 0), new Vector3(7.4f, 0.4f, 9.4f), matRoof);

        // --- D. Right Laboratory Wing ---
        CreateShape("RightLabWing", PrimitiveType.Cube, buildingRoot.transform,
            new Vector3(8.5f, 3.2f, 0), new Vector3(7.0f, 5.4f, 9.0f), matWings);

        CreateShape("RightWingRoof", PrimitiveType.Cube, buildingRoot.transform,
            new Vector3(8.5f, 6.1f, 0), new Vector3(7.4f, 0.4f, 9.4f), matRoof);

        // --- E. Entrance Portico / Grand Canopy ---
        CreateShape("PorticoCanopy", PrimitiveType.Cube, buildingRoot.transform,
            new Vector3(0, 4.2f, -5.8f), new Vector3(7.5f, 0.5f, 2.5f), matRoof);

        // --- F. Classical Institutional Pillars (Columns) ---
        float[] pillarXPositions = new float[] { -2.8f, -0.95f, 0.95f, 2.8f };
        for (int i = 0; i < pillarXPositions.Length; i++)
        {
            CreateShape("Pillar_" + (i + 1), PrimitiveType.Cylinder, buildingRoot.transform,
                new Vector3(pillarXPositions[i], 2.3f, -5.8f), new Vector3(0.5f, 1.7f, 0.5f), matPillars);
        }

        // --- G. Entrance Steps ---
        CreateShape("Step_Bottom", PrimitiveType.Cube, buildingRoot.transform,
            new Vector3(0, 0.15f, -5.8f), new Vector3(5.5f, 0.2f, 1.8f), matPathway);
        CreateShape("Step_Middle", PrimitiveType.Cube, buildingRoot.transform,
            new Vector3(0, 0.35f, -5.4f), new Vector3(4.8f, 0.2f, 1.4f), matPathway);
        CreateShape("Step_Top", PrimitiveType.Cube, buildingRoot.transform,
            new Vector3(0, 0.55f, -5.0f), new Vector3(4.2f, 0.2f, 1.0f), matPathway);

        // --- H. Double Entrance Doors ---
        CreateShape("MainDoorLeft", PrimitiveType.Cube, buildingRoot.transform,
            new Vector3(-0.65f, 1.8f, -5.02f), new Vector3(1.1f, 2.4f, 0.1f), matDoor);
        CreateShape("MainDoorRight", PrimitiveType.Cube, buildingRoot.transform,
            new Vector3(0.65f, 1.8f, -5.02f), new Vector3(1.1f, 2.4f, 0.1f), matDoor);

        // --- I. AICTE Signboard Plaque ---
        CreateShape("AICTE_Signboard", PrimitiveType.Cube, buildingRoot.transform,
            new Vector3(0, 4.8f, -5.03f), new Vector3(5.0f, 0.9f, 0.12f), matSignboard);

        // --- J. Windows Grid (Central Block & Wings) ---
        // Central Block Upper Windows
        float[] winCentralX = new float[] { -2.8f, 0.0f, 2.8f };
        for (int i = 0; i < winCentralX.Length; i++)
        {
            CreateShape("CenterWin_" + i, PrimitiveType.Cube, buildingRoot.transform,
                new Vector3(winCentralX[i], 6.2f, -5.03f), new Vector3(1.5f, 1.8f, 0.1f), matWindows);
        }

        // Left Wing Windows (2 floors x 2 windows)
        float[] leftWinX = new float[] { -10.2f, -6.8f };
        float[] winY = new float[] { 2.2f, 4.5f };
        for (int r = 0; r < winY.Length; r++)
        {
            for (int c = 0; c < leftWinX.Length; c++)
            {
                CreateShape($"LeftWin_{r}_{c}", PrimitiveType.Cube, buildingRoot.transform,
                    new Vector3(leftWinX[c], winY[r], -4.53f), new Vector3(1.4f, 1.5f, 0.1f), matWindows);
            }
        }

        // Right Wing Windows (2 floors x 2 windows)
        float[] rightWinX = new float[] { 6.8f, 10.2f };
        for (int r = 0; r < winY.Length; r++)
        {
            for (int c = 0; c < rightWinX.Length; c++)
            {
                CreateShape($"RightWin_{r}_{c}", PrimitiveType.Cube, buildingRoot.transform,
                    new Vector3(rightWinX[c], winY[r], -4.53f), new Vector3(1.4f, 1.5f, 0.1f), matWindows);
            }
        }

        return buildingRoot;
    }

    // ============================================================
    // 5. LANDSCAPING & TREES (PREFABS CONCEPT)
    // ============================================================
    private void ConstructLandscaping(Transform parentTransform)
    {
        // Symmetrical positions along the campus entrance and lawn borders
        Vector3[] treePositions = new Vector3[]
        {
            // Front walkway flank left
            new Vector3(-4.5f, 0, -8.0f),
            new Vector3(-4.5f, 0, -12.5f),
            new Vector3(-4.5f, 0, -16.5f),

            // Front walkway flank right
            new Vector3(4.5f, 0, -8.0f),
            new Vector3(4.5f, 0, -12.5f),
            new Vector3(4.5f, 0, -16.5f),

            // Left campus garden corner
            new Vector3(-14.5f, 0, -8.0f),
            new Vector3(-14.5f, 0, 4.0f),

            // Right campus garden corner
            new Vector3(14.5f, 0, -8.0f),
            new Vector3(14.5f, 0, 4.0f)
        };

        for (int i = 0; i < treePositions.Length; i++)
        {
            CreateTreeInstance($"Tree_{i + 1}", parentTransform, treePositions[i]);
        }
    }

    /// <summary>
    /// Demonstrates the Prefab concept: Reusable compound object composed of
    /// a cylindrical trunk and a sphere/cube foliage canopy.
    /// </summary>
    private GameObject CreateTreeInstance(string name, Transform parent, Vector3 localPosition)
    {
        GameObject treeRoot = new GameObject(name);
        treeRoot.transform.SetParent(parent);
        treeRoot.transform.localPosition = localPosition;

        // Tree Trunk (Cylinder)
        GameObject trunk = GameObject.CreatePrimitive(PrimitiveType.Cylinder);
        trunk.name = "Trunk";
        trunk.transform.SetParent(treeRoot.transform);
        trunk.transform.localPosition = new Vector3(0, 1.2f, 0);
        trunk.transform.localScale = new Vector3(0.45f, 1.2f, 0.45f);
        trunk.GetComponent<Renderer>().material = matTrunk;

        // Tree Foliage Canopy (Sphere)
        GameObject foliage = GameObject.CreatePrimitive(PrimitiveType.Sphere);
        foliage.name = "Foliage";
        foliage.transform.SetParent(treeRoot.transform);
        foliage.transform.localPosition = new Vector3(0, 3.2f, 0);
        foliage.transform.localScale = new Vector3(2.4f, 2.4f, 2.4f);
        foliage.GetComponent<Renderer>().material = matFoliage;

        // Secondary Upper Foliage for natural look
        GameObject upperFoliage = GameObject.CreatePrimitive(PrimitiveType.Sphere);
        upperFoliage.name = "UpperFoliage";
        upperFoliage.transform.SetParent(treeRoot.transform);
        upperFoliage.transform.localPosition = new Vector3(0, 4.1f, 0);
        upperFoliage.transform.localScale = new Vector3(1.7f, 1.7f, 1.7f);
        upperFoliage.GetComponent<Renderer>().material = matFoliage;

        return treeRoot;
    }

    // ============================================================
    // HELPER METHOD FOR CREATING PRIMITIVES
    // ============================================================
    private GameObject CreateShape(string name, PrimitiveType type, Transform parent,
                                  Vector3 localPos, Vector3 localScale, Material material)
    {
        GameObject obj = GameObject.CreatePrimitive(type);
        obj.name = name;
        obj.transform.SetParent(parent);
        obj.transform.localPosition = localPos;
        obj.transform.localScale = localScale;
        if (material != null)
        {
            obj.GetComponent<Renderer>().material = material;
        }
        return obj;
    }
}
