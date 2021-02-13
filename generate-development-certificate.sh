#!/bin/bash

DIRNAME=build/development-certificate
CANAME=localca
NAME=localhost
IP=0.0.0.0

rm -rf $DIRNAME
mkdir -p $DIRNAME
cd $DIRNAME

openssl genrsa -des3 -out $CANAME.key 2048 && \
 openssl req -x509 -new -nodes -key $CANAME.key -sha256 -days 825 -out $CANAME.pem && \
 openssl genrsa -out $NAME.key 2048 && \
 openssl req -new -key $NAME.key -out $NAME.csr

>$NAME.ext cat <<-EOF
authorityKeyIdentifier=keyid,issuer
basicConstraints=CA:FALSE
keyUsage = digitalSignature, nonRepudiation, keyEncipherment, dataEncipherment
subjectAltName = @alt_names
[alt_names]
DNS.1 = $NAME
IP.1 = $IP
EOF

openssl x509 -req -in $NAME.csr -CA $CANAME.pem -CAkey $CANAME.key -CAcreateserial -out $NAME.crt -days 825 -sha256 -extfile $NAME.ext

rm $NAME.csr
rm $NAME.ext
rm $CANAME.key
rm $CANAME.srl

echo "Done"
