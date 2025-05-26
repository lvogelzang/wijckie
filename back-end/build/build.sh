aws ecr get-login-password --region eu-central-1 --profile studiogoes | docker login --username AWS --password-stdin 557444162880.dkr.ecr.eu-central-1.amazonaws.com/wijckie
aws lambda invoke \
    --profile studiogoes \
    --function-name App-version-counter \
    --cli-binary-format raw-in-base64-out \
    --payload '{ "appId": "wijckie-back-end" }' \
    --output text \
    latest_version.txt
LAST_USED_VERSION="`cat latest_version.txt`"
LAST_USED_VERSION=$(echo $LAST_USED_VERSION | tr -d '"')
NEXT_VERSION=$(echo ${LAST_USED_VERSION} | awk -F. -v OFS=. '{$NF += 1 ; print}')
# NEXT_VERSION=2.0.1
echo "Enter to continue building $NEXT_VERSION"
read -n 1
# docker build -t wijckie/back-end --platform linux/arm64 --no-cache -f ./Dockerfile ..
docker build -t wijckie/back-end --platform linux/arm64 -f ./Dockerfile ..
docker tag wijckie/back-end 557444162880.dkr.ecr.eu-central-1.amazonaws.com/wijckie/back-end:$NEXT_VERSION
docker push 557444162880.dkr.ecr.eu-central-1.amazonaws.com/wijckie/back-end:$NEXT_VERSION
aws lambda invoke \
    --profile studiogoes \
    --function-name App-version-counter \
    --cli-binary-format raw-in-base64-out \
    --payload "{ \"appId\": \"wijckie-back-end\", \"version\": \"$NEXT_VERSION\" }" \
    --output text \
    latest_version.txt
