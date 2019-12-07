import { Tree } from '@angular-devkit/schematics';

/**
 * Adds a package to the package.json
 */
export function addPackageToPackageJson(host: Tree, type: string, pkg: string, version: string) {
  if (host.exists('package.json')) {
    const sourceText = host.read('package.json')!.toString('utf-8');
    const json = JSON.parse(sourceText);
    if (!json[type]) {
      json[type] = {};
    }

    if (!json[type][pkg]) {
      json[type][pkg] = version;
    }

    host.overwrite('package.json', JSON.stringify(json, null, 2));
  }

  return host;
}

/**
 * Adds a scripts to the package.json
 */
export function addScriptsToPackageJson(host: Tree, scriptsName: string, method: string) {
  if (host.exists('package.json')) {
    const sourceText = host.read('package.json')!.toString('utf-8');
    const json = JSON.parse(sourceText);
    if (!json['scripts']) {
      json['scripts'] = {};
    }

    if (!json['scripts'][scriptsName]) {
      json['scripts'][scriptsName] = method;
    }

    host.overwrite('package.json', JSON.stringify(json, null, 2));
  }

  return host;
}

/**
 * Adds a method to the package.json
 */
export function addKeyToPackageJson(host: Tree, key: string, method: string | object) {
  if (host.exists('package.json')) {
    const sourceText = host.read('package.json')!.toString('utf-8');
    const json = JSON.parse(sourceText);

    if (!json[key]) {
      json[key] = method;
    }

    host.overwrite('package.json', JSON.stringify(json, null, 2));
  }

  return host;
}
