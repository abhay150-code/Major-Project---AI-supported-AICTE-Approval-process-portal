using UnityEngine;

/// <summary>
/// AICTE Smart Approval Portal - 3D Institutional Model
/// Script: CameraController.cs
/// 
/// Purpose:
/// Demonstrates simple camera viewing, zoom functionality, and target tracking.
/// Keeps the camera positioned at an appealing architectural viewpoint.
/// </summary>
public class CameraController : MonoBehaviour
{
    // ============================================================
    // 1. C# VARIABLES (SYLLABUS REQUIREMENT)
    // ============================================================
    [Header("Target & Viewport Settings")]
    [Tooltip("The central object the camera looks at")]
    public Transform target;                  // Transform variable: Target object

    [Tooltip("Distance from the camera to the building center")]
    public float distance = 28.0f;            // Float variable: Camera distance

    [Tooltip("Height of the camera above ground level")]
    public float height = 12.0f;              // Float variable: Camera height

    [Header("Zoom Settings")]
    [Tooltip("Sensitivity of mouse scroll-wheel zoom")]
    public float zoomSpeed = 8.0f;            // Float variable: Zoom speed

    public float minDistance = 12.0f;         // Minimum zoom limit
    public float maxDistance = 45.0f;         // Maximum zoom limit

    [Header("Angle Settings")]
    [Tooltip("Horizontal view angle around target in degrees")]
    public float horizontalAngle = 45.0f;     // Float variable: Isometric 45-degree angle

    // ============================================================
    // 2. UNITY LIFECYCLE METHODS
    // ============================================================

    void Start()
    {
        // If target is not manually assigned, find the building in the scene
        if (target == null)
        {
            GameObject building = GameObject.Find("InstitutionalBuilding");
            if (building != null)
            {
                target = building.transform;
            }
        }

        UpdateCameraPosition();
    }

    void LateUpdate()
    {
        // LateUpdate ensures smooth camera movement after other objects update
        HandleZoomInput();
        UpdateCameraPosition();
    }

    // ============================================================
    // 3. USER INPUT & CAMERA METHODS (SYLLABUS REQUIREMENT)
    // ============================================================

    /// <summary>
    /// Reads mouse scroll wheel to zoom the camera closer or further away.
    /// </summary>
    private void HandleZoomInput()
    {
        float scrollInput = Input.GetAxis("Mouse ScrollWheel");
        if (Mathf.Abs(scrollInput) > 0.001f)
        {
            // Scrolling up decreases distance (zooms in), scrolling down increases distance (zooms out)
            distance -= scrollInput * zoomSpeed * 10.0f;
            distance = Mathf.Clamp(distance, minDistance, maxDistance);
        }
    }

    /// <summary>
    /// Computes the camera's 3D coordinates based on distance and angle,
    /// then aims the camera directly at the building center.
    /// </summary>
    public void UpdateCameraPosition()
    {
        Vector3 targetPosition = target != null ? target.position : new Vector3(0, 3, 0);

        // Convert horizontal angle to radians for trigonometric calculation
        float rad = horizontalAngle * Mathf.Deg2Rad;
        float x = targetPosition.x + distance * Mathf.Sin(rad);
        float z = targetPosition.z - distance * Mathf.Cos(rad);
        float y = targetPosition.y + height;

        transform.position = new Vector3(x, y, z);

        // Point the camera at slightly above the base for optimal architectural framing
        transform.LookAt(targetPosition + new Vector3(0, 2.5f, 0));
    }
}
