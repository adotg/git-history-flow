#!/bin/bash

TARGET_FILE="$1"
# Saves function output
FN_OP= 

normalize_change() {
    if [[ $1 == *","* ]]; then
        FN_OP=$1
    else
        FN_OP="$1,1"
    fi
}

extract_changes() {
    local res=
    local deletion=
    local addition=
    local op="["

    # Extract the text between @@ and @@
    res=`echo "$1" | sed -e 's/@@ \(.*\) @@\(.*\)/\1/'`
    deletion=`echo "$res" | sed -e 's/\-\(.*\) \(.*\)/\1/'`
    addition=`echo "$res" | sed -e 's/\(.*\)\+\(.*\)$/\2/'`
    
    normalize_change $deletion
    op+=$FN_OP
    op+=","
    normalize_change $addition
    op+=$FN_OP
    op+="]"
    
    FN_OP=$op 
}

process() {
    local i=
    local line_list=
    local line=
    local op="["
    local list_len=

    IFS=$'\n' read -rd '' -a line_list <<<"$1"
    list_len=${#line_list[*]}

    for (( i = 0; i < list_len; ++ i ))
    do
        line=${line_list[$i]}
        if [[ $line =~ ^@@+ ]]; then
            extract_changes "$line" 
            op+=$FN_OP
            op+=","
            if [ "$2" = true ] ; then
                break
            fi
        fi
    done
   
    op=`echo "$op" | sed 's/.$//'`
    op+="]"
    FN_OP=$op
}

loggable() {
    local res=
    # Apply git log on any commit and sends it for processing with a flag which says to stop execution whenever the
    # match is found
    res=`git log -U0 $1 $TARGET_FILE`
    process "$res" $true
}

diffable() {
    local res=
    # Apply git log on any commit and sends it for processing until the end of the string is encountered
    res=`git diff -U0 $1 $2 $TARGET_FILE`
    process "$res" $false
}

# Split the string sepatated by new line character in list
DIFF_COMMITS=`git log --pretty="%h - %s" --reverse $TARGET_FILE`
IFS=$'\n' read -rd '' -a COMMITS_LIST <<<"$DIFF_COMMITS" 

for (( i = 0; i < ${#COMMITS_LIST[*]}; ++ i ))
do
    desc=${COMMITS_LIST[$i]}
    COMMIT_DESC=(${desc// - / })
    
    if ((i==0))
    then
        # For the first commit, apply git log as there is nothing against which it would be diffed to
        loggable ${COMMIT_DESC[0]} 
    else
        # For for subsequent commits, apply git diff between the previous and current commit 
        diffable ${PREV_COMMIT_DESC[0]} ${COMMIT_DESC[0]} 
    fi

    PREV_COMMIT_DESC=$COMMIT_DESC
    echo "=================================="
done
