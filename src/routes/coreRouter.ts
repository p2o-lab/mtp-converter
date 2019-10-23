/*
 * MIT License
 *
 * Copyright (c) 2018 Markus Graube <markus.graube@tu.dresden.de>,
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

import {Request, Response, Router} from 'express';
import {version} from '../../package.json';
import {MtpParser} from "../mtp-parser/MtpParser";
import {ModuleOptions} from "@p2olab/polaris-interface";
import {UploadedFile} from 'express-fileupload';
export const coreRouter: Router = Router();

/**
 * @api {get} /    root
 * @apiName root
 * @apiGroup Manager
 */
coreRouter.get('/', (req: Request, res: Response) => {
    res.send({status: 'succesful'});
});

/**
 * @api {get} /version    Get version
 * @apiName GetVersion
 * @apiDescription  Get version of polaris-backend
 * @apiGroup Manager
 */
coreRouter.get('/version', (req: Request, res: Response) => {
    res.json({version: version});
});


/**
 * @api {put} /module    Add module
 * @apiName PutModule
 * @apiGroup Module
 * @apiParam {ModuleOptions} module    Module to be added
 */
coreRouter.post('/mtp', (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let mtpFile: UploadedFile  = req.files.mtp as UploadedFile;

    const parser: MtpParser = new MtpParser();
    console.log(mtpFile.name, mtpFile.size, mtpFile.mimetype, mtpFile.tempFilePath); // the uploaded file object
    const result: ModuleOptions = parser.extract(mtpFile.tempFilePath);
    res.json(result);
});
