Summary of commands to run on macos to deploy.  I tested locally, then used SAM to deploy to AWS Lambda.
### Set up linux commands
```
# create project structure
mkdir aws-lambda
cd aws-lambda
nvm install 22
nym use 22

npm init -y
npm install --save-dev typescript ts-node @types/node
npx tsc --init
npm install --save @modelcontextprotocol/sdk express
npm install --save-dev @types/express
mkdir src
cd src
vi server.ts
vi client.ts

# startup server and client locally to test
cd ..
npx ts-node src/server.ts
npx ts-node ./src/server.ts

# deploy to AWS Lambda
sam init --name mcp-aws-lambda \\n  --runtime nodejs22.x \\n  --dependency-manager npm \\n  --app-template hello-world-typescript \\n  --no-interactive
rm -rf mcp-aws-lambda/hello-world/
mkdir mcp-aws-lambda/mcp-aws-function
cd mcp-aws-lambda

# make sure we have the following packages
npm init -y
npm install --save-dev typescript ts-node @types/node
npx tsc --init
npm install --save @modelcontextprotocol/sdk express
npm install --save-dev @types/express
npm install --save-dev esbuild

# edit/create config/run files
vi run.sh
mv template.yaml template.yaml.old
vi template.yml
cd mcp-aws-function
mkdir src
cd src
vi server.ts
vi client.ts
vi esbuild.js
vi Makefile

cd mcp-aws-function
cp run.sh ./mcp-aws-function
sam build
cd src
sam deploy --guided
aws s3 mb s3://mcp-aws-lambda-deployments --region us-east-1
sam deploy --guided

# test
curl -X POST \\n     -H "Content-Type: application/json" \\n     -d '{"jsonrpc": "2.0", "method": "calculate", "params": {"a": 5, "b": 3, "operation": "add"}, "id": 1}' \\n     https://rrx2gm4swj6rlhdrssmpsbnap40ttdxp.lambda-url.us-east-1.on.aws/mcp

# to delete all SAM resources
aws cloudformation list-stacks
aws cloudformation delete-stacl --stack-name <name or stackid with arn>

aws s3 ls
aws s3 rm s3://<name of s3 bucket> --recursive
