# Run test and linter
npm run test:schematics
npm run tslint

# Link project
cd ../../src/lib
npm link

# Create Angular base project
cd /tmp
rm -rf testxyz
ng new testxyz
cd testxyz
ng add @angular/material @angular-devkit/schematics @angular/cdk
ng add @covalent/core

# Run covalent schematics
cd testxyz
git add .; git commit -m 'fix(update): commit updated';
npm link @td-vantage/ui-platform
ng update @td-vantage/ui-platform --migrate-only --from=0.0.0 --to=3.0.1

# Check generated files
git status
npm i