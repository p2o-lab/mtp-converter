/*
 * MIT License
 *
 * Copyright (c) 2019 Markus Graube <markus.graube@tu.dresden.de>,
 * Chair for Process Control Systems, Technische Universität Dresden
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */


import {ModuleOptions} from "@p2olab/polaris-interface";
import * as fs from 'fs';
import * as path from 'path';
import * as temp from 'temp';
import * as extract from 'extract-zip';
import {Document, parseXml} from 'libxmljs'
import {parseStringPromise} from 'xml2js';

export class MtpParser {

    private mtpPath: string;
    private tempDir: string;

    private result: ModuleOptions;

    constructor(mtpPath: string) {
        this.mtpPath = mtpPath;
        if (!mtpPath) {
            throw new Error('No MTP file provided')
        }

        // Automatically track and cleanup files at exit
        //temp.track();
        this.tempDir = temp.mkdirSync();

        this.result = {} as any;
    }


    public async extract(): Promise<void> {
        await new Promise((resolve, reject) => {
            extract(this.mtpPath, {dir: this.tempDir}, function (err) {
                // extraction is complete. make sure to handle the err
                if (err) {
                    console.warn(err);
                    reject();
                } else {
                    resolve();
                }
            })
        });
    }

    public getFiles(): string[] {
        return fs.readdirSync(this.tempDir);
    }

    public async readFile(filename: string) {
        const xmlContent: string = fs.readFileSync(path.join(this.tempDir, filename)).toString();

        const result = await parseStringPromise(xmlContent);
        //console.dir(result);
        console.log(result.CAEXFile.InstanceHierarchy[0].InternalElement);
        console.log(result.CAEXFile.InstanceHierarchy.filter(i => i.$.ID === "752a5c30-f4ed-4f09-a2fd-62c146a1b311"));

        this.result.id

        var xmlDoc: Document = parseXml(xmlContent);
        console.log(xmlDoc.get('/CAEXFile/InstanceHierarchy[@Name="ModuleTypePackage"]').toString());

        //console.log(xmlDoc.get('/CAEXFile/InstanceHierarchy[@ID="752a5c30-f4ed-4f09-a2fd-62c146a1b311"]').toString())
        return result;
    }
}