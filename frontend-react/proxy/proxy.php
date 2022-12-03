<?php

require 'functions.php';
$config = require '_config.php';

$defaultBaseUrl = 'http://178.132.200.166:18095/';
$baseUrl = isset($config['base_url']) ? $config['base_url'] : $defaultBaseUrl;

$scriptName = $_SERVER['SCRIPT_NAME'];
$requestUri = $_SERVER['REQUEST_URI'];
$requestMethod = $_SERVER['REQUEST_METHOD'];

$path = isset($_GET['q']) ? $_GET['q'] : '';

$data = file_get_contents('php://input');
$headers = ['Content-Type: application/json'];

$url = $baseUrl . $path;

$response = sendPostRequest($url, $data,$headers);

echo $response;
die();