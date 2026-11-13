using UnityEngine;

/// <summary>
/// AICTE Smart Approval Portal - 3D Institutional Model
/// Script: TreeSpawner.cs
/// 
/// Purpose:
/// Demonstrates the Unity PREFAB concept taught in university syllabus:
/// - Taking a GameObject reference (Prefab)
/// - Using the Instantiate() method to dynamically spawn multiple copies
/// - Setting transform positions and parent-child hierarchies
/// </summary>
public class TreeSpawner : MonoBehaviour
{
    // ============================================================
    // 1. C# VARIABLES (SYLLABUS REQUIREMENT)
    // ============================================================
    [Header("Prefab Reference (Syllabus Concept)")]
    [Tooltip("The Tree Prefab to clone around the campus")]
    public GameObject treePrefab;             // GameObject variable: Prefab template

    [Header("Spawn Settings")]
    [Tooltip("Distance from pathway for tree placement")]
    public float pathwayOffset = 5.0f;        // Float variable: Offset distance

    // ============================================================
    // 2. UNITY LIFECYCLE METHODS
    // ============================================================
    void Start()
    {
        // If a tree prefab is assigned in the Inspector, instantiate it
        if (treePrefab != null)
        {
            SpawnCampusTrees();
        }
    }

    // ============================================================
    // 3. PREFAB INSTANTIATION METHOD (SYLLABUS REQUIREMENT)
    // ============================================================
    /// <summary>
    /// Spawns tree prefab instances using Unity's Instantiate method.
    /// </summary>
    public void SpawnCampusTrees()
    {
        // Array of 3D coordinates for tree planting
        Vector3[] spawnLocations = new Vector3[]
        {
            new Vector3(-pathwayOffset, 0, -8.0f),
            new Vector3(pathwayOffset, 0, -8.0f),
            new Vector3(-pathwayOffset, 0, -13.0f),
            new Vector3(pathwayOffset, 0, -13.0f),
            new Vector3(-pathwayOffset, 0, -18.0f),
            new Vector3(pathwayOffset, 0, -18.0f),
            new Vector3(-13.0f, 0, 0.0f),
            new Vector3(13.0f, 0, 0.0f)
        };

        for (int i = 0; i < spawnLocations.Length; i++)
        {
            // Instantiate is the core Unity method to create an object from a Prefab
            GameObject treeInstance = Instantiate(treePrefab, spawnLocations[i], Quaternion.identity, transform);
            treeInstance.name = "CampusTree_" + (i + 1);
        }

        Debug.Log("Successfully instantiated " + spawnLocations.Length + " trees from Prefab!");
    }
}
