import request from 'supertest';

import app from '../app.ts';

export const CLIENT_ORIGIN = 'http://localhost:5173';

export const api = () => request.agent(app).set('Origin', CLIENT_ORIGIN);
