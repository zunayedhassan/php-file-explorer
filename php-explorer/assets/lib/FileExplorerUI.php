<?php
require_once 'FileExplorer.php';

class FileExplorerUI {
    public function __construct() {
        
    }
    
    public static function CREATE_BUTTON($title, $icon, $command, $isShowTitle, $isShowIcon) {
        ?>
            <a class="aiom-file-explorer-button <?= $command; ?>" href="#!" title="<?= $title; ?>" data-command="<?= $command; ?>">
                <?php
                
                if ($isShowIcon) {
                    ?>
                       <img alt="<?= $title; ?> Icon" src="<?= $icon; ?>" /> 
                    <?php
                }
                
                if ($isShowTitle) {
                    ?><span><?= $title; ?></span><?php
                }
                
                ?>
            </a>
        <?php
    }
    
    public static function FILE_EXPLORER($id) {
        $path = "demo-files";
        FileExplorer::REFRESH($path, $id, NULL, NULL);
    }
}