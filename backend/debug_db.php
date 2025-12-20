<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

// Load composer
require __DIR__ . '/vendor/autoload.php';

// Bootstrap Laravel (minimal)
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$columns = Schema::getColumnListing('users');
echo "Columns in users table:\n";
print_r($columns);

echo "\nDetailed Info:\n";
$details = DB::select('DESCRIBE users');
print_r($details);
