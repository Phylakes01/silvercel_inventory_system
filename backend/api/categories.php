<?php
require_once 'database_connection.php';
require_once 'cors.php';

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    $sql = "SELECT * FROM categories";
    $result = $conn->query($sql);
    $categories = array();
    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $categories[] = $row;
        }
    }
    echo json_encode($categories);
} elseif ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $name = $data['name'];

    if (isset($data['id'])) {
        // Update
        $id = $data['id'];
        $sql = "UPDATE categories SET name = ? WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("si", $name, $id);
    } else {
        // Create
        $sql = "INSERT INTO categories (name) VALUES (?)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("s", $name);
    }

    if ($stmt->execute()) {
        echo json_encode(['message' => 'Category saved successfully']);
    } else {
        echo json_encode(['message' => 'Error saving category']);
    }
    $stmt->close();
} elseif ($_SERVER['REQUEST_METHOD'] == 'DELETE') {
   $id = $_GET['id'];

    // Step 1: Check if category is linked to any products
    $checkQuery = "SELECT COUNT(*) AS total FROM products WHERE category_id = ?";
    $checkStmt = $conn->prepare($checkQuery);
    $checkStmt->bind_param("i", $id);
    $checkStmt->execute();
    $checkResult = $checkStmt->get_result()->fetch_assoc();

    if ($checkResult['total'] > 0) {
        // Cannot delete — category in use
        echo json_encode([
            'status' => 'error',
            'message' => 'Cannot delete category: it is linked to one or more products.'
        ]);
        $checkStmt->close();
        exit; // Stop execution here
    }

    $checkStmt->close();

    // Step 2: Category is safe to delete
    $sql = "DELETE FROM categories WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $id);

    if ($stmt->execute()) {
        echo json_encode([
            'status' => 'success',
            'message' => 'Category deleted successfully'
        ]);
    } else {
        echo json_encode([
            'status' => 'error',
            'message' => 'Error deleting category'
        ]);
    }

    $stmt->close();
}

$conn->close();
?>