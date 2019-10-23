export default function parseArgs() {
  if (getArgvParam('--chain')) {
    process.env.CHAIN = getArgvParam('--chain');
  }
  if (getArgvParam('--data-dir')) {
    process.env.APPDATAPATH = getArgvParam('--data-dir');
  }
  if (getArgvParam('--api-endpoint')) {
    process.env.APIENDPOINT = getArgvParam('--api-endpoint');
  }
  if (process.argv.indexOf('--debug') > -1) {
    process.env.DEBUG = true;
  }
}

function getArgvParam(name) {
  return process.argv.indexOf(name) > -1
    ? process.argv[process.argv.indexOf(name) + 1]
    : null;
}
