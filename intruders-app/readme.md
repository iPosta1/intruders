# npx serve build. Do not use in production
# npm i
# npm run build
# docker build ./
# docker tag <imageId> 947546022191.dkr.ecr.us-east-2.amazonaws.com/intruders-app:<version>
# aws ecr get-login-password \
        --region us-east-2 | docker login \
        --username AWS \
        --password-stdin 947546022191.dkr.ecr.us-east-2.amazonaws.com
# docker push 947546022191.dkr.ecr.us-east-2.amazonaws.com/intruders-app:<version>