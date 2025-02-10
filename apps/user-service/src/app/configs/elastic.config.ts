import { Client } from '@elastic/elasticsearch';
import fs from 'fs';
import path from 'path';

const dirname = `${__dirname}/assets`;

const elasticClient = new Client({
  node: process.env.ELASTICSEARCH_URL,
  auth: {
    username: process.env.ELASTICSEARCH_USERNAME,
    password: process.env.ELASTICSEARCH_PASSWORD,
  },
  tls: {
    ca: fs.readFileSync(path.join(dirname, 'http_ca.crt')),
    rejectUnauthorized: false,
  },
});

export default elasticClient;
