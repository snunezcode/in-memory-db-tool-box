#!/bin/bash 
id=$(date '+%H%M%S')
start_time=$(date +%s)

echo "`date '+%H:%M:%S'` -  ## In-Memory-DB-Tool-Box - Creating AWS Cloudformation StackID : $id "


aws cloudformation create-stack --stack-name "in-memory-db-tool-box-$id" --template-body file://InMemoryDbToolBox.template --parameters ParameterKey=Username,ParameterValue=snmatus@amazon.com ParameterKey=VPCParam,ParameterValue=vpc-07d80a425057895a3 ParameterKey=SubnetParam,ParameterValue=subnet-03bff4b2b43b0d393 ParameterKey=InstanceType,ParameterValue=t3a.medium ParameterKey=PublicAccess,ParameterValue=true ParameterKey=SGInboundAccess,ParameterValue=0.0.0.0/0 ParameterKey=GitHubRepository,ParameterValue=snunezcode  ParameterKey=RedisServer,ParameterValue=cls-10-001.9aldbm.0001.use1.cache.amazonaws.com ParameterKey=RedisPort,ParameterValue=6379 --region us-east-1 --capabilities CAPABILITY_NAMED_IAM
aws cloudformation wait stack-create-complete --stack-name "in-memory-db-tool-box-$id" --region us-east-1


export $(aws cloudformation describe-stacks --stack-name "in-memory-db-tool-box-$id" --output text --query 'Stacks[0].Outputs[].join(`=`, [join(`_`, [`CF`, `OUT`, OutputKey]), OutputValue ])' --region us-east-1)

end_time=$(date +%s)
elapsed=$(( end_time - start_time ))
eval "echo Elapsed time: $(date -ud "@$elapsed" +'$((%s/3600/24)) days %H hr %M min %S sec')"


echo -e "\n\n\n --############### Connection Information ###############-- \n\n"
echo " StackID  : $id"
echo " PublicAppURL   : $CF_OUT_PublicAppURL"
echo " PrivateAppURL   : $CF_OUT_PrivateAppURL"

echo -e "\n\n\n --############### Stack Deletion ###############-- \n\n"

echo "aws cloudformation delete-stack --stack-name in-memory-db-tool-box-$id --region us-east-1"
echo "aws cloudformation wait stack-delete-complete --stack-name in-memory-db-tool-box-$id --region us-east-1"



