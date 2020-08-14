/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Directive, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AlfrescoApiService } from '../services/alfresco-api.service';
import { DownloadZipDialogComponent } from '../dialogs/download-zip/download-zip.dialog';
import { NodeEntry, VersionEntry } from '@alfresco/js-api';
import { DownloadService } from '../services/download.service';
import { AbstractDownloadDirective } from './abstract-download.directive';

/**
 * Directive selectors without adf- prefix will be deprecated on 3.0.0
 */
@Directive({
    // tslint:disable-next-line: directive-selector
    selector: '[adfNodeDownload]'
})
export class NodeDownloadDirective extends AbstractDownloadDirective {

    /** Nodes to download. */
    @Input('adfNodeDownload')
    nodes: NodeEntry | NodeEntry[];

    /** Node's version to download. */
    @Input()
    version: VersionEntry;

    constructor(
        private apiService: AlfrescoApiService,
        private downloadService: DownloadService,
        private dialog: MatDialog) {
            super();
    }

    downloadVersion(nodeId: string, versionId: string, fileName: string): void {
        const url = this.apiService.getInstance().content.getVersionContentUrl(nodeId, versionId, true);
        this.downloadService.downloadUrl(url, fileName);
    }

    downloadContent(nodeId, fileName: string): void {
        const url = this.apiService.getInstance().content.getContentUrl(nodeId, true);
        this.downloadService.downloadUrl(url, fileName);
    }

    downloadZip(selection: Array<NodeEntry>) {
        if (selection && selection.length > 0) {
            // nodeId for Shared node
            const nodeIds = selection.map((node: any) => (node.entry.nodeId || node.entry.id));

            this.dialog.open(DownloadZipDialogComponent, {
                width: '600px',
                disableClose: true,
                data: {
                    nodeIds
                }
            });
        }
    }
}
