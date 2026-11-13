using UnityEngine;

/// <summary>
/// AICTE Smart Approval Portal - 3D Institutional Model
/// Script: CampusHUD.cs
/// 
/// Purpose:
/// Displays a clear on-screen graphical user interface (GUI) using Unity's built-in OnGUI.
/// Provides beginner-friendly controls to adjust rotation speed, toggle auto-spin, and reset view.
/// </summary>
public class CampusHUD : MonoBehaviour
{
    [Tooltip("Reference to the BuildingRotator component")]
    public BuildingRotator rotator;

    void Start()
    {
        if (rotator == null)
        {
            rotator = FindFirstObjectByType<BuildingRotator>();
        }
    }

    void OnGUI()
    {
        // Background card for instructions
        GUI.Box(new Rect(20, 20, 360, 205), "AICTE Smart Approval Portal\n3D Institutional Campus Model");

        GUI.Label(new Rect(35, 60, 330, 22), "• Left Click + Drag: Rotate Building");
        GUI.Label(new Rect(35, 82, 330, 22), "• Scroll Wheel: Zoom Camera In / Out");
        GUI.Label(new Rect(35, 104, 330, 22), "• Spacebar: Toggle Auto-Rotation");
        GUI.Label(new Rect(35, 126, 330, 22), "• 'R' Key: Reset Orientation");

        if (rotator != null)
        {
            // Slider to adjust rotation speed variable dynamically
            GUI.Label(new Rect(35, 150, 110, 20), "Speed: " + (int)rotator.rotationSpeed);
            rotator.rotationSpeed = GUI.HorizontalSlider(new Rect(125, 153, 120, 20), rotator.rotationSpeed, 20.0f, 300.0f);

            // Toggle button
            string toggleLabel = rotator.isAutoRotating ? "Pause Spin" : "Auto-Spin";
            if (GUI.Button(new Rect(255, 148, 105, 25), toggleLabel))
            {
                rotator.ToggleAutoRotate();
            }

            // Reset button
            if (GUI.Button(new Rect(35, 175, 110, 24), "Reset View (R)"))
            {
                rotator.ResetRotation();
            }
        }
    }
}
