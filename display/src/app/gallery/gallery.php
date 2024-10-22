<?php
    $imagesDir = '../../images/';

    echo '{ "galleries": {';

    $files = scandir($imagesDir);
    foreach ($files as $file) {
        if ($file === '.' || $file === '..' ||!is_dir($imagesDir. $file)) continue;
        echo '"' . $file . '": [';
        $images = scandir($imagesDir . $file);
        foreach ($images as $image) {
            if ($image === '.' || $image === '..') continue;
            echo '"' . $image . '", ';
        }
        echo '], ';
    }

    echo '} }'
?>
