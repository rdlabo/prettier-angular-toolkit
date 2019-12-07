import { Rule, SchematicsException, Tree, chain } from '@angular-devkit/schematics';
import { NodePackageInstallTask, RunSchematicTask } from '@angular-devkit/schematics/tasks';
import { getPackageManager } from '@angular/cli/utilities/package-manager';
import { getWorkspace } from '@schematics/angular/utility/workspace';

import { addKeyToPackageJson, addPackageToPackageJson, addScriptsToPackageJson } from './../utils/package';
import { Schema } from './schema';

function addFormatterToPackageJson(): Rule {
  return (host: Tree) => {
    addPackageToPackageJson(
      host,
      'devDependencies',
      'prettier',
      'latest'
    );
    addPackageToPackageJson(
      host,
      'devDependencies',
      'lint-staged',
      'latest'
    );
    addPackageToPackageJson(
      host,
      'devDependencies',
      '@kaizenplatform/prettier-config',
      'latest'
    );
    addScriptsToPackageJson(
      host,
      'lint-staged',
      'lint-staged'
    );
    addScriptsToPackageJson(
      host,
      'format',
      'prettier --parser typescript --write \"./**/*.ts\" &&  prettier --parser angular --write \"./**/*.html\"'
    );
    addKeyToPackageJson(
      host,
      'pre-commit',
      [
        'lint-staged',
      ]
    );
    addKeyToPackageJson(
      host,
      'lint-staged',
      {
        '*.ts': [
          'prettier --parser typescript --write',
          'git add',
        ],
        '*.html': [
          'prettier --parser angular --write',
          'git add',
        ],
      }
    );
    return host;
  };
}

function addPrettierConfig(): Rule {
  return (host: Tree) => {
    const sourcePath = `prettier.config.js`;
    if (!host.exists(sourcePath)) {
      host.create(sourcePath, 'module.exports =require(\'@kaizenplatform/prettier-config\');')
    }
    return host;
  };
}

function runInstall(npmTool: string): Rule {
  return (host: Tree, context) => {
    const packageInstall = context.addTask(new NodePackageInstallTask());
    const command = npmTool === 'npm' ? 'npm' : 'yarn';
    context.addTask(
      new RunSchematicTask('run-install', {
        command,
        args: [
          'install',
        ],
      }),
      [packageInstall]
    );
    return host;
  };
}

export default function ngAdd(options: Schema): Rule {
  return async (host: Tree) => {
    const workspace = await getWorkspace(host);

    if (!options.project) {
      options.project = workspace.extensions.defaultProject as string;
    }

    const projectTree = workspace.projects.get(options.project);
    const packageMgm = getPackageManager(projectTree.root);

    if (projectTree.extensions['projectType'] !== 'application') {
      throw new SchematicsException(
        `Capacitor Add requires a project type of "application".`
      );
    }

    return chain([
      addFormatterToPackageJson(),
      addPrettierConfig(),
      runInstall(packageMgm),
    ]);
  };
}
