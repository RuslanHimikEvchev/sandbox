<?php

$audit = json_encode($_SERVER, JSON_PRETTY_PRINT);
echo $audit;
//file_put_contents('audit.json', $audit, FILE_APPEND);