#if UNITY_EDITOR
using UnityEditor;
using UnityEngine;

/// <summary>
/// AICTE Smart Approval Portal - 3D Institutional Model
/// Script: AICTEModelMenu.cs (Editor Tool)
/// 
/// Purpose:
/// Adds a custom top-menu item in the Unity Editor:
/// "AICTE Portal > Build Institutional Campus in Scene"
/// 
/// Allows users or evaluators to generate the entire 3D campus hierarchy
/// in the scene with a single click inside the Unity Editor.
/// </summary>
public static class AICTEModelMenu
{
    [MenuItem("AICTE Portal/Build Institutional Campus in Scene", false, 1)]
    public static void BuildCampusInEditor()
    {
        // Check if CampusManager exists in scene
        CampusBuilder builder = Object.FindFirstObjectByType<CampusBuilder>();
        if (builder == null)
        {
            GameObject managerObj = new GameObject("CampusManager");
            builder = managerObj.AddComponent<CampusBuilder>();
            Undo.RegisterCreatedObjectUndo(managerObj, "Create CampusManager");
        }

        // Trigger campus construction
        builder.BuildCampus();

        // Mark scene dirty so user can save
        UnityEditor.SceneManagement.EditorSceneManager.MarkAllScenesDirty();

        EditorUtility.DisplayDialog(
            "AICTE 3D Model",
            "Institutional Campus generated successfully!\n\n" +
            "• Main Academic Building with Pillars & Signboard\n" +
            "• Campus Lawn & Entrance Walkway\n" +
            "• Landscaping Trees (Prefabs)\n" +
            "• Directional Sunlight & Camera Controller\n\n" +
            "Press the 'Play' button at the top to test mouse rotation and zoom!",
            "OK"
        );
    }

    [MenuItem("AICTE Portal/Select Institutional Building", false, 2)]
    public static void SelectBuilding()
    {
        GameObject building = GameObject.Find("InstitutionalBuilding");
        if (building != null)
        {
            Selection.activeGameObject = building;
            EditorGUIUtility.PingObject(building);
        }
        else
        {
            EditorUtility.DisplayDialog("AICTE 3D Model", "Please build the campus first using 'AICTE Portal > Build Institutional Campus in Scene'.", "OK");
        }
    }
}
#endif
