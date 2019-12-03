# Run test and linter
npm run test:schematics
npm run tslint

# Link project
cd ../src/lib
npm link

# Create Angular base project
cd /tmp
rm -rf testxyz
ng new testxyz

# Run covalent schematics
cd testxyz
npm link @td-vantage/ui-platform
ng g @td-vantage/ui-platform:ng-add

# Check generated files
git status
npm i
