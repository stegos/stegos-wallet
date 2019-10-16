import { Notification, shell } from 'electron';
import fetch from 'node-fetch';
import p from '../../package';

const { owner, repo } = p.build.publish;
const githubRepo = `https://api.github.com/repos/${owner}/${repo}/`;

const getFromGithub = async (path: string) => {
  const resp = await fetch(`${githubRepo}${path}`);
  if (resp.status > 400) {
    return null;
  }
  const array = await resp.json();
  if (!Array.isArray(array)) {
    return null;
  }
  return array;
};

export const checkUpdateAndNotify = async () => {
  console.log('Checking update on github');
  const resp = await fetch(`${githubRepo}releases`);
  if (resp.status !== 200) {
    console.log("Can't get updates from github");
    return;
  }
  const releases = await resp.json();
  const last = releases.sort((a, b) => compareVersions(a.tag_name, b.tag_name))[
    releases.length - 1
  ];
  if (last && compareVersions(last.tag_name, p.version)) {
    const notification = new Notification({
      title: 'StegosWallet Update Available',
      body: `Version ${
        last.tag_name
      } is already available, you can download it`,
      actions: [{ text: last.html_url }]
    });
    notification.on('click', () => {
      shell.openExternal(last.html_url);
    });
    notification.show();
  } else {
    console.log(`No update, latest version ${p.version} installed`);
  }
};

/**
 * returns commit sha of current version
 * @return {Promise<null|string>}
 */
export const getCurrentSha = async () => {
  const tags = await getFromGithub('tags');
  const currentTag = tags.find(t => compareVersions(t.name, p.version) === 0);
  return currentTag && currentTag.commit && currentTag.commit.sha;
};

export const compareVersions = (v1: string, v2: string) => {
  const v1Ar = getVersionArray(v1);
  const v2Ar = getVersionArray(v2);
  const minLen = Math.min(v1Ar.length, v2Ar.length);
  for (let i = 0; i < minLen; i += 1) {
    if (v1Ar[i] > v2Ar[i]) return 1;
    if (v2Ar[i] > v1Ar[i]) return -1;
  }
  if (v1Ar.length === v2Ar.length) return 0;
  const lv = v1Ar.length > v2Ar.length ? v1Ar : v2Ar;
  for (let i = minLen; i < lv.length; i += 1) {
    if (lv[i] !== 0) return v1Ar.length - v2Ar.length;
  }
  return 0;
};

const getVersionArray = (v: string) =>
  v
    .trim()
    .replace('v', '')
    .split('.')
    .map(s => Number(s));
