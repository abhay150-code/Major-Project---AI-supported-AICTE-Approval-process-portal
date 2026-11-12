using UnityEngine;

/// <summary>
/// AICTE Smart Approval Portal - 3D Institutional Model
/// Script: BuildingRotator.cs
/// 
/// Purpose:
/// Demonstrates fundamental C# concepts taught in university syllabus:
/// - Public and private variables (float, bool, Vector3)
/// - Unity lifecycle methods (Start, Update)
/// - User mouse and keyboard input handling
/// - 3D object transformation and rotation
/// </summary>
public class BuildingRotator : MonoBehaviour
{
    // ============================================================
    // 1. C# VARIABLES (SYLLABUS REQUIREMENT)
    // ============================================================
    [Header("Manual Rotation Settings")]
    [Tooltip("Adjustable speed of manual mouse rotation (Variable)")]
    public float rotationSpeed = 150.0f;      // Float variable: Rotation speed

    [Header("Automatic Rotation Settings")]
    [Tooltip("Adjustable speed of automatic continuous rotation (Variable)")]
    public float autoRotateSpeed = 20.0f;     // Float variable: Auto-spin speed

    [Tooltip("Whether the building is automatically rotating (Variable)")]
    public bool isAutoRotating = false;      // Boolean variable: Auto-rotate flag

    // Private tracking variables
    private bool isDragging = false;
    private Vector3 initialRotation;

    // ============================================================
    // 2. UNITY LIFECYCLE METHODS
    // ============================================================

    void Start()
    {
        // Store the initial rotation angles so we can reset anytime
        initialRotation = transform.eulerAngles;
    }

    void Update()
    {
        // Read keyboard shortcuts (Space to toggle, R to reset)
        HandleKeyboardInput();

        // Read mouse drag inputs to rotate the building
        HandleMouseInput();

        // If auto-rotation is active and the user is not actively dragging
        if (isAutoRotating && !isDragging)
        {
            PerformAutoRotation();
        }
    }

    // ============================================================
    // 3. USER INPUT METHODS (SYLLABUS REQUIREMENT)
    // ============================================================

    /// <summary>
    /// Reads mouse button and drag movement to rotate the building horizontally.
    /// </summary>
    private void HandleMouseInput()
    {
        // Left mouse button pressed down
        if (Input.GetMouseButtonDown(0))
        {
            isDragging = true;
        }

        // Left mouse button held down and dragged
        if (Input.GetMouseButton(0) && isDragging)
        {
            // Input.GetAxis("Mouse X") returns horizontal mouse displacement
            float mouseDeltaX = Input.GetAxis("Mouse X");

            // Calculate rotation angle: speed * delta * frame-time
            float rotationAmount = -mouseDeltaX * rotationSpeed * Time.deltaTime * 50.0f;

            // Apply rotation around the global Y-axis (up axis)
            transform.Rotate(Vector3.up, rotationAmount, Space.World);
        }

        // Left mouse button released
        if (Input.GetMouseButtonUp(0))
        {
            isDragging = false;
        }
    }

    /// <summary>
    /// Reads keyboard inputs for convenient user shortcuts.
    /// </summary>
    private void HandleKeyboardInput()
    {
        // Press Spacebar to toggle auto-rotation
        if (Input.GetKeyDown(KeyCode.Space))
        {
            ToggleAutoRotate();
        }

        // Press 'R' to reset the building rotation to original angle
        if (Input.GetKeyDown(KeyCode.R))
        {
            ResetRotation();
        }
    }

    // ============================================================
    // 4. CUSTOM C# METHODS (SYLLABUS REQUIREMENT)
    // ============================================================

    /// <summary>
    /// Rotates the building steadily around the Y axis.
    /// </summary>
    public void PerformAutoRotation()
    {
        transform.Rotate(Vector3.up, autoRotateSpeed * Time.deltaTime, Space.World);
    }

    /// <summary>
    /// Toggles the automatic rotation state on or off.
    /// </summary>
    public void ToggleAutoRotate()
    {
        isAutoRotating = !isAutoRotating;
        Debug.Log("Building Auto-Rotation is now: " + (isAutoRotating ? "ENABLED" : "DISABLED"));
    }

    /// <summary>
    /// Resets the building's rotation back to its original orientation.
    /// </summary>
    public void ResetRotation()
    {
        transform.eulerAngles = initialRotation;
        Debug.Log("Building orientation reset to initial angle.");
    }

    /// <summary>
    /// Allows setting rotation speed dynamically from UI sliders.
    /// </summary>
    public void SetRotationSpeed(float newSpeed)
    {
        rotationSpeed = newSpeed;
    }
}
