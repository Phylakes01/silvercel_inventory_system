<?php
require_once __DIR__ . '/../vendor/autoload.php';

use Dotenv\Dotenv;

$dotenv = Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->load();

// enable this if the UPLOAD_ROOT in .env file has a path
// $uploadRoot = $_ENV['UPLOAD_ROOT'];
// define('UPLOAD_ROOT', $uploadRoot);

$frontendOrigin = $_ENV['FRONTEND_ORIGIN'];
define('FRONTEND_ORIGIN', $frontendOrigin);
?>