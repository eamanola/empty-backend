#!/bin/bash
composefiles=
envfile=
others=

while [ "$1" != "" ];
do
      case $1 in
            -f)
            shift
            composefiles+=("-f $1")
            ;;
            --env-file)
            shift
            envfile=$1
            ;;
            *)
            others+=($1)
            ;;
      esac
      shift
done

docker compose ${composefiles[@]} build --no-cache --ssh default &&

docker compose --env-file $envfile ${composefiles[@]} up ${others[@]}
