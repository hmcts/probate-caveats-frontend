#!/bin/bash
TEST_FILE_PATTERN="test[a-zA-Z0-9]+\.(js)$"
FILE_PATTERN="\.(js)$"
FORBIDDEN_WORDS=('.only')
FOUND_FORBIDDEN_WORDS=''
CHANGED_TEST_FILES=`git diff --cached --name-only | grep -E $TEST_FILE_PATTERN`
CHANGED_FILES=`git diff --cached --name-only | grep -E $FILE_PATTERN`

# Check for forbidden words
if [[ "$CHANGED_TEST_FILES" != "" ]]; then
    for i in "$CHANGED_TEST_FILES"; do
        for j in "${FORBIDDEN_WORDS[@]}"; do
            if echo `git show :$i` | grep -q "$j"; then
                FOUND_FORBIDDEN_WORDS+="  $i contains $j references\n"
            fi
        done
    done

    if [[ ! -z "$FOUND_FORBIDDEN_WORDS" ]]; then
        echo "Commit rejected"
        echo -e "${FOUND_FORBIDDEN_WORDS%'\n'}"
        echo "Please remove them before committing"
        exit 1
    fi
fi


# Run ESLint
if [[ "$CHANGED_FILES" != "" ]]; then
    for i in "$CHANGED_FILES"; do
        "node_modules/.bin/eslint" $i

        if [[ "$?" != 0 ]]; then
            echo "Commit rejected"
            echo "ESLint failed"
            echo "Please fix the errors before committing"
            exit 1
        fi
    done
fi

exit 0
