<?php

// Для FormData
// echo var_dump($_POST);

// Для JSON
$_POST = json_decode(file_get_contents("php://input"), true);
echo var_dump($_POST);