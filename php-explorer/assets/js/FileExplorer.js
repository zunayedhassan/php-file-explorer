"use strict";

class FileExplorer {
    constructor(id, home) {
        this.Home                   = home;
        this.Id                     = id;
        this.Explorer               = document.querySelector("#" + this.Id);
        this.Path                   = this.Explorer.getAttribute("data-path");
        this.Main                   = document.querySelector("#aiom-file-explorer-wrapper");
        this.Url                    = "file-operation.php";
        this.RefreshButton          = this.Explorer.querySelector(".view-refresh");
        this.NewFolderButton        = this.Explorer.querySelector(".create-new-folder");
        this.HomeButton             = this.Explorer.querySelector(".go-gome");
        this.FileInput              = this.Explorer.querySelector(".aiom-explorer-files-input");
        this.UploadButton           = this.Explorer.querySelector(".edit-upload");
        this.FolderLinks            = this.Explorer.querySelectorAll(".aiom-file-link");
        this.UpButton               = this.Explorer.querySelector(".go-up");
        this.History                = this.Explorer.getAttribute("data-history");
        this.GoBackButton           = this.Explorer.querySelector(".go-back");
        this.GoForwardButton        = this.Explorer.querySelector(".go-forward");
        this.ViewTrashButton        = this.Explorer.querySelector(".view-trash");
        this.Rows                   = this.Explorer.querySelectorAll(".aiom-file-explorer-file-row");
        this.FileCheckboxes         = this.Explorer.querySelectorAll(".aiom-file-explorer-file-checkbox");
        this.FileSelectionLabel     = this.Explorer.querySelector(".aiom-file-explorer-toolbar-label");
        this.FileSelectiontoolbar   = this.Explorer.querySelector(".aiom-file-explorer-toolbar-extra");
        this.FileSelectAllCheckbox  = this.Explorer.querySelector(".aiom-file-explorer-select-all-checkbox");
        this.CancelActionButton     = this.Explorer.querySelector(".edit-cancel");
        this.CopyButton             = this.Explorer.querySelector(".edit-copy");
        this.MoveButton             = this.Explorer.querySelector(".edit-move");
        this.DeleteButton           = this.Explorer.querySelector(".edit-delete");
        this.RenameButton           = this.Explorer.querySelector(".edit-rename");
        this.CompressButton         = this.Explorer.querySelector(".edit-compress");
        this.ExtractButton          = this.Explorer.querySelector(".edit-extract");
        this.DownloadButton         = this.Explorer.querySelector(".action-download");
        
        let message = this.Explorer.getAttribute("data-message");
        
        if (message.length > 0) {
            window.open("file-operation-message.php?message=" + encodeURI(message));
        }
        
        if ((this.History === null) || (this.History === undefined)) {
            this.History = "";
        }
        
        this.NewFolderButton.addEventListener("click", event => {
            let newFolderName = prompt("Folder Name", "New Folder");
            
            if (newFolderName !== null) {
                let formData = new FormData();
                formData.append('operation', "create-folder");
                formData.append('folder-name', newFolderName);
                formData.append('path', this.Explorer.getAttribute("data-path"));
                formData.append('id', this.Id);
                formData.append('history', this.History);
                
                Ajax.ON_ACTION(this.Url, formData, responseText => {
                    this.Main.innerHTML = responseText;
                    let fileExplorer = new FileExplorer(this.Id, this.Home);
                });
            }
        });
        
        this.RefreshButton.addEventListener("click", event => {
            let formData = new FormData();
            formData.append('path', this.Explorer.getAttribute("data-path"));
            formData.append('id', this.Id);
            formData.append('operation', "view-refresh");
            formData.append('history', this.History);
            
            Ajax.ON_ACTION(this.Url, formData, responseText => {
                this.Main.innerHTML = responseText;
                let fileExplorer = new FileExplorer(this.Id, this.Home);
            });
        });
        
        this.HomeButton.addEventListener("click", event => {
            this.History += this.Home + "?";
            
            let formData = new FormData();
            formData.append('path', this.Home);
            formData.append('id', this.Id);
            formData.append('operation', "go-home");
            formData.append('history', this.History);
            
            Ajax.ON_ACTION(this.Url, formData, responseText => {
                this.Main.innerHTML = responseText;
                let fileExplorer = new FileExplorer(this.Id, this.Home);
            });
        });
        
        this.UploadButton.addEventListener("click", event => {
            this.FileInput.click();
        });
        
        this.FileInput.addEventListener("change", event => {
            let files = event.target.files;
            this._handleFiles(files);
        });
        
        if ((this.FolderLinks !== null) || (this.FolderLinks !== undefined)) {
            for (let i = 0; i < this.FolderLinks.length; i++) {
                let folderLink = this.FolderLinks[i];
                
                folderLink.addEventListener("click", event => {
                    let path = folderLink.getAttribute("data-filename");
                    
                    this.History += path + "?";
                    
                    let formData = new FormData();
                    formData.append('path', path);
                    formData.append('id', this.Id);
                    formData.append('operation', "view-folder");
                    formData.append('history', this.History);
                    
                    Ajax.ON_ACTION(this.Url, formData, responseText => {
                        this.Main.innerHTML = responseText;
                        let fileExplorer = new FileExplorer(this.Id, this.Home);
                    });
                });
            }
        }
        
        this.UpButton.addEventListener("click", event => {
            if (this.Path.includes("/")) {
                let path = this.Path.substr(0, this.Path.lastIndexOf("/"));
                
                this.History += path + "?";
                
                let formData = new FormData();
                formData.append('path', path);
                formData.append('id', this.Id);
                formData.append('operation', "go-up");
                formData.append('history', this.History);
                
                Ajax.ON_ACTION(this.Url, formData, responseText => {
                    this.Main.innerHTML = responseText;
                    let fileExplorer = new FileExplorer(this.Id, this.Home);
                });
            }
        });
        
        this.GoBackButton.addEventListener("click", event => {
            let path = this.Home;
            
            if ((this.History !== null) || (this.History.trim() !== "") || (this.History !== undefined)) {
                let pathHistories = this.History.split("?");
                
                for (let i = pathHistories.length - 1; i >= 0; i--) {
                    let pathHistory = pathHistories[i];
                    
                    if ((pathHistory === this.Path) && (i > 0)) {
                        path = pathHistories[i - 1];
                    }
                }
            }
            
            let formData = new FormData();
            formData.append('path', path);
            formData.append('id', this.Id);
            formData.append('operation', "go-up");
            formData.append('history', this.History);

            Ajax.ON_ACTION(this.Url, formData, responseText => {
                this.Main.innerHTML = responseText;
                let fileExplorer = new FileExplorer(this.Id, this.Home);
            });
        });
        
        this.GoForwardButton.addEventListener("click", event => {
            let path = this.Home;
            
            if ((this.History !== null) || (this.History.trim() !== "") || (this.History !== undefined)) {
                let pathHistories = this.History.split("?");
                
                for (let i = pathHistories.length - 1; i >= 0; i--) {
                    let pathHistory = pathHistories[i];
                    
                    if ((pathHistory === this.Path) && (i < pathHistories.length - 2)) {
                        path = pathHistories[i + 1];
                    }
                }
            }
            
            let formData = new FormData();
            formData.append('path', path);
            formData.append('id', this.Id);
            formData.append('operation', "go-up");
            formData.append('history', this.History);

            Ajax.ON_ACTION(this.Url, formData, responseText => {
                this.Main.innerHTML = responseText;
                let fileExplorer = new FileExplorer(this.Id, this.Home);
            });
        });
        
        this.ViewTrashButton.addEventListener("click", event => {
            let path = this.Path;
                    
            this.History += path + "?";
            
            let formData = new FormData();
            formData.append('path', path);
            formData.append('id', this.Id);
            formData.append('operation', "view-trash");
            formData.append('history', this.History);
            
            Ajax.ON_ACTION(this.Url, formData, responseText => {
                this.Main.innerHTML = responseText;
                let fileExplorer = new FileExplorer(this.Id, this.Home);
            });
        });
        
        if ((this.FileCheckboxes !== undefined) && (this.FileCheckboxes !== null)) {
            for (let i = 0; i < this.FileCheckboxes.length; i++) {
                let fileCheckbox = this.FileCheckboxes[i];
                
                fileCheckbox.addEventListener("change", event => {
                    this.Rows[i].setAttribute("data-is-select", event.target.checked);
                    
                    let count = 0;
                    
                    for (let j = 0; j < this.FileCheckboxes.length; j++) {
                        let item = this.FileCheckboxes[j];
                        
                        if (item.checked) {
                            count += 1;
                        }
                    }
                    
                    let message = count + " items selected";
                    
                    this.FileSelectionLabel.innerHTML = message;
                    
                    if (count > 0) {
                        this._showSelectionToolBar(true);
                    }
                    else {
                        this._showSelectionToolBar(false);
                    }
                });
            }
        }
        
        this.FileSelectAllCheckbox.addEventListener("change", event => {
            let isChecked = event.target.checked;
            
            for (let i = 0; i < this.FileCheckboxes.length; i++) {
                let fileCheckbox = this.FileCheckboxes[i];
                fileCheckbox.checked = isChecked;
                this.Rows[i].setAttribute("data-is-select", isChecked);
            }
            
            let message = this.FileCheckboxes.length + " items selected";
            this.FileSelectionLabel.innerHTML = message;
            this._showSelectionToolBar(isChecked);
        });
        
        this.CancelActionButton.addEventListener("click", event => {
            if ((this.FileCheckboxes === null) || (this.FileCheckboxes === undefined)) {
                return;
            }
            
            for (let i = 0; i < this.FileCheckboxes.length; i++) {
                let fileCheckbox = this.FileCheckboxes[i];
                fileCheckbox.checked = false;
                this.Rows[i].setAttribute("data-is-select", false);
            }
            
            let message = 0 + " items selected";
            this.FileSelectionLabel.innerHTML = message;
            
            this._showSelectionToolBar(false);
        });
        
        this.CopyButton.addEventListener("click", event => {
            let numberOfSelectedItems = 0;
            let copyItems = "";
            
            for (let i = 0; i < this.FileCheckboxes.length; i++) {
                let fileCheckbox = this.FileCheckboxes[i];
                
                if (fileCheckbox.checked) {
                    numberOfSelectedItems += 1;
                    copyItems += this.Rows[i].getAttribute("data-filename") + "?";
                }
            }
            
            if (numberOfSelectedItems > 0) {
                let destinition = prompt("Copy to", this.Path);
                
                if (destinition !== null) {
                    let formData = new FormData();
                    formData.append('path', this.Path);
                    formData.append('id', this.Id);
                    formData.append('operation', "edit-copy");
                    formData.append('history', this.History);
                    formData.append('copy', copyItems);
                    formData.append('destinition', destinition);
                    
                    Ajax.ON_ACTION(this.Url, formData, responseText => {
                        this.Main.innerHTML = responseText;
                        let fileExplorer = new FileExplorer(this.Id, this.Home);
                    });
                }
            } 
        });
        
        this.MoveButton.addEventListener("click", event => {
            let numberOfSelectedItems = 0;
            let moveItems = "";
            
            for (let i = 0; i < this.FileCheckboxes.length; i++) {
                let fileCheckbox = this.FileCheckboxes[i];
                
                if (fileCheckbox.checked) {
                    numberOfSelectedItems += 1;
                    moveItems += this.Rows[i].getAttribute("data-filename") + "?";
                }
            }
            
            if (numberOfSelectedItems > 0) {
                let destinition = prompt("Move to", this.Path);
                
                if (destinition !== null) {
                    let formData = new FormData();
                    formData.append('path', this.Path);
                    formData.append('id', this.Id);
                    formData.append('operation', "edit-move");
                    formData.append('history', this.History);
                    formData.append('move', moveItems);
                    formData.append('destinition', destinition);
                    
                    Ajax.ON_ACTION(this.Url, formData, responseText => {
                        this.Main.innerHTML = responseText;
                        let fileExplorer = new FileExplorer(this.Id, this.Home);
                    });
                }
            } 
        });
        
        this.DeleteButton.addEventListener("click", event => {
            let numberOfSelectedItems = 0;
            let deleteItems = "";
            
            for (let i = 0; i < this.FileCheckboxes.length; i++) {
                let fileCheckbox = this.FileCheckboxes[i];
                
                if (fileCheckbox.checked) {
                    numberOfSelectedItems += 1;
                    deleteItems += this.Rows[i].getAttribute("data-filename") + "?";
                }
            }
            
            if (numberOfSelectedItems > 0) {
                let formData = new FormData();
                formData.append('path', this.Path);
                formData.append('id', this.Id);
                formData.append('operation', "edit-delete");
                formData.append('history', this.History);
                formData.append('move', deleteItems);

                Ajax.ON_ACTION(this.Url, formData, responseText => {
                    this.Main.innerHTML = responseText;
                    let fileExplorer = new FileExplorer(this.Id, this.Home);
                });
            } 
        });
        
        this.RenameButton.addEventListener("click", event => {
            let selectedItem = "";
            let oldFileName = "";
            
            for (let i = 0; i < this.FileCheckboxes.length; i++) {
                let fileCheckbox = this.FileCheckboxes[i];
                
                if (fileCheckbox.checked) {
                    selectedItem = this.Rows[i].getAttribute("data-filename");
                    oldFileName = this.Rows[i].getAttribute("data-file");
                    break;
                }
            }
            
            if (selectedItem.trim().length > 0) {
                let fileName = prompt("Change name to", oldFileName);
                
                if (fileName !== null) {
                    let formData = new FormData();
                    formData.append('path', this.Path);
                    formData.append('id', this.Id);
                    formData.append('operation', "edit-rename");
                    formData.append('history', this.History);
                    formData.append('filename-src', selectedItem);
                    formData.append('rename', fileName);
                    
                    Ajax.ON_ACTION(this.Url, formData, responseText => {
                        this.Main.innerHTML = responseText;
                        let fileExplorer = new FileExplorer(this.Id, this.Home);
                    });
                }
            }
        });
        
        this.CompressButton.addEventListener("click", event => {
            let files = "";
            let fileNames = "";
            let totalSelectedFiles = 0;
            
            for (let i = 0; i < this.FileCheckboxes.length; i++) {
                let fileCheckbox = this.FileCheckboxes[i];
                
                if (fileCheckbox.checked) {
                    let file = this.Rows[i].getAttribute("data-filename");
                    files += file + "?";
                    fileNames += this.Rows[i].getAttribute("data-file") + "?";
                    totalSelectedFiles += 1;
                }
            }
            
            if (totalSelectedFiles) {
                let formData = new FormData();
                formData.append('path', this.Path);
                formData.append('id', this.Id);
                formData.append('operation', "edit-compress");
                formData.append('history', this.History);
                formData.append('files', files);
                formData.append('fileNames', fileNames);
                
                Ajax.ON_ACTION(this.Url, formData, responseText => {
                    this.Main.innerHTML = responseText;
                    let fileExplorer = new FileExplorer(this.Id, this.Home);
                });
            }
        });
        
        this.ExtractButton.addEventListener("click", event => {
            let files = "";
            
            for (let i = 0; i < this.FileCheckboxes.length; i++) {
                let checkbox = this.FileCheckboxes[i];
                
                if (checkbox.checked) {
                    let file = this.Rows[i].getAttribute("data-filename");
                    
                    if (file.includes(".zip")) {
                        files += file + "?";
                    }
                }
            }
            
            if (files.length > 0) {
                let formData = new FormData();
                formData.append('path', this.Path);
                formData.append('id', this.Id);
                formData.append('operation', "edit-extract");
                formData.append('history', this.History);
                formData.append('files', files);
                
                Ajax.ON_ACTION(this.Url, formData, responseText => {
                    window.location.href = "index.php";
                });
            }
        });
        
        this.DownloadButton.addEventListener("click", event => {
            let file = "";
            
            for (let i = 0; i < this.FileCheckboxes.length; i++) {
                let checkbox = this.FileCheckboxes[i];
                
                if (checkbox.checked) {
                    file = this.Rows[i].getAttribute("data-filename");
                    break;
                }
            }
            
            if (file.length > 0) {
                window.open(file, "_blank");
            }
        });
    }
    
    static get TRASH_FOLDER() {
        return ".aiom-file-explorer-trash";
    }
    
    _handleFiles(files) {
        for (let i = 0; i < files.length; i++) {
            let file = files[i];
            this._uploadFile(file);
        }
    }

    _uploadFile(file) {
        let formData = new FormData();
        formData.append('path', this.Home);
        formData.append('id', this.Id);
        formData.append('operation', "edit-upload");
        formData.append('file', file);

        Ajax.ON_ACTION(this.Url, formData, responseText => {
            this.Main.innerHTML = responseText;
            let fileExplorer = new FileExplorer(this.Id, this.Home);
        });
    }
    
    _showSelectionToolBar(isShow) {
        if (isShow) {
            this.FileSelectiontoolbar.style.display = "grid";
        }
        else {
            this.FileSelectiontoolbar.style.display = "none";
        }
    }
}