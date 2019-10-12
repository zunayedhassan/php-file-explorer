<?php
require_once './assets/lib/FileExplorer.php';
require_once './assets/lib/FileExplorerUI.php';

session_start();

if (isset($_POST["operation"])) {
    $operation = $_POST["operation"];
    $path = $_POST["path"];
    $id = $_POST["id"];
    $history = $_POST["history"];
    
    if ($operation == "view-refresh") {
        FileExplorer::REFRESH($path, $id, $history, NULL);
    }
    else if ($operation == "create-folder") {
        $folder = $path . "/" . $_POST["folder-name"];
        
        if (!file_exists($folder)) {
            mkdir($folder, 0777, true);
        }
        
        FileExplorer::REFRESH($path, $id, $history, NULL);
    }
    else if ($operation == "go-home") {
        FileExplorer::REFRESH($path, $id, $history, NULL);
    }
    else if ($operation == "edit-upload") {
        $file = $_FILES["file"];
        $target_dir = $path . "/";
        $target_file = $target_dir . basename($_FILES["file"]["name"]);
        $tempFileName = $_FILES["file"]["tmp_name"];
        
        move_uploaded_file ($tempFileName , $target_file);
        FileExplorer::REFRESH($path, $id, $history, NULL);
    }
    else if ($operation == "view-folder") {
        FileExplorer::REFRESH($path, $id, $history, NULL);
    }
    else if ($operation == "go-up") {
        FileExplorer::REFRESH($path, $id, $history, NULL);
    }
    else if ($operation == "go-back") {
        FileExplorer::REFRESH($path, $id, $history, NULL);
    }
    else if ($operation == "view-trash") {
        FileExplorer::REFRESH(FileExplorer::$HOME_FOLDER . "/" . FileExplorer::$TRASH_FOLDER, $id, $history, NULL);
    }
    else if ($operation == "edit-copy") {
        $destinition = $_POST["destinition"];
        
        if (is_dir($destinition)) {
            $copyItems = $_POST["copy"];
            $files = explode("?", $copyItems);
            
            for ($i = 0; $i < count($files); $i++) {
                $file = $files[$i];
                $fileName = substr($file, strrpos($file, "/") + 1);
                
                if (trim($fileName) !== "") {
                    copy($file, $destinition . "/" . $fileName);
                }
            }
        }
        
        FileExplorer::REFRESH($path, $id, $history, NULL);
    }
    else if ($operation == "edit-move") {
        $destinition = $_POST["destinition"];
        
        if (is_dir($destinition)) {
            $moveItems = $_POST["move"];
            $files = explode("?", $moveItems);
            
            for ($i = 0; $i < count($files); $i++) {
                $file = $files[$i];
                $fileName = substr($file, strrpos($file, "/") + 1);
                
                if (trim($fileName) !== "") {
                    rename($file, $destinition . "/" . $fileName);
                }
            }
        }
        
        FileExplorer::REFRESH($path, $id, $history, NULL);
    }
    else if ($operation == "edit-delete") {
        $destinition = FileExplorer::$HOME_FOLDER . "/" . FileExplorer::$TRASH_FOLDER;
        
        if (is_dir($destinition)) {
            $moveItems = $_POST["move"];
            $files = explode("?", $moveItems);
            
            for ($i = 0; $i < count($files); $i++) {
                $file = $files[$i];
                $fileName = substr($file, strrpos($file, "/") + 1);
                
                if (trim($fileName) !== "") {
                    if (strpos($path, FileExplorer::$TRASH_FOLDER) !== false) {
                        chmod($file, 0777);
                        unlink($file);
                    }
                    else {
                        rename($file, $destinition . "/" . $fileName);
                    }
                }
            }
        }
        
        FileExplorer::REFRESH($path, $id, $history, NULL);
    }
    else if ($operation == "edit-rename") {
        $oldName = $_POST["filename-src"];
        $newName = $path . "/" . $_POST["rename"];
        
        if (file_exists($oldName)) {
            rename($oldName, $newName);
        }
        
        FileExplorer::REFRESH($path, $id, $history, NULL);
    }
    else if ($operation == "edit-compress") {
        $files = $_POST["files"];
        $files = explode("?", $files);
        $zipname = $path . "/" . uniqid() . ".zip";
        
        if (count($files) == 1) {
            $zipname = $path . "/" . explode("?", $_POST["fileNames"])[0] . ".zip";
        }
        
        $zip = new ZipArchive();
        $zip->open($zipname, ZipArchive::CREATE);
        
        foreach ($files as $file) {
            if (trim(strlen($file) > 0)) {
                $zip->addFile($file);
            }
        }
        
        $zip->close();
        
        FileExplorer::REFRESH($path, $id, $history, "Selected files are compressed to '" . $zipname . "'");
    }
    else if ($operation == "edit-extract") {
        $files = $_POST["files"];
        $files = explode("?", $files);
        
        for ($i = 0; $i < count($files); $i++) {
            $file = $files[$i];
            
            if (strlen($file) > 0) {
                $path = pathinfo(realpath($file), PATHINFO_DIRNAME);
                $zip = new ZipArchive;
                $res = $zip->open($file);

                if ($res === TRUE) {
                    // extract it to the path we determined above
                    $zip->extractTo($path);
                    $zip->close();
                }
            }
        }
    }
}