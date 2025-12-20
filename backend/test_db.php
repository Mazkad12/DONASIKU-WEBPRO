<?php
try {
    // Connect to MySQL server without selecting a database
    $pdo = new PDO("mysql:host=127.0.0.1;port=3306", "root", "");
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Create database
    $pdo->exec("CREATE DATABASE IF NOT EXISTS donasiku");
    echo "Database 'donasiku' created successfully (or already exists).\n";

    // Test selecting it
    $pdo->exec("USE donasiku");
    echo "Successfully selected database 'donasiku'.";
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage();
}
