#!/bin/bash
COMMIT_MESSAGE=`head -n1 $1`
PATTERN="^(PRO|DTSPB)-[0-9]+: "

if [[ ! "$COMMIT_MESSAGE" =~ $PATTERN ]]
then
    echo "Commit rejected"
    echo "\"${COMMIT_MESSAGE}\" is not a valid commit message"
    echo "The commit message must start with the JIRA number in the format \"PRO-XXXX: \""
    echo "For example \"PRO-1234: Add a really interesting feature\""
    exit 1
fi

exit 0
