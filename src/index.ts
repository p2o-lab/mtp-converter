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

/* tslint:disable:no-console */

import * as commandLineArgs from 'command-line-args';
import * as commandLineUsage from 'command-line-usage';
import {Server} from './server/server';
import * as serverHandlers from './server/serverHandlers';

const optionDefinitions = [
    {
        name: 'help',
        alias: 'h',
        type: Boolean,
        description: 'Print this usage guide.'
    },
    {
        name: 'port',
        alias: 'p',
        type: Number,
        description: 'Port of mtp-converter'
    }
];
const sections = [
    {
        header: 'mtp-converter',
        content: '......'
    },
    {
        header: 'Options',
        optionList: optionDefinitions
    }
];

let options;
try {
    options = commandLineArgs(optionDefinitions);
} catch (err) {
    console.log('Error: Could not parse commandNode line arguments', err.toString());
    console.log(commandLineUsage(sections));
}
if (options) {
    if (options.help) {
        console.log(commandLineUsage(sections));
    } else {
        const appServer = new Server();

        const port = serverHandlers.normalizePort(options.port || process.env.PORT || 3000);
        appServer.startHttpServer(port);
    }
}
