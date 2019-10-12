<?php
require_once './assets/lib/FileExplorer.php';
require_once './assets/lib/FileExplorerUI.php';

session_start();
?>
<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <title>File Explorer</title>
        
        <link type="text/css" rel="stylesheet" media="all" href="assets/css/styles.css" />
        
        <script type="text/javascript" src="assets/js/Ajax.js"></script>
        <script type="text/javascript" src="assets/js/FileExplorer.js"></script>
    </head>
    <body>
        <main id="aiom-file-explorer-wrapper">
            <?php FileExplorerUI::FILE_EXPLORER("aiom-files"); ?>
        </main>
        
        <script type="text/javascript" src="assets/js/app.js"></script>
    </body>
</html>
 