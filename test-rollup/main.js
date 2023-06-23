import { hello } from './hello.js'
import { version } from "../package.json";
document.getElementById('root').innerHTML = hello('lwj') + version;
