<?php

class FileExplorer {
    public static $TRASH_FOLDER = ".aiom-file-explorer-trash";
    public static $HOME_FOLDER  = "demo-files";

    public function __construct() {
        
    }

    static function REFRESH($path, $id, $history, $message) {
        $trash= FileExplorer::$HOME_FOLDER . "/" . FileExplorer::$TRASH_FOLDER;
        
        if (!file_exists($trash)) {
            mkdir($trash, 0777, true);
        }
        
        if ($history === NULL) {
            $history = "";
        }
        
        ?>
        
        <div id="<?= $id; ?>" class="aiom-file-explorer" data-path="<?= $path; ?>" data-history="<?= $history; ?>" data-message="<?= $message; ?>">
            <input class="aiom-explorer-files-input" type="file" multiple />
            
            <div class="aiom-file-explorer-toolbar">
                <?php

                FileExplorerUI::CREATE_BUTTON("New Folder",  "assets/images/folder.svg",        "create-new-folder", true, true);
                FileExplorerUI::CREATE_BUTTON("Home",        "assets/images/home.svg",          "go-gome",           true, true);
                FileExplorerUI::CREATE_BUTTON("Up",          "assets/images/up.svg",            "go-up",             true, true);
                FileExplorerUI::CREATE_BUTTON("Back",        "assets/images/left.svg",          "go-back",           true, true);
                FileExplorerUI::CREATE_BUTTON("Next",        "assets/images/right.svg",         "go-forward",        true, true);
                FileExplorerUI::CREATE_BUTTON("Refresh",     "assets/images/refresh.svg",       "view-refresh",      true, true);
                FileExplorerUI::CREATE_BUTTON("Upload",      "assets/images/upload.svg",        "edit-upload",       true, true);
                FileExplorerUI::CREATE_BUTTON("Recycle Bin", "assets/images/recycling-bin.svg", "view-trash",        true, true);

                ?>
            </div>

            <div class="aiom-file-explorer-toolbar-extra">
                <label class="aiom-file-explorer-toolbar-label">2 Items selected</label>

                <?php

                FileExplorerUI::CREATE_BUTTON("Copy",      null,    "edit-copy",        true, false);
                FileExplorerUI::CREATE_BUTTON("Move",      null,    "edit-move",        true, false);
                FileExplorerUI::CREATE_BUTTON("Delete",    null,    "edit-delete",      true, false);
                FileExplorerUI::CREATE_BUTTON("Rename",    null,    "edit-rename",      true, false);
                FileExplorerUI::CREATE_BUTTON("Download",  null,    "action-download",  true, false);
                FileExplorerUI::CREATE_BUTTON("Compress",  null,    "edit-compress",    true, false);
                FileExplorerUI::CREATE_BUTTON("Extract",   null,    "edit-extract",     true, false);
                FileExplorerUI::CREATE_BUTTON("Cancel",    null,    "edit-cancel",      true, false);

                ?>
            </div>

            <table>
                <thead>
                    <tr>
                        <th><input type="checkbox" class="aiom-file-explorer-select-all-checkbox" /></th>
                        <th>Name</th>
                        <th>Size</th>
                        <th>Last Modified</th>
                        <th>Type</th>
                        <th>Permission</th>
                    </tr>
                </thead>

                <tbody>
                    <?php
                    $files = scandir($path);

                    for ($i = 2; $i < count($files); $i++) {
                        $file = $files[$i];
                        $fileName = $path . "/" . $file;

                        $extension = "";

                        if (!is_dir($fileName)) {
                            $pathInfo = pathinfo($fileName);
                            $extension = isset($pathInfo["extension"]) ? $pathInfo["extension"] : "";
                        }

                        $fileTime = date("F d Y H:i:s", filemtime($fileName));
                        $fileSize = filesize($fileName);

                        $fileSizeAsString = $fileSize . "";

                        if (strlen($fileSizeAsString) > 9) {
                            $fileSizeAsString = ($fileSize / 1000000000.0) . " GB";
                        }
                        else if (strlen($fileSizeAsString) > 6) {
                            $fileSizeAsString = ($fileSize / 1000000.0) . " MB";
                        }
                        else if (strlen($fileSizeAsString) > 3) {
                            $fileSizeAsString = ($fileSize / 1000.0) . " KB";
                        }
                        else {
                            $fileSizeAsString .= " bytes";
                        }

                        $filePermission = substr(sprintf('%o', fileperms($fileName)), -4);

                        $fileIcon = "file-icon.svg";

                        if (is_dir($fileName)) {
                            $fileIcon = "folder-icon.svg";
                            $fileSizeAsString = "";
                        }
                        
                        if ($file != FileExplorer::$TRASH_FOLDER) { 
                            
                            $data = "";
                            
                            if (is_dir($fileName)) {
                                $data .= 'class="aiom-file-link" ';
                            }
                            
                            $data .= "data-filename='" . $fileName . "'";
                            ?>

                            <tr class="aiom-file-explorer-file-row" data-is-select="false" data-filename="<?= $fileName; ?>" data-file="<?= $file; ?>">
                                <td><input class="aiom-file-explorer-file-checkbox" type="checkbox" /></td>
                                <td <?= $data; ?>>
                                    <img class="aiom-file-icon" src="assets/images/<?= $fileIcon; ?>" alt="Icon" /> <span><?= $file; ?></span>
                                </td>
                                <td <?= $data; ?>><?= $fileSizeAsString; ?></td>
                                <td <?= $data; ?>><datetime><?= $fileTime; ?></datetime></td>
                                <td <?= $data; ?>><?= $extension; ?></td>
                                <td <?= $data; ?>><?= $filePermission; ?></td>
                            </tr>

                            <?php
                        }
                    }

                    ?>
                </tbody>
            </table>
        </div>    
            
        <?php
    }
}