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

import * as express from 'express';
import * as http from 'http';
import Middleware from './middleware';;
import Routes from './routes';
import * as serverHandlers from './serverHandlers';

export class Server {

    public readonly app: express.Application;
    private httpServer: http.Server;

    constructor() {
        this.app = express();
        Middleware.init(this.app);
        Routes.init(this.app);
    }

    public startHttpServer(port: number | string | boolean) {
        this.httpServer = http.createServer(this.app);

        this.app.set('port', port);
        this.httpServer.listen(port);
        this.httpServer.on('error', (error) => serverHandlers.onError(error, port));
        this.httpServer.on('listening', () => {
            const addr: any = this.httpServer.address();
            const bind: string = (typeof addr === 'string') ? `pipe ${addr}` : `port ${addr.port}`;
            console.log(`Listening on ${bind}`);
        });
    }

    public async stop() {
        await this.httpServer.close();
        this.httpServer = null;
    }
}
